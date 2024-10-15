"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AboutProps {
  setActiveSection: (section: string) => void;
}

const qualities = [
  { title: "Innovative", description: "Always seeking new solutions" },
  { title: "Dedicated", description: "Committed to excellence in every project" },
  { title: "Collaborative", description: "Thrives in team environments" },
  { title: "Adaptable", description: "Quick to learn and apply new technologies" },
]

export default function About({ setActiveSection }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeQuality, setActiveQuality] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('about')
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuality((prev) => (prev + 1) % qualities.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-900 dark:text-blue-400">About Me</h2>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 space-y-6"
          >
            <p className="text-xl text-gray-700 dark:text-gray-300">
              <b>Namaste!</b>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              I'm a passionate Software Developer from Mumbai, India, with a love for <b>problem-solving</b> and a strong dedication to <b>automating workflows</b>. I specialize in developing AI tools and experimenting with the latest <b>ML/DL models</b> to push the boundaries of what's possible.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              My journey in software development is driven by a desire to create <b>efficient, scalable</b> solutions that make a difference. I thrive on tackling complex challenges and turning them into streamlined, effective processes. Whether it's developing algorithms to enhance <b>machine learning</b> capabilities or creating automation scripts to save time and reduce errors, I am always looking for ways to <b>innovate</b> and <b>improve</b>.
            </p>
          </motion.div>
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-100 dark:bg-blue-900 rounded-lg p-8 h-full"
            >
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-200 mb-6 text-center">
                What Drives Me
              </h3>
              <div className="relative h-40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuality}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  >
                    <h4 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {qualities[activeQuality].title}
                    </h4>
                    <p className="text-lg text-blue-800 dark:text-blue-200">
                      {qualities[activeQuality].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-8 flex justify-center space-x-2">
                {qualities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveQuality(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === activeQuality ? 'bg-blue-600 dark:bg-blue-400' : 'bg-blue-300 dark:bg-blue-700'
                    }`}
                    aria-label={`View quality ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}