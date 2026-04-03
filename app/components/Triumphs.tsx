"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image, { StaticImageData } from "next/image"
import { useScrollEngine } from "./scroll/ScrollEngine"
import AnimatedCounter from "./AnimatedCounter"
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import ctc from "@/public/images/crack_the_code_JaiHind.jpg"
import feynwick from "@/public/images/FeynwickCertificate.jpg"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"
import trident from "@/public/images/Trident_Tsec.jpg"

interface Certificate {
  title: string
  issuer: string
  date: string
  description: string
  image: StaticImageData
  isAward: boolean
}

const certificates: Certificate[] = [
  {
    title: "Certificate Of Achievement — AskPandaAI",
    issuer: "CTO — IIFL Finance Ltd",
    date: "Jun 13th, 2024",
    description:
      "Designed and implemented NLP-powered chatbot for real-time internal employee access to financial data.",
    image: AskPandaAI,
    isAward: true,
  },
  {
    title: "0-100 Full Stack Web Development Course",
    issuer: "Harkirat Singh",
    date: "Apr 2024",
    description:
      "Mastered full-stack development, backend architecture, DevOps practices, and cloud deployment.",
    image: fullstack,
    isAward: false,
  },
  {
    title: "Tech-a-thon (Hackathon)",
    issuer: "IIFL",
    date: "Oct 6th & 7th, 2023",
    description: "Won 1st prize for an AI-powered customer support chatbot.",
    image: techathon,
    isAward: true,
  },
  {
    title: "Feynwick Certificate",
    issuer: "CSI — KJSIEIT",
    date: "April 24th, 2021",
    description: "Participated in an inter-college coding contest, refining DSA skills.",
    image: feynwick,
    isAward: false,
  },
  {
    title: "Rubix-Hackathon",
    issuer: "CSI — TSEC",
    date: "Jan 18th – 20th, 2022",
    description: "Built a healthcare consultation web app with the MERN stack.",
    image: rubix,
    isAward: true,
  },
  {
    title: "Trident",
    issuer: "Code Cell — TSEC",
    date: "Sept 28, 2019",
    description: "Completed a multi-round coding event focused on speed and complexity.",
    image: trident,
    isAward: true,
  },
  {
    title: "Crack-The-Code",
    issuer: "Dot Com Club, Jai Hind College",
    date: "Nov, 2017",
    description: "Won 2nd prize in a coding contest during 11th grade.",
    image: ctc,
    isAward: true,
  },
]

const stats = [
  { value: 7, suffix: "+", label: "Awards & Certifications" },
  { value: 4, suffix: "+", label: "Hackathon Wins" },
  { value: 3, suffix: "", label: "Research Contributions" },
]

export default function Triumphs() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-80px" })
  const [selected, setSelected] = useState<Certificate | null>(null)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("triumphs", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section id="triumphs" ref={sectionRef} className="relative min-h-[80vh] py-32">
      <div className="container mx-auto px-6" ref={contentRef}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
        >
          Triumphs
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]"
        >
          Certifications and wins that shaped my journey.
        </motion.h2>

        {/* Animated stat counters */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="font-display italic text-5xl sm:text-6xl text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-[10px] font-body font-medium tracking-[0.25em] uppercase text-white/25">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certificate cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.button
              key={cert.title}
              type="button"
              onClick={() => setSelected(cert)}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
              className="group glass rounded-2xl p-4 text-left hover:bg-white/[0.04] transition-colors"
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-body font-medium tracking-[0.25em] uppercase text-white/20">
                  {cert.isAward ? "Award" : "Certificate"}
                </p>
                <h3 className="mt-1 font-display italic text-base text-white leading-snug">
                  {cert.title}
                </h3>
                <p className="mt-1 font-body text-xs text-white/25">{cert.issuer}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail overlay */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-50 bg-[#090909]/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-x-4 bottom-4 top-auto z-50 max-h-[80vh] overflow-hidden rounded-2xl glass-elevated sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div className="relative h-48 w-full">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-contain bg-[#0e0e0e]"
                sizes="(max-width: 640px) 100vw, 448px"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display italic text-xl text-white">{selected.title}</h3>
              <p className="mt-1 font-body text-xs text-white/30">
                {selected.issuer} · {selected.date}
              </p>
              <p className="mt-3 font-body text-sm text-white/40 leading-relaxed">
                {selected.description}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-4 font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
