"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/app/components/ui/button"
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from 'framer-motion'

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

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
    },
    open: {
      opacity: 1,
      y: 0,
    }
  }

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  }

  return (
    <>
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
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <motion.div 
              className="relative z-10 w-full max-w-sm"
              variants={menuVariants}
            >
              {navItems.map((item, index) => (
                <motion.div 
                  key={item} 
                  variants={itemVariants}
                  custom={index}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: index * 0.1 }}
                  className="mb-4"
                >
                  <Button
                    onClick={() => scrollToSection(item)}
                    variant="ghost"
                    className={`${
                      activeSection === item.toLowerCase() ? 'text-blue-400' : 'text-white'
                    } hover:text-blue-300 block w-full text-center text-2xl py-3`}
                  >
                    {item}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}