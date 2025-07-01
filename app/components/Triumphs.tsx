"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Calendar, Medal } from "lucide-react"
import Carousel from "./Carousel"
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import ctc from "@/public/images/crack_the_code_JaiHind.jpg"
import feynwick from "@/public/images/FeynwickCertificate.jpg"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"
import trident from "@/public/images/Trident_Tsec.jpg"
// import { FaBullhorn } from "react-icons/fa"

interface TriumphsProps {
  setActiveSection: (section: string) => void
}

export default function Triumphs({ setActiveSection }: TriumphsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection("triumphs")
        }
      },
      { threshold: 0.3 },
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

  const certificates = [
    {
      title: "Certificate Of Achievement - AskPandaAI",
      issuer: "CTO - IIFL Finance Ltd",
      date: "Jun 13th, 2024",
      description:
        "Designed and implemented NLP-powered chatbot for real-time internal employee access to financial data, improving employee support efficiency. Used: Python, Flask, Qdrant(VectorDB), Azure-OpenAI-service, Blob storage,PostgreSQL, Zoho ticketing service, ReactJS.",
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
      date: "Jan 18th - 20th , 2022",
      description:
        "Participated in Intra-College Hacakthon, creating a Healthcare & consulation web app, using MERN stack.",
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

  const certificateCards = certificates.map((cert, index) => (
    <div key={index} className="h-full w-full overflow-hidden">
      <div className="h-full flex flex-col md:flex-row bg-white dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600">
        {/* Left Side - Image with Fixed Aspect Ratio */}
        <div className="md:w-1/2 relative h-64 md:h-full overflow-hidden group">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600">
            <Image
              src={cert.image || "/placeholder.svg"}
              alt={cert.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-2 line-clamp-2">{cert.title}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              {cert.date}
            </div>
          </div>
        </div>

        {/* Right Side - Content with Fixed Height and Scrolling */}
        <div className="md:w-1/2 flex flex-col bg-white dark:bg-gray-700 h-80 md:h-full">
          <div className="p-4 md:p-6 flex-shrink-0">
            <div className="hidden md:block">
              <div className="flex items-center mb-3">
                {cert.isAward ? (
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                    <Medal className="mr-2 h-4 w-4" />
                    Triumph
                  </div>
                ) : (
                  <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    <Award className="mr-2 h-4 w-4" />
                    Certification
                  </div>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2 line-clamp-2">
                {cert.title}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 text-sm">
                <span className="font-medium truncate">{cert.issuer}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center flex-shrink-0">
                  <Calendar className="mr-1 h-4 w-4" />
                  {cert.date}
                </span>
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 custom-scrollbar">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{cert.description}</p>
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <section
      id="triumphs"
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            Triumphs & Certifications
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Carousel items={certificateCards} />
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </section>
  )
}
