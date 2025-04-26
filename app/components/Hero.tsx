"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { FaFileAlt, FaArrowDown, FaArrowRight } from 'react-icons/fa'

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isResumeHovered, setIsResumeHovered] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  
  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 300])
  
  const opacitySection = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    setMounted(true)
    
    // Intersection observer for section detection
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('hero')
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    // Auto-advance the active index
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 4000)
    
    // Track mouse position for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) - 0.5,
          y: ((e.clientY - rect.top) / rect.height) - 0.5
        })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      clearInterval(interval)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [setActiveSection])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'
  
  // Content for the rotating showcase
  const showcaseItems = [
    { title: "Software Developer", description: "Building elegant solutions to complex problems" },
    { title: "AI Enthusiast", description: "Exploring the frontiers of artificial intelligence" },
    { title: "ML Expert", description: "Creating intelligent systems that learn and adapt" }
  ]

  return (
    <section 
      ref={sectionRef} 
      className={`relative h-screen max-h-[800px] overflow-hidden ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* Diagonal split background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-blue-950 to-purple-950'
            : 'bg-gradient-to-br from-blue-50 to-purple-50'
        }`}></div>
        
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: isDark ? '#0f172a' : '#f8fafc', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: isDark ? '#1e1b4b' : '#ede9fe', stopOpacity: 0.8 }} />
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
            ? 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0) 70%)' 
            : 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0) 70%)',
          y: y1
        }}
      />
      
      <motion.div 
        className="absolute bottom-[30%] left-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full opacity-20"
        style={{ 
          background: isDark 
            ? 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0) 70%)' 
            : 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(124,58,237,0) 70%)',
          y: y2
        }}
      />
      
      <motion.div 
        className="absolute top-[60%] right-[20%] w-20 h-20 md:w-32 md:h-32 rounded-full opacity-20"
        style={{ 
          background: isDark 
            ? 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(236,72,153,0) 70%)' 
            : 'radial-gradient(circle, rgba(219,39,119,0.4) 0%, rgba(219,39,119,0) 70%)',
          y: y3
        }}
      />
      
      {/* Main content */}
      <motion.div 
        ref={containerRef}
        className="relative z-10 w-full h-full flex flex-col md:flex-row"
        style={{ opacity: opacitySection }}
      >
        {/* Left side - Name and title */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md mx-auto md:mx-0"
          >
            <h2 className={`text-sm uppercase tracking-widest mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Portfolio
            </h2>
            
            <h1 className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Sohail<br />
              <span className={`${
                isDark 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
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
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {showcaseItems[activeIndex].title}
                  </h3>
                  <p className={`text-sm md:text-base ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {showcaseItems[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex space-x-3 mb-6">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? isDark ? 'bg-blue-400 w-8' : 'bg-blue-600 w-8'
                      : isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${showcaseItems[index].title}`}
                />
              ))}
            </div>
            
            {/* Resume button */}
            <motion.button
              className={`group relative overflow-hidden px-6 py-3 rounded-full font-medium text-base ${
                isDark 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors duration-300`}
              onHoverStart={() => setIsResumeHovered(true)}
              onHoverEnd={() => setIsResumeHovered(false)}
              onClick={() => window.open('/documents/Sohail_Gidwani_Resume_2024.pdf', '_blank')}
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
                    className={`absolute -bottom-1 left-0 h-0.5 ${
                      isDark ? 'bg-white' : 'bg-white'
                    } rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: isResumeHovered ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </span>
              
              {/* Button glow effect */}
              <motion.div 
                className={`absolute inset-0 ${
                  isDark ? 'bg-blue-500' : 'bg-blue-500'
                }`}
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
                        opacity: 0.7 
                      }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 100, 
                        y: (Math.random() - 0.5) * 100, 
                        opacity: 0 
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    />
                  ))}
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Right side - Interactive showcase */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center px-6 md:px-12">
          <motion.div 
            className="relative w-full max-w-sm aspect-square"
            style={{
              rotateY: mousePosition.x * 10,
              rotateX: -mousePosition.y * 10,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onHoverStart={() => setIsCardHovered(true)}
            onHoverEnd={() => setIsCardHovered(false)}
          >
            {/* Interactive card */}
            <motion.div 
              className={`absolute inset-0 rounded-2xl overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-black/30'
                  : 'bg-gradient-to-br from-white to-gray-100 shadow-xl shadow-black/10'
              } backdrop-blur-sm border ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              whileHover={{ 
                boxShadow: isDark 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)'
              }}
            >
              {/* Card content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col">
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <motion.div
                    className={`w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}
                    animate={{
                      boxShadow: [
                        isDark ? '0 0 0 0 rgba(59,130,246,0)' : '0 0 0 0 rgba(37,99,235,0)',
                        isDark ? '0 0 0 10px rgba(59,130,246,0.1)' : '0 0 0 10px rgba(37,99,235,0.1)',
                        isDark ? '0 0 0 0 rgba(59,130,246,0)' : '0 0 0 0 rgba(37,99,235,0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg 
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.path 
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        animate={{ 
                          pathLength: isCardHovered ? [0, 1] : 1,
                          rotate: isCardHovered ? 360 : 0
                        }}
                        transition={{ 
                          pathLength: { duration: 1.5, ease: "easeInOut" },
                          rotate: { duration: 2, ease: "easeInOut" }
                        }}
                      />
                      <motion.path 
                        d="M12 16V12" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        animate={{ 
                          pathLength: isCardHovered ? [0, 1] : 1,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <motion.path 
                        d="M12 8H12.01" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        animate={{ 
                          pathLength: isCardHovered ? [0, 1] : 1,
                        }}
                        transition={{ duration: 0.5, delay: 1 }}
                      />
                    </svg>
                  </motion.div>
                  
                  <h3 className={`text-lg sm:text-xl font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Discover My Work
                  </h3>
                  
                  <p className={`text-xs sm:text-sm mb-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Explore my projects and see how I combine technology and creativity to build innovative solutions.
                  </p>
                  
                  <motion.button
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                      isDark 
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Scroll to projects section
                      const projectsSection = document.getElementById('projects')
                      if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    <span>View Projects</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.span>
                  </motion.button>
                </div>
                
                {/* Card decorative elements */}
                <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-red-500"></div>
                <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-green-500"></div>
                
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div className={`w-16 h-1 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
              
              {/* Interactive particles inside card on hover */}
              {isCardHovered && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${
                        i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
                      }`}
                      initial={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        opacity: 0
                      }}
                      animate={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{ 
                        duration: Math.random() * 2 + 1,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Decorative elements behind the card */}
            <motion.div 
              className={`absolute -bottom-4 -right-4 w-full h-full rounded-2xl ${
                isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
              } -z-10`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>
            
            <motion.div 
              className={`absolute -top-4 -left-4 w-full h-full rounded-2xl ${
                isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'
              } -z-10`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            ></motion.div>
          </motion.div>
        </div>
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
            const aboutSection = document.getElementById('about')
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          whileHover={{ y: 5 }}
        >
          <span className={`text-xs uppercase tracking-widest mb-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaArrowDown className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}