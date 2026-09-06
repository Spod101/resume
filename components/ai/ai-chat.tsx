"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { AgentAvatar, type AvatarState } from "@/components/ai/agent-avatar"
import { OWNER, SUGGESTED_QUESTIONS } from "@/lib/ai/profile"

type Role = "user" | "assistant"
type Message = { id: string; role: Role; content: string }

/** Mirrors the server-side limits in app/api/chat/route.ts. */
const MAX_CHARS = 600
const MAX_HISTORY = 10
/** Longest we will silently wait out a rate limit before telling the visitor. */
const RETRY_CAP_MS = 8000

/** Abortable sleep, so hitting stop during a rate-limit wait still cancels. */
const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort)
      resolve()
    }, ms)
    signal.addEventListener("abort", onAbort, { once: true })
  })

const GREETING =
  `Hi. I'm ${OWNER.shortName}'s AI assistant — ask me about his work, his stack, ` +
  `or any project on this site.`

const STATUS_LABEL: Record<AvatarState, string> = {
  idle: "Online",
  listening: "Listening",
  thinking: "Thinking…",
  speaking: "Typing…",
}

const newId = () => Math.random().toString(36).slice(2)

/**
 * The system prompt asks for plain text, but the model still reaches for
 * markdown on long answers, and the bubble renders it literally. Strip the
 * emphasis it actually uses -- including a half-streamed trailing "**".
 */
const stripMarkdown = (text: string) =>
  text
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,2}$/, "")

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-black text-white"
            : "rounded-bl-md bg-neutral-100 text-neutral-900"
        }`}
      >
        {isUser ? message.content : stripMarkdown(message.content)}
        {!isUser && !message.content && (
          <span className="inline-flex gap-1 py-1 align-middle">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function AiChat() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<"idle" | "thinking" | "streaming">("idle")
  const [error, setError] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const busy = status !== "idle"

  const avatarState: AvatarState =
    status === "streaming"
      ? "speaking"
      : status === "thinking"
        ? "thinking"
        : focused || input.length > 0
          ? "listening"
          : "idle"

  // Keep the newest message in view as tokens stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  // Never leave a request hanging when the widget unmounts.
  useEffect(() => () => abortRef.current?.abort(), [])

  // The widget lives in the root layout while the scroll-to-top button lives in
  // the page, so they cannot share React state. A body attribute lets CSS pull
  // that button out of the way while the panel is open.
  useEffect(() => {
    document.body.dataset.chatOpen = String(open)
    return () => {
      delete document.body.dataset.chatOpen
    }
  }, [open])

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_CHARS)
      if (!text || busy) return

      const outbound = [...messages, { id: newId(), role: "user" as const, content: text }]
      const replyId = newId()

      setMessages([...outbound, { id: replyId, role: "assistant", content: "" }])
      setInput("")
      setError(null)
      setStatus("thinking")
      // The composer auto-grows as you type, so shrink it back after sending.
      if (inputRef.current) inputRef.current.style.height = "auto"

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const payload = JSON.stringify({
          messages: outbound.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content })),
        })
        const post = () =>
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: payload,
          })

        let res = await post()

        // The profile makes each question token-heavy, so a few in a row can hit
        // Groq's per-minute limit. The route tells us how long to hold off;
        // waiting it out once reads as a slow answer rather than a failure.
        if (res.status === 429) {
          const info = await res.json().catch(() => null)
          const waitMs = Math.min(Number(info?.retryAfterMs) || 0, RETRY_CAP_MS)
          if (!waitMs) throw new Error(info?.error ?? "Busy right now. Please try again.")
          await wait(waitMs, controller.signal)
          res = await post()
        }

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error ?? "Something went wrong. Please try again.")
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        // Groq delivers hundreds of tiny chunks per second. Painting each one
        // would re-render the transcript ~300x/s and starve the avatar's
        // animation, so tokens are buffered and flushed once per frame.
        let pending = ""
        let frame = 0
        const flush = () => {
          frame = 0
          if (!pending) return
          const addition = pending
          pending = ""
          setMessages((prev) =>
            prev.map((m) => (m.id === replyId ? { ...m, content: m.content + addition } : m)),
          )
        }

        try {
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            if (!chunk) continue
            setStatus("streaming")
            pending += chunk
            if (!frame) frame = requestAnimationFrame(flush)
          }
        } finally {
          if (frame) cancelAnimationFrame(frame)
          flush()
        }

        // A clean stream that produced nothing at all still needs an answer.
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId && !m.content
              ? { ...m, content: "Sorry — I didn't catch that. Could you rephrase?" }
              : m,
          ),
        )
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((prev) => prev.filter((m) => m.id !== replyId || m.content))
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== replyId))
          setError((err as Error).message)
        }
      } finally {
        abortRef.current = null
        setStatus("idle")
      }
    },
    [busy, messages],
  )

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the AI assistant" : `Ask ${OWNER.shortName}'s AI assistant`}
        aria-expanded={open}
        className="fixed bottom-12 right-6 z-60 flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-lg ring-1 ring-black/10 transition-shadow hover:shadow-xl md:bottom-18 md:right-8"
        whileHover={reduceMotion ? undefined : { scale: 1.04 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <AgentAvatar state={open ? avatarState : "idle"} size={48} />
        <span className="text-sm font-bold text-black">
          {open ? "Close" : "Ask me"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={`${OWNER.name}'s AI assistant`}
            className="fixed inset-x-4 bottom-28 z-60 flex h-[min(70vh,560px)] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 sm:inset-x-auto sm:right-6 sm:w-[380px] md:bottom-36 md:right-8"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
              <AgentAvatar state={avatarState} size={60} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-black">
                  {OWNER.shortName}&apos;s AI
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
                  {STATUS_LABEL[avatarState]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            {/* Transcript */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              <Bubble message={{ id: "greeting", role: "assistant", content: GREETING }} />
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}

              {/* One per row and right-aligned, matching where the visitor's own
                  messages land. Each is shaped like a user bubble and fills in
                  black on hover, so it previews what tapping it will send. */}
              {messages.length === 0 && (
                <div className="flex flex-col items-end gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <motion.button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-[85%] rounded-2xl rounded-br-md border border-black/15 px-3.5 py-2 text-left text-[12.5px] leading-snug text-neutral-600 transition-colors hover:border-black hover:bg-black hover:text-white"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-neutral-100 px-3.5 py-2.5 text-[12px] text-neutral-600">
                  {error}
                </p>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="border-t border-black/10 p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl bg-neutral-100 px-3 py-2 transition-shadow focus-within:ring-2 focus-within:ring-black/70">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  placeholder={`Ask about ${OWNER.shortName}…`}
                  aria-label={`Ask about ${OWNER.shortName}`}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send(input)
                    }
                  }}
                  className="max-h-24 flex-1 resize-none bg-transparent text-[13px] text-black outline-none placeholder:text-neutral-500"
                />

                {busy ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    aria-label="Stop generating"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
                  >
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </button>
                )}
              </div>

              <p className="px-1 pt-2 text-[10px] text-neutral-400">
                AI assistant — it can be wrong. For anything important, email{" "}
                {OWNER.email}.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
