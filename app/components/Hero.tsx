"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { FaFileAlt, FaChevronDown, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"
import { Moon, Sun } from "lucide-react"

interface HeroProps {
  setActiveSection: (section: string) => void
}

// Generate random positions and sizes only once
const generateRandomPositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    size: Math.random() * 300 + 100,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    xMovement: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
    yMovement: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
    duration: Math.random() * 30 + 30,
  }))
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
  const orbPositions = useMemo(() => generateRandomPositions(8), [])
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
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection("hero")
        }
      },
      { threshold: 0.3 },
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
      {/* Base gradient background */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0a1025 0%, #111639 50%, #1e1145 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)",
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
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
          href="https://www.linkedin.com/in/sohailgidwani/"
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
          href="mailto:sohailgidwani@gmail.com"
          aria-label="Email"
          className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group
            ${isDark ? "bg-gray-800/60 text-white" : "bg-white/10 text-gray-800"}
            hover:ring-2 hover:ring-blue-500 hover:scale-110 hover:bg-blue-500/20 dark:hover:bg-blue-500/20"
          }`}
        >
          <FaEnvelope className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
        </a>
      </div>

      {/* Animated background elements - with higher opacity */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated wave SVG */}
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          style={{ opacity: isDark ? 0.15 : 0.1 }}
        >
          <motion.path
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? "rgb(59, 130, 246, 0.5)" : "rgb(37, 99, 235, 0.3)"}
            animate={{
              d: [
                "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,186.7C672,192,768,224,864,213.3C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,122.7C96,149,192,203,288,192C384,181,480,107,576,80C672,53,768,75,864,101.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,122.7C672,149,768,235,864,266.7C960,299,1056,277,1152,261.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? "rgb(139, 92, 246, 0.5)" : "rgb(124, 58, 237, 0.3)"}
            animate={{
              d: [
                "M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,122.7C672,149,768,235,864,266.7C960,299,1056,277,1152,261.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,181.3C672,160,768,128,864,128C960,128,1056,160,1152,186.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </svg>

        {/* Animated gradient overlay with higher opacity */}
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
              ? "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.15) 0%, transparent 40%)"
              : "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.1) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.1) 0%, transparent 40%)",
          }}
        />

        {/* Floating orbs with higher opacity - using memoized positions */}
        {orbPositions.map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              background: isDark
                ? i % 2 === 0
                  ? "rgba(59, 130, 246, 0.08)"
                  : "rgba(139, 92, 246, 0.08)"
                : i % 2 === 0
                  ? "rgba(59, 130, 246, 0.06)"
                  : "rgba(139, 92, 246, 0.06)",
              top: orb.top,
              left: orb.left,
            }}
            animate={{
              x: orb.xMovement,
              y: orb.yMovement,
            }}
            transition={{
              duration: orb.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}

        {/* Subtle stars/particles - using memoized positions */}
        {starPositions.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
              top: star.top,
              left: star.left,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: star.delay,
            }}
          />
        ))}
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
          {/* Name - now on the same line with different styling */}
          <motion.h1
            ref={nameRef}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={isDark ? "text-white" : "text-gray-900"}>Sohail </span>
            <span
              className={
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
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
              className={`text-xl sm:text-2xl md:text-3xl font-medium mb-3 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Software Developer
            </h2>
            <p className={`text-sm sm:text-base max-w-lg mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Building elegant solutions to complex problems with AI/ML expertise
            </p>
          </motion.div>

          {/* Action buttons container - always side by side */}
          <div className="flex justify-center items-center space-x-4">
            {/* Scroll for more button */}
            <motion.button
              className="group relative overflow-hidden px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300"
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
              className="group relative overflow-hidden px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300"
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
