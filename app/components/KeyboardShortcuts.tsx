"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Command, X } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-md -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Command className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg text-foreground">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="p-4">
              <div className="space-y-2">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between rounded-xl bg-background/50 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
