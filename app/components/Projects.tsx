"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import Carousel from "./Carousel"
import imagecaption from '@/public/images/BE-Project.jpg'
import blogsite from '@/public/images/BlogSite.jpg'
import techupdates from '@/public/images/Tech Updates.png'
import { Github, ExternalLink } from "lucide-react"
import ScrollAnimation from "./ScrollAnimation"
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
      description: `• Implemented CNN and VGG-16 models for image feature extraction and LSTM (BLEU score: 0.65)/Transformer (BLEU score: 0.80) models for caption generation.• Created a user-friendly web interface using Streamlit, demonstrating full-stack capabilities in AI application development.`,
      image: imagecaption,
      tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit"],
      github: "https://github.com/SohailGidwani/Image-Caption",
    },
    {
      id: "scribeglobe",
      title: "ScribeGlobe (Medium-like Blogging site) ",
      description: `Built with React.js and Vite for a responsive user experience. Developed serverless backend using Hono on Cloudflare Workers. • Implemented PostgreSQL for efficient data storage and retrieval, demonstrating proficiency in SQL database management.`,
      image: blogsite,
      tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL"],
      github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    },
    {
      id: "tech-updates",
      title: "Tech-updates (Personal Tech News Aggregator)",
      image: techupdates,
      description: `Built a personalized news aggregator that scrapes and categorizes tech articles using AI. Implemented web scraping from multiple sources like Medium, Y Combinator, and Crunchbase. • Integrated Azure OpenAI for intelligent article categorization. • Developed REST API with Flask and PostgreSQL for data persistence, with a responsive React frontend for article viewing.`,
      tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping"],
      github: "https://github.com/SohailGidwani/Project-TechUpdates",
    },
  ]

  const projectCards = projects.map((project, index) => (
    <motion.div 
      key={index} 
      className="h-full w-full overflow-hidden"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3 + index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="h-full flex flex-col md:flex-row bg-white dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600">
        {/* Image Section with Fixed Aspect Ratio */}
        <motion.div 
          className="md:w-1/2 relative h-64 md:h-full overflow-hidden group"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              {...(index === 0 ? { priority: true } : {})}
            />
          </div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 md:p-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-white text-xl md:text-2xl font-bold mb-2 line-clamp-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.2 }}
              viewport={{ once: true }}
            >
              {project.title}
            </motion.h3>
            <motion.div 
              className="flex flex-wrap gap-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
              viewport={{ once: true }}
            >
              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.div
                  key={tagIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.2 + tagIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="outline"
                    className="bg-white/20 text-white border-none backdrop-blur-sm text-xs"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {project.tags.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.2 + 3 * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge variant="outline" className="bg-white/20 text-white border-none backdrop-blur-sm text-xs">
                    +{project.tags.length - 3} more
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content Section with Fixed Height and Scrolling */}
        <motion.div 
          className="md:w-1/2 flex flex-col bg-white dark:bg-gray-700 h-80 md:h-full"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
          viewport={{ once: true }}
        >
          <div className="p-4 md:p-6 flex-shrink-0">
            <div className="hidden md:block mb-4">
              <motion.h3 
                className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2 line-clamp-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.2 }}
                viewport={{ once: true }}
              >
                {project.title}
              </motion.h3>
              <motion.div 
                className="w-12 h-1 bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                viewport={{ once: true }}
              ></motion.div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 custom-scrollbar">
            <div className="space-y-4">
              <motion.p 
                className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.2 }}
                viewport={{ once: true }}
              >
                {project.description}
              </motion.p>

              <motion.div 
                className="hidden md:flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.2 }}
                viewport={{ once: true }}
              >
                {project.tags.map((tag, tagIndex) => (
                  <motion.div
                    key={tagIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.8 + index * 0.2 + tagIndex * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="pt-2 flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { triggerHaptic(); }}
                >
                  <Github className="h-4 w-4" />
                  <span>View Code</span>
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:focus:ring-gray-400/20"
                    onClick={() => { triggerHaptic(); }}
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  ))

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <ScrollAnimation variant="fadeUp" duration={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">Featured Projects</h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation variant="scale" delay={0.2}>
          <div className="mb-12">
            <Carousel items={projectCards} />
          </div>
        </ScrollAnimation>
      </div>

      {/* Hide Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  )
}