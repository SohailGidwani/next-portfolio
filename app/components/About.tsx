"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { Code, Lightbulb, Users, Zap, BookOpen, Rocket } from "lucide-react"

interface AboutProps {
  setActiveSection: (section: string) => void
}

interface Quality {
  title: string

  description: string

  icon: React.ReactNode

  color: string

  detailedDescription: string
}

const qualities: Quality[] = [
  {
    title: "Innovative",

    description: "Always seeking new solutions",

    icon: <Lightbulb className="w-5 h-5 md:w-6 md:h-6" />,

    color: "text-yellow-500",

    detailedDescription:
      "Innovation drives my approach to problem-solving. I constantly explore new technologies and methodologies to create unique solutions that stand out.",
  },

  {
    title: "Dedicated",

    description: "Committed to excellence in every project",

    icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,

    color: "text-orange-500",

    detailedDescription:
      "My dedication ensures that every project receives my full attention and effort. I'm committed to delivering high-quality work that exceeds expectations.",
  },

  {
    title: "Collaborative",

    description: "Thrives in team environments",

    icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,

    color: "text-green-500",

    detailedDescription:
      "I believe great ideas emerge from collaboration. I enjoy working in teams, sharing knowledge, and combining diverse perspectives to achieve common goals.",
  },

  {
    title: "Adaptable",

    description: "Quick to learn and apply new technologies",

    icon: <Code className="w-5 h-5 md:w-6 md:h-6" />,

    color: "text-purple-500",

    detailedDescription:
      "Adaptability is essential in the fast-evolving tech landscape. I quickly learn new technologies and frameworks, applying them effectively to solve complex problems.",
  },
]

export default function About({ setActiveSection }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const [activeQuality, setActiveQuality] = useState(0)

  const [isHovering, setIsHovering] = useState(false)

  const [showGreeting, setShowGreeting] = useState(false)

  const [greetingComplete, setGreetingComplete] = useState(false)

  const bioRef = useRef<HTMLDivElement>(null)

  const qualitiesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries

        if (entry.isIntersecting) {
          setActiveSection("about")
          if (!greetingComplete) {
            setShowGreeting(true)
          }
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
  }, [setActiveSection, greetingComplete])

  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setActiveQuality((prev) => (prev + 1) % qualities.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovering])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-20 bg-white dark:bg-gray-800 transition-colors duration-300 relative min-h-screen"
    >
      {/* Greeting Animation Overlay */}
      <AnimatePresence>
        {showGreeting && !greetingComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm lg:absolute"
          >
            <motion.div
              initial={{
                scale: 0.5,
                opacity: 0,
                rotateY: -90,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateY: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 1.2,
              }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  setGreetingComplete(true)
                  setShowGreeting(false)
                }, 1500)
              }}
              className="text-center px-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotateZ: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: 1,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl"
              >
                <span className="text-2xl md:text-4xl lg:text-6xl font-bold">Namaste!</span>
                <motion.span
                  className="text-2xl md:text-4xl lg:text-6xl"
                >
                  🙏
                </motion.span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-2 md:mt-4 text-sm md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium"
              >
                Welcome to my story
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">About Me</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-stretch">
          {/* Left Column - Bio */}

          <motion.div
            ref={bioRef}
            initial={{ opacity: 0, x: -20 }}
            animate={greetingComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-1/2 space-y-4 md:space-y-6"
          >
            <div className="relative">
              <div className="absolute -left-3 md:-left-4 top-0 h-full w-1 bg-blue-600 rounded-full"></div>

              <div className="space-y-4 md:space-y-6 pl-4 md:pl-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={greetingComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.6,
                  }}
                  className="flex items-center"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-700/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">Namaste!</span>
                    <motion.span
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                      className="text-xl md:text-2xl"
                    >
                      🙏
                    </motion.span>
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  I'm a passionate Software Developer from Mumbai, India, with a love for{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">problem-solving</span> and a strong
                  dedication to{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">automating workflows</span>. I
                  specialize in developing AI tools and experimenting with the latest{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">ML/DL models</span> to push the
                  boundaries of what's possible.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  My journey in software development is driven by a desire to create{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">efficient, scalable</span> solutions
                  that make a difference. I thrive on tackling complex challenges and turning them into streamlined,
                  effective processes. Whether it's developing algorithms to enhance{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">machine learning</span> capabilities
                  or creating automation scripts to save time and reduce errors, I am always looking for ways to{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">innovate</span> and{" "}
                  <span className="font-semibold text-blue-900 dark:text-blue-300">improve</span>.
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              className="mt-6 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 relative overflow-hidden"
            >
              <div className="absolute -right-2 -bottom-2 opacity-10">
                <BookOpen className="w-16 h-16 text-blue-900 dark:text-blue-300" />
              </div>

              <p className="text-blue-900 dark:text-blue-300 italic text-sm md:text-base relative z-10">
                "I believe that technology should simplify life, not complicate it. My goal is to create solutions that
                are both powerful and intuitive."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 1.4 }}
              className="flex flex-wrap gap-3 mt-6 pl-4 md:pl-6"
            >
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                <Rocket className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />

                <span className="text-sm text-gray-700 dark:text-gray-300">AI Enthusiast</span>
              </div>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />

                <span className="text-sm text-gray-700 dark:text-gray-300">Full Stack Developer</span>
              </div>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />

                <span className="text-sm text-gray-700 dark:text-gray-300">Problem Solver</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Qualities */}

          <motion.div
            ref={qualitiesRef}
            initial={{ opacity: 0, x: 20 }}
            animate={greetingComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:w-1/2 w-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800 rounded-xl p-4 md:p-8 h-full shadow-md border border-blue-100 dark:border-blue-800/50">
              <h3 className="text-xl md:text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-6 text-center">
                What Drives Me
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {qualities.map((quality, index) => (
                  <motion.div
                    key={quality.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={greetingComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className={`p-3 md:p-5 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeQuality === index
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white/80 dark:bg-gray-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setActiveQuality(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-2 md:mb-3">
                      <div
                        className={`p-1.5 md:p-2 rounded-full ${
                          activeQuality === index ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                      >
                        <span className={activeQuality === index ? "text-white" : quality.color}>{quality.icon}</span>
                      </div>

                      <h4
                        className={`ml-2 md:ml-3 font-bold text-sm md:text-base ${
                          activeQuality === index ? "text-white" : "text-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {quality.title}
                      </h4>
                    </div>

                    <p
                      className={`text-xs md:text-sm ${
                        activeQuality === index ? "text-white/90" : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {quality.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 md:mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuality}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 md:p-6 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900/30"
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-center text-xs md:text-sm">
                      <span className={`font-medium ${qualities[activeQuality].color}`}>
                        {qualities[activeQuality].title}:
                      </span>{" "}
                      {qualities[activeQuality].detailedDescription}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="w-full mt-6 flex justify-center">
                <div className="flex space-x-2">
                  {qualities.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveQuality(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeQuality === index ? "bg-blue-600 dark:bg-blue-400 w-4" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      aria-label={`View ${qualities[index].title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
