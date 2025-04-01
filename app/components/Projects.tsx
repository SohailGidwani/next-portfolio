"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Briefcase, Calendar, Building, ChevronRight, ArrowRight, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { useTheme } from 'next-themes'

interface ExperienceProps {
  setActiveSection: (section: string) => void;
}

interface ExperienceItem {
  title: string;
  company: string;
  date: string;
  description: string;
  projects: string[];
}

export default function Experience({ setActiveSection }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('experience')
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

  const experiences: ExperienceItem[] = [
    {
      title: "Software Developer (Full Stack)",
      company: "IIFL Finance Ltd",
      date: "2023 - Present",
      description: "Leading AI initiatives and developing cutting-edge machine learning models for various client projects. Mentoring junior developers and contributing to the company's AI research efforts.",
      projects: [
        "Custom Data Chatbots (RAG) : Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
        "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
        "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment, ensuring robust and secure AI solutions."
      ]
    },
    {
      title: "Web Developer (Intern)",
      company: "Iremfy.com",
      date: "May 2021 - July 2021",
      description: "Designed and implemented machine learning algorithms for predictive analytics. Collaborated with cross-functional teams to integrate ML solutions into existing products.",
      projects: [
        "Troubleshot and debugged code ensuring compatibility with devices, browsers, and operating systems.",
        "Developed web platform back ends using NodeJS and Flask frameworks. Built APIs and data clients to consume APIs.",
        "Implemented responsive front-end designs using React, showcasing adaptability in learning and applying new technologies."
      ]
    },
  ]

  // Handle theme detection
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'
  if(isDark==mounted){
    console.log("Theme is Dark")
  }
  // Don't render themed content until mounted
  if (!mounted) {
    return <section id="experience" className="py-20 bg-gray-50"></section>
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const DesktopExperience = () => (
    <div className="relative">
      {/* Interactive Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="flex justify-center mb-16"
      >
        <div className="relative w-full max-w-4xl">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 dark:bg-blue-900 transform -translate-y-1/2"></div>
          
          {/* Timeline Nodes */}
          <div className="flex justify-between relative">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Timeline Node */}
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center z-10 cursor-pointer transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-blue-600 shadow-lg shadow-blue-300 dark:shadow-blue-900' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedExperience(exp)}
                >
                  <Briefcase className="text-white" size={24} />
                </motion.div>
                
                {/* Date Label */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className={`px-4 py-2 rounded-full ${
                    activeIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                  } transition-all duration-300`}>
                    <span className="text-sm font-medium">{exp.date}</span>
                  </div>
                </div>
                
                {/* Hover Card */}
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20"
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45"></div>
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">{exp.title}</h3>
                    <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-xs">
                      <Building size={12} className="mr-1" />
                      <span>{exp.company}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                      {exp.description}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExperience(exp);
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
                    >
                      View Details <ArrowRight size={14} className="ml-1" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Experience Details */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
      >
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
              activeIndex === index ? 'scale-105 ring-2 ring-blue-500' : 'hover:scale-102'
            }`}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedExperience(exp)}
          >
            <div className="h-2 bg-blue-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{exp.title}</h3>
              
              <div className="flex justify-between mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Building size={14} className="mr-1" />
                  <span>{exp.company}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Clock size={14} className="mr-1" />
                  <span>{exp.date}</span>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {exp.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{exp.projects.length} Projects</span>
                <button 
                  className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  View Details <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )

  const MobileExperience = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="relative"
    >
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900"></div>
      
      {/* Experience Items */}
      <div className="space-y-8 pl-16">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative"
          >
            {/* Timeline Node */}
            <div className="absolute left-0 top-0 -translate-x-[3.25rem]">
              <motion.div
                className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg cursor-pointer"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExperience(exp)}
              >
                <Briefcase className="text-white" size={20} />
              </motion.div>
            </div>
            
            {/* Date Label */}
            <div className="absolute left-0 top-1 -translate-x-[8.5rem] hidden md:block">
              <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                <span className="text-xs font-medium">{exp.date}</span>
              </div>
            </div>
            
            {/* Experience Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              whileHover={{ y: -3 }}
              onClick={() => setSelectedExperience(exp)}
            >
              <div className="h-1.5 bg-blue-600"></div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">{exp.title}</h3>
                
                <div className="flex flex-col md:flex-row md:justify-between mb-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1 md:mb-0">
                    <Building size={14} className="mr-1" />
                    <span>{exp.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm md:hidden">
                    <Calendar size={14} className="mr-1" />
                    <span>{exp.date}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {exp.description}
                </p>
                
                <button 
                  className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  View Details <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <section id="experience" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">Professional Experience</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>
        
        {isMobile ? <MobileExperience /> : <DesktopExperience />}
      </div>
      
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-600 dark:text-blue-400">
              {selectedExperience?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Building size={16} className="mr-1" />
                  <span className="font-medium">{selectedExperience?.company}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
                  <Calendar size={16} className="mr-1" />
                  <span>{selectedExperience?.date}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {selectedExperience?.description}
              </p>
            </div>
            
            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <Briefcase size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              Key Projects
            </h4>
            
            <div className="space-y-4">
              {selectedExperience?.projects.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-600 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mt-1 mr-3">
                      <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-base">{project}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}