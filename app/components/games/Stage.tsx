"use client"

import Image from "next/image"
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import GameScene, { Halo, THEME_ACCENT, type GameTheme } from "./GameScene"

export interface StageItem {
  id: string
  title: string
  image: string
  description: string
  theme: GameTheme
}

/** How the picture sits on the stage. */
export interface StageMedia {
  /** Size and aspect classes for the picture on the stage. */
  className: string
  /** Must match the tile's `sizes`, so the stage reuses the tile's file. */
  sizes: string
  /** Text below the picture at every width (wide pictures), not beside it. */
  stacked?: boolean
}

// The picture's flight between its tile and the stage is a spring, so closing
// mid-flight turns it around from wherever it is instead of restarting.
export const FLIGHT: Transition = { type: "spring", duration: 0.55, bounce: 0.15 }
export const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft
export const REST = "translate(0px, 0px) rotate(0deg) scale(1)"
export const RADIUS = { borderRadius: 4 } // on `style`, so framer keeps it true while scaling

const LINE: Variants = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.4, ease: EASE_OUT } },
  gone: { opacity: 0, transition: { duration: 0.12 } },
}

/**
 * Where each of the other tiles goes when one opens: straight away from it,
 * farther the farther it already was, tilting toward the side it leaves by.
 */
export function scatterAway(tiles: Record<string, HTMLElement | null>, openId: string) {
  const origin = tiles[openId]?.getBoundingClientRect()
  const out: Record<string, string> = {}
  if (!origin) return out
  const ox = origin.left + origin.width / 2
  const oy = origin.top + origin.height / 2
  for (const [id, el] of Object.entries(tiles)) {
    if (id === openId || !el) continue
    const rect = el.getBoundingClientRect()
    const dx = rect.left + rect.width / 2 - ox
    const dy = rect.top + rect.height / 2 - oy
    const len = Math.hypot(dx, dy) || 1
    const push = 180 + len * 0.45
    out[id] = `translate(${((dx / len) * push).toFixed(1)}px, ${((dy / len) * push).toFixed(1)}px) rotate(${dx < 0 ? -8 : 8}deg) scale(0.9)`
  }
  return out
}

/**
 * The open stage: a scene for the item takes over the page and its picture
 * flies (shared `layoutId`) to centre stage beside, or above, its text.
 * Closing (Escape, the button, a click outside, or dragging the picture down)
 * plays it backwards.
 */
export default function Stage({
  item,
  layoutId,
  media,
  alt,
  reduce,
  onClose,
  returnFocus,
}: {
  item: StageItem | null
  layoutId: (id: string) => string
  media: StageMedia | null
  alt: string
  reduce: boolean
  onClose: () => void
  returnFocus: () => void
}) {
  return (
    <Dialog.Root open={item !== null} onOpenChange={(isOpen) => (isOpen ? undefined : onClose())}>
      <AnimatePresence>
        {item && media ? (
          <Dialog.Portal forceMount key="stage">
            <Dialog.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-[70]"
                initial={{ opacity: 0 }}
                // A short hold before the scene rises, so the other tiles are
                // seen scattering before it covers them.
                animate={{ opacity: 1, transition: { duration: 0.32, delay: 0.08, ease: EASE_OUT } }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
              >
                <GameScene theme={item.theme} still={reduce} />
              </motion.div>
            </Dialog.Overlay>

            {/* Clicks on the empty area fall through this layer to the
                overlay, which Radix treats as outside the dialog and closes.
                overflow-hidden clips halo art that reaches past the screen,
                which would otherwise widen a phone's layout viewport. */}
            <div className="pointer-events-none fixed inset-0 z-[71] flex items-center justify-center overflow-hidden p-6 pt-20 md:p-10">
              <Dialog.Content
                forceMount
                // Radix returns focus to whatever held it at open, which was
                // lost by the time the exit animation unmounts the dialog.
                onCloseAutoFocus={(event) => {
                  event.preventDefault()
                  returnFocus()
                }}
                className={`pointer-events-auto flex w-full max-w-5xl flex-col items-center outline-none ${
                  media.stacked ? "gap-10" : "gap-7 md:flex-row md:justify-center md:gap-14"
                }`}
              >
                <div className="relative shrink-0">
                  <Halo theme={item.theme} still={reduce} />
                  <motion.div
                    layoutId={layoutId(item.id)}
                    transition={FLIGHT}
                    style={{ ...RADIUS, touchAction: "none" }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.5}
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 110 || info.velocity.y > 600) onClose()
                    }}
                    className={`relative shrink-0 cursor-grab overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] active:cursor-grabbing ${media.className}`}
                  >
                    {/* `layout` on the image's box counter-scales it while the
                        frame changes shape (a square tile opening into a wide
                        picture), so the picture re-crops instead of stretching. */}
                    <motion.div layout transition={FLIGHT} className="absolute inset-0">
                      <Image src={item.image} alt={alt} fill sizes={media.sizes} draggable={false} className="pointer-events-none object-cover" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* A soft dark pool behind the text keeps it legible over
                    whatever the scene draws there. */}
                <motion.div
                  className={`relative isolate text-center before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-20 before:-z-10 before:bg-[radial-gradient(closest-side,rgba(0,0,0,0.78),rgba(0,0,0,0.45)_55%,transparent)] ${
                    media.stacked ? "max-w-xl" : "max-w-md md:text-left"
                  }`}
                  initial="hidden"
                  animate="show"
                  exit="gone"
                  variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.28 } } }}
                >
                  <Dialog.Title asChild>
                    <motion.h2 variants={LINE} className="font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl">
                      {item.title}
                    </motion.h2>
                  </Dialog.Title>
                  <motion.span
                    variants={LINE}
                    aria-hidden
                    className={`mx-auto mt-5 block h-0.5 w-12 ${media.stacked ? "" : "md:mx-0"}`}
                    style={{ background: THEME_ACCENT[item.theme] }}
                  />
                  <Dialog.Description asChild>
                    <motion.p variants={LINE} className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                      {item.description}
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
  )
}
