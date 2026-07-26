"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Copy } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

const contactRows = [
  {
    label: "Email",
    value: "sohailgidwani15@gmail.com",
    href: "mailto:sohailgidwani15@gmail.com",
    external: false,
    copyValue: "sohailgidwani15@gmail.com",
  },
  {
    label: "GitHub",
    value: "SohailGidwani",
    href: "https://github.com/SohailGidwani",
    external: true,
    copyValue: null as string | null,
  },
  {
    label: "LinkedIn",
    value: "sohail-gidwani",
    href: "https://www.linkedin.com/in/sohail-gidwani/",
    external: true,
    copyValue: null as string | null,
  },
  {
    label: "Phone",
    value: "+1 973 652 5842",
    href: "tel:+19736525842",
    external: false,
    copyValue: "+1 9736525842",
  },
] as const

export default function Contact() {
  const emailAriaLabel = "Email Sohail Gidwani"
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Framer bypasses the CSS reduced-motion kill switch; gate movement here.
  const reduced = useReducedMotion()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = async (value: string, label: string) => {
    try {
      if (!navigator?.clipboard) return
      await navigator.clipboard.writeText(value)
      triggerHaptic(10)
      setCopiedLabel(label)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedLabel(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="contact" className="section-y">
      <div className="container mx-auto px-[18px] sm:px-6 md:px-9">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8 md:space-y-10"
        >
          <div className="w-full min-w-0 [container-type:inline-size]">
            <h2 className="font-display text-[clamp(2rem,10.5cqi,6.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-pretty">
              <span className="block text-foreground">Let&apos;s work</span>
              <span className="block text-accent">Together.</span>
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Looking for full-time roles, research collaborations, or interesting side projects. Based in Los Angeles,
            open to remote and on-site.
          </p>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {contactRows.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.05 }}
                viewport={{ once: true }}
                className="min-w-0 space-y-2"
              >
                <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    onClick={() => triggerHaptic()}
                    className="inline-flex min-h-11 min-w-0 items-center gap-1 break-words text-sm font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline sm:min-h-0 md:text-base"
                    aria-label={item.label === "Email" ? emailAriaLabel : `${item.label}: ${item.value}`}
                  >
                    <span className="min-w-0 break-all">{item.value}</span>
                    {item.external ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden /> : null}
                  </a>
                  {item.copyValue ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.copyValue!, item.label)}
                      className={`inline-grid h-11 w-11 shrink-0 place-items-center rounded border transition sm:h-8 sm:w-8 ${
                        copiedLabel === item.label
                          ? "border-accent/50 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                      }`}
                      aria-label={copiedLabel === item.label ? `${item.label} copied` : `Copy ${item.label}`}
                    >
                      <AnimatePresence initial={false}>
                        {copiedLabel === item.label ? (
                          <motion.span
                            key="check"
                            className="col-start-1 row-start-1 flex"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            {/* The check draws itself: a small earned-feedback flourish */}
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3.5 w-3.5"
                              aria-hidden
                            >
                              <motion.path
                                d="M20 6 9 17l-5-5"
                                initial={{ pathLength: reduced ? 1 : 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                              />
                            </svg>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            className="col-start-1 row-start-1 flex"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <footer className="mt-20 flex flex-col gap-6 border-t border-border pt-10 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
            © 2026 Sohail Gidwani
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            <a
              href="https://github.com/SohailGidwani"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-muted-foreground transition hover:text-foreground sm:min-h-0"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sohail-gidwani/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-muted-foreground transition hover:text-foreground sm:min-h-0"
            >
              LinkedIn
            </a>
            <a
              href="mailto:sohailgidwani15@gmail.com"
              className="inline-flex min-h-11 items-center text-muted-foreground transition hover:text-foreground sm:min-h-0"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    </section>
  )
}
