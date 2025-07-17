"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ArrowLeft, Code, Database, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeProvider } from "next-themes"
import blogsite from '@/public/images/BlogSite.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ThemeToggle from "@/app/components/ThemeToggle"

export default function ScribeGlobePage() {
  const project = {
    title: "ScribeGlobe (Medium-like Blogging site)",
    description: "A modern, full-stack blogging platform built with React and serverless architecture. Features a responsive design, real-time content management, and scalable backend infrastructure.",
    longDescription: `ScribeGlobe is a comprehensive blogging platform that replicates the functionality of Medium while incorporating modern web development practices. The project demonstrates full-stack development capabilities with a focus on performance, scalability, and user experience.

The frontend is built with React.js and Vite, providing a fast and responsive user interface. The backend utilizes Hono framework on Cloudflare Workers for serverless architecture, ensuring high availability and cost-effectiveness. PostgreSQL serves as the primary database, handling user data, articles, and content management efficiently.

Key features include user authentication, article creation and editing, real-time preview, markdown support, and responsive design. The project showcases modern development practices including TypeScript for type safety, Tailwind CSS for styling, and comprehensive error handling.`,
    image: blogsite,
    tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL", "Full Stack"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    features: [
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Modern Frontend",
        description: "Built with React.js and Vite for fast development and optimal performance"
      },
      {
        icon: <Database className="w-6 h-6" />,
        title: "Serverless Backend",
        description: "Hono framework on Cloudflare Workers for scalable, cost-effective infrastructure"
      },
      {
        icon: <Code className="w-6 h-6" />,
        title: "Type Safety",
        description: "Full TypeScript implementation ensuring code reliability and maintainability"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Responsive Design",
        description: "Tailwind CSS for beautiful, mobile-first responsive user interface"
      }
    ],
    technicalDetails: [
      "React.js with Vite for fast development and building",
      "TypeScript for type safety and better development experience",
      "Tailwind CSS for utility-first styling",
      "Hono framework for serverless API development",
      "Cloudflare Workers for edge computing and global deployment",
      "PostgreSQL database for data persistence",
      "User authentication and authorization system",
      "Markdown support for rich content creation",
      "Real-time preview and editing capabilities",
      "Responsive design for all device types"
    ],
    challenges: [
      "Implementing serverless architecture with Cloudflare Workers",
      "Managing database connections in serverless environment",
      "Creating responsive design for complex content layouts",
      "Handling real-time content updates and synchronization",
      "Optimizing performance for global edge deployment"
    ],
    learnings: [
      "Serverless architecture design and implementation",
      "Modern React development with TypeScript",
      "Database design for content management systems",
      "Edge computing and global deployment strategies",
      "Full-stack development with modern tooling"
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