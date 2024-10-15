"use client"

import { useEffect, useRef } from 'react'
import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion } from 'framer-motion'

interface SkillsProps {
  setActiveSection: (section: string) => void;
}

export default function Skills({ setActiveSection }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('skills')
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

  const skillCategories = [
    {
      category: "Programming Languages",
      skills: ["Python", "JavaScript", "TypeScript", "Java", "C++"]
    },
    {
      category: "Machine Learning / AI",
      skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "NLTK", "HuggingFace Transformers", " spaCy", "OpenCV", "Pandas", "Numpy", "SeaBorn", "Matplotlib"]
    },
    {
      category: "Web Development",
      skills: ["React", "Node.js", "Express", "Next.js", "Django", "Flask"]
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "MySQL", "Vector DBs"]
    },
    {
      category: "Cloud Platforms",
      skills: ["AWS", "Google Cloud Platform", "Azure", "Heroku", "CloudFlare"]
    },
    {
      category: "Tools & Others",
      skills: ["Git", "Docker", "Kubernetes", "CI/CD", "Agile Methodologies", "RESTful APIs", "Bitbucket", "TFS", "Linux", "Serverless Deployments"]
    }
  ]

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900 dark:text-blue-400">Skills</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full dark:bg-gray-700">
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}