"use client"

import { useEffect, useRef } from 'react'
import { Button } from "@/app/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('hero')
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [setActiveSection])

  return (
    <section id="hero" ref={sectionRef} className="py-20 text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            Sohail Gidwani
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-gray-600 dark:text-gray-300">
            <TypeAnimation
              sequence={[
                'Software Developer',
                2000,
                'AI Enthusiast',
                2000,
                'Machine Learning Expert',
                2000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
            />
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Passionate about creating innovative AI solutions and pushing the boundaries of technology.
          </p>
          <Button
            onClick={() => {
              const contactSection = document.getElementById('contact')
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' })
                setActiveSection('contact')
              }
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}