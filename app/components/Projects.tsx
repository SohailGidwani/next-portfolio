"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ExternalLink } from 'lucide-react'
import Carousel from './Carousel'

interface ProjectsProps {
  setActiveSection: (section: string) => void;
}

export default function Projects({ setActiveSection }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('projects')
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [setActiveSection])

  const projects = [
    {
      title: "Image Feature Detection & Captioning",
      description: `• Implemented CNN and VGG-16 models for image feature extraction and LSTM (BLEU score: 0.65)/Transformer (BLEU score: 0.80)
      models for caption generation.• Created a user-friendly web interface using Streamlit, demonstrating full-stack capabilities in AI application development.`,
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit"],
      github: "https://github.com/yourusername/ai-image-recognition",
      demo: "https://ai-image-recognition-demo.com"
    },
    {
      title: "ScribeGlobe (Medium-like Blogging site) ",
      description: `Built with React.js and Vite for a responsive user experience. Developed serverless backend using Hono on Cloudflare Workers.
      • Implemented PostgreSQL for efficient data storage and retrieval, demonstrating proficiency in SQL database management.
      `,
      image: "/placeholder.svg?height=300&width=400",
      tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL"],
      github: "https://github.com/yourusername/nlp-chatbot",
      demo: "https://nlp-chatbot-demo.com"
    },
    {
      title: "Predictive Analytics Dashboard",
      description: "Built a web-based dashboard for visualizing and analyzing predictive models for business intelligence.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Python", "Scikit-learn", "D3.js", "Flask"],
      github: "https://github.com/yourusername/predictive-analytics-dashboard",
      demo: "https://predictive-analytics-demo.com"
    }
  ]

  const projectCards = projects.map((project, index) => (
    <Card key={index} className="w-full flex flex-col md:flex-row dark:bg-gray-700 overflow-hidden shadow-lg">
      <div className="md:w-1/2">
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-64 md:h-full object-cover"
        />
      </div>
      <div className="md:w-1/2 flex flex-col p-6">
        <CardHeader className="flex-shrink-0 p-0 mb-4">
          <CardTitle className="text-2xl md:text-3xl text-indigo-800 dark:text-indigo-400">{project.title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-base md:text-lg mt-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between p-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Demo
              </a>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  ))

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-800 dark:text-indigo-400">Projects</h2>
        <Carousel items={projectCards} />
      </div>
    </section>
  )
}