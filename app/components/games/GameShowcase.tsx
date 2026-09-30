"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { MotionConfig, motion, useReducedMotion } from "framer-motion"
import { triggerHaptic } from "../ui/haptics"
import Stage, { EASE_OUT, FLIGHT, RADIUS, REST, scatterAway, type StageItem } from "./Stage"

export type Game = StageItem

// One `sizes` for the grid and the stage, so both request the same file and
// the poster is already decoded when it lifts out of the grid.
const POSTER_SIZES = "(max-width: 768px) 64vw, 520px"
const POSTER = {
  className: "aspect-[2/3] w-[min(62vw,calc(44dvh*2/3))] md:h-[min(76dvh,760px)] md:w-auto",
  sizes: POSTER_SIZES,
}
const layoutId = (id: string) => `game-poster-${id}`

/**
 * The story-driven games grid on /about. Clicking a poster pushes the others
 * out of the way, takes over the page with a scene from that game, and flies
 * the poster to centre stage beside its description.
 */
export default function GameShowcase({ games }: { games: Game[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scatter, setScatter] = useState<Record<string, string>>({})
  const tiles = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastOpened = useRef<string | null>(null)
  const reduce = useReducedMotion() ?? false
  const selected = games.find((g) => g.id === selectedId) ?? null

  const open = (id: string) => {
    triggerHaptic()
    setScatter(scatterAway(tiles.current, id))
    lastOpened.current = id
    setSelectedId(id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {games.map((game) => {
          const isOpen = game.id === selectedId
          const pushed = selectedId !== null && !isOpen
          return (
            <motion.button
              key={game.id}
              ref={(el) => {
                tiles.current[game.id] = el
              }}
              type="button"
              onClick={() => open(game.id)}
              aria-haspopup="dialog"
              aria-label={game.title}
              initial={false}
              animate={
                pushed
                  ? { transform: reduce ? REST : (scatter[game.id] ?? REST), opacity: 0 }
                  : { transform: REST, opacity: 1 }
              }
              // Out on the ease-out curve, with the fade trailing the flight so
              // the push is seen before the scene covers it; back in on the
              // flight spring, a beat behind the poster returning to its slot.
              transition={
                pushed
                  ? { transform: { duration: 0.45, ease: EASE_OUT }, opacity: { duration: 0.3, delay: 0.12, ease: EASE_OUT } }
                  : { ...FLIGHT, delay: 0.06 }
              }
              className="group relative aspect-[2/3] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* The official art already carries each title, so the tile is the
                  poster alone; the button's label names it. While a poster is on
                  stage its slot stays empty, holding the grid in place. */}
              {!isOpen ? (
                <motion.div
                  layoutId={layoutId(game.id)}
                  transition={FLIGHT}
                  style={RADIUS}
                  className="absolute inset-0 overflow-hidden border border-border bg-card"
                >
                  <motion.div layout transition={FLIGHT} className="absolute inset-0">
                    <Image
                      src={game.image}
                      alt=""
                      fill
                      sizes={POSTER_SIZES}
                      className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                    />
                  </motion.div>
                </motion.div>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <Stage
        item={selected}
        layoutId={layoutId}
        media={selected ? POSTER : null}
        alt={selected ? `${selected.title} poster` : ""}
        reduce={reduce}
        onClose={() => setSelectedId(null)}
        returnFocus={() => {
          const id = lastOpened.current
          if (id) tiles.current[id]?.focus({ preventScroll: true })
        }}
      />
    </MotionConfig>
  )
}
