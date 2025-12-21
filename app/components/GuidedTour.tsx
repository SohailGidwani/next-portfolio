"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

type TourStep = {
  id: string
  title: string
  description: string
}

interface GuidedTourProps {
  steps: TourStep[]
  stepIndex: number | null
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
}

export default function GuidedTour({ steps, stepIndex, onNext, onPrevious, onClose }: GuidedTourProps) {
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
      element.scrollIntoView({ behavior: "smooth", block: "start" })
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto fixed inset-x-4 bottom-4 z-[60] w-auto rounded-3xl border border-border bg-card/95 p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.5)] backdrop-blur sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[92vw] sm:max-w-sm"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
              aria-label="Close guided tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{activeStep.description}</p>

          <div className="mt-5 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Step {currentIndex + 1} of {steps.length}
            </span>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:w-auto"
                disabled={currentIndex === 0}
                aria-label="Previous step"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/15 sm:w-auto"
                aria-label="Next step"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
