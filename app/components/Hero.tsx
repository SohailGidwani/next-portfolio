"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { FaFileAlt, FaArrowDown } from "react-icons/fa"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isResumeHovered, setIsResumeHovered] = useState(false)

  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)

    // Intersection observer for section detection
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection("hero")
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Auto-advance the active index
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 4000)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      clearInterval(interval)
    }
  }, [setActiveSection])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  // Content for the rotating showcase
  const showcaseItems = [
    { title: "Software Developer", description: "Building elegant solutions to complex problems" },
    { title: "AI Enthusiast", description: "Exploring the frontiers of artificial intelligence" },
    { title: "ML Expert", description: "Creating intelligent systems that learn and adapt" },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "800px",
      }}
    >
      {/* Base gradient background */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)",
        }}
      />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute inset-0 w-[200%] h-[200%]"
          animate={{
            x: [0, -500],
            y: [0, -500],
          }}
          transition={{
            duration: 60,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            background: isDark
              ? "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.4) 0%, transparent 40%)"
              : "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.2) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Animated mesh grid */}
      <div className="absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.03]">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 300 + 100
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full blur-3xl`}
              style={{
                width: size,
                height: size,
                background: isDark
                  ? i % 2 === 0
                    ? "rgba(59, 130, 246, 0.03)"
                    : "rgba(139, 92, 246, 0.03)"
                  : i % 2 === 0
                    ? "rgba(59, 130, 246, 0.03)"
                    : "rgba(139, 92, 246, 0.03)",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                y: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 30 + 30,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          )
        })}
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: isDark ? 0.05 : 0.03 }}>
          <motion.path
            d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100"
            stroke={isDark ? "white" : "black"}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: 1, pathOffset: 0 }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.path
            d="M0,300 C150,400 350,200 500,300 C650,400 850,200 1000,300"
            stroke={isDark ? "white" : "black"}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: 1, pathOffset: 0 }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: 5,
            }}
          />
          <motion.path
            d="M0,500 C150,600 350,400 500,500 C650,600 850,400 1000,500"
            stroke={isDark ? "white" : "black"}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: 1, pathOffset: 0 }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: 10,
            }}
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center py-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          style={{ opacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle badge */}
          <motion.div
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              isDark ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            PORTFOLIO
          </motion.div>

          {/* Name */}
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Sohail{" "}
            <span
              className={`${
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              Gidwani
            </span>
          </motion.h1>

          {/* Rotating titles */}
          <div className="h-20 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h2 className={`text-xl sm:text-2xl font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {showcaseItems[activeIndex].title}
                </h2>
                <p className={`text-sm max-w-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {showcaseItems[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicator dots */}
          <div className="flex justify-center space-x-3 mb-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? isDark
                      ? "bg-blue-400 w-8"
                      : "bg-blue-600 w-8"
                    : isDark
                      ? "bg-gray-700"
                      : "bg-gray-300"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${showcaseItems[index].title}`}
              />
            ))}
          </div>

          {/* Resume button */}
          <motion.button
            className={`group relative overflow-hidden px-6 py-3 rounded-full font-medium text-base ${
              isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors duration-300`}
            onHoverStart={() => setIsResumeHovered(true)}
            onHoverEnd={() => setIsResumeHovered(false)}
            onClick={() => window.open("/documents/Sohail_Gidwani_Resume_2024.pdf", "_blank")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="relative z-10 flex items-center">
              <FaFileAlt className="mr-2" />
              <span>View Resume</span>
            </span>

            {/* Button glow effect */}
            <motion.div
              className={`absolute inset-0 ${isDark ? "bg-blue-500" : "bg-blue-500"}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isResumeHovered ? 1 : 0, opacity: isResumeHovered ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0, originY: 0 }}
            />
          </motion.button>

          {/* Decorative element */}
          <motion.div
            className={`mt-8 w-20 h-1 rounded-full mx-auto ${
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => {
            // Scroll to the next section
            const aboutSection = document.getElementById("about")
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: "smooth" })
            }
          }}
          whileHover={{ y: 5 }}
        >
          <span className={`text-xs uppercase tracking-widest mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Scroll
          </span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
            <FaArrowDown className={`${isDark ? "text-gray-400" : "text-gray-600"}`} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
