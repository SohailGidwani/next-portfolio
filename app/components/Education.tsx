"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import ScrollAnimation from './ScrollAnimation'
import { triggerHaptic } from "./ui/haptics"

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
          triggerHaptic(10);
          setActiveSection("education")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
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
    triggerHaptic();
    setExpandedCard(expandedCard === index ? null : index)
  }

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <ScrollAnimation variant="fadeUp" duration={0.6}>
          <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">
            Education
          </h2>
          </div>
        </ScrollAnimation>

        {/* Education Grid */}
        <ScrollAnimation variant="fadeUp" stagger={true} staggerDelay={0.2}>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 ${
                    isDark ? 'bg-gray-800 border-gray-800 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'
                  } hover:shadow-xl`}
                  onClick={() => toggleCard(index)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`p-2 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg md:text-xl text-blue-900 dark:text-blue-400">
                            {edu.degree}
                          </CardTitle>
                          <motion.div 
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            viewport={{ once: true }}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            {edu.location}
                          </motion.div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCard === index ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Institution and Year */}
                    <motion.div 
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {edu.year}
                      </div>
                      <motion.div 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {edu.cgpa}
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {edu.institution}
                    </motion.div>

                    <motion.p 
                      className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      {edu.description}
                    </motion.p>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedCard === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                        >
                          {/* Achievements */}
                          {edu.achievements && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                            >
                              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                <Award className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                Achievements
                                </h4>
                              <div className="space-y-2">
                                {edu.achievements.map((achievement, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                                    className="flex items-start space-x-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement}</p>
                                  </motion.div>
                                ))}
                            </div>
                            </motion.div>
                          )}

                          {/* Courses */}
                          {edu.courses && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                            >
                              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                  Key Courses
                                </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {edu.courses.map((course, idx) => (
                                  <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: 0.4 + idx * 0.02 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                                    } transition-colors duration-200 hover:bg-opacity-80`}
                                  >
                                    {course}
                                  </motion.span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
            </motion.div>
          ))}
        </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}