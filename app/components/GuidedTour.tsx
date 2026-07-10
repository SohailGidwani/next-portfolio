"use client"

import { useEffect, useRef } from "react"
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio, TOUR_STEPS } from "./PortfolioProvider"
import { smoothScrollTo } from "@/app/utils/smoothScroll"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"

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
  const returnFocusRef = useRef<HTMLElement | null>(null)

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

  useEffect(() => {
    if (activeStep && !returnFocusRef.current) {
      returnFocusRef.current = document.activeElement as HTMLElement | null
    }
  }, [activeStep])

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
    <Dialog
      open={Boolean(activeStep)}
      modal={false}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      {activeStep ? (
        <DialogContent
          showOverlay={false}
          showClose={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            returnFocusRef.current?.focus()
            returnFocusRef.current = null
          }}
          className="left-3 right-3 top-auto bottom-3 z-[60] w-auto max-w-none translate-x-0 translate-y-0 gap-0 rounded border border-border bg-card/95 p-0 backdrop-blur sm:left-auto sm:right-5 sm:bottom-5 sm:w-[92vw] sm:max-w-sm sm:border-2 sm:border-accent/50"
          aria-live="polite"
        >
          <DialogTitle className="sr-only">{activeStep.title}</DialogTitle>
          <DialogDescription className="sr-only">{activeStep.description}</DialogDescription>

          <div className="flex items-center gap-3 px-3 py-2.5 sm:hidden">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              aria-label="Previous step"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{activeStep.title}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {currentIndex + 1}/{steps.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-accent/40 bg-accent/10 text-accent transition hover:bg-accent/15"
              aria-label="Next step"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
              aria-label="Close guided tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="hidden p-5 sm:block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded bg-accent/10 text-accent">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guided tour</p>
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
              <span>Step {currentIndex + 1} of {steps.length}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition hover:bg-accent/15"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
