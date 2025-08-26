"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, PanInfo } from "framer-motion"
import { Award, Calendar, Medal, ChevronLeft, ChevronRight, X, Building } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import ctc from "@/public/images/crack_the_code_JaiHind.jpg"
import feynwick from "@/public/images/FeynwickCertificate.jpg"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"
import trident from "@/public/images/Trident_Tsec.jpg"
import { triggerHaptic } from "./ui/haptics"
import ReactDOM from "react-dom"
import { StaticImageData } from "next/image"

interface TriumphsProps {
  setActiveSection: (section: string) => void
}

interface Certificate {
  title: string
  issuer: string
  date: string
  description: string
  image: StaticImageData
  isAward: boolean
}

// Mobile Bottom Sheet Modal
function BottomSheetModal({ open, onClose, certificate }: { open: boolean, onClose: () => void, certificate: Certificate | null }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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

  const dragThreshold = 100;
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

  if (!open || !certificate) return null;

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
        style={{ minHeight: '60vh', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={event => event.stopPropagation()}
      >
        <div className="w-16 h-2.5 bg-gray-300 dark:bg-slate-600 rounded-full mx-auto mb-4 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {certificate.isAward ? (
              <Medal className="w-5 h-5 text-yellow-500" />
            ) : (
              <Award className="w-5 h-5 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {certificate.isAward ? 'Achievement' : 'Certificate'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{certificate.title}</h2>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <Building size={16} className="mr-2" />
            <span className="font-medium">{certificate.issuer}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{certificate.date}</span>
          </div>
        </div>
        
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{certificate.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return null;
}

export default function Triumphs({ setActiveSection }: TriumphsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);
          setActiveSection("triumphs")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    const ref = sectionRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    }
  }, [setActiveSection])

  // Set mounted state
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



  const certificates = [
    {
      title: "Certificate Of Achievement - AskPandaAI",
      issuer: "CTO - IIFL Finance Ltd",
      date: "Jun 13th, 2024",
      description:
        "Designed and implemented NLP-powered chatbot for real-time internal employee access to financial data, improving employee support efficiency.",
      image: AskPandaAI,
      isAward: true,
    },
    {
      title: "0-100 Full Stack Web Development Course",
      issuer: "Harkirat Singh",
      date: "Apr 2024",
      description:
        "Mastered full-stack web development, including frontend frameworks, backend architecture, databases, DevOps practices, and cloud deployment.",
      image: fullstack,
      isAward: false,
    },
    {
      title: "Tech-a-thon (Hackathon)",
      issuer: "IIFL",
      date: "Oct 6th & 7th, 2023",
      description: "Won 1st prize for making AI-powered Customer support chatbot",
      image: techathon,
      isAward: true,
    },
    {
      title: "Feynwick Certificate",
      issuer: "CSI - KJSIEIT",
      date: "April 24th, 2021",
      description: "Participated in an Inter-College code contest, brushing up DSA skills.",
      image: feynwick,
      isAward: false,
    },
    {
      title: "Rubix-Hackathon",
      issuer: "CSI - TSEC",
      date: "Jan 18th - 20th, 2022",
      description:
        "Participated in Intra-College Hackathon, creating a Healthcare & consultation web app, using MERN stack.",
      image: rubix,
      isAward: true,
    },
    {
      title: "Trident",
      issuer: "Code Cell - TSEC",
      date: "Sept 28, 2019",
      description:
        "Participated in a code event which had 3 rounds, 1.Blind-code, 2.Pattern problem & 3.Complexity based.",
      image: trident,
      isAward: true,
    },
    {
      title: "Crack-The-Code",
      issuer: "Dot Com Club, Jai Hind College",
      date: "Nov, 2017",
      description: "Won 2nd prize at a coding contest in my 11th grade.",
      image: ctc,
      isAward: true,
    },
  ]



  const openModal = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    triggerHaptic()
  }

  const closeModal = () => {
    setSelectedCertificate(null)
  }

  if (!mounted) {
    return null
  }

  return (
    <section id="triumphs" ref={sectionRef} className="py-16 md:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            Triumphs & Certifications
          </h2>

        </motion.div>

        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 group/card snap-start"
              >
                <div 
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-slate-600 h-full cursor-pointer"
                  onClick={() => openModal(cert)}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    
                    {/* Award Badge */}
                    {cert.isAward && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Award
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {cert.isAward ? (
                        <Medal className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Award className="w-5 h-5 text-blue-500" />
                      )}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {cert.isAward ? 'Achievement' : 'Certificate'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {cert.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {cert.issuer}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {cert.date}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator for all devices */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:block">Scroll to explore • Click for details</span>
            <span className="md:hidden">Swipe to explore • Tap for details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Modal for Desktop and Mobile */}
      {isMobile ? (
        <BottomSheetModal 
          open={selectedCertificate !== null} 
          onClose={closeModal} 
          certificate={selectedCertificate} 
        />
      ) : (
        <Dialog open={selectedCertificate !== null} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                {selectedCertificate?.isAward ? (
                  <Medal className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Award className="w-5 h-5 text-blue-500" />
                )}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {selectedCertificate?.isAward ? 'Achievement' : 'Certificate'}
                </span>
              </div>
              <DialogTitle className="text-left">{selectedCertificate?.title}</DialogTitle>
              <DialogDescription className="text-left">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <Building size={16} className="mr-2" />
                  <span className="font-medium">{selectedCertificate?.issuer}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  <span>{selectedCertificate?.date}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            {selectedCertificate && (
              <div className="space-y-6">
                <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    fill
                    className="object-contain bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCertificate.description}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
