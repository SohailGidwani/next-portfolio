"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useScrollEngine } from "./scroll/ScrollEngine"
import { useIsMobile } from "./hooks/useDeviceDetect"

const WebGLCanvas = dynamic(() => import("./webgl/WebGLCanvas"), { ssr: false })
const LiquidGlassShader = dynamic(() => import("./webgl/LiquidGlassShader"), { ssr: false })

const nameLetters = "Sohail Gidwani".split("")

const letterVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.6 + i * 0.04,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export default function Hero() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("hero", sectionRef.current)
    }
  }, [registerSection])

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        {isMobile === false ? (
          <WebGLCanvas
            fallback={<div className="absolute inset-0 webgl-fallback" />}
          >
            <LiquidGlassShader />
          </WebGLCanvas>
        ) : (
          <div className="absolute inset-0 webgl-fallback" />
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white leading-none">
          {isMobile !== false ? (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Sohail Gidwani
            </motion.span>
          ) : (
            <span className="inline-flex flex-wrap justify-center overflow-hidden">
              {nameLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate={revealed ? "visible" : "hidden"}
                  className="inline-block"
                  style={{ whiteSpace: letter === " " ? "pre" : undefined }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          )}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={revealed ? { scaleX: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-6 h-px w-16 bg-white/20 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
          className="mt-5 font-body text-sm sm:text-base tracking-[0.3em] uppercase text-white/40"
        >
          Software Engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
          className="mt-3 font-body text-xs sm:text-sm text-white/20 max-w-md leading-relaxed"
        >
          AI systems that work in production. Full-stack engineering meets applied ML.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-[11px] font-body tracking-[0.25em] uppercase text-white/15"
        >
          Scroll ↓
        </motion.span>
      </motion.div>
    </section>
  )
}
