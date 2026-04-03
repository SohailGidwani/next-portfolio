"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import PinnedSection from "./scroll/PinnedSection"
import { useScrollEngine } from "./scroll/ScrollEngine"

const WebGLCanvas = dynamic(() => import("./webgl/WebGLCanvas"), { ssr: false })
const LiquidGlassShader = dynamic(() => import("./webgl/LiquidGlassShader"), { ssr: false })

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
    value: "sohail-gidwani",
    href: "https://www.linkedin.com/in/sohail-gidwani/",
  },
  {
    label: "GitHub",
    value: "SohailGidwani",
    href: "https://github.com/SohailGidwani",
  },
]

export default function Contact() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("contact", sectionRef.current)
    }
  }, [registerSection])

  const handleProgress = useCallback((p: number) => {
    setProgress(p)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:sohailgidwani15@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`
    window.open(mailtoLink, "_blank")
  }

  return (
    <PinnedSection id="contact" scrubDuration={1.5} onProgress={handleProgress}>
      <div ref={sectionRef} className="relative flex h-screen w-full items-center overflow-hidden">
        {/* WebGL background at calm state */}
        <div className="pointer-events-none absolute inset-0">
          <WebGLCanvas
            fallback={
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] via-transparent to-transparent" />
            }
          >
            <LiquidGlassShader scrollProgress={1} velocity={0} />
          </WebGLCanvas>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] items-center">
            {/* Left — CTA and links */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
              >
                Contact
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                className="mt-6 font-display italic text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05]"
              >
                Let&apos;s build
                <br />
                something.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-6 font-body text-sm text-white/30 max-w-md leading-relaxed"
              >
                I&apos;m looking for full-time roles, research collaborations, or interesting side
                projects. Drop me a message and we&apos;ll figure it out from there.
              </motion.p>

              <div className="mt-10 space-y-3">
                {contactLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-[9px] font-body font-medium tracking-[0.3em] uppercase text-white/20 w-16 shrink-0">
                      {link.label}
                    </span>
                    <span className="font-body text-sm text-white/40 group-hover:text-white transition-colors">
                      {link.value}
                    </span>
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-6 font-body text-xs text-white/15"
              >
                Los Angeles, CA · Open to remote and on-site
              </motion.div>
            </div>

            {/* Right — contact form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-elevated rounded-2xl p-8 space-y-5"
            >
              <div>
                <label htmlFor="contact-name" className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 block mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 block mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 block mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors resize-none"
                  placeholder="What do you have in mind?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full glass rounded-xl py-3 font-body text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </PinnedSection>
  )
}
