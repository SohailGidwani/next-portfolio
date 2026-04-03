"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useScrollEngine } from "./scroll/ScrollEngine"

interface EducationItem {
  degree: string
  institution: string
  year: string
  cgpa: string
  location: string
  description: string
  courses: string[]
}

const education: EducationItem[] = [
  {
    degree: "M.S in Computer Science",
    institution: "University of Southern California",
    year: "August 2025 – May 2027",
    cgpa: "GPA — 3.5 / 4.0",
    location: "Los Angeles, CA, USA",
    description:
      "Advanced studies in AI systems, retrieval, and large-scale software engineering.",
    courses: [
      "Analysis of Algorithms",
      "Information Retrieval and Web Search Engines",
      "ML for Data Science",
      "Applied NLP",
    ],
  },
  {
    degree: "B.E in Computer Engineering",
    institution: "University of Mumbai — TSEC",
    year: "Aug 2019 – May 2023",
    cgpa: "CGPA — 9.05 / 10",
    location: "Mumbai, India",
    description:
      "Focus on AI/ML, cloud computing, and full-stack development with strong academic performance.",
    courses: [
      "Artificial Intelligence",
      "Machine Learning",
      "Advanced DBMS",
      "Cloud Computing",
      "Data Structures & Algorithms",
      "Operating Systems",
      "Software Engineering",
      "Object-Oriented Programming",
      "Big Data Analytics",
      "Computer Networks",
      "Cryptography & System Security",
      "Blockchain",
    ],
  },
  {
    degree: "Science — HSC",
    institution: "Jai Hind College, Mumbai",
    year: "2017 – 2019",
    cgpa: "Percentage — 71.38%",
    location: "Mumbai, India",
    description: "Foundation in science and mathematics with early exposure to computer science.",
    courses: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  },
]

export default function Education() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-80px" })

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("education", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative min-h-[80vh] py-32"
    >
      {/* Subtle geometric grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container relative mx-auto px-6" ref={contentRef}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
        >
          Education
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]"
        >
          Structured learning, layered over curiosity.
        </motion.h2>

        <div className="mt-16 space-y-20">
          {education.map((item, index) => (
            <motion.div
              key={item.degree}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
              className="grid gap-8 lg:grid-cols-[1fr_1fr]"
            >
              <div>
                <h3 className="font-display italic text-3xl sm:text-4xl text-white leading-tight">
                  {item.institution}
                </h3>
                <div className="mt-4 space-y-1">
                  <p className="font-body text-sm text-white/50">{item.degree}</p>
                  <p className="font-body text-xs text-white/30">{item.year}</p>
                  <p className="font-body text-xs text-white/30">{item.location}</p>
                </div>
                <div className="mt-3 inline-block glass rounded-full px-3 py-1">
                  <span className="font-mono text-xs text-white/50">{item.cgpa}</span>
                </div>
              </div>

              <div>
                <p className="font-body text-sm text-white/40 leading-relaxed">
                  {item.description}
                </p>

                {item.courses.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 mb-3">
                      Coursework
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.courses.map((course) => (
                        <span
                          key={course}
                          className="glass rounded-full px-3 py-1 font-body text-[11px] text-white/35"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
