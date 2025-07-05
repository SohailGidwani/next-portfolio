"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'

interface EducationProps {
  setActiveSection: (section: string) => void;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
  description: string;
  location?: string;
  achievements?: string[];
  courses?: string[];
}

export default function Education({ setActiveSection }: EducationProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('education')
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

  const education: EducationItem[] = [
    {
      degree: "B.E in Computer Engineering",
      institution: "University of Mumbai - TSEC",
      year: "2019 - 2023",
      cgpa: "CGPA - 9.05/10",
      location: "Mumbai, India",
      description: "Comprehensive computer engineering program with focus on modern software development and AI/ML technologies.",
      achievements: [
        "Graduated with distinction (CGPA: 9.05/10)",
        "Active participation in technical events and hackathons",
        "Completed capstone project in AI/ML domain"
      ],
      courses: [
        "Artificial Intelligence", "Machine Learning", "Advanced DBMS", 
        "Data Structures & Algorithms", "Operating Systems", "Software Engineering", 
        "Cloud Computing", "Object Oriented Programming", "Big Data Analytics", 
        "Computer Networks", "Cryptography & System Security", "Blockchain"
      ]
    },
    {
      degree: "Science - HSC (11th & 12th Grade)",
      institution: "Jai Hind College, Mumbai",
      year: "2017 - 2019",
      cgpa: "Percentage - 71.38%",
      location: "Mumbai, India",
      description: "Higher secondary education with focus on science and mathematics, laying foundation for engineering studies.",
      achievements: [
        "Secured 71.38% in HSC examinations",
        "Strong foundation in Physics, Chemistry, and Mathematics",
        "Early exposure to Computer Science concepts"
      ],
      courses: [
        "Physics", "Chemistry", "Mathematics", "English", 
        "Computer Science (Software & Hardware)"
      ]
    }
  ]

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">
            Education
          </h2>
        </motion.div>

        {/* Education Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 ${
                    isDark ? 'bg-gray-800 border-gray-800 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'
                  } hover:shadow-lg`}
                  onClick={() => toggleCard(index)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg md:text-xl text-blue-900 dark:text-blue-400">
                            {edu.degree}
                          </CardTitle>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {edu.location}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCard === index ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Institution and Year */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {edu.year}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {edu.cgpa}
                      </div>
                    </div>

                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {edu.institution}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {edu.description}
                    </p>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedCard === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                        >
                          {/* Achievements */}
                          {edu.achievements && (
                            <div>
                              <div className="flex items-center mb-3">
                                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  Key Achievements
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {edu.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                      isDark ? 'bg-blue-400' : 'bg-blue-600'
                                    }`}></div>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Courses */}
                          {edu.courses && (
                            <div>
                              <div className="flex items-center mb-3">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  Key Courses
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {edu.courses.map((course, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 text-xs rounded-md ${
                                      isDark 
                                        ? 'bg-gray-600 text-gray-200' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}