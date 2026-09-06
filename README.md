# resume

Portfolio site for Clayton Dale Tambis. Next.js 16 (App Router), React 19, Tailwind CSS v4,
Framer Motion.

```bash
npm install --legacy-peer-deps   # vaul still pins React 18
npm run dev
```

## AI assistant

A floating widget (bottom-right, on every page) lets visitors ask questions about Clayton. It is
powered by Groq and streams its answers token by token.

The avatar is the watercolour portrait in `public/images/avatar.png`, animated. It renders as a
bare cut-out head with no circular frame: `public/images/avatar-head.webp` is that portrait with
its cream ground flood-filled away and cropped tight to the head (36 KB, down from 2.3 MB).

Because the artwork is a flat painting the face is drawn over rather than posed: the painted smile
is hidden under a blurred skin-coloured stroke and an SVG mouth is drawn on top, cycling through
open shapes at roughly 10fps while tokens arrive. Blinks drop a skin-coloured lid over the top of
each painted eye, stopping short of its dark bottom edge so that edge reads as the closed-eye
line. When the mouth is closed the overlay is skipped entirely, so the resting face is the
untouched original. On top of that the head follows the visitor's pointer in 3D, glances around on
its own once the pointer sits still, breathes with a little squash and stretch, squints while
thinking, and grins and pops for a beat when an answer arrives.

Every coordinate and colour in that overlay was measured off the artwork and lives in the FACE MAP
block at the top of `components/ai/agent-avatar.tsx`. Swap the portrait and that block is the only
thing to re-measure.

To turn it on, add a key to `.env.local`:

```bash
cp .env.example .env.local
# then paste your key from https://console.groq.com/keys
```

Without `GROQ_API_KEY` the widget still renders, but the API replies with a 503 and the chat shows
a friendly "not configured yet" message.

The default model is `openai/gpt-oss-120b`. Groq keys differ in which models they can reach, so if
you see a `model_not_found` in the server log, list yours and set `GROQ_MODEL`:

```bash
curl -s https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY" | grep '"id"'
```

| File | Role |
| --- | --- |
| `lib/ai/profile.ts` | Everything the assistant is allowed to say, plus the system prompt. **Edit this when you add a project.** |
| `app/api/chat/route.ts` | Streaming proxy to Groq. Validates input, rate-limits per IP, keeps the key server-side. |
| `components/ai/agent-avatar.tsx` | The animated avatar and its FACE MAP. |
| `components/ai/ai-chat.tsx` | The launcher, panel, transcript and composer. |

The assistant has no access to the rendered page — `lib/ai/profile.ts` is its only source of
truth, and the system prompt tells it to point people at Clayton's email rather than guess when
something is not covered there. It deliberately does **not** know his phone number: the resume
goes to specific people, but this site is public and the assistant repeats whatever it knows.

### Rate limits

The profile is sent as the system prompt on every question, so each one costs roughly 2.5k input
tokens. Groq's free tier allows 8,000 tokens per minute, which works out to about three questions
a minute before it returns a 429. The route passes Groq's retry delay back to the widget, which
waits out anything under 8 seconds silently and otherwise shows "Busy right now — give it a few
seconds and ask again." Raising the ceiling means moving off the free tier
(https://console.groq.com/settings/billing); trimming `lib/ai/profile.ts` is the other lever.
