import { NextResponse } from "next/server"
import { z } from "zod"
import { SYSTEM_PROMPT } from "@/lib/ai/profile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b"

/**
 * gpt-oss and qwen3 are reasoning models: they burn completion tokens on an
 * "analysis" pass before answering, and that pass counts against max_tokens.
 * Low effort is plenty for answering from a fixed profile, and keeps the reply
 * from being truncated. Other model families reject the parameter outright.
 */
const isReasoningModel = /gpt-oss|qwen/i.test(MODEL)

/** Keep the request small: long histories cost tokens and invite prompt stuffing. */
const MAX_CHARS = 600
const MAX_TURNS = 12

/** Best-effort throttle. Serverless instances are ephemeral, so this caps abuse
 *  from a single warm instance rather than acting as a hard global limit. */
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 25
const hits = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Drop cold entries so the map cannot grow unbounded on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW
}

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(MAX_CHARS),
      }),
    )
    .min(1)
    .max(MAX_TURNS),
})

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is not configured yet. Set GROQ_API_KEY." },
      { status: 503 },
    )
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "That's a lot of questions. Give it a few minutes and try again." },
      { status: 429 },
    )
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.4,
        // Answers are meant to be 2-4 sentences and low reasoning effort spends
        // ~50 tokens, so this is generous. It also counts toward the per-minute
        // token limit, which is why it is not set higher.
        max_tokens: 550,
        ...(isReasoningModel ? { reasoning_effort: "low" } : {}),
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.data.messages],
      }),
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    return NextResponse.json(
      { error: "Could not reach the assistant. Please try again." },
      { status: 502 },
    )
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    console.error("Groq error", upstream.status, detail)

    // The system prompt carries Clayton's whole profile, so every question
    // costs ~2.5k input tokens and a few in quick succession can trip Groq's
    // per-minute token limit. Pass the retry delay back so the client can wait
    // it out instead of showing the visitor an error.
    if (upstream.status === 429) {
      const fromHeader = Number(upstream.headers.get("retry-after")) * 1000
      const fromBody = Number(/try again in ([\d.]+)s/i.exec(detail)?.[1]) * 1000
      const retryAfterMs = [fromBody, fromHeader].find((v) => Number.isFinite(v) && v > 0) ?? 4000

      return NextResponse.json(
        { error: "Busy right now — give it a few seconds and ask again.", retryAfterMs },
        { status: 429 },
      )
    }

    return NextResponse.json(
      { error: "The assistant is having a moment. Please try again." },
      { status: 502 },
    )
  }

  // Groq speaks OpenAI-flavoured SSE. Unwrap it here so the browser only has to
  // read plain UTF-8 text off the stream.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""

  const text = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data:")) continue
          const payload = line.slice(5).trim()
          if (!payload || payload === "[DONE]") continue
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content
            if (delta) controller.enqueue(encoder.encode(delta))
          } catch {
            // A partial frame we can safely skip.
          }
        }
      },
    }),
  )

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
