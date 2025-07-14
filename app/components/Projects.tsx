"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import imagecaption from '@/public/images/BE-Project.jpg'
import blogsite from '@/public/images/BlogSite.jpg'
import techupdates from '@/public/images/Tech Updates.png'
import { Github, ExternalLink, ArrowUpRight } from "lucide-react"
// import ScrollAnimation from "./ScrollAnimation"
import { triggerHaptic } from "./ui/haptics"

interface ProjectsProps {
  setActiveSection: (section: string) => void
}

export default function Projects({ setActiveSection }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10);
          setActiveSection("projects")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
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

  const projects = [
    {
      id: "image-captioning",
      title: "Image Feature Detection & Captioning",
      shortDescription: "AI-powered image captioning system using CNN, VGG-16, LSTM, and Transformer models with Streamlit interface.",
      description: `Implemented CNN and VGG-16 models for image feature extraction and LSTM (BLEU score: 0.65)/Transformer (BLEU score: 0.80) models for caption generation. Created a user-friendly web interface using Streamlit, demonstrating full-stack capabilities in AI application development.`,
      image: imagecaption,
      tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit"],
      github: "https://github.com/SohailGidwani/Image-Caption",
      featured: true,
    },
    {
      id: "scribeglobe",
      title: "ScribeGlobe",
      shortDescription: "Medium-like blogging platform with serverless backend using Hono on Cloudflare Workers.",
      description: `Built with React.js and Vite for a responsive user experience. Developed serverless backend using Hono on Cloudflare Workers. Implemented PostgreSQL for efficient data storage and retrieval, demonstrating proficiency in SQL database management.`,
      image: blogsite,
      tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL"],
      github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
      featured: true,
    },
    {
      id: "tech-updates",
      title: "Tech-Updates",
      shortDescription: "Personal tech news aggregator with AI-powered categorization and web scraping capabilities.",
      description: `Built a personalized news aggregator that scrapes and categorizes tech articles using AI. Implemented web scraping from multiple sources like Medium, Y Combinator, and Crunchbase. Integrated Azure OpenAI for intelligent article categorization. Developed REST API with Flask and PostgreSQL for data persistence, with a responsive React frontend for article viewing.`,
      image: techupdates,
      tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping"],
      github: "https://github.com/SohailGidwani/Project-TechUpdates",
      featured: true,
    },
  ]

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-600 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100 dark:bg-gray-600">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                      {project.title}
                    </h3>
                    <motion.div
                      className="ml-3 p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {project.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 4 && (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-500 text-xs px-2 py-1"
                      >
                        +{project.tags.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 text-sm font-medium flex-1 justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => triggerHaptic()}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </motion.a>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex-1 justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        triggerHaptic();
                        window.location.href = `/projects/${project.id}`;
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            onClick={() => triggerHaptic()}
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}