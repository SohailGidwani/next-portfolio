"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/app/components/ui/button"
import { Menu, Moon, Sun, X, ChevronRight } from 'lucide-react'
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
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = (scrolled / windowHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        ref={navbarRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800' 
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
        }`}
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
                      activeSection === item.toLowerCase() 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                    } hover:text-blue-600 dark:hover:text-blue-400 transition-all`}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                onClick={toggleTheme} 
                variant="ghost" 
                size="icon" 
                className="mr-2 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="md:hidden">
                <Button 
                  onClick={() => setIsOpen(!isOpen)} 
                  variant="ghost" 
                  size="icon"
                  className="bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gray-200 dark:bg-gray-700 w-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              className="relative z-10 w-11/12 max-w-sm mx-auto bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/30 shadow-xl"
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
                        ${activeSection === item.toLowerCase() 
                          ? 'bg-blue-600/20 text-white' 
                          : 'text-white/90 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center w-full">
                        <span className="text-lg">{item}</span>
                        <ChevronRight 
                          className={`ml-auto h-4 w-4 transition-transform duration-300 ${
                            activeSection === item.toLowerCase() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
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
                  {theme === 'dark' ? (
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