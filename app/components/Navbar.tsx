"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/app/components/ui/button"
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion } from 'framer-motion'

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = ['About', 'Experience', 'Education', 'Skills', 'Projects', 'Triumphs', 'Contact']

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId.toLowerCase())
    }
    setIsOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-blue-600 dark:text-blue-400">SG</a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  variant="ghost"
                  className={`${
                    activeSection === item.toLowerCase() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                  } hover:text-blue-600 dark:hover:text-blue-400`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={toggleTheme} variant="ghost" size="icon" className="mr-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="md:hidden">
              <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Button
                key={item}
                onClick={() => scrollToSection(item)}
                variant="ghost"
                className={`${
                  activeSection === item.toLowerCase() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                } hover:text-blue-600 dark:hover:text-blue-400 block w-full text-left`}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  )
}