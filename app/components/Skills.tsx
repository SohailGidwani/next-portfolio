"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Cloud, Code, Cpu, Database, Globe, PenToolIcon as Tool } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { triggerHaptic } from "./ui/haptics"

interface SkillsProps {
  setActiveSection: (section: string) => void
  onSkillHover?: (skill: string | null) => void
}

interface Skill {
  name: string
  logo?: string
  lightLogo?: string
  darkLogo?: string
  proficiency?: number
}

interface SkillCategory {
  category: string
  description: string
  icon: ReactNode
  skills: Skill[]
  isFocus?: boolean
}

const skillCategories: SkillCategory[] = [
  {
    category: "Machine Learning / AI",
    description: "AI, data science, and model development tools",
    icon: <Cpu className="h-5 w-5" />,
    isFocus: true,
    skills: [
      {
        name: "TensorFlow",
        logo: "/skill-icons/tensorflow.svg",
        proficiency: 5,
      },
      {
        name: "PyTorch",
        logo: "/skill-icons/pytorch.svg",
        proficiency: 4,
      },
      {
        name: "Scikit-learn",
        logo: "/skill-icons/scikit-learn.svg",
        proficiency: 5,
      },
      {
        name: "Keras",
        logo: "/skill-icons/keras.png",
        proficiency: 4,
      },
      {
        name: "OpenCV",
        logo: "/skill-icons/opencv.svg",
        proficiency: 4,
      },
      { name: "NLTK", proficiency: 4 },
      {
        name: "HuggingFace",
        lightLogo: "/skill-icons/huggingface.svg",
        darkLogo: "/skill-icons/huggingface.svg",
        proficiency: 5,
      },
      { name: "spaCy", proficiency: 3 },
      {
        name: "Pandas",
        logo: "/skill-icons/pandas.svg",
        proficiency: 5,
      },
      {
        name: "NumPy",
        logo: "/skill-icons/numpy.svg",
        proficiency: 5,
      },
      {
        name: "Matplotlib",
        logo: "/skill-icons/matplotlib.png",
        proficiency: 4,
      },
      {
        name: "Seaborn",
        logo: "/skill-icons/seaborn.png",
        proficiency: 4,
      },
    ],
  },
  {
    category: "Programming Languages",
    description: "Core languages I use for development",
    icon: <Code className="h-5 w-5" />,
    skills: [
      {
        name: "Python",
        logo: "/skill-icons/python.svg",
        proficiency: 5,
      },
      {
        name: "JavaScript",
        logo: "/skill-icons/javascript.svg",
        proficiency: 3,
      },
      {
        name: "TypeScript",
        logo: "/skill-icons/typescript.svg",
        proficiency: 3,
      },
      {
        name: "Java",
        logo: "/skill-icons/java.svg",
        proficiency: 4,
      },
      {
        name: "C++",
        logo: "/skill-icons/cplusplus.svg",
        proficiency: 3,
      },
    ],
  },
  {
    category: "Web Development",
    description: "Frontend and backend technologies",
    icon: <Globe className="h-5 w-5" />,
    skills: [
      {
        name: "React",
        logo: "/skill-icons/react.svg",
        proficiency: 3,
      },
      {
        name: "Node.js",
        logo: "/skill-icons/nodejs.svg",
        proficiency: 4,
      },
      {
        name: "Express",
        lightLogo: "/skill-icons/express.svg",
        darkLogo: "/skill-icons/express.svg",
        proficiency: 4,
      },
      {
        name: "Next.js",
        lightLogo: "/skill-icons/nextjs.svg",
        darkLogo: "/skill-icons/nextjs.svg",
        proficiency: 3,
      },
      {
        name: "Django",
        lightLogo: "/skill-icons/django.svg",
        darkLogo: "/skill-icons/django.svg",
        proficiency: 4,
      },
      {
        name: "Flask",
        lightLogo: "/skill-icons/flask.svg",
        darkLogo: "/skill-icons/flask.svg",
        proficiency: 5,
      },
    ],
  },
  {
    category: "Databases",
    description: "Database systems and technologies",
    icon: <Database className="h-5 w-5" />,
    skills: [
      {
        name: "PostgreSQL",
        logo: "/skill-icons/postgresql.svg",
        proficiency: 4,
      },
      {
        name: "MongoDB",
        logo: "/skill-icons/mongodb.svg",
        proficiency: 5,
      },
      {
        name: "Redis",
        logo: "/skill-icons/redis.svg",
        proficiency: 3,
      },
      { name: "Elasticsearch", proficiency: 3 },
      {
        name: "MySQL",
        logo: "/skill-icons/mysql.svg",
        proficiency: 4,
      },
      {
        name: "Qdrant",
        logo: "/skill-icons/qdrant.png",
        proficiency: 4,
      },
    ],
  },
  {
    category: "Cloud Platforms",
    description: "Cloud services and platforms",
    icon: <Cloud className="h-5 w-5" />,
    skills: [
      {
        name: "AWS",
        lightLogo:
          "/skill-icons/aws.svg",
        darkLogo:
          "/skill-icons/aws.svg",
        proficiency: 4,
      },
      {
        name: "Google Cloud",
        logo: "/skill-icons/googlecloud.svg",
        proficiency: 4,
      },
      {
        name: "Azure",
        logo: "/skill-icons/azure.svg",
        proficiency: 3,
      },
      {
        name: "Heroku",
        logo: "/skill-icons/heroku.svg",
        proficiency: 5,
      },
      {
        name: "CloudFlare",
        logo: "/skill-icons/cloudflare.png",
        proficiency: 4,
      },
    ],
  },
  {
    category: "Tools & Others",
    description: "Development tools and methodologies",
    icon: <Tool className="h-5 w-5" />,
    skills: [
      {
        name: "Git",
        logo: "/skill-icons/git.svg",
        proficiency: 5,
      },
      {
        name: "N8N",
        logo: "/skill-icons/n8n.svg",
        proficiency: 4,
      },
      {
        name: "Docker",
        logo: "/skill-icons/docker.svg",
        proficiency: 4,
      },
      {
        name: "Kubernetes",
        logo: "/skill-icons/kubernetes.svg",
        proficiency: 3,
      },
      { name: "CI/CD", proficiency: 4 },
      { name: "Agile", proficiency: 5 },
      { name: "RESTful APIs", proficiency: 5 },
      {
        name: "Linux",
        logo: "/skill-icons/linux.svg",
        proficiency: 4,
      },
      {
        name: "Bitbucket",
        logo: "/skill-icons/bitbucket.svg",
        proficiency: 4,
      },
      { name: "TFS", proficiency: 3 },
      { name: "Serverless", proficiency: 4 },
    ],
  },
]

export default function Skills({ setActiveSection, onSkillHover }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("skills")
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

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"

  const getLogoSrc = (skill: Skill) => {
    if (isDark && skill.darkLogo) return skill.darkLogo
    if (!isDark && skill.lightLogo) return skill.lightLogo
    return skill.logo
  }

  const toggleCard = (index: number) => {
    triggerHaptic()
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  const handleSkillHover = (skill: string | null) => {
    onSkillHover?.(skill)
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-16 sm:py-20"
      onMouseLeave={() => handleSkillHover(null)}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Skills</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Building across the full AI and CS spectrum.
          </h2>
          <p className="text-sm text-muted-foreground">
            Hover a skill to spotlight related projects and experience.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((group, index) => {
            const isActive = activeIndex === index
            const previewSkills = group.skills.slice(0, 4)

            return (
              <motion.button
                key={group.category}
                type="button"
                onClick={() => toggleCard(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                aria-expanded={isActive}
                className={`group rounded-3xl border border-border bg-card/80 p-6 text-left shadow-[0_20px_60px_-50px_rgba(0,0,0,0.4)] transition hover:-translate-y-1 ${
                  group.isFocus ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {group.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-foreground">{group.category}</h3>
                      {group.isFocus && (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                          Focus
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>

                {!isActive && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {previewSkills.map((skill) => (
                      <span
                        key={skill.name}
                        onMouseEnter={() => handleSkillHover(skill.name)}
                        onMouseLeave={() => handleSkillHover(null)}
                        className="cursor-pointer rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                      >
                        {skill.name}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">Tap to expand</span>
                  </div>
                )}

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        {group.skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 transition hover:border-primary/30"
                            onMouseEnter={() => handleSkillHover(skill.name)}
                            onMouseLeave={() => handleSkillHover(null)}
                          >
                            <div className="flex items-center gap-2">
                              {getLogoSrc(skill) ? (
                                <Image
                                  src={getLogoSrc(skill) as string}
                                  alt={skill.name}
                                  width={20}
                                  height={20}
                                  className="h-5 w-5"
                                />
                              ) : (
                                <span className="h-5 w-5 rounded-full bg-primary/20" />
                              )}
                              <span className="text-xs font-semibold text-foreground">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, dotIndex) => {
                                const proficiency = skill.proficiency ?? 0
                                return (
                                  <span
                                    key={`${skill.name}-${dotIndex}`}
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      dotIndex < proficiency ? "bg-primary" : "bg-border"
                                    }`}
                                  />
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
