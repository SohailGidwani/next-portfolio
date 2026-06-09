"use client"

import { useState, type ReactNode } from "react"
import { Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { triggerHaptic } from "./ui/haptics"

type DiagramLightboxProps = {
  title: string
  children: ReactNode
}

/**
 * Wraps a dense diagram with an expand control that reopens it in a
 * near-fullscreen dialog with room to breathe (and scroll on small screens).
 * The button is hover-revealed on desktop and always visible on touch sizes.
 */
export default function DiagramLightbox({ title, children }: DiagramLightboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="group/diagram relative">
        {children}
        <button
          type="button"
          onClick={() => {
            triggerHaptic()
            setOpen(true)
          }}
          aria-label={`Expand diagram: ${title}`}
          className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-card/90 text-muted-foreground opacity-0 backdrop-blur transition hover:border-accent/50 hover:text-foreground focus-visible:opacity-100 group-hover/diagram:opacity-100 max-lg:opacity-100"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[92vh] w-[96vw] max-w-[96vw] grid-rows-[auto_1fr] gap-3 overflow-hidden rounded p-4 sm:w-[96vw] sm:rounded sm:p-6">
          <DialogTitle className="pr-10 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </DialogTitle>
          <div className="min-h-0 overflow-auto">
            <div className="mx-auto min-w-[720px] max-w-6xl py-2">{children}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
