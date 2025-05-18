"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

interface EducationProps {
  setActiveSection: (section: string) => void;
}

export default function Education({ setActiveSection }: EducationProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('education')
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

  const education = [
    {
      degree: "B.E in Computer Engineering",
      institution: "Univeristy of Mumbai - TSEC",
      year: "2019 - 2023",
      cgpa: "CGPA - 9.05/10",
      description: "Coursework: Artificial Intelligence, Machine Learning, Advanced DBMS, Data Structures & Algorithms, Operating Systems, Software Engineering, Cloud Computing, Object Oriented Programming, Big Data Analytics, Computer Networks, Cryptography & System Security, Blockchain."
    },
    {
      degree: "Science - HSC (11th & 12th Grade)",
      institution: "Jai Hind College, Mumbai",
      year: "2017 - 2019",
      cgpa: "Percentage - 71.38%",
      description: "Coursework: Physics, Chemistry, Mathematics, English, Computer Science (Software & Hardware)"
    }
  ]

  return (
    <section id="education" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900 dark:text-blue-400">Education</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full dark:bg-gray-700">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <GraduationCap size={24} className="text-blue-600 dark:text-blue-400" />
                  <CardTitle>{edu.degree}</CardTitle>
                </CardHeader>
                <CardContent>
                 <b> <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{edu.institution} | {edu.year} | {edu.cgpa}</p></b>
                  <p>{edu.description}</p> 
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}