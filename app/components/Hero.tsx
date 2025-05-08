"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { FaFileAlt, FaArrowDown } from "react-icons/fa"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // const [isResumeHovered, setIsResumeHovered] = useState(false)

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

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [setActiveSection])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden w-full h-screen"
      // style={{
      //   // Subtract navbar height (80px) from viewport height
      //   height: "calc(100vh - 80px)",
      // }}
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

        {/* Floating orbs with higher opacity */}
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 300 + 100
          return (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: size,
                height: size,
                background: isDark
                  ? i % 2 === 0
                    ? "rgba(59, 130, 246, 0.08)"
                    : "rgba(139, 92, 246, 0.08)"
                  : i % 2 === 0
                    ? "rgba(59, 130, 246, 0.06)"
                    : "rgba(139, 92, 246, 0.06)",
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

        {/* Subtle stars/particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 5,
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
          {/* Name - made larger and with more spacing */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={isDark ? "text-white" : "text-gray-900"}>Sohail</span>
            <br />
            <span
              className={
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              }
            >
              Gidwani
            </span>
          </motion.h1>

          {/* Static title and description - replacing the rotating content */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Software Developer
            </h2>
            <p className={`text-sm sm:text-base max-w-lg mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Building elegant solutions to complex problems
            </p>
          </motion.div>

          {/* Resume button - with simplified animation */}
          <motion.button
            className={`relative overflow-hidden px-8 py-3 rounded-full font-medium text-base ${
              isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-all duration-300`}
            // onHoverStart={() => setIsResumeHovered(true)}
            // onHoverEnd={() => setIsResumeHovered(false)}
            onClick={() => window.open("/documents/Sohail_Gidwani_Resume_2024.pdf", "_blank")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="flex items-center">
              <FaFileAlt className="mr-2" />
              <span>View Resume</span>
            </span>
          </motion.button>

          {/* Decorative line */}
          {/* <motion.div
            className={`mt-16 w-24 h-1 rounded-full mx-auto ${
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          /> */}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
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
          <span className={`text-xs uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            SCROLL
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <FaArrowDown className={`${isDark ? "text-gray-400" : "text-gray-600"}`} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
