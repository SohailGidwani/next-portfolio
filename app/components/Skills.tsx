"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  PenToolIcon as Tool,
  Type,
  FileText,
  Search,
  RefreshCcw,
  Users,
  Network,
  GitMerge,
  Zap,
} from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useSkillHighlight } from "./SkillHighlightProvider"

interface Skill {
  name: string
  logo?: string
  lightLogo?: string
  darkLogo?: string
  icon?: ReactNode
  proficiency?: number
}

interface SkillCategory {
  category: string
  icon: ReactNode
  skills: Skill[]
  isFocus?: boolean
}

const skillCategories: SkillCategory[] = [
  {
    category: "Machine Learning / AI",
    icon: <Cpu className="h-4 w-4" />,
    isFocus: true,
    skills: [
      { name: "TensorFlow", logo: "/skill-icons/tensorflow.svg", proficiency: 5 },
      { name: "PyTorch", logo: "/skill-icons/pytorch.svg", proficiency: 4 },
      { name: "Scikit-learn", logo: "/skill-icons/scikit-learn.svg", proficiency: 5 },
      { name: "Keras", logo: "/skill-icons/keras.png", proficiency: 4 },
      { name: "OpenCV", logo: "/skill-icons/opencv.svg", proficiency: 4 },
      { name: "NLTK", icon: <Type className="h-4 w-4" />, proficiency: 4 },
      { name: "HuggingFace", lightLogo: "/skill-icons/huggingface.svg", darkLogo: "/skill-icons/huggingface.svg", proficiency: 5 },
      { name: "spaCy", icon: <FileText className="h-4 w-4" />, proficiency: 3 },
      { name: "Pandas", logo: "/skill-icons/pandas.svg", proficiency: 5 },
      { name: "NumPy", logo: "/skill-icons/numpy.svg", proficiency: 5 },
      { name: "Matplotlib", logo: "/skill-icons/matplotlib.png", proficiency: 4 },
      { name: "Seaborn", logo: "/skill-icons/seaborn.png", proficiency: 4 },
      { name: "MCP", icon: <Network className="h-4 w-4" />, proficiency: 4 },
      { name: "LLMOps", icon: <RefreshCcw className="h-4 w-4" />, proficiency: 4 },
    ],
  },
  {
    category: "Programming Languages",
    icon: <Code className="h-4 w-4" />,
    skills: [
      { name: "Python", logo: "/skill-icons/python.svg", proficiency: 5 },
      { name: "JavaScript", logo: "/skill-icons/javascript.svg", proficiency: 3 },
      { name: "TypeScript", logo: "/skill-icons/typescript.svg", proficiency: 3 },
      { name: "Java", logo: "/skill-icons/java.svg", proficiency: 4 },
      { name: "C++", logo: "/skill-icons/cplusplus.svg", proficiency: 3 },
      { name: "SQL", icon: <Database className="h-4 w-4" />, proficiency: 4 },
    ],
  },
  {
    category: "Web Development",
    icon: <Globe className="h-4 w-4" />,
    skills: [
      { name: "React", logo: "/skill-icons/react.svg", proficiency: 3 },
      { name: "Node.js", logo: "/skill-icons/nodejs.svg", proficiency: 4 },
      { name: "Express", lightLogo: "/skill-icons/express.svg", darkLogo: "/skill-icons/express.svg", proficiency: 4 },
      { name: "Next.js", lightLogo: "/skill-icons/nextjs.svg", darkLogo: "/skill-icons/nextjs.svg", proficiency: 3 },
      { name: "Django", lightLogo: "/skill-icons/django.svg", darkLogo: "/skill-icons/django.svg", proficiency: 4 },
      { name: "Flask", lightLogo: "/skill-icons/flask.svg", darkLogo: "/skill-icons/flask.svg", proficiency: 5 },
      { name: "Hono", icon: <Zap className="h-4 w-4" />, proficiency: 3 },
      { name: "FastAPI", icon: <Zap className="h-4 w-4" />, proficiency: 4 },
      { name: "Tailwind CSS", icon: <Code className="h-4 w-4" />, proficiency: 4 },
      { name: "WebRTC", icon: <Network className="h-4 w-4" />, proficiency: 3 },
      { name: "HTML5", icon: <Globe className="h-4 w-4" />, proficiency: 5 },
      { name: "CSS3", icon: <Globe className="h-4 w-4" />, proficiency: 5 },
    ],
  },
  {
    category: "Databases",
    icon: <Database className="h-4 w-4" />,
    skills: [
      { name: "PostgreSQL", logo: "/skill-icons/postgresql.svg", proficiency: 4 },
      { name: "MongoDB", logo: "/skill-icons/mongodb.svg", proficiency: 5 },
      { name: "Redis", logo: "/skill-icons/redis.svg", proficiency: 3 },
      { name: "Elasticsearch", icon: <Search className="h-4 w-4" />, proficiency: 3 },
      { name: "MySQL", logo: "/skill-icons/mysql.svg", proficiency: 4 },
      { name: "Qdrant", logo: "/skill-icons/qdrant.png", proficiency: 4 },
      { name: "Oracle", icon: <Database className="h-4 w-4" />, proficiency: 3 },
      { name: "SQLAlchemy", icon: <Database className="h-4 w-4" />, proficiency: 4 },
    ],
  },
  {
    category: "Cloud Platforms",
    icon: <Cloud className="h-4 w-4" />,
    skills: [
      { name: "AWS", lightLogo: "/skill-icons/aws.svg", darkLogo: "/skill-icons/aws.svg", proficiency: 4 },
      { name: "Google Cloud", logo: "/skill-icons/googlecloud.svg", proficiency: 4 },
      { name: "Azure", logo: "/skill-icons/azure.svg", proficiency: 3 },
      { name: "Heroku", logo: "/skill-icons/heroku.svg", proficiency: 5 },
      { name: "CloudFlare", logo: "/skill-icons/cloudflare.png", proficiency: 4 },
    ],
  },
  {
    category: "Tools & Others",
    icon: <Tool className="h-4 w-4" />,
    skills: [
      { name: "Git", logo: "/skill-icons/git.svg", proficiency: 5 },
      { name: "N8N", logo: "/skill-icons/n8n.svg", proficiency: 4 },
      { name: "Docker", logo: "/skill-icons/docker.svg", proficiency: 4 },
      { name: "Kubernetes", logo: "/skill-icons/kubernetes.svg", proficiency: 3 },
      { name: "CI/CD", icon: <RefreshCcw className="h-4 w-4" />, proficiency: 4 },
      { name: "Agile", icon: <Users className="h-4 w-4" />, proficiency: 5 },
      { name: "RESTful APIs", icon: <Network className="h-4 w-4" />, proficiency: 5 },
      { name: "Linux", logo: "/skill-icons/linux.svg", proficiency: 4 },
      { name: "Bitbucket", logo: "/skill-icons/bitbucket.svg", proficiency: 4 },
      { name: "TFS", icon: <GitMerge className="h-4 w-4" />, proficiency: 3 },
      { name: "Serverless", icon: <Zap className="h-4 w-4" />, proficiency: 4 },
    ],
  },
]

export default function Skills() {
  const { setActiveSkill } = useSkillHighlight()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const getLogoSrc = (skill: Skill) => {
    if (isDark && skill.darkLogo) return skill.darkLogo
    if (!isDark && skill.lightLogo) return skill.lightLogo
    return skill.logo
  }

  return (
    <section
      id="skills"
      className="section-y"
      onMouseLeave={() => setActiveSkill(null)}
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
            Tools I actually use, not just ones I&apos;ve heard of.
          </h2>
        </motion.div>

        <div className="mt-12">
          {skillCategories.map((group, index) => {
            const n = String(index + 1).padStart(2, "0")

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group/section grid grid-cols-1 gap-5 border-t border-border py-8 sm:py-10 lg:grid-cols-[220px_1fr] lg:gap-10 xl:grid-cols-[260px_1fr]"
              >
                {/* Left column — category label */}
                <div className="flex flex-col justify-start lg:pt-0.5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {n}
                    </span>
                    <div className="h-px w-4 bg-accent/50 transition-all duration-500 group-hover/section:w-8" />
                  </div>
                  <h3 className="break-words font-display text-2xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-3xl xl:text-4xl">
                    {group.category}
                  </h3>
                  {group.isFocus && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                      — Focus
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-muted-foreground/40">
                    {group.skills.length}&nbsp;tools
                  </p>
                </div>

                {/* Right column — skill items */}
                <div
                  className="flex flex-wrap content-start gap-x-5 gap-y-3 lg:gap-x-8 lg:gap-y-5 lg:pt-1"
                >
                  {group.skills.map((skill) => {
                    const logoSrc = getLogoSrc(skill)

                    return (
                      <div
                        key={skill.name}
                        className="group/skill flex cursor-default items-center gap-2"
                        onMouseEnter={() => setActiveSkill(skill.name)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        {/* Logo / icon — grayscale at rest, full color on hover */}
                        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-muted-foreground transition duration-300 lg:h-6 lg:w-6">
                          {logoSrc ? (
                            <Image
                              src={logoSrc}
                              alt={skill.name}
                              width={20}
                              height={20}
                              className="h-[18px] w-[18px] object-contain transition duration-300 lg:h-6 lg:w-6"
                            />
                          ) : skill.icon ? (
                            skill.icon
                          ) : (
                            <span className="h-2 w-2 bg-accent/40 transition duration-300 group-hover/skill:bg-accent" />
                          )}
                        </span>

                        {/* Skill name — sliding amber underline on hover */}
                        <span className="relative pb-[3px]">
                          <span className="font-mono text-[11px] uppercase leading-none tracking-[0.1em] text-muted-foreground transition duration-300 group-hover/skill:text-foreground lg:text-[14px]">
                            {skill.name}
                          </span>
                          <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-[width] duration-300 ease-out group-hover/skill:w-full" />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  )
}
