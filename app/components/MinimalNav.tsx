"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'triumphs', label: 'Triumphs' },
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
]

interface MinimalNavProps {
  activeSection: string
  visible: boolean
}

export default function MinimalNav({ activeSection, visible }: MinimalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const currentLabel = SECTIONS.find(s => s.id === activeSection)?.label ?? ''

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          >
            <button
              onClick={() => scrollTo('hero')}
              className="font-display italic text-sm text-white/60 hover:text-white transition-colors"
            >
              Sohail Gidwani
            </button>
            <span className="text-[10px] font-body font-medium tracking-[4px] uppercase text-white/25">
              {currentLabel}
            </span>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col gap-1.5 p-2 group"
              aria-label="Open menu"
            >
              <span className="block w-5 h-px bg-white/50 group-hover:bg-white transition-colors" />
              <span className="block w-3.5 h-px bg-white/50 group-hover:bg-white transition-colors ml-auto" />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] glass-elevated flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-sm tracking-[3px] uppercase"
              aria-label="Close menu"
            >
              Close
            </button>
            <nav className="flex flex-col items-center gap-6">
              {SECTIONS.filter(s => s.id !== 'hero').map((section, i) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => scrollTo(section.id)}
                  className={`font-display italic text-3xl md:text-5xl transition-colors ${
                    activeSection === section.id ? 'text-white' : 'text-white/20 hover:text-white/60'
                  }`}
                >
                  {section.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
