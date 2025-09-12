"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Menu, Moon, Sun, X, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence, useTransform, useSpring } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [namePosition, setNamePosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [heroThemeTogglePosition, setHeroThemeTogglePosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [initialsAnimating, setInitialsAnimating] = useState(false)
  const [themeToggleAnimating, setThemeToggleAnimating] = useState(false)
  const navbarRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const navbarThemeToggleRef = useRef<HTMLButtonElement>(null)

  // Motion values for the initials animation with springs for smoother motion
  const initialsX = useSpring(0, { stiffness: 100, damping: 20 })
  const initialsY = useSpring(0, { stiffness: 100, damping: 20 })
  const initialsScale = useSpring(1, { stiffness: 100, damping: 15 })
  const initialsOpacity = useSpring(0, { stiffness: 100, damping: 20 })
  const navbarOpacity = useSpring(0, { stiffness: 100, damping: 20 })
  const navbarY = useSpring(-100, { stiffness: 100, damping: 20 })

  // Motion values for theme toggle animation
  const themeToggleX = useSpring(0, { stiffness: 100, damping: 20 })
  const themeToggleY = useSpring(0, { stiffness: 100, damping: 15 })
  const themeToggleScale = useSpring(1, { stiffness: 100, damping: 15 })
  const themeToggleOpacity = useSpring(0, { stiffness: 100, damping: 20 })

  // Transform for opacity
  const opacityValue = useTransform(initialsOpacity, [0, 0.5, 1], [0, 0.8, 1])
  const themeToggleOpacityValue = useTransform(themeToggleOpacity, [0, 0.5, 1], [0, 0.8, 1])

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollY / windowHeight) * 100
      setScrollProgress(progress)

      // Show navbar with even a small scroll
      const scrollThreshold = 10 // Very small threshold
      const navbarVisibility = Math.min(1, scrollY / 100) // Smooth transition over 100px of scroll

      navbarOpacity.set(navbarVisibility)
      navbarY.set(scrollY > scrollThreshold ? 0 : -100)

      // Handle initials animation based on scroll position
      if (logoRef.current && namePosition.width > 0) {
        const logoRect = logoRef.current.getBoundingClientRect()

        // Calculate how far we've scrolled through the hero section
        // Use a smaller divisor to make the animation happen sooner
        const scrollProgress = Math.min(1, scrollY / (window.innerHeight / 2))

        if (scrollProgress > 0) {
          setInitialsAnimating(true)

          // Calculate the position for the animation
          const startX = namePosition.x + namePosition.width / 2 - logoRect.width / 2
          const startY = namePosition.y + namePosition.height / 2 - logoRect.height / 2
          const endX = logoRect.left
          const endY = logoRect.top

          // Interpolate between start and end positions
          const currentX = startX + (endX - startX) * scrollProgress
          const currentY = startY + (endY - startY) * scrollProgress

          // Scale down from the name size to the logo size
          const scaleValue = 1 + (1 - scrollProgress) * 2

          initialsX.set(currentX - endX)
          initialsY.set(currentY - endY)
          initialsScale.set(scaleValue)
          initialsOpacity.set(scrollProgress)
        } else {
          setInitialsAnimating(true)
          initialsOpacity.set(0)
        }
      }

      // Handle theme toggle animation based on scroll position
      if (navbarThemeToggleRef.current && heroThemeTogglePosition.width > 0) {
        const navbarToggleRect = navbarThemeToggleRef.current.getBoundingClientRect()

        // Calculate scroll progress for theme toggle animation
        const themeToggleScrollProgress = Math.min(1, scrollY / (window.innerHeight * 0.3))

        if (themeToggleScrollProgress > 0) {
          setThemeToggleAnimating(true)

          // Calculate the position for the theme toggle animation
          const startX = heroThemeTogglePosition.x + heroThemeTogglePosition.width / 2 - navbarToggleRect.width / 2
          const startY = heroThemeTogglePosition.y + heroThemeTogglePosition.height / 2 - navbarToggleRect.height / 2
          const endX = navbarToggleRect.left
          const endY = navbarToggleRect.top

          // Interpolate between start and end positions
          const currentX = startX + (endX - startX) * themeToggleScrollProgress
          const currentY = startY + (endY - startY) * themeToggleScrollProgress

          themeToggleX.set(currentX - endX)
          themeToggleY.set(currentY - endY)
          themeToggleScale.set(1)
          themeToggleOpacity.set(themeToggleScrollProgress)
        } else {
          setThemeToggleAnimating(false)
          themeToggleOpacity.set(0)
        }
      }
    }

    // Listen for name position updates
    const handleNamePosition = (e: Event) => {
      const customEvent = e as CustomEvent
      setNamePosition(customEvent.detail)
    }

    // Listen for hero theme toggle position updates
    const handleHeroThemeTogglePosition = (e: Event) => {
      const customEvent = e as CustomEvent
      setHeroThemeTogglePosition(customEvent.detail)
    }

    // Listen for hero scroll events
    const handleHeroScroll = (e: Event) => {
      const customEvent = e as CustomEvent
      const { scrollY } = customEvent.detail

      // Show navbar with even a small scroll
      const scrollThreshold = 10 // Very small threshold
      const navbarVisibility = Math.min(1, scrollY / 100) // Smooth transition over 100px of scroll

      navbarOpacity.set(navbarVisibility)
      navbarY.set(scrollY > scrollThreshold ? 0 : -100)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("namePosition", handleNamePosition)
    window.addEventListener("heroThemeTogglePosition", handleHeroThemeTogglePosition)
    window.addEventListener("heroScroll", handleHeroScroll)

    // Initial scroll check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("namePosition", handleNamePosition)
      window.removeEventListener("heroThemeTogglePosition", handleHeroThemeTogglePosition)
      window.removeEventListener("heroScroll", handleHeroScroll)
    }
  }, [
    namePosition,
    heroThemeTogglePosition,
    initialsX,
    initialsY,
    initialsScale,
    initialsOpacity,
    navbarOpacity,
    navbarY,
    themeToggleX,
    themeToggleY,
    themeToggleScale,
    themeToggleOpacity,
  ])

  const navItems = ["About", "Education", "Experience", "Skills", "Projects", "Blogs", "Triumphs", "Contact"]

  const scrollToSection = (sectionId: string) => {
    triggerHaptic();
    const element = document.getElementById(sectionId.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId.toLowerCase())
    }
    setIsOpen(false)
  }

  const toggleTheme = () => {
    triggerHaptic();
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
    },
    open: {
      opacity: 1,
      y: 0,
    },
  }

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  }

  return (
    <>
      {/* Island Navbar Container */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4"
        style={{
          opacity: navbarOpacity,
          y: navbarY,
        }}
      >
        <motion.nav
          ref={navbarRef}
          className={`
            relative rounded-3xl transition-all duration-300 shadow-lg w-[95%] max-w-5xl overflow-hidden
            ${
              scrolled
                ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-600/50 shadow-xl"
                : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border border-gray-200/30 dark:border-slate-600/30"
            }
          `}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-3 pb-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center">
                <motion.a
                  ref={logoRef}
                  href="#"
                  className="text-2xl font-bold text-blue-600 dark:text-blue-400 relative mr-6"
                  style={{
                    opacity: opacityValue,
                  }}
                >
                  {/* Static logo */}
                  <span className={initialsAnimating ? "opacity-0" : "opacity-100"}>SG</span>

                  {/* Animated logo that transitions from the name */}
                  {initialsAnimating && (
                    <motion.span
                      className="absolute top-0 left-0 text-2xl font-bold text-blue-600 dark:text-blue-400"
                      style={{
                        x: initialsX,
                        y: initialsY,
                        scale: initialsScale,
                        transformOrigin: "center",
                      }}
                    >
                      SG
                    </motion.span>
                  )}
                </motion.a>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    variant="ghost"
                    size="sm"
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        activeSection === item.toLowerCase()
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {item}
                  </Button>
                ))}
              </div>

              {/* Right Section - Theme Toggle and Mobile Menu */}
              <div className="flex items-center space-x-2">
                {/* Theme Toggle */}
                <motion.div
                  style={{
                    opacity: themeToggleAnimating ? themeToggleOpacityValue : 1,
                  }}
                >
                  <Button
                    ref={navbarThemeToggleRef}
                    onClick={toggleTheme}
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-full bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 relative flex items-center justify-center"
                  >
                    {/* Static theme toggle */}
                    <div
                      className={`flex items-center justify-center ${themeToggleAnimating ? "opacity-0" : "opacity-100"}`}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </div>

                    {/* Animated theme toggle that transitions from hero */}
                    {themeToggleAnimating && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          x: themeToggleX,
                          y: themeToggleY,
                          scale: themeToggleScale,
                          transformOrigin: "center",
                        }}
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </motion.div>
                    )}
                  </Button>
                </motion.div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-full bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
                  >
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Progress Bar - Integrated at the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/20 dark:bg-slate-600/20 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="lg:hidden fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="relative z-10 w-11/12 max-w-sm mx-auto bg-white/10 dark:bg-slate-950/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 shadow-xl"
              variants={menuVariants}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 dark:border-gray-800/30">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 rounded-full"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>

              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={itemVariants}
                    custom={index}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      onClick={() => scrollToSection(item)}
                      variant="ghost"
                      className={`
                        group relative w-full justify-start text-left px-4 py-3 rounded-xl transition-all duration-300
                        ${
                          activeSection === item.toLowerCase()
                            ? "bg-blue-600/20 text-white"
                            : "text-white/90 hover:bg-white/10"
                        }
                      `}
                    >
                      <div className="flex items-center w-full">
                        <span className="text-lg">{item}</span>
                        <ChevronRight
                          className={`ml-auto h-4 w-4 transition-transform duration-300 ${
                            activeSection === item.toLowerCase() ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      </div>

                      {activeSection === item.toLowerCase() && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full"
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 dark:border-gray-800/30 flex justify-between items-center">
                <span className="text-sm text-white/70">Theme</span>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  {theme === "dark" ? (
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      <span>Light Mode</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      <span>Dark Mode</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
