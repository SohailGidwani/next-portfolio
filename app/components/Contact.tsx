"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

const contactItems = [
  {
    icon: <Mail className="h-4 w-4" />,
    label: "Email",
    value: "sohailgidwani15@gmail.com",
    link: "mailto:sohailgidwani15@gmail.com",
    copyValue: "sohailgidwani15@gmail.com",
  },
  {
    icon: <Phone className="h-4 w-4" />,
    label: "Phone",
    value: "+1 9736525842",
    link: "tel:+19736525842",
    copyValue: "+1 9736525842",
  },
  {
    icon: <Linkedin className="h-4 w-4" />,
    label: "LinkedIn",
    value: "sohail-gidwani",
    link: "https://www.linkedin.com/in/sohail-gidwani/",
    copyValue: "https://www.linkedin.com/in/sohail-gidwani/",
  },
  {
    icon: <Github className="h-4 w-4" />,
    label: "GitHub",
    value: "SohailGidwani",
    link: "https://github.com/SohailGidwani",
    copyValue: "https://github.com/SohailGidwani",
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: "Location",
    value: "Los Angeles, CA",
  },
]

export default function Contact() {
  const emailAriaLabel = "Email Sohail Gidwani"
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
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
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-3 lg:self-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Contact</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Want to work together? Let&apos;s talk.
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              I&apos;m looking for full-time roles, research collaborations, or interesting side projects. Drop me a message and we&apos;ll figure it out from there.
            </p>
          </motion.div>

          <div className="lg:justify-self-end">
            <div className="grid max-w-2xl gap-3">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border bg-card/80 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                          onClick={() => triggerHaptic()}
                          className="block truncate text-sm font-medium text-foreground hover:text-primary"
                          aria-label={item.label === "Email" ? emailAriaLabel : item.label}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="truncate text-sm font-medium text-foreground">{item.value}</p>
                      )}
                    </div>
                    {item.copyValue && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.copyValue, item.label)}
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-background/70 transition ${
                          copiedLabel === item.label
                            ? "border-primary/40 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                        }`}
                        aria-label={copiedLabel === item.label ? `${item.label} copied` : `Copy ${item.label}`}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copiedLabel === item.label ? (
                            <motion.span
                              key="check"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Check className="h-4 w-4" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Copy className="h-4 w-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
