"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio, TOUR_STEPS } from "./PortfolioProvider"
import { smoothScrollTo } from "@/app/utils/smoothScroll"

type TourStep = {
  id: string
  title: string
  description: string
}

interface GuidedTourProps {
  steps?: TourStep[]
}

export default function GuidedTour({ steps = TOUR_STEPS }: GuidedTourProps) {
  const { tourStep: stepIndex, nextTourStep: onNext, previousTourStep: onPrevious, stopTour: onClose } = usePortfolio()
  const activeStep = stepIndex !== null ? steps[stepIndex] : null
  const currentIndex = stepIndex ?? 0
  const previousElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (previousElementRef.current) {
      previousElementRef.current.classList.remove("tour-highlight")
    }

    if (!activeStep) {
      previousElementRef.current = null
      return
    }

    const element = document.getElementById(activeStep.id)
    if (element) {
      element.classList.add("tour-highlight")
      smoothScrollTo(element, { offset: 20 })
      previousElementRef.current = element
    }

    return () => {
      if (previousElementRef.current) {
        previousElementRef.current.classList.remove("tour-highlight")
      }
    }
  }, [activeStep])

  useEffect(() => {
    if (!activeStep) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerHaptic()
        onClose()
      }
      if (event.key === "ArrowRight") {
        triggerHaptic()
        onNext()
      }
      if (event.key === "ArrowLeft") {
        triggerHaptic()
        onPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeStep, onClose, onNext, onPrevious])

  const handleNext = () => {
    triggerHaptic()
    onNext()
  }

  const handlePrevious = () => {
    triggerHaptic()
    onPrevious()
  }

  const handleClose = () => {
    triggerHaptic()
    onClose()
  }

  return (
    <AnimatePresence>
      {activeStep && (
        <>
          {/* Mobile: Compact floating bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-x-3 bottom-3 z-[60] flex items-center gap-3 rounded border border-border bg-card/95 px-3 py-2.5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)] backdrop-blur sm:hidden"
            role="dialog"
            aria-live="polite"
          >
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              aria-label="Previous step"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{activeStep.title}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {currentIndex + 1}/{steps.length}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-accent/40 bg-accent/10 text-accent transition hover:bg-accent/15"
              aria-label="Next step"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
              aria-label="Close guided tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          {/* Desktop: Full card with description */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto fixed bottom-5 right-5 z-[60] hidden w-[92vw] max-w-sm rounded-md border-2 border-accent/50 bg-card/95 p-5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.35),0_30px_80px_-60px_rgba(0,0,0,0.5)] backdrop-blur sm:block"
            style={{
              animation: "tour-dialog-glow 2s ease-in-out infinite",
            }}
            role="dialog"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded bg-accent/10 text-accent">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Guided tour
                  </p>
                  <h3 className="font-display text-lg text-foreground">{activeStep.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
                aria-label="Close guided tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{activeStep.description}</p>

            <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                Step {currentIndex + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground disabled:opacity-40"
                  disabled={currentIndex === 0}
                  aria-label="Previous step"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:bg-accent/15"
                  aria-label="Next step"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
