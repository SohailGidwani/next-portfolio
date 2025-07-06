"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Briefcase, Calendar, Building, ChevronRight, ExternalLink, Clock, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { useTheme } from "next-themes"
import ScrollAnimation from "./ScrollAnimation"
import ReactDOM from "react-dom"

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
        className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg p-4 pt-2 relative touch-pan-y"
        style={{ minHeight: '60vh', maxHeight: '85vh', overflowY: 'auto', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
        onClick={event => event.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          className="w-16 h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
        <div className="mb-2">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">{experience.title}</h2>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
            <Building size={16} className="mr-2" />
            <span className="font-medium">{experience.company}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{experience.date}</span>
            {experience.isLatest && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Current
              </span>
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
      title: "Full-Stack/AI Developer",
      company: "IIFL Finance Ltd",
      date: "June, 2023 - Present",
      description:
        "Leading AI initiatives and developing cutting-edge machine learning models for various client projects. Mentoring junior developers and contributing to the company's AI research efforts.",
      projects: [
        "Custom Data Chatbots (RAG) : Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
        "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
        "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment, ensuring robust and secure AI solutions.",
      ],
      isLatest: false,
    },
    {
      title: "Web Developer (Intern)",
      company: "Iremfy.com",
      date: "May, 2021 - July, 2021",
      description:
        "Designed and implemented machine learning algorithms for predictive analytics. Collaborated with cross-functional teams to integrate ML solutions into existing products.",
      projects: [
        "Troubleshot and debugged code ensuring compatibility with devices, browsers, and operating systems.",
        "Developed web platform back ends using NodeJS and Flask frameworks. Built APIs and data clients to consume APIs.",
        "Implemented responsive front-end designs using React, showcasing adaptability in learning and applying new technologies.",
      ],
      isLatest: false,
    },
  ]

  // Handle theme detection
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
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
                      onClick={() => setActiveExperience(index)}
                      className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeExperience === index
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                    >
                      {exp.company}
                      {exp.isLatest && (
                          <motion.span 
                            className="absolute -top-1 -right-1 flex h-3 w-3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </motion.span>
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
                        <Building size={18} className="mr-2" />
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
                            <motion.span 
                              className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4, duration: 0.3 }}
                            >
                            <Clock size={12} className="mr-1" />
                            Current
                            </motion.span>
                        )}
                        </motion.div>
                      </div>

                      <motion.button
                        onClick={() => setSelectedExperience(experiences[activeExperience])}
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
                        onClick={() => setSelectedExperience(experiences[activeExperience])}
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
                className="flex justify-start mb-8 overflow-x-auto pb-2 -mx-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
              <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                <div className="flex flex-nowrap">
                  {experiences.map((exp, index) => (
                      <motion.button
                      key={index}
                      onClick={() => setActiveExperience(index)}
                      className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                        activeExperience === index
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                    >
                      {exp.company}
                      {exp.isLatest && (
                          <motion.span 
                            className="absolute -top-1 -right-1 flex h-2 w-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </motion.span>
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
                    <div>
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {experiences[activeExperience].title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {experiences[activeExperience].company}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <span>{experiences[activeExperience].date}</span>
                        {experiences[activeExperience].isLatest && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedExperience(experiences[activeExperience])}
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
                      onClick={() => setSelectedExperience(experiences[activeExperience])}
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
        <DialogContent className="w-full max-w-3xl max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-600 dark:text-blue-400">{selectedExperience?.title}</DialogTitle>
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
              <p className="text-gray-700 dark:text-gray-300">{selectedExperience?.description}</p>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Briefcase className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              Key Points
            </h4>
            <div className="space-y-4">
              {selectedExperience?.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-600 shadow-sm"
                >
                  <p className="text-gray-700 dark:text-gray-300">{project}</p>
                </div>
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
