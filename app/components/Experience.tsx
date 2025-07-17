"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Briefcase, Calendar, ChevronRight, ExternalLink, X} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { useTheme } from "next-themes"
import ScrollAnimation from "./ScrollAnimation"
import ReactDOM from "react-dom"
import { triggerHaptic } from "./ui/haptics"
import Image, { StaticImageData } from "next/image"
import AskPandaAI from "@/public/images/Insaito.png"
import fullstack from "@/public/images/iifl.png"
import feynwick from "@/public/images/iremify.png"

interface ExperienceProps {
  setActiveSection: (section: string) => void
}

interface ExperienceItem {
  title: string
  company: string
  date: string
  description: string
  projects: string[]
  isLatest?: boolean
  logo: StaticImageData
  companyColor?: string
}

// Add a custom BottomSheetModal component for mobile
function BottomSheetModal({ open, onClose, experience }: { open: boolean, onClose: () => void, experience: ExperienceItem | null }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Handle escape key and back gesture
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    window.history.pushState({ modal: true }, '');
    const handlePopState = () => {
      if (open) onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('popstate', handlePopState);
      if (open) window.history.back();
    };
  }, [open, onClose]);

  // Drag-to-close logic
  const dragThreshold = 100; // px
  function handleDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    if (info.offset.y > dragThreshold) {
      if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
        window.navigator.vibrate(15);
      }
      onClose();
    }
  }

  if (!open || !experience) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, bounce: 0.22 }}
        className="w-full max-w-lg mx-auto bg-white dark:bg-slate-950 rounded-t-2xl shadow-lg p-4 pt-2 relative touch-pan-y"
        style={{ minHeight: '60vh', maxHeight: '85vh', overflowY: 'auto', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
        onClick={event => event.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          className="w-16 h-2.5 bg-gray-300 dark:bg-slate-600 rounded-full mx-auto mb-4 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
        <div className="mb-2">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">{experience.title}</h2>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
            <div className="relative w-4 h-4 rounded-full overflow-hidden bg-white dark:bg-slate-700 mr-2 flex-shrink-0">
              <Image
                src={experience.logo}
                alt={`${experience.company} logo`}
                fill
                className="object-cover"
                sizes="16px"
              />
            </div>
            <span className="font-medium">{experience.company}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{experience.date}</span>
            {experience.isLatest && (
              <motion.span 
                className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    opacity: [1, 0.3, 1],
                    scale: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                ACTIVE
              </motion.span>
            )}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">{experience.description}</p>
        </div>
        <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          <Briefcase className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
          Key Points
        </h4>
        <div className="space-y-3">
          {experience.projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-blue-600 shadow-sm"
            >
              <p className="text-gray-700 dark:text-gray-300 text-xs">{project}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return null;
}

export default function Experience({ setActiveSection }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [activeExperience, setActiveExperience] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  // Handle active section detection - moved before mounted check
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);
          setActiveSection("experience")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px", // Add margin for better detection
      },
    )

    const ref = sectionRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    }
  }, [setActiveSection])

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
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const experiences: ExperienceItem[] = [
    {
      title: "Senior Software Engineer - I ",
      company: "Insaito, Inc.",
      date: "May 12, 2025 - Present",
      description:
        "Building cutting-edge AI agent platforms from scratch, focusing on open-source LLM deployment and integration architecture. Leading the development of comprehensive AI agent builder with extensive third-party app integrations.",
      projects: [
        "AI Agent Builder Platform: Architecting and developing a comprehensive AI agent builder platform from the ground up, enabling users to create sophisticated AI agents with custom workflows and integrations.",
        "Open Source LLM Deployment: Deploying and optimizing open-source large language models including Qwen 3 and Mistral Small 24B 2, ensuring efficient performance and scalability for production environments.",
        "OAuth Integration Architecture: Building robust OAuth functionality for 100+ different applications, enabling seamless authentication and authorization across diverse third-party services and platforms.",
        "MCP Server Development: Creating Model Context Protocol (MCP) servers for integrated applications, making all functions and capabilities available to the AI models for enhanced functionality and user experience.",
        "Full-Stack Development: Handling end-to-end development from backend infrastructure to frontend user interfaces, ensuring cohesive and performant AI agent experiences.",
      ],
      isLatest: true,
      logo: AskPandaAI, // Replace with actual Insaito logo
      companyColor: "from-purple-500 to-pink-500",
    },
    {
      title: "Full-Stack/AI Developer",
      company: "IIFL Finance Ltd",
      date: "June, 2023 - May 12, 2024",
      description:
        "Led AI initiatives and developed cutting-edge machine learning models for various client projects. Mentored junior developers and contributed to the company's AI research efforts.",
      projects: [
        "Custom Data Chatbots (RAG) : Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
        "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
        "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment, ensuring robust and secure AI solutions.",
      ],
      isLatest: false,
      logo: fullstack, // Replace with actual IIFL logo
      companyColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Web Developer (Intern)",
      company: "Iremify.com",
      date: "May, 2021 - July, 2021",
      description:
        "Designed and implemented machine learning algorithms for predictive analytics. Collaborated with cross-functional teams to integrate ML solutions into existing products.",
      projects: [
        "Troubleshot and debugged code ensuring compatibility with devices, browsers, and operating systems.",
        "Developed web platform back ends using NodeJS and Flask frameworks. Built APIs and data clients to consume APIs.",
        "Implemented responsive front-end designs using React, showcasing adaptability in learning and applying new technologies.",
      ],
      isLatest: false,
      logo: feynwick, // Replace with actual Iremfy logo
      companyColor: "from-green-500 to-emerald-500",
    },
  ]

  // Handle theme detection
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimation variant="fadeUp" duration={0.6}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-blue-400" : "text-blue-900"}`}>
            Professional Experience
          </h2>
        </div>
        </ScrollAnimation>

        {/* Desktop View */}
        {!isMobile && mounted && (
          <ScrollAnimation variant="fadeUp" delay={0.2}>
          <div className="hidden md:block max-w-5xl mx-auto">
            {/* Simple Pill Navigation */}
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md overflow-x-auto max-w-full">
                <div className="flex flex-nowrap">
                  {experiences.map((exp, index) => (
                      <motion.button
                      key={index}
                      onClick={() => { triggerHaptic(); setActiveExperience(index); }}
                      className={`relative flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeExperience === index
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                    >
                      {/* Company Logo */}
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                        <Image
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      
                      {/* Company Name */}
                      <span className="font-medium">{exp.company}</span>
                      
                      {/* Enhanced Current Indicator */}
                      {exp.isLatest && (
                          <motion.div 
                            className="flex items-center"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                          >
                             <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.8, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                      )}
                      </motion.button>
                  ))}
                </div>
              </div>
              </motion.div>

            {/* Experience Content */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden min-h-[500px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
              <div className="h-1 bg-blue-600"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExperience}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="p-10"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
                    <div>
                        <motion.h3 
                          className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                        {experiences[activeExperience].title}
                        </motion.h3>

                        <motion.div 
                          className="flex items-center mb-2 text-gray-600 dark:text-gray-400"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                        <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white dark:bg-gray-700 mr-2 flex-shrink-0">
                          <Image
                            src={experiences[activeExperience].logo}
                            alt={`${experiences[activeExperience].company} logo`}
                            fill
                            className="object-cover"
                            sizes="20px"
                          />
                        </div>
                        <span className="font-medium">{experiences[activeExperience].company}</span>
                        </motion.div>

                        <motion.div 
                          className="flex items-center text-gray-600 dark:text-gray-400"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                        <Calendar size={18} className="mr-2" />
                        <span>{experiences[activeExperience].date}</span>
                        {experiences[activeExperience].isLatest && (
                            <motion.div 
                              className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
                            >
                            {/* <motion.div
                              className="relative"
                              animate={{ 
                                scale: [1, 1.3, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Zap size={12} className="text-green-600 dark:text-green-400" />
                            </motion.div> */}
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.8, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                              ACTIVE
                            </span>
                            </motion.div>
                        )}
                        </motion.div>
                      </div>

                      <motion.button
                        onClick={() => { triggerHaptic(); setSelectedExperience(experiences[activeExperience]); }}
                        className="mt-6 lg:mt-0 px-5 py-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm flex items-center self-start"
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        More info <ChevronRight size={16} className="ml-1" />
                      </motion.button>
                    </div>

                    <motion.p 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                    {experiences[activeExperience].description}
                    </motion.p>

                  <div>
                      <motion.h4 
                        className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                      <Briefcase size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                      Key Points
                      </motion.h4>

                      <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                      {experiences[activeExperience].projects.slice(0, 2).map((project, idx) => (
                          <motion.div
                          key={idx}
                          className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border-blue-600"
                            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                        >
                          <p className="text-gray-700 dark:text-gray-300 text-base">
                            {project.length > 180 ? `${project.substring(0, 180)}...` : project}
                          </p>
                          </motion.div>
                      ))}
                      </motion.div>

                    {experiences[activeExperience].projects.length > 2 && (
                        <motion.button
                        onClick={() => { triggerHaptic(); setSelectedExperience(experiences[activeExperience]); }}
                        className="mt-6 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center"
                          whileHover={{ x: 5 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 1.0 }}
                      >
                        More info <ExternalLink size={14} className="ml-1" />
                        </motion.button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              </motion.div>
            </div>
          </ScrollAnimation>
        )}

        {/* Mobile Timeline View */}
        {isMobile && mounted && (
          <ScrollAnimation variant="fadeUp" delay={0.2}>
          <div className="md:hidden">
              <motion.div 
                className="flex justify-center mb-8 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                <div className="flex flex-nowrap gap-1">
                  {experiences.map((exp, index) => (
                      <motion.button
                      key={index}
                      onClick={() => { triggerHaptic(); setActiveExperience(index); }}
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                        activeExperience === index
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                    >
                      {/* Company Name - No logo on mobile */}
                      <span className="text-xs">
                        {exp.company.includes(',') ? exp.company.split(',')[0] : 
                         exp.company.includes('.') ? exp.company.split('.')[0] : exp.company}
                      </span>
                      
                      {/* Mobile Current Indicator */}
                      {exp.isLatest && (
                          <motion.div 
                            className="flex items-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.8, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                      )}
                      </motion.button>
                  ))}
                </div>
              </div>
              </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeExperience}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-1 bg-blue-600"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {experiences[activeExperience].title}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="relative w-4 h-4 rounded-full overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                          <Image
                            src={experiences[activeExperience].logo}
                            alt={`${experiences[activeExperience].company} logo`}
                            fill
                            className="object-cover"
                            sizes="16px"
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {experiences[activeExperience].company}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <span>{experiences[activeExperience].date}</span>
                        {experiences[activeExperience].isLatest && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                            {/* <Zap size={10} className="text-green-600 dark:text-green-400" /> */}
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.8, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            ACTIVE
                          </span>
                          
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { triggerHaptic(); setSelectedExperience(experiences[activeExperience]); }}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {experiences[activeExperience].description}
                  </p>

                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Featured Project:</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                      {experiences[activeExperience].projects[0].length > 120
                        ? `${experiences[activeExperience].projects[0].substring(0, 120)}...`
                        : experiences[activeExperience].projects[0]}
                    </div>
                    <button
                      onClick={() => { triggerHaptic(); setSelectedExperience(experiences[activeExperience]); }}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center"
                    >
                      View more <ChevronRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          </ScrollAnimation>
        )}

        {/* Fallback for when not mounted */}
        {!mounted && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-12 text-blue-900">Professional Experience</h2>
            <div className="bg-white rounded-xl shadow-lg p-10">
              <p className="text-gray-600">Loading experience...</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Project Modal */}
      {!isMobile && (
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent className="w-full max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl text-blue-600 dark:text-blue-400">{selectedExperience?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 dark:text-gray-400">
                <div className="flex items-center mb-1 sm:mb-0">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white dark:bg-gray-700 mr-2 flex-shrink-0">
                    {selectedExperience?.logo && (
                      <Image
                        src={selectedExperience.logo}
                        alt={`${selectedExperience.company} logo`}
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    )}
                  </div>
                  <span className="font-medium">{selectedExperience?.company}</span>
                </div>
                <span className="hidden sm:inline mx-2">•</span>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{selectedExperience?.date}</span>
                  {selectedExperience?.isLatest && (
                    <motion.span 
                      className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ 
                          opacity: [1, 0.3, 1],
                          scale: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        ACTIVE
                      </span>
                    </motion.span>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-6 pr-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedExperience?.description}</p>
            </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center sticky top-0 bg-background py-2 -mx-2 px-2 z-10">
              <Briefcase className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              Key Points ({selectedExperience?.projects.length})
            </h4>
            <div className="space-y-4 pb-4">
              {selectedExperience?.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{project}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      )}
      {isMobile && (
        <AnimatePresence>
          <BottomSheetModal
            open={!!selectedExperience}
            onClose={() => setSelectedExperience(null)}
            experience={selectedExperience}
          />
        </AnimatePresence>
      )}
    </section>
  )
}
