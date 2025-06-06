"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Database, Cloud, Cpu, Globe, PenToolIcon as Tool, ChevronDown, ChevronUp, Zap } from "lucide-react"
import { useTheme } from "next-themes"

interface SkillsProps {
  setActiveSection: (section: string) => void
}

interface Skill {
  name: string
  logo?: string
  lightLogo?: string
  darkLogo?: string
  proficiency?: number // 1-5 scale
}

interface SkillCategory {
  category: string
  icon: React.ReactNode
  description: string
  skills: Skill[]
  accentColor: string
  lightAccentColor: string
  darkAccentColor: string
}

export default function Skills({ setActiveSection }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Handle active section detection - moved before mounted check
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection("skills")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px", // Added for better detection
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

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  const skillCategories: SkillCategory[] = [
    {
      category: "Programming Languages",
      icon: <Code className="w-5 h-5" />,
      description: "Core languages I use for development",
      accentColor: "border-blue-500",
      lightAccentColor: "bg-blue-500",
      darkAccentColor: "bg-blue-400",
      skills: [
        {
          name: "Python",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
          proficiency: 5,
        },
        {
          name: "JavaScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          proficiency: 3,
        },
        {
          name: "TypeScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
          proficiency: 3,
        },
        {
          name: "Java",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
          proficiency: 4,
        },
        {
          name: "C++",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
          proficiency: 3,
        },
      ],
    },
    {
      category: "Machine Learning / AI",
      icon: <Cpu className="w-5 h-5" />,
      description: "AI and data science technologies",
      accentColor: "border-purple-500",
      lightAccentColor: "bg-purple-500",
      darkAccentColor: "bg-purple-400",
      skills: [
        {
          name: "TensorFlow",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
          proficiency: 5,
        },
        {
          name: "PyTorch",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
          proficiency: 4,
        },
        {
          name: "Scikit-learn",
          logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
          proficiency: 5,
        },
        { name: "Keras", proficiency: 4 },
        {
          name: "OpenCV",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
          proficiency: 4,
        },
        { name: "NLTK", proficiency: 4 },
        {
          name: "HuggingFace",
          lightLogo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
          darkLogo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
          proficiency: 5,
        },
        { name: "spaCy", proficiency: 3 },
        {
          name: "Pandas",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
          proficiency: 5,
        },
        {
          name: "NumPy",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
          proficiency: 5,
        },
        { name: "Matplotlib", proficiency: 4 },
        { name: "Seaborn", proficiency: 4 },
      ],
    },
    {
      category: "Web Development",
      icon: <Globe className="w-5 h-5" />,
      description: "Frontend and backend technologies",
      accentColor: "border-green-500",
      lightAccentColor: "bg-green-500",
      darkAccentColor: "bg-green-400",
      skills: [
        {
          name: "React",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          proficiency: 3,
        },
        {
          name: "Node.js",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
          proficiency: 4,
        },
        {
          name: "Express",
          lightLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
          darkLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg",
          proficiency: 4,
        },
        {
          name: "Next.js",
          lightLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
          darkLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg",
          proficiency: 3,
        },
        {
          name: "Django",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
          proficiency: 4,
        },
        {
          name: "Flask",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
          proficiency: 5,
        },
      ],
    },
    {
      category: "Databases",
      icon: <Database className="w-5 h-5" />,
      description: "Database systems and technologies",
      accentColor: "border-amber-500",
      lightAccentColor: "bg-amber-500",
      darkAccentColor: "bg-amber-400",
      skills: [
        {
          name: "PostgreSQL",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
          proficiency: 4,
        },
        {
          name: "MongoDB",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
          proficiency: 5,
        },
        {
          name: "Redis",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
          proficiency: 3,
        },
        { name: "Elasticsearch", proficiency: 3 },
        {
          name: "MySQL",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
          proficiency: 4,
        },
        { name: "Vector DBs", proficiency: 4 },
      ],
    },
    {
      category: "Cloud Platforms",
      icon: <Cloud className="w-5 h-5" />,
      description: "Cloud services and platforms",
      accentColor: "border-sky-500",
      lightAccentColor: "bg-sky-500",
      darkAccentColor: "bg-sky-400",
      skills: [
        {
          name: "AWS",
          lightLogo:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
          darkLogo:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
          proficiency: 4,
        },
        {
          name: "Google Cloud",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
          proficiency: 4,
        },
        {
          name: "Azure",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
          proficiency: 3,
        },
        {
          name: "Heroku",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg",
          proficiency: 5,
        },
        { name: "CloudFlare", proficiency: 4 },
      ],
    },
    {
      category: "Tools & Others",
      icon: <Tool className="w-5 h-5" />,
      description: "Development tools and methodologies",
      accentColor: "border-gray-500",
      lightAccentColor: "bg-gray-500",
      darkAccentColor: "bg-gray-400",
      skills: [
        {
          name: "Git",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
          proficiency: 5,
        },
        {
          name: "Docker",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
          proficiency: 4,
        },
        {
          name: "Kubernetes",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
          proficiency: 3,
        },
        { name: "CI/CD", proficiency: 4 },
        { name: "Agile", proficiency: 5 },
        { name: "RESTful APIs", proficiency: 5 },
        {
          name: "Linux",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
          proficiency: 4,
        },
        {
          name: "Bitbucket",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
          proficiency: 4,
        },
        { name: "TFS", proficiency: 3 },
        { name: "Serverless", proficiency: 4 },
      ],
    },
  ]

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index)
  }

  // Function to render skill proficiency indicators
  const renderProficiency = (level = 3) => {
    return (
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-2 rounded-sm ${
              i < level ? (isDark ? "bg-blue-400" : "bg-blue-500") : isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  // Get the appropriate logo based on theme
  const getLogoSrc = (skill: Skill) => {
    if (isDark && skill.darkLogo) return skill.darkLogo
    if (!isDark && skill.lightLogo) return skill.lightLogo
    return skill.logo
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`py-16 md:py-20 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-blue-400" : "text-blue-900"}`}>
            Skills
          </h2>
        </motion.div>

        {/* Show content regardless of mounted state, but with fallback styling */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                className={`h-full overflow-hidden border ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } hover:shadow-md transition-all duration-300 ${
                  expandedCategory === index
                    ? `border-l-4 ${
                        isDark
                          ? "border-l-" + category.darkAccentColor.split("-").pop()
                          : "border-l-" + category.lightAccentColor.split("-").pop()
                      }`
                    : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(index)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"} mr-3 ${
                          expandedCategory === index ? (isDark ? "text-blue-400" : "text-blue-600") : ""
                        }`}
                      >
                        {category.icon}
                      </div>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </div>
                    <button
                      className={`p-1 rounded-full ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      } transition-colors duration-200`}
                      aria-label={expandedCategory === index ? "Collapse" : "Expand"}
                    >
                      {expandedCategory === index ? (
                        <ChevronUp className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                      ) : (
                        <ChevronDown className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </button>
                  </div>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-2 pl-11`}>
                    {category.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <AnimatePresence>
                    {expandedCategory === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                          {category.skills.map((skill) => (
                            <div
                              key={skill.name}
                              className={`p-2 rounded-lg border ${
                                isDark
                                  ? "border-gray-700 bg-gray-800/50 hover:border-blue-500"
                                  : "border-gray-200 bg-white hover:border-blue-300"
                              } flex flex-col items-center justify-center text-center transition-colors duration-200`}
                            >
                              {getLogoSrc(skill) ? (
                                <div
                                  className={`w-6 h-6 mb-2 flex items-center justify-center ${
                                    isDark ? "bg-gray-700 rounded-full p-1" : ""
                                  }`}
                                >
                                  <img
                                    src={getLogoSrc(skill) || "/placeholder.svg"}
                                    alt={skill.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`w-6 h-6 mb-2 rounded-full ${
                                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                                  } flex items-center justify-center`}
                                >
                                  <Zap className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                                </div>
                              )}
                              <span
                                className={`text-xs font-medium truncate w-full mb-1 ${
                                  isDark ? "text-gray-200" : "text-gray-800"
                                }`}
                              >
                                {skill.name}
                              </span>
                              {renderProficiency(skill.proficiency)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {expandedCategory !== index && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pl-11">
                      {category.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                          } transition-colors duration-200 hover:bg-opacity-80`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
