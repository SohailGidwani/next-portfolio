"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useScrollEngine } from "./scroll/ScrollEngine"

const contactLinks = [
  {
    label: "Email",
    value: "sohailgidwani15@gmail.com",
    href: "mailto:sohailgidwani15@gmail.com",
  },
  {
    label: "Phone",
    value: "+1 9736525842",
    href: "tel:+19736525842",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sohail-gidwani",
    href: "https://www.linkedin.com/in/sohail-gidwani/",
  },
  {
    label: "GitHub",
    value: "github.com/SohailGidwani",
    href: "https://github.com/SohailGidwani",
  },
]

export default function Contact() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("contact", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen items-center py-32 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6" ref={contentRef}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
          >
            Contact
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display italic text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05]"
          >
            Let&apos;s build
            <br />
            something.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 font-body text-sm text-white/30 max-w-md mx-auto leading-relaxed"
          >
            Looking for full-time roles, research collaborations, or interesting
            side projects. Reach out and let&apos;s figure it out from there.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-10 mb-10 h-px w-20 mx-auto bg-white/10 origin-center"
          />

          <div className="space-y-4">
            {contactLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-center gap-5 group py-1"
              >
                <span className="text-[9px] font-body font-medium tracking-[0.3em] uppercase text-white/20 w-16 text-right shrink-0">
                  {link.label}
                </span>
                <span className="font-body text-sm text-white/40 group-hover:text-white transition-colors duration-300">
                  {link.value}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 font-body text-xs text-white/10"
          >
            Los Angeles, CA · Open to remote and on-site
          </motion.p>
        </div>
      </div>
    </section>
  )
}
