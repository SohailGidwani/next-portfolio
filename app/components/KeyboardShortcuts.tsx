"use client"

import { useEffect, useState } from "react"
import { Command, X } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)

  // Detect OS on mount
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const shortcuts = [
    { keys: isMac ? ["⌘", "K"] : ["Ctrl", "K"], description: "Open command palette" },
    { keys: ["?"], description: "Show keyboard shortcuts" },
    { keys: ["↑", "↓"], description: "Navigate in lists" },
    { keys: ["Enter"], description: "Select item" },
    { keys: ["Esc"], description: "Close dialogs" },
    { keys: ["←", "→"], description: "Navigate guided tour" },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        triggerHaptic()
        setIsOpen((prev) => !prev)
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showClose={false}
        className="top-[20%] max-w-md translate-y-0 gap-0 overflow-hidden rounded p-0"
      >
            <DialogDescription className="sr-only">
              Keyboard commands available throughout the portfolio.
            </DialogDescription>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded bg-accent/10 text-accent">
                  <Command className="h-4 w-4" />
                </span>
                <DialogTitle className="font-display text-lg text-foreground">Keyboard Shortcuts</DialogTitle>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close keyboard shortcuts"
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>

            {/* Shortcuts list */}
            <div className="p-4">
              <div className="space-y-2">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between rounded bg-background/50 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="inline-flex min-w-[24px] items-center justify-center rounded bg-muted px-2 py-1 text-xs font-medium text-foreground">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3 text-center text-xs text-muted-foreground">
              Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">?</kbd> to toggle this menu
            </div>
      </DialogContent>
    </Dialog>
  )
}
