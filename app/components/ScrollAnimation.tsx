"use client"

import { motion, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
  stagger?: boolean
  staggerDelay?: number
}

export default function ScrollAnimation({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  variant = 'fadeUp',
  stagger = false,
  staggerDelay = 0.1
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once, 
    amount: threshold,
    margin: "-10% 0px -10% 0px"
  })

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0 }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger ? staggerDelay : 0
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
      >
        {Array.isArray(children) ? children.map((child, index) => (
          <motion.div key={index} variants={childVariants}>
            {child}
          </motion.div>
        )) : (
          <motion.div variants={childVariants}>
            {children}
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={variants[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}