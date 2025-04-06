"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Lightbulb, Users, Zap } from 'lucide-react'

interface AboutProps {
  setActiveSection: (section: string) => void;
}

const qualities = [
  { 
    title: "Innovative", 
    description: "Always seeking new solutions",
    icon: <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
  },
  { 
    title: "Dedicated", 
    description: "Committed to excellence in every project",
    icon: <Zap className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
  },
  { 
    title: "Collaborative", 
    description: "Thrives in team environments",
    icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
  },
  { 
    title: "Adaptable", 
    description: "Quick to learn and apply new technologies",
    icon: <Code className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
  },
]

export default function About({ setActiveSection }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeQuality, setActiveQuality] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('about')
        }
      },
      { threshold: 0.3 }
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
    if (isHovering) return
    
    const interval = setInterval(() => {
      setActiveQuality((prev) => (prev + 1) % qualities.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isHovering])

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            About Me
          </h2>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-stretch">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-4 md:space-y-6"
          >
            <div className="relative">
              <div className="absolute -left-3 md:-left-4 top-0 h-full w-1 bg-blue-600 rounded-full"></div>
              <div className="space-y-4 md:space-y-6 pl-4 md:pl-6">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium"
                >
                  <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">Namaste!</span>
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  I'm a passionate Software Developer from Mumbai, India, with a love for <span className="font-semibold text-blue-900 dark:text-blue-300">problem-solving</span> and a strong dedication to <span className="font-semibold text-blue-900 dark:text-blue-300">automating workflows</span>. I specialize in developing AI tools and experimenting with the latest <span className="font-semibold text-blue-900 dark:text-blue-300">ML/DL models</span> to push the boundaries of what's possible.
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  My journey in software development is driven by a desire to create <span className="font-semibold text-blue-900 dark:text-blue-300">efficient, scalable</span> solutions that make a difference. I thrive on tackling complex challenges and turning them into streamlined, effective processes. Whether it's developing algorithms to enhance <span className="font-semibold text-blue-900 dark:text-blue-300">machine learning</span> capabilities or creating automation scripts to save time and reduce errors, I am always looking for ways to <span className="font-semibold text-blue-900 dark:text-blue-300">innovate</span> and <span className="font-semibold text-blue-900 dark:text-blue-300">improve</span>.
                </motion.p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
            >
              <p className="text-blue-900 dark:text-blue-300 italic text-sm md:text-base">
                "I believe that technology should simplify life, not complicate it. My goal is to create solutions that are both powerful and intuitive."
              </p>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Qualities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
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
                    className={`p-3 md:p-5 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeQuality === index 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white/80 dark:bg-gray-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => setActiveQuality(index)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="flex items-center mb-2 md:mb-3">
                      <div className={`p-1.5 md:p-2 rounded-full ${
                        activeQuality === index 
                          ? 'bg-white/20' 
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {quality.icon}
                      </div>
                      <h4 className={`ml-2 md:ml-3 font-bold text-sm md:text-base ${
                        activeQuality === index 
                          ? 'text-white' 
                          : 'text-blue-900 dark:text-blue-300'
                      }`}>
                        {quality.title}
                      </h4>
                    </div>
                    <p className={`text-xs md:text-sm ${
                      activeQuality === index 
                        ? 'text-white/90' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
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
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {qualities[activeQuality].title}:
                      </span> {" "}
                      This quality helps me approach problems with a fresh perspective and deliver exceptional results.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}