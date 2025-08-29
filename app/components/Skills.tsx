"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Database, Cloud, Cpu, Globe, PenToolIcon as Tool, ChevronDown, ChevronUp, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import ScrollAnimation from "./ScrollAnimation"
import { triggerHaptic } from "./ui/haptics"

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

// Props interface for the Skills component - receives function to update active section
interface SkillsProps {
  setActiveSection: (section: string) => void
}

// Individual skill item structure with optional logo and proficiency level
interface Skill {
  name: string                    // Skill name (e.g., "Python", "React")
  logo?: string                   // Default logo URL for the skill
  lightLogo?: string             // Logo URL for light theme
  darkLogo?: string              // Logo URL for dark theme
  proficiency?: number           // Skill level from 1-5 (1=beginner, 5=expert)
}

// Category structure that groups related skills together
interface SkillCategory {
  category: string               // Category name (e.g., "Programming Languages")
  icon: React.ReactNode         // Lucide icon component for the category
  description: string           // Brief description of what the category contains
  skills: Skill[]               // Array of skills in this category
  accentColor: string           // Border color for light theme
  lightAccentColor: string      // Background color for light theme
  darkAccentColor: string       // Background color for dark theme
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Skills({ setActiveSection }: SkillsProps) {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  const sectionRef = useRef<HTMLElement>(null)                    // Reference to the skills section for intersection observer
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)  // Tracks which category is currently expanded
  const { theme, systemTheme } = useTheme()                       // Theme context from next-themes
  const [mounted, setMounted] = useState(false)                   // Prevents hydration mismatch by waiting for mount

  // ========================================================================
  // INTERSECTION OBSERVER - ACTIVE SECTION DETECTION
  // ========================================================================
  
  // This useEffect sets up an intersection observer to detect when the skills section
  // comes into view and updates the active section in the navbar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);                                    // Provides haptic feedback on mobile
          setActiveSection("skills")                            // Updates navbar to show "skills" as active
        }
      },
      {
        threshold: 0.3,                                         // Triggers when 30% of section is visible
        rootMargin: "-10% 0px -10% 0px",                       // Adds 10% margin for better detection
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)                      // Start observing the skills section
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)                  // Clean up observer on unmount
      }
    }
  }, [setActiveSection])

  // ========================================================================
  // MOUNTED STATE MANAGEMENT
  // ========================================================================
  
  // Prevents hydration mismatch by ensuring component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // ========================================================================
  // THEME DETERMINATION
  // ========================================================================
  
  // Determines the current theme (light/dark) for conditional styling
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  // ========================================================================
  // SKILL CATEGORIES DATA STRUCTURE
  // ========================================================================
  
  // This array defines all skill categories and their associated skills
  // Each category has its own color scheme, icon, and list of skills
  const skillCategories: SkillCategory[] = [
    {
      category: "Programming Languages",                        // Category header
      icon: <Code className="w-5 h-5" />,                      // Lucide icon component
      description: "Core languages I use for development",      // Category description
      accentColor: "border-blue-500",                          // Light theme border color
      lightAccentColor: "bg-blue-500",                         // Light theme background color
      darkAccentColor: "bg-blue-400",                          // Dark theme background color
      skills: [                                                 // Array of skills in this category
        {
          name: "Python",                                       // Skill name
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", // Skill logo URL
          proficiency: 5,                                       // Proficiency level (1-5)
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
      category: "Machine Learning / AI",                       // Second category
      icon: <Cpu className="w-5 h-5" />,                       // CPU icon for AI/ML
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
        { name: "Keras",
          logo: "https://logo.svgcdn.com/d/keras-original.png",
          proficiency: 4 },
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
        { name: "Matplotlib",
          logo: "https://logo.svgcdn.com/l/matplotlib-icon.png",
          proficiency: 4 },
        { name: "Seaborn", 
          logo: "https://logo.svgcdn.com/l/seaborn-icon.png",
          proficiency: 4 },
      ],
    },
    {
      category: "Web Development",                              // Third category
      icon: <Globe className="w-5 h-5" />,                     // Globe icon for web dev
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
          darkLogo: "https://cdn.simpleicons.org/express/ffffff",
          proficiency: 4,
        },
        {
          name: "Next.js",
          lightLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
          darkLogo: "https://cdn.simpleicons.org/next.js/ffffff",
          proficiency: 3,
        },
        {
          name: "Django",
          lightLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
          darkLogo: "https://cdn.simpleicons.org/django/ffffff",
          proficiency: 4,
        },
        {
          name: "Flask",
          lightLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
          darkLogo: "https://cdn.simpleicons.org/flask/ffffff",
          proficiency: 5,
        },
      ],
    },
    {
      category: "Databases",                                    // Fourth category
      icon: <Database className="w-5 h-5" />,                   // Database icon
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
        { name: "Qdrant", 
          logo: "https://logo.svgcdn.com/l/qdrant-icon.png",
          proficiency: 4 },
      ],
    },
    {
      category: "Cloud Platforms",                              // Fifth category
      icon: <Cloud className="w-5 h-5" />,                      // Cloud icon
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
        { name: "CloudFlare",
          logo: "https://logo.svgcdn.com/d/cloudflare-original.png",
          proficiency: 4 },
      ],
    },
    {
      category: "Tools & Others",                               // Sixth category
      icon: <Tool className="w-5 h-5" />,                       // Tool icon
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
          name: "N8N",
          logo: "https://cdn.simpleicons.org/n8n/ea4b71",
          proficiency: 4,

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

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  // Toggles the expanded state of a category when clicked
  // If the same category is clicked again, it collapses
  const toggleCategory = (index: number) => {
    triggerHaptic();                                            // Provides haptic feedback
    setExpandedCategory(expandedCategory === index ? null : index)  // Toggle expansion state
  }

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================
  
  // Renders proficiency level indicators as small colored bars
  // Creates 5 bars where filled bars represent the skill level
  const renderProficiency = (level = 3) => {
    return (
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (                          // Creates array of 5 elements
          <div
            key={i}
            className={`w-1 h-2 rounded-sm ${
              i < level ? (isDark ? "bg-blue-400" : "bg-blue-500") : isDark ? "bg-slate-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  // Determines which logo to display based on current theme
  // Prioritizes theme-specific logos, falls back to default logo
  const getLogoSrc = (skill: Skill) => {
    if (isDark && skill.darkLogo) return skill.darkLogo          // Dark theme logo
    if (!isDark && skill.lightLogo) return skill.lightLogo      // Light theme logo
    return skill.logo                                            // Default logo
  }

  // ========================================================================
  // RENDER SECTION
  // ========================================================================
  
  return (
    <section
      id="skills"                                               // Section ID for navigation and intersection observer
      ref={sectionRef}                                          // Reference for intersection observer
      className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300"  // Styling with theme support
    >
      <div className="container mx-auto px-4">
        {/* ========================================================================
            SECTION HEADER - "Skills" title with fade-up animation
        ======================================================================== */}
        <ScrollAnimation variant="fadeUp" duration={0.6}>
          <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-blue-400" : "text-blue-900"}`}>
            Skills
          </h2>
          </div>
        </ScrollAnimation>

        {/* ========================================================================
            SKILL CATEGORIES GRID - Main content area with staggered animations
        ======================================================================== */}
        <ScrollAnimation variant="fadeUp" stagger={true} staggerDelay={0.1}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* Maps through each skill category and renders a card */}
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.category}
                whileHover={{ y: -5, scale: 1.02 }}            // Hover animation: lifts card and scales slightly
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* ========================================================================
                  INDIVIDUAL CATEGORY CARD - Each category gets its own card
              ======================================================================== */}
              <Card
                className={`overflow-hidden border w-full cursor-pointer transition-all duration-300 ${
                  isDark
                    ? "bg-slate-800 border-slate-600 hover:border-blue-500"      // Dark theme styling
                    : "bg-white border-gray-200 hover:border-blue-300"           // Light theme styling
                } hover:shadow-lg ${
                  expandedCategory === index
                    ? `border-l-4 ${
                        isDark
                          ? "border-l-" + category.darkAccentColor.split("-").pop()    // Left border when expanded (dark)
                          : "border-l-" + category.lightAccentColor.split("-").pop()   // Left border when expanded (light)
                      }`
                    : ""
                } ${expandedCategory !== index ? "min-h-[220px]" : ""}`}        // Minimum height when collapsed
              >
                {/* ========================================================================
                    CARD HEADER - Category title, icon, and expand/collapse button
                ======================================================================== */}
                <CardHeader className="pb-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(index)}                           // Click handler for expansion
                  >
                    <div className="flex items-center">
                        {/* Category Icon with hover animation */}
                        <motion.div
                        className={`p-2 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-100"} mr-3 ${
                          expandedCategory === index ? (isDark ? "text-blue-400" : "text-blue-600") : ""
                        }`}
                          whileHover={{ scale: 1.1, rotate: 5 }}                   // Icon hover effects
                          transition={{ duration: 0.2 }}
                      >
                        {category.icon}
                        </motion.div>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                      </div>
                      
                      {/* Expand/Collapse Button with animated chevron */}
                      <motion.button
                      className={`p-1 rounded-full ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      } transition-colors duration-200`}
                      aria-label={expandedCategory === index ? "Collapse" : "Expand"}
                        whileHover={{ scale: 1.1 }}                               // Button hover effect
                        whileTap={{ scale: 0.95 }}                               // Button click effect
                    >
                        {/* Animated chevron that rotates between up/down */}
                        <AnimatePresence mode="wait">
                      {expandedCategory === index ? (
                            <motion.div
                              key="up"
                              initial={{ rotate: -90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: 90, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                        <ChevronUp className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                            </motion.div>
                      ) : (
                            <motion.div
                              key="down"
                              initial={{ rotate: 90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: -90, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                        <ChevronDown className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                            </motion.div>
                      )}
                        </AnimatePresence>
                      </motion.button>
                  </div>
                  
                  {/* Category Description */}
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-2 pl-11`}>
                    {category.description}
                  </p>
                </CardHeader>

                {/* ========================================================================
                    CARD CONTENT - Skills list (expanded) or skill tags (collapsed)
                ======================================================================== */}
                <CardContent>
                  {/* ========================================================================
                      EXPANDED VIEW - Shows detailed skill grid with logos and proficiency
                  ======================================================================== */}
                  <AnimatePresence>
                    {expandedCategory === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}                        // Start collapsed
                        animate={{ height: "auto", opacity: 1 }}                   // Expand to full height
                        exit={{ height: 0, opacity: 0 }}                          // Collapse on exit
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                          {/* Skills Grid - 2-3 columns depending on screen size */}
                          <motion.div 
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            {/* Maps through each skill in the category */}
                            {category.skills.map((skill, skillIndex) => (
                              <motion.div
                              key={skill.name}
                                initial={{ opacity: 0, scale: 0.8 }}              // Start small and invisible
                                animate={{ opacity: 1, scale: 1 }}                // Animate to full size
                                transition={{ delay: 0.3 + skillIndex * 0.05, duration: 0.3 }}  // Staggered animation
                                whileHover={{ scale: 1.05, y: -2 }}             // Hover effect
                              className={`p-2 rounded-lg border ${
                                isDark
                  ? "border-slate-600 bg-slate-800/50 hover:border-blue-500"     // Dark theme skill card
                                  : "border-gray-200 bg-white hover:border-blue-300"  // Light theme skill card
                              } flex flex-col items-center justify-center text-center transition-colors duration-200`}
                            >
                              {/* Skill Logo or Fallback Icon */}
                              {getLogoSrc(skill) ? (
                                  <motion.div
                                  className={`w-6 h-6 mb-2 flex items-center justify-center ${
                                    isDark ? "bg-gray-700 rounded-full p-1" : ""
                                  }`}
                                    whileHover={{ rotate: 360 }}                  // Logo rotation on hover
                                    transition={{ duration: 0.6 }}
                                >
                                  <img
                                    src={getLogoSrc(skill) || "/placeholder.svg"}
                                    alt={skill.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                  </motion.div>
                              ) : (
                                  // Fallback icon when no logo is available
                                  <motion.div
                                  className={`w-6 h-6 mb-2 rounded-full ${
                                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                                  } flex items-center justify-center`}
                                    whileHover={{ scale: 1.2 }}
                                >
                                  <Zap className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                                  </motion.div>
                              )}
                              
                              {/* Skill Name */}
                              <span
                                className={`text-xs font-medium truncate w-full mb-1 ${
                                  isDark ? "text-gray-200" : "text-gray-800"
                                }`}
                              >
                                {skill.name}
                              </span>
                              
                              {/* Proficiency Level Indicators */}
                              {renderProficiency(skill.proficiency)}
                              </motion.div>
                          ))}
                          </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ========================================================================
                      COLLAPSED VIEW - Shows skill names as small tags
                  ======================================================================== */}
                  {expandedCategory !== index && (
                      <motion.div 
                        className="flex flex-wrap gap-1.5 mt-2 pl-11"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                      {/* Maps through skills and renders them as small tag pills */}
                      {category.skills.map((skill, skillIndex) => (
                          <motion.span
                          key={skillIndex}
                            initial={{ opacity: 0, scale: 0.8 }}                  // Start small and invisible
                            animate={{ opacity: 1, scale: 1 }}                    // Animate to full size
                            transition={{ delay: skillIndex * 0.02, duration: 0.2 }}  // Very fast staggered animation
                            whileHover={{ scale: 1.1 }}                          // Hover effect
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                          } transition-colors duration-200 hover:bg-opacity-80`}
                        >
                          {skill.name}
                          </motion.span>
                      ))}
                      </motion.div>
                  )}
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
