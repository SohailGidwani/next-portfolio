"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ArrowLeft, Brain, Database, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import techupdates from '@/public/images/Tech Updates.png'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ThemeToggle from "@/app/components/ThemeToggle"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

export default function TechUpdatesPage() {
  const project = {
    title: "Tech-updates (Personal Tech News Aggregator)",
    description: "An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources. Features advanced content management and real-time updates.",
    longDescription: `Tech-updates is a sophisticated news aggregation platform that combines web scraping, artificial intelligence, and modern web development to deliver personalized tech news. The system automatically collects articles from multiple sources including Medium, Y Combinator, and Crunchbase, then uses Azure OpenAI for intelligent categorization and content analysis.

The backend is built with Flask and PostgreSQL, providing a robust REST API for data management. The frontend uses React with Vite for optimal performance and user experience. The system integrates Qdrant vector database for efficient content storage and retrieval, enabling fast search and recommendation features.

Key features include automated content scraping, AI-powered categorization, personalized news feeds, and a responsive web interface. The project demonstrates advanced full-stack development skills with AI integration, database design, and modern web technologies.`,
    image: techupdates,
    tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping", "AI"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    features: [
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI-Powered Categorization",
        description: "Azure OpenAI integration for intelligent article categorization and analysis"
      },
      {
        icon: <Database className="w-6 h-6" />,
        title: "Vector Database",
        description: "Qdrant vector database for efficient content storage and similarity search"
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Multi-Source Scraping",
        description: "Automated web scraping from Medium, Y Combinator, and Crunchbase"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Real-time Updates",
        description: "Flask REST API with PostgreSQL for real-time content management"
      }
    ],
    technicalDetails: [
      "React.js with Vite for fast frontend development",
      "Flask REST API for backend services",
      "PostgreSQL database for data persistence",
      "Azure OpenAI for intelligent content categorization",
      "Qdrant vector database for similarity search",
      "Web scraping from multiple tech news sources",
      "Real-time content updates and notifications",
      "Responsive design for all device types",
      "Content filtering and personalization",
      "Search and recommendation algorithms"
    ],
    challenges: [
      "Implementing reliable web scraping across multiple sources",
      "Integrating Azure OpenAI for content categorization",
      "Managing vector database operations efficiently",
      "Handling real-time content updates and synchronization",
      "Optimizing search performance with large datasets"
    ],
    learnings: [
      "AI integration in web applications",
      "Vector database design and optimization",
      "Web scraping techniques and best practices",
      "Real-time data management and synchronization",
      "Full-stack development with AI components"
    ]
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="tech-updates"
        image="/images/Tech%20Updates.png"
        keywords={project.tags}
        github={project.github}
      />
      <Suspense fallback={<ProjectSkeleton />}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
            <div className="container mx-auto px-4">
              {/* Theme Toggle - Top Right */}
              <div className="flex justify-end mb-6">
                <ThemeToggle />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <Link 
                  href="/projects" 
                  className="inline-flex items-center text-primary hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
                
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-foreground">
                  {project.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-primary/10 text-primary text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Project Content */}
          <div className="py-20">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto">
                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Detailed Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                    Project Overview
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {project.longDescription}
                    </p>
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
                    Key Features
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        className="p-6 bg-card/80 rounded-xl border border-border hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg mr-4">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Technical Details */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                    Technical Implementation
                  </h2>
                  <div className="bg-card/80 rounded-xl p-6 border border-border">
                    <ul className="space-y-3">
                      {project.technicalDetails.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Challenges & Learnings */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-12"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Challenges Faced
                      </h3>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Key Learnings
                      </h3>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Github className="mr-2 h-5 w-5" />
                      View Source Code
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-full border border-primary/60 text-primary hover:bg-primary/10 px-8 py-3"
                  >
                    <Link href="/projects" className="flex items-center">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Projects
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
      </div>
      </Suspense>
    </>
  )
}
