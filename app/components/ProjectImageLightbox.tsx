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

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragOriginRef.current = {
      x: event.clientX - posRef.current.x,
      y: event.clientY - posRef.current.y,
    }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOriginRef.current || zoom <= 1) return
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
  }

  const endDrag = () => {
    dragOriginRef.current = null
    setDragging(false)
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
