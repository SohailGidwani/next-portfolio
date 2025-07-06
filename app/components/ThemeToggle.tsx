"use client"

import { useTheme } from "next-themes"
import { Button } from "@/app/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
        disabled
      >
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  const getNextTheme = () => {
    return theme === "light" ? "dark" : "light"
  }

  const toggleTheme = () => {
    triggerHaptic();
    setTheme(getNextTheme())
  }

  const getThemeIcon = () => {
    return isDark ? (
      <Sun className="h-5 w-5 text-yellow-500" />
    ) : (
      <Moon className="h-5 w-5 text-blue-600" />
    )
  }

  const getThemeLabel = () => {
    return isDark ? "Light" : "Dark"
  }

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
        className="w-10 h-10 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm overflow-hidden"
        aria-label={`Switch to ${getThemeLabel()} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {getThemeIcon()}
          </motion.div>
        </AnimatePresence>
    </Button>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
        style={{ minWidth: '60px', maxWidth: '120px', textAlign: 'center' }}
      >
        {getThemeLabel()} Mode
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
      </motion.div>
    </motion.div>
  )
} 