"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

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
    if ("touches" in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
  }

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    let endX: number
    if ("changedTouches" in e) {
      endX = e.changedTouches[0].clientX
    } else {
      endX = e.clientX
    }

    const diffX = endX - dragStartX

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        triggerHaptic()
        navigate(-1) // Swipe right, go to previous
      } else {
        triggerHaptic()
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

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex
    if (diff === 0) return "center"
    if (diff === 1 || diff === -(items.length - 1)) return "right"
    if (diff === -1 || diff === items.length - 1) return "left"
    return "hidden"
  }

  const getCardVariants = (position: string) => {
    switch (position) {
      case "center":
        return {
          x: "0%",
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          zIndex: 3,
        }
      case "left":
        return {
          x: "-75%",
          scale: 0.8,
          opacity: 0.6,
          filter: "blur(2px)",
          zIndex: 1,
        }
      case "right":
        return {
          x: "75%",
          scale: 0.8,
          opacity: 0.6,
          filter: "blur(2px)",
          zIndex: 1,
        }
      default:
        return {
          x: "0%",
          scale: 0.7,
          opacity: 0,
          filter: "blur(4px)",
          zIndex: 0,
        }
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setShowControls(false)
      }}
      onTouchStart={handleTouchStart}
      ref={carouselRef}
    >
      <div
        className="relative h-[650px] md:h-[550px] flex items-center justify-center"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {items.map((item, index) => {
          const position = getCardPosition(index)
          const variants = getCardVariants(position)

          return (
            <motion.div
              key={index}
              className="absolute w-full max-w-5xl mx-auto"
              animate={variants}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                pointerEvents: position === "center" ? "auto" : "none",
              }}
            >
              <div className="mx-4 md:mx-8">
                <div
                  className="rounded-2xl shadow-lg overflow-hidden h-[600px] md:h-[500px]"
                  style={{
                    boxShadow:
                      position === "center"
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {item}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation Arrows - Desktop */}
      <div className="absolute inset-0 hidden md:flex items-center justify-between pointer-events-none px-4 z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => { triggerHaptic(); navigate(-1) }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-4 shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 pointer-events-auto border border-gray-200/50 dark:border-gray-700/50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => { triggerHaptic(); navigate(1) }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-4 shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 pointer-events-auto border border-gray-200/50 dark:border-gray-700/50"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Navigation Arrows - Mobile */}
      <div className="absolute inset-0 md:hidden flex items-center justify-between pointer-events-none px-4 z-10">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 0.95 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => { triggerHaptic(); navigate(-1) }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-3 shadow-xl pointer-events-auto border border-gray-200/50 dark:border-gray-700/50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 0.95 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => { triggerHaptic(); navigate(1) }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-white rounded-full p-3 shadow-xl pointer-events-auto border border-gray-200/50 dark:border-gray-700/50"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
        {items.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => { triggerHaptic(); setCurrentIndex(index) }}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "bg-blue-600 w-8 shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
