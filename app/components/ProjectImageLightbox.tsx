"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const resetView = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setDragStart(null)
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

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStart({ x: event.clientX - position.x, y: event.clientY - position.y })
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart || zoom <= 1) return
    setPosition({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y })
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
            className="h-[94dvh] w-[96vw] max-w-[96vw] grid-rows-[auto_1fr_auto] gap-3 overflow-hidden rounded bg-black/95 p-3 text-white sm:p-5"
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
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(0.5, value - 0.5))}
                  aria-label="Zoom out"
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset image zoom"
                  className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close image viewer"
                    className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-white"
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
              onPointerUp={() => setDragStart(null)}
              onPointerCancel={() => setDragStart(null)}
              style={{ cursor: zoom > 1 ? (dragStart ? "grabbing" : "grab") : "default" }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="96vw"
                className="object-contain transition-transform duration-150"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous image"
                className="inline-flex min-h-10 items-center gap-2 rounded border border-white/20 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
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
                className="inline-flex min-h-10 items-center gap-2 rounded border border-white/20 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
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
