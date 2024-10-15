"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  items: React.ReactNode[]
  autoScrollInterval?: number
}

export default function Carousel({ items, autoScrollInterval = 10000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, autoScrollInterval)
    return () => clearInterval(timer)
  }, [items.length, autoScrollInterval])

  const navigate = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction
      if (newIndex >= items.length) return 0
      if (newIndex < 0) return items.length - 1
      return newIndex
    })
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="h-[600px] md:h-[500px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            className="absolute inset-0"
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-full p-2 shadow-lg z-20 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-full p-2 shadow-lg z-20 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Next slide"
      >
        <ChevronRight  className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}