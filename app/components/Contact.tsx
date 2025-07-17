"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Github, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useInView } from "react-intersection-observer"
import ScrollAnimation from "./ScrollAnimation"
import { triggerHaptic } from "./ui/haptics"

interface ContactProps {
  setActiveSection: (section: string) => void
}

interface ContactItem {
  icon: React.ReactNode
  label: string
  value: string
  link?: string
  description: string
}

const contactItems: ContactItem[] = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: "Email",
    value: "sohailgidwani15@gmail.com",
    link: "mailto:sohailgidwani15@gmail.com",
    description: "Drop me a line anytime",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: "Phone",
    value: "+91 9503151319",
    link: "tel:+919503151319",
    description: "Let's have a conversation",
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    label: "LinkedIn",
    value: "sohail-gidwani",
    link: "https://www.linkedin.com/in/sohail-gidwani/",
    description: "Connect professionally",
  },
  {
    icon: <Github className="w-6 h-6" />,
    label: "GitHub",
    value: "SohailGidwani",
    link: "https://github.com/SohailGidwani",
    description: "Check out my code",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: "Location",
    value: "Mumbai, India",
    description: "Where I'm based",
  },
]

// Mobile-specific compact card
function MobileContactCard({ item, index, isDark }: { item: ContactItem; index: number; isDark: boolean }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex items-center p-3 rounded-lg shadow-md ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
          isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
        }`}
      >
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{item.label}</h3>
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs flex items-center ${isDark ? "text-blue-400" : "text-blue-600"} truncate`}
            onClick={() => { triggerHaptic(); }}
          >
            <span className="truncate">{item.value}</span>
            <ArrowRight className="w-3 h-3 ml-1 flex-shrink-0" />
          </a>
        ) : (
          <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"} truncate`}>{item.value}</p>
        )}
      </div>
    </motion.div>
  )
}

// Desktop card with animations
function DesktopContactCard({ item, index, isDark }: { item: ContactItem; index: number; isDark: boolean }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
        isDark
          ? "bg-slate-800/80 border-slate-600/50 hover:border-blue-500/50"
          : "bg-white/80 border-gray-200/50 hover:border-blue-500/50"
      } hover:shadow-2xl hover:-translate-y-2`}
    >
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDark ? "bg-blue-500/10" : "bg-blue-500/5"
        }`}
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
            } group-hover:scale-110 transition-transform duration-300`}
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6 }}
          >
            {item.icon}
          </motion.div>
          <div className="ml-4">
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{item.label}</h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
          </div>
        </div>

        {item.link ? (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg font-medium flex items-center group/link ${
              isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
            }`}
            whileHover={{ x: 5 }}
            onClick={() => { triggerHaptic(); }}
          >
            {item.value}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" />
          </motion.a>
        ) : (
          <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.value}</p>
        )}
      </div>
    </motion.div>
  )
}

export default function Contact({ setActiveSection }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Handle active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);
          setActiveSection("contact")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [setActiveSection])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme detection
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`py-16 md:py-20 transition-colors duration-300 bg-white dark:bg-slate-950`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Updated Header */}
        <ScrollAnimation variant="fadeUp" duration={0.8}>
          <div className="text-center mb-10 md:mb-16">
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold ${isDark ? "text-blue-400" : "text-blue-900"}`}>
            Let's Connect
            </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mt-3 md:mt-4 ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}
          >
            Ready to bring your ideas to life? Let's collaborate and create something amazing together!
          </motion.p>
          </div>
        </ScrollAnimation>

        {/* Mobile Cards (shown only on small screens) */}
        <ScrollAnimation variant="fadeUp" stagger={true} staggerDelay={0.1}>
        <div className="md:hidden space-y-3">
          {contactItems.map((item, index) => (
            <MobileContactCard key={item.label} item={item} index={index} isDark={isDark} />
          ))}
        </div>
        </ScrollAnimation>

        {/* Desktop Cards (hidden on small screens) */}
        <ScrollAnimation variant="fadeUp" stagger={true} staggerDelay={0.15}>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {contactItems.map((item, index) => (
            <DesktopContactCard key={item.label} item={item} index={index} isDark={isDark} />
          ))}
        </div>
        </ScrollAnimation>

        <ScrollAnimation variant="fadeUp" delay={0.5}>
          <div className="mt-10 md:mt-16 text-center">
            <p className={`text-base md:text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              I'm always open to new opportunities and collaborations. Feel free to reach out!
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}