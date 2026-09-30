"use client"

import { useEffect, useState } from "react"

/** Where a looping scene is: `n` beats in, with `stage` of the beat's marks passed. */
export interface Beat {
  n: number
  stage: number
}

export interface BeatPlan {
  /** Shared by every component that should keep the same time. */
  key: string
  /** Seconds per beat. */
  period: number
  /** Seconds into a beat at which its stage steps up. */
  marks: readonly number[]
  /** Seconds after the scene opens that beat 1 starts; beat 0 is the quiet lead-in. */
  firstAt: number
  /** The beat a reduced-motion still is frozen on. */
  rest: Beat
}

const clocks = new Map<string, { t0: number; users: number }>()

/**
 * A repeating beat for scenes that tell a small story on a loop. Every
 * component that asks for the same plan reads one clock, started when the
 * first of them mounts, so a ring on the screen, a glow behind the picture
 * and a status list all change on the same frame. With `still` it never
 * ticks and reports the plan's resting beat instead.
 */
export function useBeat(plan: BeatPlan, still: boolean): Beat {
  const { key, period, marks, firstAt, rest } = plan
  const [beat, setBeat] = useState<Beat>(still ? rest : { n: 0, stage: marks.length })

  useEffect(() => {
    if (still) {
      setBeat(rest)
      return
    }
    let clock = clocks.get(key)
    if (!clock) {
      clock = { t0: performance.now(), users: 0 }
      clocks.set(key, clock)
    }
    clock.users++
    const { t0 } = clock
    let timer = 0
    const tick = () => {
      // Offset so that beat 1 begins `firstAt` seconds after the clock starts.
      const elapsed = (performance.now() - t0) / 1000 + (period - firstAt)
      const n = Math.floor(elapsed / period)
      const local = elapsed - n * period
      let stage = 0
      while (stage < marks.length && local >= marks[stage]) stage++
      setBeat((b) => (b.n === n && b.stage === stage ? b : { n, stage }))
      const next = stage < marks.length ? marks[stage] : period
      timer = window.setTimeout(tick, Math.max(16, (next - local) * 1000 + 4))
    }
    tick()
    return () => {
      window.clearTimeout(timer)
      const live = clocks.get(key)
      if (live && --live.users === 0) clocks.delete(key)
    }
  }, [key, period, marks, firstAt, rest, still])

  return beat
}
