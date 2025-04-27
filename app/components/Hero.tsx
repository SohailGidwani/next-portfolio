"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { FaFileAlt, FaArrowDown, FaArrowRight } from "react-icons/fa"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isResumeHovered, setIsResumeHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 300])

  const opacitySection = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    setMounted(true)

    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the md breakpoint in Tailwind
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

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
      window.removeEventListener("resize", checkIfMobile)
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
      className={`relative h-screen max-h-[800px] overflow-hidden ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* Diagonal split background */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-gradient-to-br from-blue-950 to-purple-950" : "bg-gradient-to-br from-blue-50 to-purple-50"
          }`}
        ></div>

        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: isDark ? "#0f172a" : "#f8fafc", stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: isDark ? "#1e1b4b" : "#ede9fe", stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          <polygon points="0,0 100%,0 0,100%" fill="url(#grad1)" />
        </svg>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-[20%] right-[10%] w-12 h-12 md:w-20 md:h-20 rounded-full opacity-20"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0) 70%)"
            : "radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0) 70%)",
          y: y1,
        }}
      />

      <motion.div
        className="absolute bottom-[30%] left-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full opacity-20"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0) 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(124,58,237,0) 70%)",
          y: y2,
        }}
      />

      <motion.div
        className="absolute top-[60%] right-[20%] w-20 h-20 md:w-32 md:h-32 rounded-full opacity-20"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(236,72,153,0) 70%)"
            : "radial-gradient(circle, rgba(219,39,119,0.4) 0%, rgba(219,39,119,0) 70%)",
          y: y3,
        }}
      />

      {/* Main content */}
      <motion.div className="relative z-10 w-full h-full flex flex-col md:flex-row" style={{ opacity: opacitySection }}>
        {/* Left side - Name and title */}
        <div
          className={`w-full ${isMobile ? "mx-auto max-w-md" : "md:w-1/2"} h-full flex flex-col justify-center px-6 md:px-12 lg:px-16`}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={isMobile ? "text-center" : "max-w-md"}
          >
            <h2 className={`text-sm uppercase tracking-widest mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              Portfolio
            </h2>

            <h1
              className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Sohail
              <br />
              <span
                className={`${
                  isDark
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                }`}
              >
                Gidwani
              </span>
            </h1>

            <div className="h-20 md:h-24 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {showcaseItems[activeIndex].title}
                  </h3>
                  <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {showcaseItems[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={`flex space-x-3 mb-6 ${isMobile ? "justify-center" : ""}`}>
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
              } transition-colors duration-300 ${isMobile ? "mx-auto" : ""}`}
              onHoverStart={() => setIsResumeHovered(true)}
              onHoverEnd={() => setIsResumeHovered(false)}
              onClick={() => window.open("/documents/Sohail_Gidwani_Resume_2024.pdf", "_blank")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <motion.span
                  className="mr-2 flex items-center justify-center"
                  animate={isResumeHovered ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isResumeHovered ? <FaArrowRight /> : <FaFileAlt />}
                </motion.span>
                <span className="relative">
                  View Resume
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-0.5 ${isDark ? "bg-white" : "bg-white"} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: isResumeHovered ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </span>

              {/* Button glow effect */}
              <motion.div
                className={`absolute inset-0 ${isDark ? "bg-blue-500" : "bg-blue-500"}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isResumeHovered ? 1 : 0, opacity: isResumeHovered ? 0.2 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0, originY: 0 }}
              />

              {/* Button particles */}
              {isResumeHovered && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-white"
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 0.7,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                    />
                  ))}
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Right side - DESKTOP ONLY: Interactive Code Visualization */}
        {!isMobile && (
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <CodeVisualization isDark={isDark} />
          </div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          className={`flex flex-col items-center cursor-pointer`}
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

// Separate component for the code visualization (desktop only)
function CodeVisualization({ isDark }: { isDark: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  // Code to be typed out
  const fullCode = [
    "function Portfolio() {",
    "  const skills = [",
    "    'JavaScript', 'React', 'TypeScript',",
    "    'Node.js', 'Python', 'Machine Learning',",
    "    'AI', 'Data Science', 'Cloud Computing'",
    "  ];",
    "",
    "  const projects = getProjects();",
    "  const experience = getExperience();",
    "",
    "  return (",
    "    <Developer",
    '      name="Sohail Gidwani"',
    "      skills={skills}",
    "      projects={projects}",
    "      experience={experience}",
    "    />",
    "  );",
    "}",
    "",
    "// Explore my work below",
  ]

  useEffect(() => {
    // Track mouse position for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Typing animation
    if (isTyping && currentLine < fullCode.length) {
      const timer = setTimeout(
        () => {
          setCodeLines((prev) => [...prev, fullCode[currentLine]])
          setCurrentLine((prev) => prev + 1)
        },
        Math.random() * 100 + 50,
      ) // Random typing speed for realism

      return () => clearTimeout(timer)
    } else if (currentLine >= fullCode.length) {
      setIsTyping(false)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [currentLine, isTyping, fullCode])

  // Function to get syntax highlighting classes
  const getSyntaxClass = (line: string) => {
    if (line.trim().startsWith("function")) {
      return isDark ? "text-purple-400" : "text-purple-600"
    } else if (line.trim().startsWith("const") || line.trim().startsWith("let") || line.trim().startsWith("var")) {
      return isDark ? "text-blue-400" : "text-blue-600"
    } else if (line.includes("return")) {
      return isDark ? "text-pink-400" : "text-pink-600"
    } else if (line.includes("//")) {
      return isDark ? "text-green-400" : "text-green-600"
    } else if (line.includes('"') || line.includes("'")) {
      return isDark ? "text-yellow-300" : "text-yellow-600"
    } else {
      return isDark ? "text-gray-300" : "text-gray-700"
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-md aspect-square"
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Code editor window */}
      <motion.div
        className={`absolute inset-0 rounded-xl overflow-hidden ${
          isDark
            ? "bg-gray-900 border border-gray-700 shadow-xl shadow-purple-900/20"
            : "bg-white border border-gray-200 shadow-xl shadow-purple-300/20"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Editor header */}
        <div className={`h-10 ${isDark ? "bg-gray-800" : "bg-gray-100"} flex items-center px-4`}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className={`text-xs mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>portfolio.jsx</div>
        </div>

        {/* Code content */}
        <div
          className={`p-6 h-[calc(100%-2.5rem)] overflow-hidden font-mono text-sm ${
            isDark ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div className="relative">
            {codeLines.map((line, index) => (
              <div key={index} className="flex">
                <span className={`mr-4 select-none ${isDark ? "text-gray-600" : "text-gray-400"}`}>{index + 1}</span>
                <span className={getSyntaxClass(line)}>{line}</span>
              </div>
            ))}

            {/* Blinking cursor */}
            {isTyping && (
              <motion.span
                className={`inline-block w-2 h-5 ml-1 ${isDark ? "bg-blue-400" : "bg-blue-600"}`}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  position: "absolute",
                  left: codeLines[currentLine - 1]?.length * 8 || 0,
                  top: (currentLine - 1) * 24 || 0,
                }}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Floating code particles */}
      <div className="absolute inset-0 pointer-events-none">
        {["<>", "/>", "{}", "()", "[]", "=>", "&&", "||", "===", "!=="].map((symbol, index) => (
          <motion.div
            key={index}
            className={`absolute text-xs font-mono px-2 py-1 rounded-md ${
              isDark
                ? index % 3 === 0
                  ? "bg-blue-900/30 text-blue-400"
                  : index % 3 === 1
                    ? "bg-purple-900/30 text-purple-400"
                    : "bg-pink-900/30 text-pink-400"
                : index % 3 === 0
                  ? "bg-blue-100 text-blue-600"
                  : index % 3 === 1
                    ? "bg-purple-100 text-purple-600"
                    : "bg-pink-100 text-pink-600"
            }`}
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              opacity: 0,
              scale: 0,
              rotate: Math.random() * 180 - 90,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              x: `${Math.random() * 120 - 60}%`,
              y: `${Math.random() * 120 - 60}%`,
              rotate: Math.random() * 360 - 180,
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: Math.random() * 10 + 10,
              delay: index * 0.5,
              ease: "linear",
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Decorative elements */}
      <motion.div
        className={`absolute -z-10 w-full h-full rounded-xl ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`}
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 10, y: 10 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      <motion.div
        className={`absolute -z-20 w-full h-full rounded-xl ${isDark ? "bg-purple-500/10" : "bg-purple-500/5"}`}
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: -10, y: -10 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
    </motion.div>
  )
}
