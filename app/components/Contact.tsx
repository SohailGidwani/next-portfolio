"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Copy, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "react-hot-toast"
import { triggerHaptic } from "./ui/haptics"

interface ContactProps {
  setActiveSection: (section: string) => void
}

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

export default function Contact({ setActiveSection }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const emailAriaLabel = "Email Sohail Gidwani"

  const handleCopy = async (value: string, label: string) => {
    try {
      if (!navigator?.clipboard) {
        toast.error("Copy unavailable")
        return
      }
      await navigator.clipboard.writeText(value)
      triggerHaptic(10)
      toast.success(`${label} copied`)
    } catch (error) {
      console.error(error)
      toast.error("Copy failed")
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("contact")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [setActiveSection])

  return (
    <section id="contact" ref={sectionRef} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Contact</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Let&apos;s build the next AI experience together.
            </h2>
            <p className="text-base text-muted-foreground">
              I&apos;m open to full-time roles, research collaborations, and product experiments. Share your
              vision and we&apos;ll map the next steps.
            </p>
            <a
              href="mailto:sohailgidwani15@gmail.com"
              onClick={() => triggerHaptic()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              aria-label={emailAriaLabel}
            >
              Start a conversation
            </a>
          </motion.div>

          <div className="grid gap-3">
            {contactItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card/80 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                    <div className="flex items-center gap-2">
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                          onClick={() => triggerHaptic()}
                          className="text-sm font-medium text-foreground hover:text-primary"
                          aria-label={item.label === "Email" ? emailAriaLabel : item.label}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      )}
                      {item.copyValue && (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.copyValue, item.label)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                          aria-label={`Copy ${item.label}`}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
