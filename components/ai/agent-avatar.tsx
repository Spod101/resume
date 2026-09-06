"use client"

import Image from "next/image"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import type { TargetAndTransition } from "framer-motion"
import { memo, useEffect, useId, useRef, useState } from "react"

export type AvatarState = "idle" | "listening" | "thinking" | "speaking"

/* ---------------------------------------------------------------------------
 * FACE MAP
 *
 * The avatar is a flat watercolour painting, so the face cannot be posed -- it
 * is drawn over. Three things keep that from looking pasted on:
 *
 *  - The painted smile is hidden by stroking a skin-coloured, blurred line
 *    along it (not by covering a region), so only the line itself is touched.
 *    The overlay mouth is then drawn on top.
 *  - Whenever the mouth is closed the overlay is skipped entirely, so the
 *    resting face is the untouched original. The patch is only ever on screen
 *    beneath an open mouth, which covers most of it anyway.
 *  - Blinking drops a skin-coloured lid over the top of each painted eye and
 *    stops short of its bottom edge, leaving that dark edge showing as the
 *    closed-eye line. No fake lashes needed.
 *
 * Coordinates are percentages of avatar-head.webp -- the background-free,
 * head-tight crop of avatar.png. The artwork and the overlay <svg> both fill
 * the same box and the viewBox is 0-100, so they map 1:1 at any size. Colours
 * are sampled from the painting. Replace the artwork and only this block needs
 * re-measuring.
 * ------------------------------------------------------------------------- */

const SKIN = "#fcddaf" // skin along the mouth
const MOUTH_IN = "#964020" // inside of an open mouth
const LIP = "#783016" // upper lip line

/** The painted smile, fitted to its measured points. Also the patch path. */
const SMILE_PATH = "M 44.5 77.09 Q 53.42 80.08 62.34 77.21"
const MOUTH_CX = 53.42
const PATCH_STROKE = 2.42
const LIP_STROKE = 0.57

/** Open-mouth shapes: two quadratics meeting at the mouth corners. */
const SHAPES = {
  ajar: { x0: 46.79, y0: 77.34, x1: 60.3, y1: 77.34, top: 78.62, bottom: 81.04 },
  open: { x0: 45.77, y0: 77.21, x1: 61.32, y1: 77.21, top: 78.74, bottom: 83.33 },
  wide: { x0: 45.01, y0: 76.96, x1: 61.83, y1: 76.96, top: 79.0, bottom: 85.88 },
  narrow: { x0: 48.58, y0: 77.47, x1: 58.52, y1: 77.47, top: 79.0, bottom: 82.06 },
  grin: { x0: 43.73, y0: 76.45, x1: 63.11, y1: 76.58, top: 79.25, bottom: 86.65 },
} as const

type Viseme = "closed" | keyof typeof SHAPES

const EYES = [
  {
    id: "left",
    skin: "#facd9e",
    mask: { cx: 38.89, cy: 64.21, rx: 6.88, ry: 3.06 },
    lid: { x: 30.73, y: 61.16, width: 16.32, height: 4.81 },
  },
  {
    id: "right",
    skin: "#faca9a",
    mask: { cx: 68.33, cy: 62.17, rx: 6.76, ry: 2.68 },
    lid: { x: 60.3, y: 59.5, width: 16.06, height: 4.14 },
  },
] as const

/** Talking loop. Mixed widths and the odd closed beat read as speech. */
const TALK_FRAMES: Viseme[] = [
  "ajar", "open", "wide", "open", "narrow", "open",
  "ajar", "wide", "closed", "open", "narrow", "ajar",
]

/**
 * Per-state motion for the head. scaleX/scaleY move against each other a
 * little, which gives the bob some squash and stretch instead of a flat pulse.
 */
const BODY: Record<AvatarState, { keyframes: TargetAndTransition; duration: number }> = {
  idle: {
    keyframes: { scaleX: [1, 1.012, 1], scaleY: [1, 1.03, 1], y: [0, -2.5, 0], rotate: [-0.6, 0.6, -0.6] },
    duration: 4.2,
  },
  listening: {
    keyframes: { scaleX: [1, 1.018, 1], scaleY: [1, 1.038, 1], y: [0, -3.5, 0], rotate: [-2.4, -1.2, -2.4] },
    duration: 2.6,
  },
  thinking: {
    keyframes: { scaleX: [1, 1.01, 1], scaleY: [1, 1.022, 1], y: [0, -2, 0], rotate: [-4.5, 4.5, -4.5] },
    duration: 2.1,
  },
  speaking: {
    keyframes: {
      scaleX: [1, 1.028, 1.008, 1.022, 1],
      scaleY: [1, 1.052, 1.012, 1.044, 1],
      y: [0, -3, -1, -2.5, 0],
      rotate: [-1.2, 1.2, -0.6, 1, -1.2],
    },
    duration: 0.82,
  },
}

const MAX_TURN_DEG = 16
const MAX_NOD_DEG = 11
const TURN_REACH_PX = 260
/** How long the pointer must sit still before the head starts glancing about. */
const IDLE_BEFORE_GLANCE_MS = 2500
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

function AgentAvatarImpl({
  state = "idle",
  size = 56,
  className = "",
}: {
  state?: AvatarState
  size?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // Two avatars are on screen at once (launcher + panel header), so the
  // filter/mask ids have to be unique per instance.
  const uid = useId()

  const [frame, setFrame] = useState<Viseme>("closed")
  const [blinking, setBlinking] = useState(false)
  const [reacting, setReacting] = useState(false)

  const turn = useMotionValue(0)
  const nod = useMotionValue(0)
  const rotateY = useSpring(turn, { stiffness: 110, damping: 15, mass: 0.4 })
  const rotateX = useSpring(nod, { stiffness: 110, damping: 15, mass: 0.4 })
  const lastPointerMove = useRef(0)

  // The head follows the pointer around the page.
  useEffect(() => {
    if (reduceMotion) return

    let raf = 0
    const onMove = (event: PointerEvent) => {
      lastPointerMove.current = performance.now()
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        turn.set(clamp((dx / TURN_REACH_PX) * MAX_TURN_DEG, MAX_TURN_DEG))
        nod.set(clamp((-dy / TURN_REACH_PX) * MAX_NOD_DEG, MAX_NOD_DEG))
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, turn, nod])

  // When the pointer is still (or there is none, as on touch), look around on
  // its own so the face never freezes mid-stare.
  useEffect(() => {
    if (reduceMotion) return

    const id = setInterval(() => {
      if (performance.now() - lastPointerMove.current < IDLE_BEFORE_GLANCE_MS) return
      turn.set((Math.random() * 2 - 1) * 7)
      nod.set((Math.random() * 2 - 1) * 5)
    }, 3200)

    return () => clearInterval(id)
  }, [reduceMotion, turn, nod])

  // Lip sync: step the talking frames only while tokens are arriving.
  useEffect(() => {
    if (state !== "speaking" || reduceMotion) {
      setFrame("closed")
      return
    }

    let index = 0
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      setFrame(TALK_FRAMES[index % TALK_FRAMES.length])
      index += 1
      // Uneven timing stops it looking like a metronome.
      timer = setTimeout(step, 85 + Math.random() * 80)
    }
    step()

    return () => clearTimeout(timer)
  }, [state, reduceMotion])

  // Blinking, at irregular intervals with the occasional double.
  useEffect(() => {
    if (reduceMotion) return

    const timers = new Set<ReturnType<typeof setTimeout>>()
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t)
        fn()
      }, ms)
      timers.add(t)
    }

    const schedule = () => {
      later(() => {
        setBlinking(true)
        later(() => {
          setBlinking(false)
          if (Math.random() < 0.28) {
            later(() => {
              setBlinking(true)
              later(() => setBlinking(false), 105)
            }, 150)
          }
          schedule()
        }, 115)
      }, 2200 + Math.random() * 3600)
    }
    schedule()

    return () => {
      timers.forEach(clearTimeout)
      timers.clear()
    }
  }, [reduceMotion])

  // A quick grin and squint the moment it stops thinking and starts answering.
  const previous = useRef(state)
  useEffect(() => {
    const wasThinking = previous.current === "thinking"
    previous.current = state
    if (!wasThinking || state !== "speaking" || reduceMotion) return

    setReacting(true)
    const t = setTimeout(() => setReacting(false), 430)
    return () => clearTimeout(t)
  }, [state, reduceMotion])

  const mouth: Viseme = reacting ? "grin" : state === "speaking" ? frame : "closed"
  const shape = mouth === "closed" ? null : SHAPES[mouth]

  // 0 = open, 1 = shut. Squints on a reaction, narrows while thinking.
  const lid = reduceMotion
    ? 0
    : blinking
      ? 1
      : reacting
        ? 0.45
        : state === "thinking"
          ? 0.35
          : state === "listening"
            ? 0.1
            : 0

  const body = BODY[state]

  return (
    <div
      ref={ref}
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size, perspective: 700 }}
    >
      <motion.div
        className="h-full w-full"
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="h-full w-full"
          animate={reduceMotion ? undefined : body.keyframes}
          transition={{ duration: body.duration, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* A pop on the reaction, on top of the looping body motion. */}
          <motion.div
            className="relative h-full w-full"
            initial={false}
            animate={{ scale: reacting && !reduceMotion ? 1.06 : 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 14 }}
            // The shadow follows the cut-out silhouette, so the head reads as
            // sitting on the panel rather than pasted flat onto it.
            style={{ filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.22))" }}
          >
            <Image
              src="/images/avatar-head.webp"
              alt=""
              width={384}
              height={384}
              className="h-full w-full"
            />

            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <filter id={`aa-soften-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="0.51" />
                </filter>
                <filter id={`aa-edge-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="0.13" />
                </filter>
                {/* Soft-edged so the lid has no hard boundary against skin. */}
                <radialGradient id={`aa-soft-mask-${uid}`}>
                  <stop offset="0.8" stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                {EYES.map((eye) => (
                  <mask id={`aa-eye-${eye.id}-${uid}`} key={eye.id}>
                    <ellipse {...eye.mask} fill={`url(#aa-soft-mask-${uid})`} />
                  </mask>
                ))}
              </defs>

              {shape && (
                <>
                  {/* Hide the painted smile, then draw the live mouth. */}
                  <path
                    d={SMILE_PATH}
                    fill="none"
                    stroke={SKIN}
                    strokeWidth={PATCH_STROKE}
                    strokeLinecap="round"
                    filter={`url(#aa-soften-${uid})`}
                  />
                  <g filter={`url(#aa-edge-${uid})`}>
                    <path
                      d={`M ${shape.x0} ${shape.y0} Q ${MOUTH_CX} ${shape.top} ${shape.x1} ${shape.y1} Q ${MOUTH_CX} ${shape.bottom} ${shape.x0} ${shape.y0} Z`}
                      fill={MOUTH_IN}
                    />
                    <path
                      d={`M ${shape.x0} ${shape.y0} Q ${MOUTH_CX} ${shape.top} ${shape.x1} ${shape.y1}`}
                      fill="none"
                      stroke={LIP}
                      strokeWidth={LIP_STROKE}
                      strokeLinecap="round"
                    />
                  </g>
                </>
              )}

              {EYES.map((eye) => (
                <g key={eye.id} mask={`url(#aa-eye-${eye.id}-${uid})`}>
                  <motion.rect
                    x={eye.lid.x}
                    y={eye.lid.y}
                    width={eye.lid.width}
                    height={eye.lid.height}
                    fill={eye.skin}
                    style={{ transformBox: "fill-box", transformOrigin: "center top" }}
                    initial={false}
                    animate={{ scaleY: lid }}
                    transition={{ duration: 0.085, ease: "easeOut" }}
                  />
                </g>
              ))}
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Memoised: the transcript re-renders on every streamed token and the face
 *  must not re-render with it. */
export const AgentAvatar = memo(AgentAvatarImpl)
