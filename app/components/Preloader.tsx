"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const minDisplayTime = 800
    const skipThreshold = 500
    const start = Date.now()

    const finish = () => {
      const elapsed = Date.now() - start
      if (elapsed < skipThreshold) {
        setIsLoading(false)
        onComplete()
        return
      }
      const remaining = Math.max(0, minDisplayTime - elapsed)
      setTimeout(() => {
        setIsLoading(false)
        setTimeout(onComplete, 500)
      }, remaining)
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const webglReady = new Promise<void>((resolve) => {
      const handler = () => { resolve(); window.removeEventListener('webgl-ready', handler) }
      window.addEventListener('webgl-ready', handler)
      setTimeout(resolve, 3000)
    })

    Promise.all([fontsReady, webglReady]).then(finish)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090909]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className="font-display italic text-2xl text-white tracking-wide">SG</div>
            <div className="mt-4 h-px w-12 mx-auto overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-white/40"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
