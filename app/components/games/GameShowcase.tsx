"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Transition, type Variants } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { triggerHaptic } from "../ui/haptics"
import GameScene, { RuneRing, THEME_ACCENT, type GameTheme } from "./GameScene"

export interface Game {
  id: string
  title: string
  image: string
  description: string
  theme: GameTheme
}

// One `sizes` for the grid and the stage, so both request the same file and
// the poster is already decoded when it lifts out of the grid.
const POSTER_SIZES = "(max-width: 768px) 64vw, 520px"
// The poster's flight between the grid and the stage is a spring, so closing
// mid-flight turns it around from wherever it is instead of restarting.
const FLIGHT: Transition = { type: "spring", duration: 0.55, bounce: 0.15 }
const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft
const REST = "translate(0px, 0px) rotate(0deg) scale(1)"
const RADIUS = { borderRadius: 4 } // on `style`, so framer keeps it true while scaling

const LINE: Variants = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.4, ease: EASE_OUT } },
  gone: { opacity: 0, transition: { duration: 0.12 } },
}

/**
 * The story-driven games grid on /about. Clicking a poster pushes the others
 * out of the way, takes over the page with a scene from that game, and flies
 * the poster to centre stage beside its description. Closing (Escape, the
 * button, a click outside, or dragging the poster down) plays it backwards.
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
    // Each other poster is pushed straight away from the one clicked, farther
    // the farther it already was, tilting toward the side it leaves by.
    const origin = tiles.current[id]?.getBoundingClientRect()
    const next: Record<string, string> = {}
    if (origin) {
      const ox = origin.left + origin.width / 2
      const oy = origin.top + origin.height / 2
      for (const g of games) {
        const rect = g.id === id ? null : tiles.current[g.id]?.getBoundingClientRect()
        if (!rect) continue
        const dx = rect.left + rect.width / 2 - ox
        const dy = rect.top + rect.height / 2 - oy
        const len = Math.hypot(dx, dy) || 1
        const push = 180 + len * 0.45
        next[g.id] = `translate(${((dx / len) * push).toFixed(1)}px, ${((dy / len) * push).toFixed(1)}px) rotate(${dx < 0 ? -8 : 8}deg) scale(0.9)`
      }
    }
    setScatter(next)
    lastOpened.current = id
    setSelectedId(id)
  }

  const close = () => setSelectedId(null)

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
                  layoutId={`game-poster-${game.id}`}
                  transition={FLIGHT}
                  style={RADIUS}
                  className="absolute inset-0 overflow-hidden border border-border bg-card"
                >
                  <Image
                    src={game.image}
                    alt=""
                    fill
                    sizes={POSTER_SIZES}
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                  />
                </motion.div>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <Dialog.Root open={selected !== null} onOpenChange={(isOpen) => (isOpen ? undefined : close())}>
        <AnimatePresence>
          {selected ? (
            <Dialog.Portal forceMount key="game-stage">
              <Dialog.Overlay forceMount asChild>
                <motion.div
                  className="fixed inset-0 z-[70]"
                  initial={{ opacity: 0 }}
                  // A short hold before the scene rises, so the posters are
                  // seen scattering before it covers them.
                  animate={{ opacity: 1, transition: { duration: 0.32, delay: 0.08, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
                >
                  <GameScene theme={selected.theme} still={reduce} />
                </motion.div>
              </Dialog.Overlay>

              {/* Clicks on the empty area fall through this layer to the
                  overlay, which Radix treats as outside the dialog and closes. */}
              <div className="pointer-events-none fixed inset-0 z-[71] flex items-center justify-center p-6 pt-20 md:p-10">
                <Dialog.Content
                  forceMount
                  // Radix returns focus to whatever held it at open, which was
                  // lost by the time the exit animation unmounts the dialog.
                  // Hand it back to the poster the reader opened.
                  onCloseAutoFocus={(event) => {
                    event.preventDefault()
                    const id = lastOpened.current
                    if (id) tiles.current[id]?.focus({ preventScroll: true })
                  }}
                  className="pointer-events-auto flex w-full max-w-5xl flex-col items-center gap-7 outline-none md:flex-row md:justify-center md:gap-14"
                >
                  <div className="relative shrink-0">
                    {/* Phones: the rune ring circles the poster itself, sized so
                        only its sides clear the poster; the runes pass behind it
                        as the ring turns and never reach the text below. */}
                    {selected.theme === "frost" ? (
                      <RuneRing
                        still={reduce}
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[152%] w-[152%] -translate-x-1/2 -translate-y-1/2 md:hidden"
                      />
                    ) : null}
                    <motion.div
                      layoutId={`game-poster-${selected.id}`}
                      transition={FLIGHT}
                      style={{ ...RADIUS, touchAction: "none" }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0.5}
                      dragSnapToOrigin
                      onDragEnd={(_, info) => {
                        if (info.offset.y > 110 || info.velocity.y > 600) close()
                      }}
                      className="relative aspect-[2/3] w-[min(62vw,calc(44dvh*2/3))] shrink-0 cursor-grab overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] active:cursor-grabbing md:h-[min(76dvh,760px)] md:w-auto"
                    >
                      <Image
                        src={selected.image}
                        alt={`${selected.title} poster`}
                        fill
                        sizes={POSTER_SIZES}
                        draggable={false}
                        className="pointer-events-none object-cover"
                      />
                    </motion.div>
                  </div>

                  {/* A soft dark pool behind the text keeps it legible over
                      whatever the scene draws there: pitch lines, web strands,
                      particles. */}
                  <motion.div
                    className="relative isolate max-w-md text-center before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-20 before:-z-10 before:bg-[radial-gradient(closest-side,rgba(0,0,0,0.78),rgba(0,0,0,0.45)_55%,transparent)] md:text-left"
                    initial="hidden"
                    animate="show"
                    exit="gone"
                    variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.28 } } }}
                  >
                    <Dialog.Title asChild>
                      <motion.h2 variants={LINE} className="font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
                        {selected.title}
                      </motion.h2>
                    </Dialog.Title>
                    <motion.span
                      variants={LINE}
                      aria-hidden
                      className="mx-auto mt-5 block h-0.5 w-12 md:mx-0"
                      style={{ background: THEME_ACCENT[selected.theme] }}
                    />
                    <Dialog.Description asChild>
                      <motion.p variants={LINE} className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                        {selected.description}
                      </motion.p>
                    </Dialog.Description>
                  </motion.div>

                  <Dialog.Close asChild>
                    <motion.button
                      type="button"
                      aria-label="Close"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="fixed right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded border border-white/20 bg-black/30 text-white transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </motion.button>
                  </Dialog.Close>
                </Dialog.Content>
              </div>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </MotionConfig>
  )
}
