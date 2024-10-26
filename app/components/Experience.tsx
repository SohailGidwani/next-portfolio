"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
// import { useTheme } from 'next-themes'

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
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  // const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        "Custom Data Chatbots (RAG) : Built an internal employee support  chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
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



  const TimelineView = () => (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 md:left-1/2 h-full w-1 bg-blue-600 transform -translate-x-1/2"></div>
      
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className={`mb-8 flex justify-between items-center w-full ${
            index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
          } flex-col md:right-timeline`}
        >
          <div className="hidden md:block order-1 w-5/12"></div>
          <div className="z-20 flex items-center order-1 bg-blue-600 shadow-xl w-8 h-8 rounded-full">
            <h1 className="mx-auto font-semibold text-lg text-white">{index + 1}</h1>
          </div>
          <motion.div
            className={`order-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4 ${
              index % 2 === 0 ? 'md:text-right' : 'md:text-left'
            }`}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedExperience(exp)}
          >
            <h3 className="mb-3 font-bold text-blue-600 dark:text-blue-400 text-xl">{exp.title}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{exp.company}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{exp.date}</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-snug line-clamp-3">
              {exp.description}
            </p>
            <button className="text-blue-600 dark:text-blue-400 font-bold mt-2 text-sm hover:underline">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )

  const CardView = () => (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative cursor-pointer"
          onClick={() => setSelectedExperience(exp)}
        >
          <div className="absolute top-6 left-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Briefcase className="text-white" size={24} />
          </div>
          <div className="ml-20">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{exp.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{exp.company} | {exp.date}</p>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{exp.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <section id="experience" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-900 dark:text-blue-400">Professional Experience</h2>
        {isMobile ? <CardView /> : <TimelineView />}
      </div>
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExperience?.title}</DialogTitle>
            <DialogDescription>{selectedExperience?.company} | {selectedExperience?.date}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedExperience?.description}</p>
            <h4 className="font-semibold text-lg mb-2">Key Projects:</h4>
            <ul className="list-disc list-inside">
              {selectedExperience?.projects.map((project, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 mb-2">{project}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}