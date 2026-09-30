"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { MotionConfig, motion, useReducedMotion } from "framer-motion"
import { Heart } from "lucide-react"
import { triggerHaptic } from "../ui/haptics"
import Stage, { EASE_OUT, FLIGHT, RADIUS, REST, scatterAway, type StageItem, type StageMedia } from "./Stage"

export type Hero = StageItem & { shape: "wide" | "square" }

// Each picture opens at its own shape and no larger than its file stays sharp
// at 2x: the Spider-Man still is 1400 x 700, the Iron Man art 1200 x 1200.
const MEDIA: Record<Hero["shape"], StageMedia> = {
  wide: { className: "aspect-[2/1] w-[min(86vw,700px)]", sizes: "(max-width: 768px) 86vw, 700px", stacked: true },
  square: { className: "aspect-square w-[min(72vw,40dvh)] md:w-[min(56dvh,560px)]", sizes: "(max-width: 768px) 72vw, 560px" },
}
const layoutId = (id: string) => `hero-picture-${id}`

/**
 * The Marvel favourites on /about. Same stage as the games: the other card
 * slides away, a scene for the hero takes over the page (a HUD for Iron Man,
 * a comic panel for Spider-Man), and the picture opens beside the reason
 * it is a favourite.
 */
export default function MarvelShowcase({ heroes }: { heroes: Hero[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scatter, setScatter] = useState<Record<string, string>>({})
  const cards = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastOpened = useRef<string | null>(null)
  const reduce = useReducedMotion() ?? false
  const selected = heroes.find((h) => h.id === selectedId) ?? null

  const open = (id: string) => {
    triggerHaptic()
    setScatter(scatterAway(cards.current, id))
    lastOpened.current = id
    setSelectedId(id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-4 sm:grid-cols-2">
        {heroes.map((hero) => {
          const isOpen = hero.id === selectedId
          const pushed = selectedId !== null && !isOpen
          return (
            <motion.button
              key={hero.id}
              ref={(el) => {
                cards.current[hero.id] = el
              }}
              type="button"
              onClick={() => open(hero.id)}
              aria-haspopup="dialog"
              initial={false}
              animate={
                pushed
                  ? { transform: reduce ? REST : (scatter[hero.id] ?? REST), opacity: 0 }
                  : { transform: REST, opacity: 1 }
              }
              transition={
                pushed
                  ? { transform: { duration: 0.45, ease: EASE_OUT }, opacity: { duration: 0.3, delay: 0.12, ease: EASE_OUT } }
                  : { ...FLIGHT, delay: 0.06 }
              }
              className="group grid w-full grid-cols-[120px_1fr] gap-4 rounded border border-border bg-card/60 p-4 text-left transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-[160px_1fr] sm:p-5"
            >
              <span className="relative block aspect-square self-center">
                {!isOpen ? (
                  <motion.span
                    layoutId={layoutId(hero.id)}
                    transition={FLIGHT}
                    style={RADIUS}
                    className="absolute inset-0 block overflow-hidden border border-border bg-background"
                  >
                    <motion.span layout transition={FLIGHT} className="absolute inset-0 block">
                      <Image
                        src={hero.image}
                        alt=""
                        fill
                        sizes={MEDIA[hero.shape].sizes}
                        className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                      />
                    </motion.span>
                  </motion.span>
                ) : null}
              </span>
              {/* A button may only hold phrasing content, so the caption is
                  spans styled as blocks rather than a figcaption and quote.
                  No aria-label: the button is named by this text, so the
                  reason is still read out and the name differs from the
                  Spider-Man game poster further down. */}
              <span className="flex min-w-0 flex-col justify-center">
                <span className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-accent" aria-hidden />
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Favorite</span>
                </span>
                <span className="mt-1.5 block font-display text-xl text-foreground">{hero.title}</span>
                <span className="mt-2 block border-l-2 border-accent/60 pl-3 text-[14px] italic leading-relaxed text-muted-foreground sm:text-[15px]">
                  {hero.description}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      <Stage
        item={selected}
        layoutId={layoutId}
        media={selected ? MEDIA[selected.shape] : null}
        alt={selected ? selected.title : ""}
        reduce={reduce}
        onClose={() => setSelectedId(null)}
        returnFocus={() => {
          const id = lastOpened.current
          if (id) cards.current[id]?.focus({ preventScroll: true })
        }}
      />
    </MotionConfig>
  )
}
