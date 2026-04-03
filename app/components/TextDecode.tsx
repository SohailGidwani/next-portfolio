"use client"

import { useEffect, useState, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface TextDecodeProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  onComplete?: () => void
}

export default function TextDecode({
  text,
  className = '',
  delay = 0,
  speed = 50,
  onComplete,
}: TextDecodeProps) {
  const [display, setDisplay] = useState('')
  const [started, setStarted] = useState(false)

  const decode = useCallback(() => {
    let iteration = 0
    const maxIterations = text.length

    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      iteration += 1 / 3
      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplay(text)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  useEffect(() => {
    let cleanupDecode: (() => void) | undefined
    const timer = setTimeout(() => {
      setStarted(true)
      cleanupDecode = decode()
    }, delay)

    return () => {
      clearTimeout(timer)
      cleanupDecode?.()
    }
  }, [delay, decode])

  return (
    <span className={className}>
      {started ? display : '\u00A0'.repeat(text.length)}
    </span>
  )
}
