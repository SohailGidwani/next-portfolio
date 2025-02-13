"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github} from 'lucide-react'
import Carousel from './Carousel'
import imagecaption from '@/public/images/BE-Project.jpg'
import blogsite from '@/public/images/BlogSite.jpg'
import techupdates from '@/public/images/techupdates.png'

interface ProjectsProps {
  setActiveSection: (section: string) => void;
}

export default function Projects({ setActiveSection }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] =  entries
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
      image: imagecaption,
      tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit"],
      github: "https://github.com/SohailGidwani/Image-Caption",
      // demo: "https://ai-image-recognition-demo.com"
    },
    {
      title: "ScribeGlobe (Medium-like Blogging site) ",
      description: `Built with React.js and Vite for a responsive user experience. Developed serverless backend using Hono on Cloudflare Workers.
      • Implemented PostgreSQL for efficient data storage and retrieval, demonstrating proficiency in SQL database management.`,
      image: blogsite,
      tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL"],
      github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
      // demo: "https://nlp-chatbot-demo.com"
    },
    {
      title: "Tech-updates (Personal Tech News Aggregator)",
      image: techupdates,
      description: `Built a personalized news aggregator that scrapes and categorizes tech articles using AI. Implemented web scraping from multiple sources like Medium, Y Combinator, and Crunchbase.       • Integrated Azure OpenAI for intelligent article categorization and Qdrant vector database for efficient content management.       • Developed REST API with Flask and PostgreSQL for data persistence, with a responsive React frontend for article viewing.`,
      tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping"],
      github: "https://github.com/SohailGidwani/Project-TechUpdates",
      // demo: "https://tech-updates-demo.com"
      }
  ]

  const projectCards = projects.map((project, index) => (
    <Card key={index} className="w-full flex flex-col md:flex-row dark:bg-gray-700 overflow-hidden shadow-lg">
      <div className="md:w-1/2 relative h-48 md:h-[400px]">
        <Image
          src={project.image}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
        />
      </div>
      <div className="md:w-1/2 flex flex-col p-4 md:p-6 h-full md:h-[400px] overflow-y-auto">
        <CardHeader className="flex-shrink-0 p-0 mb-2 md:mb-4">
          <CardTitle className="text-xl md:text-2xl text-blue-900 dark:text-blue-400">{project.title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between p-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs md:text-sm">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-between mt-2 md:mt-4">
            <Button variant="outline" size="sm" asChild className="text-xs md:text-sm">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                GitHub
              </a>
            </Button>
            {/* <Button variant="outline" size="sm" asChild className="text-xs md:text-sm">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                Demo
              </a>
            </Button> */}
          </div>
        </CardContent>
      </div>
    </Card>
  ))

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-900 dark:text-blue-400">Projects</h2>
        <Carousel items={projectCards} />
      </div>
    </section>
  )
}