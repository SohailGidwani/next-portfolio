"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useInView } from 'react-intersection-observer'

interface ContactProps {
  setActiveSection: (section: string) => void;
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}

const contactItems: ContactItem[] = [
  { icon: <Mail className="w-6 h-6" />, label: "Email", value: "sohailgidwani15@gmail.com", link: "mailto:sohailgidwani15@gmail.com" },
  { icon: <Phone className="w-6 h-6" />, label: "Phone", value: "+91 9503151319", link: "tel:+919503151319" },
  { icon: <MapPin className="w-6 h-6" />, label: "Location", value: "Mumbai, India" },
  { icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn", value: "sohail-gidwani", link: "https://www.linkedin.com/in/sohail-gidwani/" },
  { icon: <Github className="w-6 h-6" />, label: "GitHub", value: "SohailGidwani", link: "https://github.com/SohailGidwani" },
]

function ContactCard({ item, index, isDark }: { item: ContactItem; index: number; isDark: boolean }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
          {item.icon}
        </div>
        <h3 className="ml-4 text-xl font-semibold">{item.label}</h3>
      </div>
      {item.link ? (
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`text-lg ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
        >
          {item.value}
        </a>
      ) : (
        <p className="text-lg">{item.value}</p>
      )}
    </motion.div>
  )
}

export default function Contact({ setActiveSection }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('contact')
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

  // Handle theme detection
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <section id="contact" className="py-20 bg-gray-100"></section>
  }

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className={`py-20 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl font-bold mb-12 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactItems.map((item, index) => (
            <ContactCard key={item.label} item={item} index={index} isDark={isDark} />
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            I'm always open to new opportunities and collaborations. 
            Feel free to reach out!
          </p>
        </motion.div>
      </div>
    </section>
  )
}