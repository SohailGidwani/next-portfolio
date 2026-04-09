"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, FolderKanban, Database, Brain, Search, FileText, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import knowledgeHub1 from '@/public/images/KnowledgeHub_1.png'
import knowledgeHub2 from '@/public/images/KnowledgeHub_2.png'
import knowledgeHub3 from '@/public/images/KnowledgeHub_3.png'
import knowledgeHub4 from '@/public/images/KnowledgeHub_4.png'
import knowledgeHub5 from '@/public/images/KnowledgeHub_5.png'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectDocument from "@/app/components/ProjectDocument"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

export default function KnowledgeHubPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  
  const project = {
    title: "Knowledge Hub - AI-Powered Document Management System",
    description: "A document manager I built for my USC coursework. It does OCR on handwritten notes and PDFs, runs semantic search with pgvector, and answers questions about your docs using a local LLM.",
    longDescription: `I built Knowledge Hub because I was tired of digging through hundreds of course PDFs and lecture notes during my MS in CS at USC. I wanted one place where I could dump all my documents and actually find what I needed quickly.

The system takes in PDFs and images, runs OCR to extract text (even from handwritten notes), chunks everything up, and stores vector embeddings in PostgreSQL with pgvector. That gives me two ways to search: regular full-text search and semantic search, where I can ask a question in plain English and get back the most relevant passages.

The part I'm most proud of is the Q&A feature. It uses RAG with a local LLM running on Ollama (gemma3:1b) to answer questions about my documents and cite exactly where the answer came from. No API keys, no cloud dependency, everything runs locally.

The whole thing is a Flask API with SQLAlchemy, containerized with Docker so setup is just \`docker-compose up\`. It's genuinely useful. I still use it to prep for exams and review research papers.`,
    images: {
      howItWorks: { src: knowledgeHub1, alt: "Knowledge Hub - How It Works Dashboard" },
      upload: [
        { src: knowledgeHub2, alt: "Knowledge Hub - Document Upload Interface" },
        { src: knowledgeHub3, alt: "Knowledge Hub - Document Processing and OCR" }
      ],
      llmResponses: [
        { src: knowledgeHub4, alt: "Knowledge Hub - AI-Powered Question Answering Interface" },
        { src: knowledgeHub5, alt: "Knowledge Hub - LLM Response with Citations" }
      ]
    },
    technicalDocument: {
      title: "Knowledge Hub Technical Deep Dive",
      description: "Architecture overview, implementation details, and the design decisions behind the system.",
      url: "/documents/Knowledge Hub — Technical Deep Dive (design Doc).pdf",
      size: "827 KB"
    },
    tags: ["Python", "Flask", "PostgreSQL", "pgvector", "Docker", "OCR", "AI/ML", "Vector Search", "RAG", "Academic Tools"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
    features: [
      {
        icon: <Database className="w-6 h-6" />,
        title: "Document Management",
        description: "Upload docs, and the system pulls out metadata and organizes everything automatically"
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI-Powered OCR",
        description: "Extracts text from PDFs and images using OpenCV, PyMuPDF, and Tesseract"
      },
      {
        icon: <Search className="w-6 h-6" />,
        title: "Semantic Search",
        description: "Find related content with vector similarity search, powered by pgvector and Sentence-Transformers"
      },
      {
        icon: <FileText className="w-6 h-6" />,
        title: "Question Answering",
        description: "Ask questions about your docs and get answers with citations, powered by a local LLM through RAG"
      }
    ],
    technicalDetails: [
      "Flask API with SQLAlchemy for the backend",
      "PostgreSQL + pgvector for vector similarity search",
      "Dockerized the whole stack for easy setup",
      "OCR pipeline using OpenCV, PyMuPDF, and Tesseract",
      "Sentence-Transformers (all-MiniLM-L6-v2) for generating vector embeddings",
      "Ollama running gemma3:1b locally for Q&A",
      "Hybrid search that combines full-text and semantic results",
      "Document chunking at 300-700 tokens with overlap",
      "OCR results ranked by confidence score",
      "REST API with endpoints for upload, search, and Q&A"
    ],
    challenges: [
      "pgvector queries got slow with larger doc collections, had to tune indexing and query params",
      "OCR quality varied a lot depending on scan quality and handwriting, so I added confidence scoring to filter out bad results",
      "Combining full-text and semantic search results into a single ranked list took a lot of trial and error",
      "Running embeddings and an LLM locally eats RAM, had to be careful about batch sizes and model selection",
      "Figuring out the right chunk size and overlap for different document types without losing context"
    ],
    learnings: [
      "pgvector is powerful but you need to think about indexing strategy early",
      "Wiring up ML models into a web app has more plumbing than you'd expect",
      "OCR is never as clean as you want it to be, confidence-based filtering helps a lot",
      "Chunk size matters more than the embedding model for search quality",
      "RAG is only as good as your retrieval step, garbage in garbage out",
      "Docker Compose makes multi-service setups way less painful"
    ]
  }

  const allImages = [
    project.images.howItWorks,
    ...project.images.upload,
    ...project.images.llmResponses
  ]

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  const nextImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % allImages.length)
      resetZoom()
    }
  }, [selectedImage, allImages.length, resetZoom])

  const prevImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? allImages.length - 1 : selectedImage - 1)
      resetZoom()
    }
  }, [selectedImage, allImages.length, resetZoom])

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const openImageModal = useCallback((index: number) => {
    setSelectedImage(index)
    resetZoom()
  }, [resetZoom])

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return

      switch (e.key) {
        case 'Escape':
          setSelectedImage(null)
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          resetZoom()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, nextImage, prevImage, handleZoomIn, handleZoomOut, resetZoom])

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="knowledge-hub"
        image="/images/KnowledgeHub_1.png"
        keywords={project.tags}
        github={project.github}
      />
      <Suspense fallback={<ProjectSkeleton />}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <ProjectNav />

          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                
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
                {/* How It Works Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
                    How It Works
                  </h2>
                  
                  {/* Main Dashboard Image */}
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-6">
                    <Image
                      src={project.images.howItWorks.src}
                      alt={project.images.howItWorks.alt}
                      fill
                      className="object-cover cursor-pointer"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                      onClick={() => openImageModal(0)}
                    />
                  </div>
                </motion.div>

                {/* Image Modal */}
                {selectedImage !== null && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className="relative max-w-6xl max-h-full">
                      {/* Close Button */}
                      <Button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 z-10 border border-border bg-background/80 text-foreground hover:bg-background"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      
                      {/* Navigation Buttons */}
                      <Button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 border border-border bg-background/80 text-foreground hover:bg-background"
                        size="sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 border border-border bg-background/80 text-foreground hover:bg-background"
                        size="sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>

                      {/* Zoom Controls */}
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <Button
                          onClick={handleZoomIn}
                          className="border border-border bg-background/80 text-foreground hover:bg-background"
                          size="sm"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleZoomOut}
                          className="border border-border bg-background/80 text-foreground hover:bg-background"
                          size="sm"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={resetZoom}
                          className="border border-border bg-background/80 text-foreground hover:bg-background"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Image with Zoom and Drag */}
                      <div 
                        className="overflow-hidden rounded-lg"
                        style={{ 
                          transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                          cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                        }}
                        onMouseDown={handleMouseDown}
                      >
                        <Image
                          src={allImages[selectedImage].src}
                          alt={allImages[selectedImage].alt}
                          width={1200}
                          height={800}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* Image Counter and Keyboard Shortcuts */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-foreground/80 text-background px-4 py-2 rounded-lg text-center">
                        <div className="text-sm font-medium">
                          {selectedImage + 1} of {allImages.length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Use ← → to navigate, +/- to zoom, 0 to reset, Esc to close
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Document Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
                    Document Upload & Processing
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {project.images.upload.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => openImageModal(index + 1)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
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
                        transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
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

                {/* LLM Responses Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-12"
                >
                  <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
                    AI-Powered Question Answering
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {project.images.llmResponses.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                        className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => openImageModal(index + 3)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
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

                {/* Technical Documentation */}
                <ProjectDocument
                  title={project.technicalDocument.title}
                  description={project.technicalDocument.description}
                  url={project.technicalDocument.url}
                  size={project.technicalDocument.size}
                  delay={1.6}
                />

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
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
                      <FolderKanban className="mr-2 h-5 w-5" />
                      Explore Other Projects
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
