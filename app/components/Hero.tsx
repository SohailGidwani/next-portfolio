"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FaFileAlt, FaPython,} from 'react-icons/fa'
import { SiTensorflow, SiNumpy, SiScikitlearn, SiPytorch } from 'react-icons/si'
import { useTheme } from 'next-themes'

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('hero')
        }
      },
      { threshold: 0.5 }
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

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  return (
    <section 
      ref={sectionRef} 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 text-gray-900'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`}
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto px-4 z-10 text-center"
        style={{ y: yText, opacity }}
      >
        <motion.h1 
          className={`text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-600' 
              : 'bg-gradient-to-r from-blue-600 to-purple-800'
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Sohail Gidwani
        </motion.h1>
        <h2 className={`text-2xl md:text-4xl mb-6 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
          <TypeAnimation
            sequence={[
              'Software Developer',
              2000,
              'AI Enthusiast',
              2000,
              'Machine Learning Expert',
              2000,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
          />
        </h2>
        <motion.p 
          className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Passionate about creating innovative AI solutions and pushing the boundaries of technology.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            className={`relative overflow-hidden px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
              isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => window.open('/documents/Sohail_Gidwani_Resume_2024.pdf', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              <FaFileAlt className="mr-2" />
              View Resume
            </span>
            <motion.div
              className={`absolute inset-0 ${
                isDark ? 'bg-blue-500' : 'bg-blue-300'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0, originY: 0 }}
            />
          </motion.button>
        </motion.div>

        <motion.div 
          className="mt-16 flex justify-center items-center space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {[
            { Icon: FaPython, name: 'Python' },
            { Icon: SiTensorflow, name: 'TensorFlow' },
            { Icon: SiNumpy, name: 'Numpy' },
            { Icon: SiScikitlearn, name: 'Scikit-Learn' },
            { Icon: SiPytorch, name: 'PyTorch' },
          ].map(({ Icon, name }) => (
            <motion.div
              key={name}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                isDark ? 'bg-blue-700' : 'bg-blue-200'
              }`}>
                <Icon className={`w-6 h-6 ${isDark ? 'text-blue-200' : 'text-blue-700'}`} />
              </div>
              <span className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute justify-center items-center bottom-16 transform -translate-x-1/2"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>Scroll to explore</span>
      </motion.div>
    </section>
  )
}