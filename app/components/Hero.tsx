"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import PinnedSection from "./scroll/PinnedSection"
import TextDecode from "./TextDecode"
import { useScrollEngine } from "./scroll/ScrollEngine"

const WebGLCanvas = dynamic(() => import("./webgl/WebGLCanvas"), { ssr: false })
const LiquidGlassShader = dynamic(() => import("./webgl/LiquidGlassShader"), { ssr: false })

interface HeroProps {
  onProgress?: (progress: number, velocity: number) => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

export default function Hero({ onProgress }: HeroProps) {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [titleDone, setTitleDone] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("hero", sectionRef.current)
    }
  }, [registerSection])

  const handleProgress = useCallback(
    (progress: number, vel: number) => {
      setScrollProgress(progress)
      setVelocity(vel)
      onProgress?.(progress, vel)
    },
    [onProgress]
  )

  return (
    <PinnedSection id="hero" scrubDuration={3} onProgress={handleProgress}>
      <div ref={sectionRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {isMobile ? (
            <div className="absolute inset-0 webgl-fallback" />
          ) : (
            <WebGLCanvas
              fallback={
                <div className="absolute inset-0 webgl-fallback" />
              }
            >
              <LiquidGlassShader scrollProgress={scrollProgress} velocity={velocity} />
            </WebGLCanvas>
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="font-display italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white">
              {isMobile ? (
                "Sohail Gidwani"
              ) : (
                <TextDecode
                  text="Sohail Gidwani"
                  delay={400}
                  speed={45}
                  onComplete={() => setTitleDone(true)}
                />
              )}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isMobile || titleDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6 font-body text-sm sm:text-base tracking-[0.3em] uppercase text-white/40"
          >
            Software Engineer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isMobile || titleDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-4 font-body text-xs sm:text-sm text-white/25 max-w-md"
          >
            AI systems that work in production. Full-stack engineering meets applied ML.
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isMobile || titleDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-[11px] font-body tracking-[0.25em] uppercase text-white/20"
          >
            Scroll to explore ↓
          </motion.span>
        </motion.div>
      </div>
    </PinnedSection>
  )
}
