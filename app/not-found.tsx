"use client"
import Link from 'next/link'
import { Metadata } from 'next'
import { useEffect, useState, useRef } from 'react'
import { useTheme } from 'next-themes'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Page Not Found - Sohail Gidwani',
  description: 'The page you are looking for could not be found. Return to Sohail Gidwani\'s portfolio.',
  robots: {
    index: false,
    follow: true,
  },
}

const FUN_FACTS = [
  "Did you know? Space is completely silent!",
  "A day on Venus is longer than a year on Venus.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Neutron stars can spin at a rate of 600 rotations per second!",
  "The footprints on the Moon will be there for 100 million years.",
  "One million Earths could fit inside the Sun.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "There’s a planet made of diamonds twice the size of Earth!",
  "The universe is 13.8 billion years old.",
  "The hottest planet in our solar system is Venus.",
  "A year on Mercury is just 88 days long.",
  "Jupiter has 95 moons!",
  "The largest volcano in the solar system is on Mars.",
  "Saturn could float in water because it’s mostly gas.",
  "A comet’s tail always points away from the Sun."
]

export default function NotFound() {
  const [twinkle, setTwinkle] = useState(0)
  const { resolvedTheme } = useTheme()
  const [funFact, setFunFact] = useState('')
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFunFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTwinkle(t => t + 1), 1200)
    return () => clearInterval(interval)
  }, [])

  const isDark = resolvedTheme === 'dark'

  // Confetti burst on button click
  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      zIndex: 9999,
      colors: isDark
        ? ['#818cf8', '#a5b4fc', '#fbbf24', '#6366f1', '#fff']
        : ['#60a5fa', '#a5b4fc', '#fbbf24', '#6366f1', '#fff']
    })
  }

  return (
    <div className={
      isDark
        ? "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 transition-colors duration-500"
        : "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 transition-colors duration-500"
    }>
      <div className="text-center max-w-lg w-full" ref={confettiRef}>
        {/* SVG Illustration with floating animation */}
        <div className="flex justify-center mb-6">
          <motion.svg
            width="220"
            height="180"
            viewBox="0 0 220 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            animate={{ y: [0, -18, 0, 18, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              {/* Orb gradients */}
              <radialGradient id="orbLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="orbDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
              </radialGradient>
              {/* Planet gradients */}
              <linearGradient id="planetLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
              <linearGradient id="planetDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              {/* Astronaut body gradients */}
              <linearGradient id="astronautBodyLight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
              <linearGradient id="astronautBodyDark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* Orb glow adapts to theme */}
            {isDark ? (
              <ellipse cx="110" cy="120" rx="70" ry="28" fill="url(#orbDark)" />
            ) : (
              <ellipse cx="110" cy="120" rx="70" ry="28" fill="url(#orbLight)" />
            )}
            {/* Planet */}
            {isDark ? (
              <>
                <ellipse cx="110" cy="140" rx="60" ry="18" fill="#312e81" />
                <circle cx="110" cy="90" r="60" fill="url(#planetDark)" />
                <ellipse cx="110" cy="90" rx="40" ry="16" fill="#818cf8" opacity="0.5" />
              </>
            ) : (
              <>
                <ellipse cx="110" cy="140" rx="60" ry="18" fill="#e0e7ef" />
                <circle cx="110" cy="90" r="60" fill="url(#planetLight)" />
                <ellipse cx="110" cy="90" rx="40" ry="16" fill="#93c5fd" opacity="0.7" />
              </>
            )}
            {/* Astronaut */}
            <g>
              {isDark ? (
                <>
                  <circle cx="110" cy="60" r="18" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
                  <ellipse cx="110" cy="60" rx="10" ry="7" fill="#818cf8" />
                  <rect x="100" y="78" width="20" height="28" rx="8" fill="url(#astronautBodyDark)" stroke="#6366f1" strokeWidth="2" />
                  <rect x="85" y="90" width="15" height="6" rx="3" fill="#334155" stroke="#6366f1" strokeWidth="2" />
                  <rect x="120" y="90" width="15" height="6" rx="3" fill="#334155" stroke="#6366f1" strokeWidth="2" />
                  <rect x="104" y="106" width="5" height="18" rx="2.5" fill="#334155" stroke="#6366f1" strokeWidth="2" />
                  <rect x="111" y="106" width="5" height="18" rx="2.5" fill="#334155" stroke="#6366f1" strokeWidth="2" />
                  <ellipse cx="116" cy="56" rx="3" ry="1.5" fill="#a5b4fc" opacity="0.7" />
                </>
              ) : (
                <>
                  <circle cx="110" cy="60" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="110" cy="60" rx="10" ry="7" fill="#bae6fd" />
                  <rect x="100" y="78" width="20" height="28" rx="8" fill="url(#astronautBodyLight)" stroke="#1e293b" strokeWidth="2" />
                  <rect x="85" y="90" width="15" height="6" rx="3" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
                  <rect x="120" y="90" width="15" height="6" rx="3" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
                  <rect x="104" y="106" width="5" height="18" rx="2.5" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
                  <rect x="111" y="106" width="5" height="18" rx="2.5" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="116" cy="56" rx="3" ry="1.5" fill="#fff" opacity="0.7" />
                </>
              )}
            </g>
            {/* Animated Stars */}
            <circle cx="40" cy="40" r={twinkle % 2 === 0 ? 2 : 1.2} fill="#fbbf24" opacity={twinkle % 3 === 0 ? 0.7 : 1} />
            <circle cx="180" cy="50" r={twinkle % 3 === 0 ? 1.5 : 2.1} fill="#fbbf24" opacity={twinkle % 2 === 0 ? 1 : 0.7} />
            <circle cx="60" cy="120" r={twinkle % 2 === 0 ? 1.2 : 2} fill="#fbbf24" opacity={twinkle % 3 === 0 ? 1 : 0.7} />
            <circle cx="170" cy="120" r={twinkle % 3 === 0 ? 1.8 : 1.2} fill="#fbbf24" opacity={twinkle % 2 === 0 ? 0.7 : 1} />
            <circle cx="140" cy="30" r={twinkle % 2 === 0 ? 1.2 : 2} fill="#fbbf24" opacity={twinkle % 3 === 0 ? 1 : 0.7} />
          </motion.svg>
        </div>
        <h1 className={
          isDark
            ? "text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(99,102,241,0.7)]"
            : "text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg"
        }>
          404
        </h1>
        <h2 className={
          isDark
            ? "text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-300 via-purple-400 to-blue-200 bg-clip-text text-transparent"
            : "text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 bg-clip-text text-transparent"
        }>
          Lost in Space!
        </h2>
        <p className={
          isDark
            ? "text-gray-300 mb-8 max-w-md mx-auto"
            : "text-gray-600 mb-8 max-w-md mx-auto"
        }>
          Oops! Looks like you’ve drifted off the map. This page is floating somewhere in the cosmos, but you can always beam back to safety.
        </p>
        {/* Fun Fact */}
        <div className={isDark ? "mb-8 text-blue-200 text-base italic" : "mb-8 text-blue-700 text-base italic"}>
          <span role="img" aria-label="star">✨</span> {funFact}
        </div>
        <div className="space-y-4">
          <Link
            href="/"
            onClick={handleConfetti}
            className={
              isDark
                ? "inline-block bg-gradient-to-r from-blue-500 to-purple-400 hover:from-purple-400 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-lg focus-ring"
                : "inline-block bg-gradient-to-r from-blue-600 to-purple-500 hover:from-purple-500 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-lg focus-ring"
            }
          >
            🚀 Go to Homepage
          </Link>
          <div className={isDark ? "text-sm text-gray-500" : "text-sm text-gray-400"}>
            <p>Or navigate to:</p>
            <div className={isDark ? "mt-2 space-x-4" : "mt-2 space-x-4"}>
              <Link href="/#about" className={isDark ? "hover:text-purple-400 transition-colors" : "hover:text-blue-600 transition-colors"}>
                About
              </Link>
              <Link href="/#projects" className={isDark ? "hover:text-purple-400 transition-colors" : "hover:text-blue-600 transition-colors"}>
                Projects
              </Link>
              <Link href="/#contact" className={isDark ? "hover:text-purple-400 transition-colors" : "hover:text-blue-600 transition-colors"}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 