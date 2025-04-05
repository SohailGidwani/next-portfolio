"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, ExternalLink, Code, ArrowRight } from 'lucide-react'
import Carousel from './Carousel'
import imagecaption from '@/public/images/BE-Project.jpg'
import blogsite from '@/public/images/BlogSite.jpg'
import techupdates from '@/public/images/Tech Updates.png'

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
      { threshold: 0.3 }
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
    <div key={index} className="h-full w-full overflow-hidden">
      <div className="h-full flex flex-col md:flex-row bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden">
        {/* Image Section with Overlay */}
        <div className="md:w-1/2 relative h-64 md:h-full overflow-hidden group">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline" className="bg-white/20 text-white border-none backdrop-blur-sm text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="bg-white/20 text-white border-none backdrop-blur-sm text-xs">
                  +{project.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="md:w-1/2 flex flex-col p-6 md:p-8">
          <div className="hidden md:block mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">{project.title}</h3>
            <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              {project.description}
            </p>
            
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="rounded-full border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Github className="mr-2 h-4 w-4" />
                <span>View Code</span>
              </a>
            </Button>
            
            {/* <Button 
              variant="default" 
              size="sm" 
              className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <span>Learn More</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
            Featured Projects
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Carousel items={projectCards} />
        </motion.div>
        
        {/* <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Code className="mr-2 h-5 w-5" />
            <span>View All Projects on GitHub</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div> */}
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </section>
  )
}