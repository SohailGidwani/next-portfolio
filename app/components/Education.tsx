"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, GraduationCap, MapPin } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

interface EducationProps {
  setActiveSection: (section: string) => void
}

interface EducationItem {
  degree: string
  institution: string
  year: string
  cgpa: string
  description: string
  location?: string
  achievements?: string[]
  courses?: string[]
}

const education: EducationItem[] = [
  {
    degree: "M.S in Computer Science",
    institution: "University of Southern California",
    year: "August 2025 - Present",
    cgpa: "/",
    location: "Los Angeles, CA, USA",
    description: "Advanced studies in AI systems, retrieval, and large-scale software engineering.",
    achievements: ["Admitted to the USC Viterbi School of Engineering"],
    courses: ["Analysis of Algorithms", "Information Retrieval and Web Search Engines"],
  },
  {
    degree: "B.E in Computer Engineering",
    institution: "University of Mumbai - TSEC",
    year: "2019 - 2023",
    cgpa: "CGPA - 9.05/10",
    location: "Mumbai, India",
    description:
      "Focus on AI/ML, cloud computing, and full-stack development with strong academic performance.",
    achievements: [
      "Graduated with distinction (CGPA: 9.05/10)",
      "Capstone project in AI/ML domain",
    ],
    courses: ["Artificial Intelligence", "Machine Learning", "Advanced DBMS", "Cloud Computing"],
  },
  {
    degree: "Science - HSC",
    institution: "Jai Hind College, Mumbai",
    year: "2017 - 2019",
    cgpa: "Percentage - 71.38%",
    location: "Mumbai, India",
    description: "Foundation in science and mathematics with early exposure to computer science.",
    achievements: ["Secured 71.38% in HSC examinations"],
    courses: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  },
]

export default function Education({ setActiveSection }: EducationProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("education")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [setActiveSection])

  return (
    <section id="education" ref={sectionRef} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Education</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Structured learning, layered over curiosity.
          </h2>
        </motion.div>

        <div className="mt-10 space-y-8 border-l border-border pl-6">
          {education.map((item, index) => (
            <motion.div
              key={item.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <span className="absolute -left-[34px] top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
              </span>
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.4)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-foreground">{item.degree}</h3>
                    <p className="text-sm text-muted-foreground">{item.institution}</p>
                  </div>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {item.cgpa}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {item.year}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {item.location}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>

                {item.achievements && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                )}

                {item.courses && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.courses.map((course) => (
                      <span
                        key={course}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {course}
                      </span>
                    ))}
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
