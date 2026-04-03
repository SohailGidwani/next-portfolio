"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import FloatingBadge from "./FloatingBadge"
import { useScrollEngine } from "./scroll/ScrollEngine"

interface SkillCategory {
  category: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    category: "Machine Learning / AI",
    skills: [
      "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "NLTK",
      "HuggingFace", "spaCy", "Pandas", "NumPy", "Matplotlib", "Seaborn",
      "MCP", "LLMOps",
    ],
  },
  {
    category: "Programming Languages",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "SQL"],
  },
  {
    category: "Web Development",
    skills: [
      "React", "Node.js", "Express", "Next.js", "Django", "Flask", "Hono",
      "FastAPI", "Tailwind CSS", "WebRTC", "HTML5", "CSS3",
    ],
  },
  {
    category: "Databases",
    skills: [
      "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "MySQL", "Qdrant",
      "Oracle", "SQLAlchemy",
    ],
  },
  {
    category: "Cloud Platforms",
    skills: ["AWS", "Google Cloud", "Azure", "Heroku", "CloudFlare"],
  },
  {
    category: "Tools & Others",
    skills: [
      "Git", "N8N", "Docker", "Kubernetes", "CI/CD", "Agile", "RESTful APIs",
      "Linux", "Bitbucket", "TFS", "Serverless",
    ],
  },
]

export default function Skills() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-80px" })

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("skills", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32"
      style={{ minHeight: "120vh" }}
    >
      <div className="container mx-auto px-6" ref={contentRef}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
        >
          Skills
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]"
        >
          Tools I actually use, not just ones I&apos;ve heard of.
        </motion.h2>

        <div className="mt-20 space-y-16">
          {skillCategories.map((group, groupIdx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIdx * 0.05 }}
              viewport={{ once: true, margin: "-60px" }}
              style={{
                transform: `translateY(${groupIdx % 2 === 0 ? 0 : 20}px)`,
              }}
            >
              <p className="text-[10px] font-body font-semibold tracking-[0.35em] uppercase text-white/20 mb-5">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill, i) => (
                  <FloatingBadge
                    key={skill}
                    name={skill}
                    delay={i * 0.03}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
