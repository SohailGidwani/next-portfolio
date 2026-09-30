"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export interface Pleasure {
  id: string
  icon: ReactNode
  label: string
  detail: string
  /** The small scene the icon plays: steam rising, waves drifting, the sun going down. */
  scene: "steam" | "swim" | "sunset"
}

const PLAY_MS = 2000

/**
 * The simple pleasures list on /about. Each line is short enough to show
 * whole, so there is nothing to open: the full sentence sits beside its name.
 * Hovering a line (or tapping it on a phone, where it plays once) sets its
 * icon going; the scenes live in globals.css under `.pleasure`.
 */
export default function SimplePleasures({ items }: { items: Pleasure[] }) {
  const [playing, setPlaying] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Only for touch: with a mouse, hover already plays the scene.
  const play = (id: string) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    window.clearTimeout(timer.current)
    setPlaying(null)
    // A frame with the attribute off, so tapping the same line again restarts it.
    requestAnimationFrame(() => {
      setPlaying(id)
      timer.current = window.setTimeout(() => setPlaying(null), PLAY_MS)
    })
  }

  return (
    <ul className="max-w-4xl divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => play(item.id)}
          data-play={playing === item.id ? "" : undefined}
          className="pleasure grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-1 py-4 sm:grid-cols-[auto_8rem_minmax(0,1fr)] sm:items-center"
        >
          <span
            aria-hidden
            className={`pl-tile pl-${item.scene} relative row-span-2 grid h-11 w-11 place-items-center overflow-hidden rounded border border-border bg-card/60 text-accent sm:row-span-1`}
          >
            {item.scene === "sunset" ? (
              <>
                <span className="pl-glow" />
                <span className="pl-horizon" />
              </>
            ) : null}
            {item.scene === "swim" ? <span className="pl-ripple" /> : null}
            <span className="pl-icon grid place-items-center">{item.icon}</span>
          </span>
          <span className="font-medium text-foreground">{item.label}</span>
          <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">{item.detail}</p>
        </li>
      ))}
    </ul>
  )
}
