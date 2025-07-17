"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ArrowLeft, ExternalLink, Code, Brain, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeProvider } from "next-themes"
import imagecaption from '@/public/images/BE-Project.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ThemeToggle from "@/app/components/ThemeToggle"

export default function ImageCaptioningPage() {
  const project = {
    title: "Image Feature Detection & Captioning",
    description: "An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models. This project demonstrates the integration of computer vision and natural language processing to create meaningful image descriptions.",
    longDescription: `This project implements a sophisticated image captioning system that combines computer vision and natural language processing. The system uses CNN and VGG-16 models for feature extraction from images, then employs both LSTM and Transformer architectures for generating human-like captions.

The project achieved impressive results with BLEU scores of 0.65 for LSTM and 0.80 for Transformer models, demonstrating the effectiveness of attention mechanisms in caption generation. The user interface was built using Streamlit, providing an intuitive way for users to upload images and receive instant captions.

Key technical challenges included optimizing model performance, handling diverse image types, and ensuring real-time inference capabilities. The project showcases full-stack development skills in AI application development, from model training to deployment.`,
    image: imagecaption,
    tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit", "Computer Vision", "NLP"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    features: [
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Advanced AI Models",
        description: "Implemented CNN and VGG-16 for feature extraction, LSTM and Transformer for caption generation"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "High Performance",
        description: "Achieved BLEU scores of 0.65 (LSTM) and 0.80 (Transformer) for caption quality"
      },
      {
        icon: <Code className="w-6 h-6" />,
        title: "User-Friendly Interface",
        description: "Built with Streamlit for easy image upload and instant caption generation"
      },
      {
        icon: <ExternalLink className="w-6 h-6" />,
        title: "Real-time Processing",
        description: "Optimized for fast inference and real-time caption generation"
      }
    ],
    technicalDetails: [
      "CNN and VGG-16 models for image feature extraction",
      "LSTM architecture with attention mechanisms",
      "Transformer model for improved caption quality",
      "BLEU score evaluation metrics",
      "Streamlit web interface for user interaction",
      "Image preprocessing and augmentation techniques",
      "Model optimization for deployment"
    ],
    challenges: [
      "Balancing model complexity with inference speed",
      "Handling diverse image types and content",
      "Optimizing BLEU scores for better caption quality",
      "Creating an intuitive user interface",
      "Managing model memory requirements"
    ],
    learnings: [
      "Deep learning model architecture design",
      "Computer vision and NLP integration",
      "Performance optimization techniques",
      "User interface design for AI applications",
      "Model evaluation and metrics analysis"
    ]
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<ProjectSkeleton />}>
        <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
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
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900 dark:text-blue-400">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm"
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
            <div className="container mx-auto px-4">
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
                  <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-400">
                    Project Overview
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
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
                  <h2 className="text-3xl font-bold mb-8 text-blue-900 dark:text-blue-400">
                    Key Features
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-slate-300">
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
                  <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-400">
                    Technical Implementation
                  </h2>
                                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
                    <ul className="space-y-3">
                      {project.technicalDetails.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-slate-300">{detail}</span>
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
                      <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-400">
                        Challenges Faced
                      </h3>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-slate-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-400">
                        Key Learnings
                      </h3>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-slate-300">{learning}</span>
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
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
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
                    className="rounded-full border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3"
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
    </ThemeProvider>
  )
} 