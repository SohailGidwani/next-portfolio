"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react"
import Image, { type StaticImageData } from "next/image"
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"

export type LightboxImage = {
  src: StaticImageData | string
  alt: string
  caption?: string
}

type LightboxContextValue = {
  open: (index: number) => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function ProjectImageTrigger({
  index,
  children,
  className = "",
  label,
}: {
  index: number
  children: ReactNode
  className?: string
  label: string
}) {
  const context = useContext(LightboxContext)
  if (!context) throw new Error("ProjectImageTrigger must be inside ProjectImageLightbox")

  return (
    <button
      type="button"
      onClick={() => context.open(index)}
      className={className}
      aria-label={label}
    >
      {children}
    </button>
  )
}

export default function ProjectImageLightbox({
  images,
  children,
}: {
  images: LightboxImage[]
  children: ReactNode
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  // Pan position lives in refs and is written straight to the image style:
  // routing it through React state re-rendered the dialog on every
  // pointermove, which is exactly the choppiness a drag must not have.
  const imgRef = useRef<HTMLImageElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef(0)

  const applyTransform = useCallback((zoomValue: number) => {
    if (imgRef.current) {
      imgRef.current.style.transform =
        `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${zoomValue})`
    }
  }, [])

  useEffect(() => {
    applyTransform(zoom)
  }, [zoom, selected, applyTransform])

  const resetView = useCallback(() => {
    setZoom(1)
    posRef.current = { x: 0, y: 0 }
    dragOriginRef.current = null
    setDragging(false)
  }, [])

  const open = useCallback((index: number) => {
    setSelected(Math.max(0, Math.min(index, images.length - 1)))
    resetView()
  }, [images.length, resetView])

  const close = useCallback(() => {
    setSelected(null)
    resetView()
  }, [resetView])

  const move = useCallback((direction: 1 | -1) => {
    setSelected((current) => {
      if (current === null || images.length === 0) return current
      return (current + direction + images.length) % images.length
    })
    resetView()
  }, [images.length, resetView])

  const context = useMemo(() => ({ open }), [open])
  const active = selected === null ? null : images[selected]

  // ── Unzoomed touch gestures: swipe to page, drag down to dismiss ──────
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)
  const swipeAxisRef = useRef<"x" | "y" | null>(null)
  const swipeDeltaRef = useRef({ x: 0, y: 0 })
  const swipeSamplesRef = useRef<{ t: number; x: number; y: number }[]>([])

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      event.currentTarget.setPointerCapture(event.pointerId)
      dragOriginRef.current = {
        x: event.clientX - posRef.current.x,
        y: event.clientY - posRef.current.y,
      }
      setDragging(true)
      return
    }
    swipeStartRef.current = { x: event.clientX, y: event.clientY }
    swipeAxisRef.current = null
    swipeDeltaRef.current = { x: 0, y: 0 }
    swipeSamplesRef.current = [{ t: event.timeStamp, x: event.clientX, y: event.clientY }]
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      if (!dragOriginRef.current) return
      posRef.current = {
        x: event.clientX - dragOriginRef.current.x,
        y: event.clientY - dragOriginRef.current.y,
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0
          applyTransform(zoom)
        })
      }
      return
    }
    const start = swipeStartRef.current
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (!swipeAxisRef.current) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return
      // Horizontal pages; only a downward vertical drag dismisses.
      if (Math.abs(dx) >= Math.abs(dy)) {
        swipeAxisRef.current = "x"
      } else if (dy > 0) {
        swipeAxisRef.current = "y"
      } else {
        swipeStartRef.current = null
        return
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    swipeDeltaRef.current = { x: dx, y: dy }
    swipeSamplesRef.current.push({ t: event.timeStamp, x: event.clientX, y: event.clientY })
    if (swipeSamplesRef.current.length > 5) swipeSamplesRef.current.shift()
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const el = imgRef.current
        if (!el) return
        const delta = swipeDeltaRef.current
        el.style.transform =
          swipeAxisRef.current === "x"
            ? `translateX(${delta.x}px)`
            : `translateY(${delta.y}px)`
      })
    }
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom > 1 || !swipeAxisRef.current) {
      dragOriginRef.current = null
      swipeStartRef.current = null
      swipeAxisRef.current = null
      setDragging(false)
      return
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    const axis = swipeAxisRef.current
    const delta = swipeDeltaRef.current
    const samples = swipeSamplesRef.current
    const first = samples[0]
    const last = samples[samples.length - 1]
    const el = imgRef.current
    const width = event.currentTarget.getBoundingClientRect().width || 1
    swipeStartRef.current = null
    swipeAxisRef.current = null
    swipeSamplesRef.current = []
    setDragging(false)
    if (!el) return
    const soft = "cubic-bezier(0.25, 1, 0.5, 1)"
    if (axis === "x") {
      const velocity = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0
      if (Math.abs(velocity) > 0.11 || Math.abs(delta.x) > width * 0.35) {
        // Swipe left pages forward; the next image enters from that side.
        const direction: 1 | -1 = delta.x < 0 ? 1 : -1
        move(direction)
        requestAnimationFrame(() => {
          imgRef.current?.animate(
            [
              { transform: `translateX(${40 * direction}px) scale(1)`, opacity: 0.5 },
              { transform: "translateX(0px) scale(1)", opacity: 1 },
            ],
            { duration: reducedMotion() ? 0 : 200, easing: soft }
          )
        })
      } else {
        el.animate(
          [{ transform: `translateX(${delta.x}px)` }, { transform: "translateX(0px)" }],
          { duration: reducedMotion() ? 0 : 200, easing: soft }
        )
        applyTransform(zoom)
      }
      return
    }
    const velocity = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0
    if (velocity > 0.11 || delta.y > 120) {
      if (reducedMotion()) {
        close()
        return
      }
      const exit = el.animate(
        [
          { transform: `translateY(${delta.y}px)`, opacity: 1 },
          { transform: `translateY(${delta.y + 160}px)`, opacity: 0 },
        ],
        { duration: 180, easing: soft, fill: "forwards" }
      )
      exit.finished.then(close).catch(close)
    } else {
      el.animate(
        [{ transform: `translateY(${delta.y}px)` }, { transform: "translateY(0px)" }],
        { duration: reducedMotion() ? 0 : 200, easing: soft }
      )
      applyTransform(zoom)
    }
  }

  return (
    <LightboxContext.Provider value={context}>
      {children}
      <Dialog
        open={selected !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) close()
        }}
      >
        {active ? (
          <DialogContent
            showClose={false}
            className="h-[94dvh] w-[96vw] max-w-[96vw] grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-3 overflow-hidden rounded bg-black/95 p-3 text-white sm:p-5"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault()
                move(-1)
              } else if (event.key === "ArrowRight") {
                event.preventDefault()
                move(1)
              } else if (event.key === "+" || event.key === "=") {
                event.preventDefault()
                setZoom((value) => Math.min(3, value + 0.5))
              } else if (event.key === "-") {
                event.preventDefault()
                setZoom((value) => Math.max(0.5, value - 0.5))
              } else if (event.key === "0") {
                event.preventDefault()
                resetView()
              }
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="truncate text-sm font-semibold text-white">
                  {active.caption ?? active.alt}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs text-white/65">
                  Image {(selected ?? 0) + 1} of {images.length}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
                  aria-label="Zoom in"
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white transition-transform active:scale-[0.98]"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(0.5, value - 0.5))}
                  aria-label="Zoom out"
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white transition-transform active:scale-[0.98]"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset image zoom"
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white transition-transform active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close image viewer"
                    className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white transition-transform active:scale-[0.98]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>
            </div>

            <div
              className="relative flex min-h-0 touch-none items-center justify-center overflow-hidden rounded"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
            >
              <Image
                ref={imgRef}
                src={active.src}
                alt={active.alt}
                fill
                sizes="96vw"
                className={
                  dragging
                    ? "object-contain"
                    : "object-contain transition-transform duration-150 ease-[var(--ease-out-soft)]"
                }
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous image"
                className="inline-flex min-h-10 items-center gap-2 rounded border border-white/20 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-transform active:scale-[0.98]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <p className="hidden font-mono text-[11px] text-white/65 sm:block">
                Arrow keys navigate · +/- zoom · 0 reset · Esc close
              </p>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next image"
                className="inline-flex min-h-10 items-center gap-2 rounded border border-white/20 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-transform active:scale-[0.98]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </LightboxContext.Provider>
  )
}
