"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  items: React.ReactNode[]
  autoScrollInterval?: number
}

export default function Carousel({ items, autoScrollInterval = 15000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isHovering || isDragging) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, autoScrollInterval)
    
    return () => clearInterval(timer)
  }, [items.length, autoScrollInterval, isHovering, isDragging])

  const navigate = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction
      if (newIndex >= items.length) return 0
      if (newIndex < 0) return items.length - 1
      return newIndex
    })
    
    // Show controls when navigating
    setShowControls(true)
    
    // Hide controls after 2 seconds
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    if ('touches' in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
  }

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    
    let endX: number
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX
    } else {
      endX = e.clientX
    }
    
    const diffX = endX - dragStartX
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        navigate(-1) // Swipe right, go to previous
      } else {
        navigate(1) // Swipe left, go to next
      }
    }
    
    setIsDragging(false)
  }

  const handleTouchStart = () => {
    // Show controls on touch
    setShowControls(true)
    
    // Hide controls after 2 seconds
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowControls(false);
      }}
      onTouchStart={handleTouchStart}
      ref={carouselRef}
    >
      <div 
        className="h-[600px] md:h-[500px] bg-gray-50 dark:bg-gray-800"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Arrows - Desktop */}
      <div className="absolute inset-0 hidden md:flex items-center justify-between pointer-events-none px-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate(-1)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate(1)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Navigation Arrows - Mobile */}
      <div className="absolute inset-0 md:hidden flex items-center justify-between pointer-events-none px-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 0.9 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate(-1)}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-2 shadow-lg pointer-events-auto z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 0.9 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate(1)}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-2 shadow-lg pointer-events-auto z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 w-8' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}