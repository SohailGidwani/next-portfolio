"use client"

import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeProvider } from "next-themes"
import knowledgeHub from '@/public/images/KnowledgeHub_1.png'
import imagecaption from '@/public/images/BE-Project.jpg'
import blogsite from '@/public/images/BlogSite.jpg'
import techupdates from '@/public/images/Tech Updates.png'
import ThemeToggle from "@/app/components/ThemeToggle"

export default function ProjectsPage() {
  const projects = [
    {
      id: "knowledge-hub",
      title: "Knowledge Hub - AI-Powered Document Management",
      shortDescription: "Comprehensive document management system with OCR, semantic search, and AI-powered Q&A for academic research",
      description: `• Built a Flask-based document management system with PostgreSQL and pgvector for vector similarity search.• Implemented OCR processing with OpenCV, PyMuPDF, and Tesseract for PDF and image text extraction.• Integrated local LLM (Ollama) for AI-powered question answering with RAG architecture.• Created hybrid search combining full-text and semantic search with confidence-aware ranking.`,
      image: knowledgeHub,
      tags: ["Python", "Flask", "PostgreSQL", "pgvector", "Docker", "OCR", "AI/ML", "Vector Search", "RAG"],
      github: "https://github.com/SohailGidwani/knowledge_hub",
      featured: true,
    },
    {
      id: "tech-updates",
      title: "Tech-updates (Personal Tech News Aggregator)",
      shortDescription: "AI-powered news aggregator with intelligent categorization",
      image: techupdates,
      description: `Built a personalized news aggregator that scrapes and categorizes tech articles using AI. Implemented web scraping from multiple sources like Medium, Y Combinator, and Crunchbase. • Integrated Azure OpenAI for intelligent article categorization and Qdrant vector database for efficient content management. • Developed REST API with Flask and PostgreSQL for data persistence, with a responsive React frontend for article viewing.`,
      tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping"],
      github: "https://github.com/SohailGidwani/Project-TechUpdates",
      featured: false,
    },
    {
      id: "image-captioning",
      title: "Image Feature Detection & Captioning",
      shortDescription: "AI-powered image captioning system using CNN and Transformer models",
      description: `• Implemented CNN and VGG-16 models for image feature extraction and LSTM (BLEU score: 0.65)/Transformer (BLEU score: 0.80) models for caption generation.• Created a user-friendly web interface using Streamlit, demonstrating full-stack capabilities in AI application development.`,
      image: imagecaption,
      tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit"],
      github: "https://github.com/SohailGidwani/Image-Caption",
      featured: true,
    },
    {
      id: "scribeglobe",
      title: "ScribeGlobe (Medium-like Blogging site)",
      shortDescription: "Full-stack blogging platform with serverless backend",
      description: `Built with React.js and Vite for a responsive user experience. Developed serverless backend using Hono on Cloudflare Workers. • Implemented PostgreSQL for efficient data storage and retrieval, demonstrating proficiency in SQL database management.`,
      image: blogsite,
      tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL"],
      github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
      featured: false,
    },
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
          <div className="container mx-auto px-4">
            {/* Navigation and Theme Toggle */}
            <div className="flex justify-between items-center mb-6">
              <Link 
                href="/#projects" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
              <ThemeToggle />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900 dark:text-blue-400">
                My Projects
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                Explore my portfolio of AI/ML and full-stack development projects. Each project showcases different aspects of my technical skills and problem-solving approach.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs">
                            +{project.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 rounded-full border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-105 transition-all duration-200 hover:shadow-md"
                        >
                          <Link href={`/projects/${project.id}`} className="flex items-center justify-center">
                            <span>View Details</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-full border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 hover:shadow-md"
                        >
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
} 