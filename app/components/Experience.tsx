"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, Building, ChevronRight, ExternalLink } from 'lucide-react'
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
  const timelineRef = useRef<HTMLDivElement>(null)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [activeExperience, setActiveExperience] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  // Set mounted state to handle theme detection
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('experience')
        }
      },
      { threshold: 0.3 }
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
      date: "June, 2023 - Present",
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
      date: "May, 2021 - July, 2021",
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

  // Render a minimal placeholder while mounting
  if (!mounted) {
    return (
      <section id="experience" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">Professional Experience</h2>
        </div>
      </section>
    )
  }

  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
            Professional Experience
          </h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
        </motion.div>

        {/* Desktop Timeline View */}
        {!isMobile && (
          <div className="hidden md:block max-w-6xl mx-auto">
            {/* Horizontal Timeline */}
            <div 
              ref={timelineRef}
              className="relative mb-16"
            >
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-blue-200 dark:bg-blue-900 transform -translate-y-1/2"></div>
              
              {/* Timeline Nodes */}
              <div className="flex justify-between relative px-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative"
                  >
                    {/* Timeline Node */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center z-10 cursor-pointer transition-all duration-300 ${
                        activeExperience === index 
                          ? 'bg-blue-600 shadow-lg' 
                          : 'bg-white dark:bg-gray-800 border-2 border-blue-600'
                      }`}
                      onClick={() => setActiveExperience(index)}
                      aria-label={`View experience at ${exp.company}`}
                    >
                      <Briefcase 
                        size={24} 
                        className={activeExperience === index ? 'text-white' : 'text-blue-600 dark:text-blue-400'} 
                      />
                    {/* Date Label - Alternating top/bottom for better spacing */}
                    <div className={`absolute ${index % 2 === 0 ? 'top-20' : 'bottom-20'} left-1/2 transform -translate-x-1/2 whitespace-nowrap`}>
                      <div className={`px-4 py-2 rounded-full ${
                        activeExperience === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                      } transition-all duration-300`}>
                        <span className="text-sm font-medium">{exp.company}</span>
                      </div>
                    </div>
                    </motion.button>
                    
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Experience Content */}
            <motion.div
              layout
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="h-1 bg-blue-600"></div>
              
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: activeExperience === index ? 1 : 0,
                    display: activeExperience === index ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.4 }}
                  className="p-8"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div>
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3"
                      >
                        {exp.title}
                      </motion.h3>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-center mb-2 text-gray-600 dark:text-gray-400"
                      >
                        <Building size={18} className="mr-2" />
                        <span className="font-medium">{exp.company}</span>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex items-center text-gray-600 dark:text-gray-400"
                      >
                        <Calendar size={18} className="mr-2" />
                        <span>{exp.date}</span>
                      </motion.div>
                    </div>
                    
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedExperience(exp)}
                      className="mt-6 lg:mt-0 px-5 py-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm flex items-center self-start"
                    >
                      View All Projects <ChevronRight size={16} className="ml-1" />
                    </motion.button>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
                  >
                    {exp.description}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <Briefcase size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                      Featured Projects
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {exp.projects.slice(0, 2).map((project, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-600"
                        >
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {project.length > 180 ? `${project.substring(0, 180)}...` : project}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    
                    {exp.projects.length > 2 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedExperience(exp)}
                        className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center"
                      >
                        {/* View all {exp.projects.length} projects <ExternalLink size={14} className="ml-1" /> */}
                        View more <ExternalLink size={14} className="ml-1" />
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Mobile Timeline View */}
        {isMobile && (
          <div className="md:hidden">
            <div className="relative pl-12">
              {/* Vertical Timeline Line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-600"></div>
              
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="mb-12 relative"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 top-0 -translate-x-1/2">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeExperience === index 
                          ? 'bg-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-2 border-blue-600'
                      }`}
                      onClick={() => setActiveExperience(index)}
                    >
                      <span className={activeExperience === index ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
                        {index + 1}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Experience Card */}
                  <motion.div
                    animate={{ 
                      scale: activeExperience === index ? 1 : 0.98,
                      opacity: activeExperience === index ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer ${
                      activeExperience === index ? 'border-l-4 border-blue-600' : ''
                    }`}
                    onClick={() => setActiveExperience(index)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">{exp.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{exp.date}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExperience(exp);
                          }}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                      
                      {activeExperience === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                            {exp.description}
                          </p>
                          
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              Featured Project:
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                              {exp.projects[0].length > 120 
                                ? `${exp.projects[0].substring(0, 120)}...` 
                                : exp.projects[0]
                              }
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExperience(exp);
                              }}
                              className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center"
                            >
                              {/* View all projects <ChevronRight size={12} className="ml-1" /> */}
                              View more <ChevronRight size={12} className="ml-1" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Detailed Project Modal */}
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-600 dark:text-blue-400">
              {selectedExperience?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 dark:text-gray-400">
                <div className="flex items-center mb-1 sm:mb-0">
                  <Building size={16} className="mr-2" />
                  <span className="font-medium">{selectedExperience?.company}</span>
                </div>
                <span className="hidden sm:inline mx-2">•</span>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{selectedExperience?.date}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                {selectedExperience?.description}
              </p>
            </div>
            
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Briefcase className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              Key Projects
            </h4>
            
            <div className="space-y-4">
              {selectedExperience?.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-600 shadow-sm"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    {project}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}