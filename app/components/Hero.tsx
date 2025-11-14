"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { FaFileAlt, FaChevronDown, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"
import { Moon, Sun } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

interface HeroProps {
  setActiveSection: (section: string) => void
}

// Generate random star properties
const generateRandomStars = (count: number) => {
  return Array.from({ length: count }, () => ({
    size: Math.random() * 3 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }))
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const heroThemeToggleRef = useRef<HTMLButtonElement>(null)
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isResumeHovered, setIsResumeHovered] = useState(false)
  const [isScrollHovered, setIsScrollHovered] = useState(false)
  // const [scrollY, setScrollY] = useState(0)
  // Memoize random positions to prevent re-randomization on re-renders
  const starPositions = useMemo(() => generateRandomStars(50), [])

  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Transform for theme toggle animation - more aggressive fade out
  const themeToggleOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0])
  const themeToggleY = useTransform(scrollYProgress, [0, 0.1], [0, -100])

  useEffect(() => {
    setMounted(true)

    // Intersection observer for section detection
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);
          setActiveSection("hero")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    const currentSectionRef = sectionRef.current
    if (currentSectionRef) {
      observer.observe(currentSectionRef)
    }

    // Calculate and store the position of the name element for the animation
    const updateNamePosition = () => {
      if (nameRef.current) {
        const rect = nameRef.current.getBoundingClientRect()

        // Dispatch event with name position data
        window.dispatchEvent(
          new CustomEvent("namePosition", {
            detail: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
              text: "SG",
            },
          }),
        )
      }
    }

    // Update theme toggle position for navbar animation
    const updateThemeTogglePosition = () => {
      if (heroThemeToggleRef.current) {
        const rect = heroThemeToggleRef.current.getBoundingClientRect()

        // Dispatch event with theme toggle position data
        window.dispatchEvent(
          new CustomEvent("heroThemeTogglePosition", {
            detail: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
            },
          }),
        )
      }
    }

    // Update name position on scroll to ensure accurate animation
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // setScrollY(currentScrollY)

      updateNamePosition()
      updateThemeTogglePosition()

      // Dispatch scroll event for navbar to detect
      window.dispatchEvent(
        new CustomEvent("heroScroll", {
          detail: {
            scrollY: currentScrollY,
            heroHeight: window.innerHeight,
          },
        }),
      )
    }

    updateNamePosition()
    updateThemeTogglePosition()
    window.addEventListener("resize", () => {
      updateNamePosition()
      updateThemeTogglePosition()
    })
    window.addEventListener("scroll", handleScroll)

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef)
      }
      window.removeEventListener("resize", () => {
        updateNamePosition()
        updateThemeTogglePosition()
      })
      window.removeEventListener("scroll", handleScroll)
    }
  }, [setActiveSection, mounted])

  // Function to scroll to the about section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden w-full h-screen"
      style={{
        minHeight: "100vh",
        marginTop: 0,
        paddingTop: 0,
      }}
    >
      {/* Base gradient background - Pitch black space theme */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isDark
            ? "#000000"
            : "#ffffff",
        }}
      />

      {/* Theme Toggle Button - Top Right Corner */}
      <motion.button
        ref={heroThemeToggleRef}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-40 p-3 rounded-full transition-all duration-300 ${
          isDark ? "bg-gray-800/50 hover:bg-gray-700/60 text-yellow-400" : "bg-white/50 hover:bg-white/70 text-gray-700"
        } backdrop-blur-md border ${isDark ? "border-gray-700/50" : "border-gray-200/50"} shadow-lg hover:shadow-xl`}
        style={{
          opacity: themeToggleOpacity,
          y: themeToggleY,
          display: scrollYProgress.get() > 0.2 ? "none" : "block",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {/* Animated icon swap for theme toggle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-600" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Social Icons - Bottom Right (only within Hero) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center space-y-3">
        <a
          href="https://github.com/sohailgidwani"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group
            ${isDark ? "bg-gray-800/60 text-white" : "bg-white/10 text-gray-800"}
            hover:ring-2 hover:ring-blue-500 hover:scale-110 hover:bg-blue-500/20 dark:hover:bg-blue-500/20"
          }`}
        >
          <FaGithub className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
        </a>
        <a
          href="https://www.linkedin.com/in/sohail-gidwani/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group
            ${isDark ? "bg-gray-800/60 text-white" : "bg-white/10 text-gray-800"}
            hover:ring-2 hover:ring-blue-500 hover:scale-110 hover:bg-blue-500/20 dark:hover:bg-blue-500/20"
          }`}
        >
          <FaLinkedin className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
        </a>
        <a
          href="mailto:sohailgidwani15@gmail.com"
          aria-label="Email"
          className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group
            ${isDark ? "bg-gray-800/60 text-white" : "bg-white/10 text-gray-800"}
            hover:ring-2 hover:ring-blue-500 hover:scale-110 hover:bg-blue-500/20 dark:hover:bg-blue-500/20"
          }`}
        >
          <FaEnvelope className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
        </a>
      </div>

      {/* Space-themed background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Distant nebula glow - more prominent */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 right-1/4 w-[700px] h-[700px] rounded-full filter blur-[150px]"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(75, 0, 130, 0.4) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(220, 200, 255, 0.5) 0%, rgba(200, 190, 240, 0.3) 40%, transparent 70%)",
              opacity: isDark ? 0.4 : 0.35,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: isDark ? [0.35, 0.5, 0.35] : [0.3, 0.45, 0.3],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-[600px] h-[600px] rounded-full filter blur-[140px]"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(30, 144, 255, 0.3) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(200, 220, 255, 0.5) 0%, rgba(190, 210, 250, 0.3) 40%, transparent 70%)",
              opacity: isDark ? 0.4 : 0.35,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: isDark ? [0.3, 0.45, 0.3] : [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-10 w-[500px] h-[500px] rounded-full filter blur-[130px]"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(240, 220, 255, 0.4) 0%, rgba(220, 200, 245, 0.25) 40%, transparent 70%)",
              opacity: isDark ? 0.35 : 0.3,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: isDark ? [0.25, 0.4, 0.25] : [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 28,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 10,
            }}
          />
        </div>

        {/* Star field - twinkling stars */}
        {starPositions.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              backgroundColor: isDark ? "white" : "black",
              boxShadow: isDark
                ? "0 0 2px rgba(255, 255, 255, 0.8)"
                : "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: star.delay,
            }}
          />
        ))}

        {/* Constellation lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: "none" }}>
          {/* Constellation 1 - Top left */}
          <motion.line
            x1="15%" y1="20%" x2="20%" y2="15%"
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isDark ? 0.3 : 0.2 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.line
            x1="20%" y1="15%" x2="25%" y2="25%"
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isDark ? 0.3 : 0.2 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          <motion.line
            x1="15%" y1="20%" x2="25%" y2="25%"
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isDark ? 0.3 : 0.2 }}
            transition={{ duration: 2, delay: 2 }}
          />

          {/* Constellation 2 - Top right */}
          <motion.line
            x1="75%" y1="25%" x2="80%" y2="20%"
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isDark ? 0.3 : 0.2 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          <motion.line
            x1="80%" y1="20%" x2="85%" y2="28%"
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isDark ? 0.3 : 0.2 }}
            transition={{ duration: 2, delay: 1.8 }}
          />

          {/* Constellation stars */}
          <circle cx="15%" cy="20%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
          <circle cx="20%" cy="15%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
          <circle cx="25%" cy="25%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
          <circle cx="75%" cy="25%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
          <circle cx="80%" cy="20%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
          <circle cx="85%" cy="28%" r="2" fill={isDark ? "white" : "black"} opacity="0.8" />
        </svg>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          style={{ opacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Name - slightly bigger and cleaner */}
          <motion.h1
            ref={nameRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={isDark ? "text-white" : "text-gray-900"}>Sohail </span>
            <span
              className={
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700"
              }
            >
              Gidwani
            </span>
            {/* Hidden span with initials for animation purposes */}
            <span id="name-initials" className="sr-only">
              SG
            </span>
          </motion.h1>

          {/* Elegant title and description */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2
              className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            >
              AI & Full Stack Developer
            </h2>
            <p className={`text-base sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Building elegant solutions to complex problems with AI/ML expertise
            </p>
          </motion.div>

          {/* Action buttons container - always side by side */}
          <div className="flex justify-center items-center space-x-4">
            {/* Scroll for more button */}
            <motion.button
              className="group relative overflow-hidden px-6 py-3 rounded-full font-medium text-sm transition-all duration-300"
              onHoverStart={() => setIsScrollHovered(true)}
              onHoverEnd={() => setIsScrollHovered(false)}
              onClick={scrollToAbout}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Button border */}
              <span
                className={`absolute inset-0 rounded-full border ${isDark ? "border-purple-500" : "border-purple-600"}`}
              />

              {/* Liquid fill effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 rounded-full ${
                    isDark ? "bg-purple-600" : "bg-purple-600"
                  }`}
                  initial={{ height: "0%" }}
                  animate={{ height: isScrollHovered ? "100%" : "0%" }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    transformOrigin: "bottom",
                    borderRadius: "9999px",
                  }}
                >
                  {/* Liquid bubbles effect */}
                  {isScrollHovered && (
                    <>
                      <motion.div
                        className="absolute rounded-full bg-purple-400/30 w-3 h-3"
                        animate={{
                          y: [0, -15],
                          x: [0, 3],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.3 }}
                        style={{ left: "20%", bottom: "10%" }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-purple-400/30 w-2 h-2"
                        animate={{
                          y: [0, -10],
                          x: [0, -2],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
                        style={{ left: "60%", bottom: "20%" }}
                      />
                    </>
                  )}
                </motion.div>
              </div>

              {/* Button content */}
              <span
                className={`relative z-10 flex items-center ${
                  isDark
                    ? isScrollHovered
                      ? "text-white"
                      : "text-purple-500"
                    : isScrollHovered
                      ? "text-white"
                      : "text-purple-600"
                }`}
              >
                <span>Scroll for more</span>
                <FaChevronDown className="ml-2" />
              </span>
            </motion.button>

            {/* Resume button with liquid fill */}
            <motion.button
              className="group relative overflow-hidden px-6 py-3 rounded-full font-medium text-sm transition-all duration-300"
              onHoverStart={() => setIsResumeHovered(true)}
              onHoverEnd={() => setIsResumeHovered(false)}
              onClick={() => window.open("/documents/Sohail_Gidwani_Resume.pdf", "_blank")}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Button border */}
              <span
                className={`absolute inset-0 rounded-full border ${isDark ? "border-blue-500" : "border-blue-600"}`}
              />

              {/* Liquid fill effect with container for overflow control */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 rounded-full ${isDark ? "bg-blue-600" : "bg-blue-600"}`}
                  initial={{ height: "0%" }}
                  animate={{ height: isResumeHovered ? "100%" : "0%" }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    transformOrigin: "bottom",
                    borderRadius: "9999px",
                  }}
                >
                  {/* Liquid bubbles effect */}
                  {isResumeHovered && (
                    <>
                      <motion.div
                        className="absolute rounded-full bg-blue-400/30 w-3 h-3"
                        animate={{
                          y: [0, -15],
                          x: [0, 3],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.3 }}
                        style={{ left: "20%", bottom: "10%" }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-blue-400/30 w-2 h-2"
                        animate={{
                          y: [0, -10],
                          x: [0, -2],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
                        style={{ left: "60%", bottom: "20%" }}
                      />
                    </>
                  )}
                </motion.div>
              </div>

              {/* Button content */}
              <span
                className={`relative z-10 flex items-center ${
                  isDark
                    ? isResumeHovered
                      ? "text-white"
                      : "text-blue-500"
                    : isResumeHovered
                      ? "text-white"
                      : "text-blue-600"
                }`}
              >
                <span>View Resume</span>
                <FaFileAlt className="ml-2" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
