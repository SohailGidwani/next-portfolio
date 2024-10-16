"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react'
import { useTheme } from 'next-themes'

interface ContactProps {
  setActiveSection: (section: string) => void;
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  x: number;
  y: number;
}

const ContactStar: React.FC<ContactItem & { onInteraction: () => void; isActive: boolean }> = ({ icon, label, value, link, x, y, onInteraction, isActive }) => {
  const { theme } = useTheme()

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%` }}
      whileHover={{ scale: 1.2 }}
      onHoverStart={onInteraction}
      onClick={onInteraction}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive 
            ? 'bg-blue-600 dark:bg-blue-400' 
            : 'bg-blue-400 dark:bg-blue-600'
        }`}
        animate={{ scale: isActive ? 1.2 : 1 }}
      >
        {icon}
      </motion.div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute ${y > 50 ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 transform -translate-x-1/2 ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } p-2 rounded shadow-lg z-10 w-48`}
          >
            <p className="font-semibold text-blue-600 dark:text-blue-400">{label}</p>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline break-words">
                {value}
              </a>
            ) : (
              <p className="text-sm break-words">{value}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Contact({ setActiveSection }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeItem, setActiveItem] = useState<number | null>(null)
  

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

  const contactItems: ContactItem[] = [
    { icon: <Mail className="w-6 h-6 text-white" />, label: "Email", value: "sohailgidwani15@gmail.com", link: "mailto:sohailgidwani15@gmail.com", x: 20, y: 40 },
    { icon: <Phone className="w-6 h-6 text-white" />, label: "Phone", value: "+91 9503151319", link: "tel:+919503151319", x: 80, y: 40 },
    { icon: <MapPin className="w-6 h-6 text-white" />, label: "Location", value: "Mumbai, India", x: 50, y: 20 },
    { icon: <Linkedin className="w-6 h-6 text-white" />, label: "LinkedIn", value: "sohail-gidwani", link: "https://www.linkedin.com/in/sohail-gidwani/", x: 30, y: 70 },
    { icon: <Github className="w-6 h-6 text-white" />, label: "GitHub", value: "SohailGidwani", link: "https://github.com/SohailGidwani", x: 70, y: 70 },
  ]

  // Taurus constellation stars
  const taurusStars = [
    { x: 25, y: 30, size: 3 },
    { x: 35, y: 25, size: 4 },
    { x: 45, y: 20, size: 3 },
    { x: 55, y: 25, size: 5 },
    { x: 65, y: 30, size: 4 },
    { x: 40, y: 40, size: 3 },
    { x: 50, y: 45, size: 4 },
    { x: 60, y: 50, size: 3 },
    { x: 45, y: 60, size: 4 },
    { x: 55, y: 65, size: 3 },
    { x: 30, y: 55, size: 3 },
    { x: 70, y: 45, size: 3 },
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 transition-colors duration-300 dark:bg-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center text-blue-900 dark:text-blue-400"
        >
          Contact Constellation (Taurus)
        </motion.h2>
        <div className="relative h-[600px] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl">
          {taurusStars.map((star, index) => (
            <motion.div
              key={index}
              className="absolute bg-blue-400 dark:bg-blue-600 rounded-full"
              style={{
                width: star.size,
                height: star.size,
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          {contactItems.map((item, index) => (
            <ContactStar
              key={index}
              {...item}
              onInteraction={() => setActiveItem(activeItem === index ? null : index)}
              isActive={activeItem === index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}