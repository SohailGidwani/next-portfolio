"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import glassesDark from "@/public/images/footnote/glasses-dark.png"
import glassesLight from "@/public/images/footnote/glasses-light.png"
import type { GlassesScene } from "./glassesScene"

type Screen = { status: string; term?: string; meaning?: string; owner?: string; hint?: string }

// Text from the Even Hub simulator captures.
const SCREENS = {
  bluebird: { status: "FOOTNOTE / LISTENING / 0 SAVED", term: "BLUEBIRD", meaning: "v3 navigation stack rewrite", owner: "Ask Priya R.", hint: "Press to save question" },
  saved: { status: "FOOTNOTE / LISTENING / 1 SAVED", term: "Question saved", meaning: "Saved for after the meeting.", hint: "Returning to listening" },
  fcs: { status: "FOOTNOTE / LISTENING / 1 SAVED", term: "FCS", meaning: "Fleet Control Service; dispatches robots", owner: "Ask Marcus L.", hint: "Press to save question" },
  listening: { status: "FOOTNOTE / LISTENING / 1 SAVED", term: "Listening for terms", meaning: "A new word will appear here.", hint: "Press to pause" },
  done: { status: "FOOTNOTE / DONE / 1 SAVED", term: "Meeting complete", meaning: "Your notes are on your phone." },
} satisfies Record<string, Screen>

type ScreenKey = keyof typeof SCREENS

const STEPS: { label: string; detail: string; screen: ScreenKey; caption: string; gesture?: string }[] = [
  { label: "Hear", detail: "a word", screen: "bluebird", caption: "Someone says Bluebird. The card shows what it means and who to ask." },
  { label: "Press", detail: "to save", screen: "saved", gesture: "Press", caption: "Press once to save a question for later, without interrupting anyone." },
  { label: "Swipe", detail: "to mute", screen: "listening", gesture: "Swipe down", caption: "Already know what FCS means? Swipe down and it stops showing up." },
  { label: "Hold", detail: "to end", screen: "done", gesture: "Hold", caption: "Hold to end the meeting. Your saved question is waiting on your phone." },
]

const IDLE_CAPTION = "Pick a step to see it from the wearer's side."
const STEP_MS = 3400
const TURN_MS = 1400
const SWIPE_HOLD_MS = 900

const GREEN = "text-[#4cf24f] [text-shadow:0_0_7px_rgba(76,242,79,0.45)]"

/** `fontClass` is the G2 display face, loaded by the page (font loaders must live in server modules here). */
export default function GlassesFigure({ fontClass }: { fontClass: string }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<HTMLSpanElement>(null)
  const sceneRef = useRef<GlassesScene | null>(null)
  const rafRef = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const shownRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [played, setPlayed] = useState(false)
  const [step, setStep] = useState(-1)
  const [screen, setScreen] = useState<ScreenKey>("bluebird")
  const [leaving, setLeaving] = useState(false)

  // One frame: advance the camera, draw, and pin the HTML display to the lens.
  // Keeps asking for frames only while the camera is moving.
  const requestFrame = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(function frame(now) {
      rafRef.current = 0
      const scene = sceneRef.current
      if (!scene) return
      const moving = scene.tick(now)
      scene.render()
      const display = displayRef.current
      if (display) {
        display.style.transform = scene.displayTransform()
        display.style.opacity = String(shownRef.current ? scene.behind() : 0)
      }
      const gesture = gestureRef.current
      if (gesture) {
        const p = scene.gesturePoint()
        gesture.style.transform = `translate(${p.x}px, ${p.y}px)`
      }
      if (moving) rafRef.current = requestAnimationFrame(frame)
    })
  }, [])

  // Load three.js only when the figure is close, then build the scene.
  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    let cancelled = false
    let resizeObserver: ResizeObserver | undefined
    let themeObserver: MutationObserver | undefined
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#35b8d4"

    const load = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        load.disconnect()
        import("./glassesScene")
          .then(({ createGlassesScene }) => {
            if (cancelled) return
            const scene = createGlassesScene(canvas, accent())
            sceneRef.current = scene
            const rect = stage.getBoundingClientRect()
            scene.resize(rect.width, rect.height)
            resizeObserver = new ResizeObserver(([e]) => {
              const { width, height } = e.contentRect
              scene.resize(width, height)
              requestFrame()
            })
            resizeObserver.observe(stage)
            themeObserver = new MutationObserver(() => {
              scene.setAccent(accent())
              requestFrame()
            })
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
            // A step picked before the scene loaded should open behind the lens.
            if (shownRef.current) scene.goTo("inside", 0)
            requestFrame()
            setReady(true)
          })
          .catch(() => {
            // No WebGL or the chunk failed: the poster stays, which is still a fair picture.
          })
      },
      { rootMargin: "400px 0px" },
    )
    load.observe(stage)

    const seen = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.5), { threshold: [0, 0.5] })
    seen.observe(stage)

    return () => {
      cancelled = true
      load.disconnect()
      seen.disconnect()
      resizeObserver?.disconnect()
      themeObserver?.disconnect()
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      timers.current.forEach(clearTimeout)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [requestFrame])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const show = useCallback(
    (i: number, turn: boolean) => {
      const scene = sceneRef.current
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setStep(i)
      setLeaving(false)
      shownRef.current = true
      if (scene && turn) scene.goTo("inside", still ? 0 : TURN_MS)
      // The swipe step shows the FCS card first, then swipes it away.
      if (STEPS[i].screen === "listening" && !still) {
        setScreen("fcs")
        timers.current.push(
          setTimeout(() => setLeaving(true), SWIPE_HOLD_MS),
          setTimeout(() => {
            setLeaving(false)
            setScreen("listening")
          }, SWIPE_HOLD_MS + 320),
        )
      } else {
        setScreen(STEPS[i].screen)
      }
      requestFrame()
    },
    [requestFrame],
  )

  const play = useCallback(() => {
    clearTimers()
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (still) {
      show(0, true)
      return
    }
    sceneRef.current?.goTo("outside", 0)
    shownRef.current = false
    setStep(-1)
    requestFrame()
    timers.current.push(setTimeout(() => show(0, true), 350))
    for (let i = 1; i < STEPS.length; i++) timers.current.push(setTimeout(() => show(i, false), 350 + TURN_MS + STEP_MS * i))
  }, [requestFrame, show])

  // Plays once, the first time the figure is properly on screen with the scene loaded.
  useEffect(() => {
    if (!ready || !inView || played) return
    setPlayed(true)
    play()
  }, [ready, inView, played, play])

  const pick = (i: number) => {
    clearTimers()
    setPlayed(true)
    const inside = shownRef.current
    show(i, !inside)
  }

  const replay = () => {
    setPlayed(true)
    play()
  }

  const s: Screen = SCREENS[screen]
  const bluebird = step === 0 ? "hl" : step >= 1 ? "saved" : ""
  const fcs = step === 2 && screen === "fcs" ? "hl" : step >= 2 ? "muted" : ""
  const gesture = step >= 0 ? STEPS[step].gesture : undefined
  const gestureOn = gesture && !(step === 2 && screen === "fcs" && !leaving)

  return (
    <figure className="rounded border border-border bg-card/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Through the lens</p>
        <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground">Illustrative render</p>
      </div>

      <p className="mt-4 font-display text-lg leading-snug tracking-tight text-foreground sm:text-xl">
        &ldquo;
        <Term state={bluebird} mark="1">
          Bluebird
        </Term>{" "}
        is slipping because <Term state={fcs}>FCS</Term> is still on the old golden path.&rdquo;
      </p>

      <div
        ref={stageRef}
        role="img"
        aria-label={`3D render of the Even G2 glasses. The lens shows: ${[s.term, s.meaning, s.owner].filter(Boolean).join(", ")}.`}
        className="relative mt-4 aspect-[4/3] overflow-hidden rounded border border-border bg-background sm:aspect-video"
      >
        <div aria-hidden className={`absolute inset-0 transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}>
          <Image src={glassesLight} alt="" fill sizes="(max-width: 768px) 100vw, 728px" className="object-contain dark:hidden" />
          <Image src={glassesDark} alt="" fill sizes="(max-width: 768px) 100vw, 728px" className="hidden object-contain dark:block" />
        </div>
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        {/* The G2 display on its real 576 x 288 grid, pinned to the lens each frame. */}
        <div
          ref={displayRef}
          aria-hidden
          style={{ opacity: 0 }}
          className={`${fontClass} pointer-events-none absolute left-0 top-0 h-[288px] w-[576px] origin-top-left rounded-md bg-[#040805]/90 text-[22px] leading-6 transition-opacity duration-300 dark:bg-transparent`}
        >
          <div
            className={`absolute inset-0 transition-[transform,opacity] duration-300 ease-[var(--ease-out-soft)] motion-reduce:transition-none ${
              leaving ? "translate-y-8 opacity-0" : ""
            }`}
          >
            <p className={`absolute left-4 top-3 whitespace-nowrap opacity-80 ${GREEN}`}>{s.status}</p>
            <div className="absolute left-4 top-12 h-56 w-[544px] border-[1.5px] border-[#4cf24f]/80 shadow-[0_0_8px_rgba(76,242,79,0.25)]" />
            <p className={`absolute left-[38px] top-[72px] whitespace-nowrap ${GREEN}`}>{s.term}</p>
            <p className={`absolute left-[38px] top-[129px] whitespace-nowrap opacity-90 ${GREEN}`}>{s.meaning}</p>
            <p className={`absolute left-[38px] top-[190px] whitespace-nowrap opacity-80 ${GREEN}`}>{s.owner}</p>
            <p className={`absolute left-[38px] top-[239px] whitespace-nowrap opacity-70 ${GREEN}`}>{s.hint}</p>
            <span className="absolute left-[528px] top-[243px] h-[11px] w-1 bg-[#4cf24f]/80" />
          </div>
        </div>

        <span
          ref={gestureRef}
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 transition-opacity duration-200 ${gestureOn ? "opacity-100" : "opacity-0"}`}
        >
          <span className="relative -ml-12 flex items-center gap-2">
            <span className="relative grid h-4 w-4 place-items-center">
              <span data-kind={gestureOn ? gesture : undefined} className="g2-gesture absolute inset-0 rounded-full border-[1.5px] border-accent" />
              <span data-kind={gestureOn ? gesture : undefined} className="g2-gesture-dot h-[7px] w-[7px] rounded-full bg-accent" />
            </span>
            <span className="rounded border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground">{gesture}</span>
          </span>
        </span>
      </div>

      <div role="group" aria-label="Steps in a meeting" className="mt-4 flex flex-wrap gap-2">
        {STEPS.map((st, i) => (
          <button
            key={st.label}
            type="button"
            aria-pressed={step === i}
            onClick={() => pick(i)}
            className={`flex h-11 items-center gap-2 rounded border px-3 font-mono text-xs uppercase tracking-[0.12em] transition-[color,background-color,border-color,transform] duration-150 ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] ${
              step === i
                ? "border-accent/60 bg-accent/10 text-foreground"
                : "border-border bg-transparent text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/30"
            }`}
          >
            {st.label}
            <span className="normal-case tracking-normal text-muted-foreground">{st.detail}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={replay}
          disabled={!ready}
          className="ml-auto flex h-11 items-center rounded px-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:invisible"
        >
          Replay
        </button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-[3lh] border-t border-border pt-4 text-sm leading-relaxed text-foreground sm:min-h-[2lh]">
        {step >= 0 ? STEPS[step].caption : IDLE_CAPTION}
      </p>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Screens recreated from Even Hub simulator captures. Halcyon Robotics, the company in the demo, is made up.
      </figcaption>
    </figure>
  )
}

/** A jargon word in the sentence: highlighted when heard, footnoted when saved, struck out when muted. */
function Term({ state, mark, children }: { state: string; mark?: string; children: React.ReactNode }) {
  const look =
    state === "hl"
      ? "text-accent"
      : state === "saved"
        ? "underline decoration-accent decoration-2 underline-offset-[5px]"
        : state === "muted"
          ? "text-muted-foreground line-through decoration-2"
          : ""
  return (
    <span>
      <span className={`transition-colors duration-300 ${look}`}>{children}</span>
      {mark && state === "saved" ? <sup className="ml-0.5 font-mono text-[11px] text-accent">{mark}</sup> : null}
    </span>
  )
}
