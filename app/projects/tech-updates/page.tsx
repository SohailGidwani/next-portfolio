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
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

export default function TechUpdatesPage() {
  const project = {
    title: "Tech-updates (Personal Tech News Aggregator)",
    description: "I wanted my own tech news feed, so I built one. It scrapes articles from Medium, YC, and Crunchbase, then uses Azure OpenAI to sort everything into categories.",
    longDescription: `I got tired of checking five different sites every morning for tech news, so I built a thing that does it for me. Tech-updates scrapes articles from Medium, Y Combinator's Hacker News, and Crunchbase on a schedule, then pipes them through Azure OpenAI to auto-categorize everything (AI/ML, startups, web dev, etc.).

The backend is Flask + PostgreSQL for the core API and data storage. The cool part is the Qdrant vector database: every article gets embedded and stored as a vector, so I can do similarity search. If you're reading about LLMs, it'll surface related articles you might've missed. It's not just keyword matching, it actually understands the content.

The frontend is React + Vite. Nothing groundbreaking there, but it's fast and the UI updates as new articles come in. I built this mostly because I wanted to work with vector databases and see how well GPT-based models handle content categorization at scale. Turns out, pretty well.`,
    image: techupdates,
    tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping", "AI"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    features: [
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI-Powered Categorization",
        description: "Articles go through Azure OpenAI, which tags them by topic so I don't have to read everything myself"
      },
      {
        icon: <Database className="w-6 h-6" />,
        title: "Vector Database",
        description: "Every article gets embedded in Qdrant, so 'find me more like this' actually works"
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Multi-Source Scraping",
        description: "Scrapers run on a schedule, pulling articles from Medium, YC, and Crunchbase automatically"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Real-time Updates",
        description: "Flask API + Postgres on the backend. New articles show up in the feed as they're scraped"
      }
    ],
    technicalDetails: [
      "React + Vite frontend with category filtering and search",
      "Flask REST API handling scraping triggers, CRUD, and AI calls",
      "PostgreSQL for article storage, user prefs, and scraping metadata",
      "Azure OpenAI (GPT-4) for categorizing and summarizing articles",
      "Qdrant vector DB storing article embeddings for similarity search",
      "Custom scrapers for Medium (RSS parsing), YC (HTML scraping), and Crunchbase",
      "Cron-based scraping schedule so the feed stays fresh",
      "Mobile-friendly layout built with Tailwind",
      "Filter by category, source, or date range",
      "Similar article recommendations powered by cosine similarity on embeddings"
    ],
    challenges: [
      "Every site structures its HTML differently, so each scraper needed custom parsing logic that breaks when they redesign",
      "Azure OpenAI rate limits hit hard when you're categorizing hundreds of articles at once. Had to add batching and retry logic",
      "Qdrant was new to me, and figuring out the right embedding dimensions and distance metrics took real experimentation",
      "Deduplication is tricky when the same story gets covered by multiple sources with different titles",
      "Keeping the scraping schedule reliable without hammering the source sites or getting IP-blocked"
    ],
    learnings: [
      "LLMs are surprisingly good at categorization if you write clear prompts and give them structured output formats",
      "Vector databases aren't just hype. Similarity search on embeddings works way better than keyword search for articles",
      "Web scraping is fragile by nature. You need good error handling and alerts for when a scraper silently breaks",
      "Rate limiting and backoff aren't optional when you're calling external APIs in a loop",
      "Building something I actually use every day kept me motivated in ways a tutorial project never would"
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
