"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { smoothScrollToTop } from "@/app/utils/smoothScroll"

export default function BackToTop() {
  const [show, setShow] = useState(false)
  // Framer bypasses the CSS reduced-motion kill switch; gate movement here.
  const reduced = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    triggerHaptic()
    smoothScrollToTop()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded border border-border bg-card/90 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
