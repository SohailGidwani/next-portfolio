"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Github, FolderKanban, Code, Database, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import blogsite from '@/public/images/BlogSite.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

export default function ScribeGlobePage() {
  const project = {
    title: "ScribeGlobe (Medium-like Blogging site)",
    description: "A Medium-style blogging platform I built to learn serverless. React + Vite frontend, Hono running on Cloudflare Workers, Postgres for the data.",
    longDescription: `I wanted to build something real to learn serverless and edge computing, so I made a Medium-style blogging platform from scratch. The idea was simple: if I could get a full CRUD app running on Cloudflare Workers with a real database, I'd actually understand how serverless works beyond the marketing pitch.

The frontend is React + Vite with TypeScript and Tailwind. Nothing fancy, but it's fast and the DX is great. The interesting part is the backend: I used Hono as the framework running on Cloudflare Workers, which means the API runs at the edge, close to wherever the user is. Postgres handles all the data (users, articles, auth tokens).

You can sign up, write posts with markdown, preview them in real time, and publish. The whole thing is typed end-to-end with TypeScript, which caught a ton of bugs before they happened. I also spent a lot of time on the responsive layout since blog content needs to read well on any screen size.`,
    image: blogsite,
    tags: ["React", "Vite", "Typescript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL", "Full Stack"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    features: [
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Modern Frontend",
        description: "React + Vite, so hot reloads are instant and the production build is tiny"
      },
      {
        icon: <Database className="w-6 h-6" />,
        title: "Serverless Backend",
        description: "Hono on Cloudflare Workers, so the API runs at the edge and I'm not paying for idle servers"
      },
      {
        icon: <Code className="w-6 h-6" />,
        title: "Type Safety",
        description: "TypeScript everywhere, frontend and backend. Catches most of my dumb mistakes at compile time"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Responsive Design",
        description: "Tailwind CSS for styling. Blog content looks good on phones, tablets, and desktop"
      }
    ],
    technicalDetails: [
      "React 18 + Vite for the frontend, with lazy-loaded routes",
      "TypeScript across the full stack, shared types between client and server",
      "Tailwind CSS for all styling, no custom CSS files",
      "Hono as the API framework, built specifically for edge runtimes",
      "Deployed on Cloudflare Workers, cold starts are basically zero",
      "PostgreSQL for storing users, articles, and session data",
      "Auth system with hashed passwords and JWT tokens",
      "Markdown editor with live preview as you type",
      "Optimistic UI updates so the app feels snappy",
      "Mobile-first layout that scales up to wide screens"
    ],
    challenges: [
      "Cloudflare Workers can't hold persistent DB connections, so I had to figure out connection pooling with serverless",
      "Hono's ecosystem is smaller than Express, so I wrote a few middleware pieces myself",
      "Getting markdown rendering to look consistent across browsers took more CSS tweaking than I expected",
      "Auth in a stateless serverless environment meant I couldn't rely on sessions, had to go full JWT",
      "Debugging Workers locally vs. deployed behaved differently, especially around environment variables"
    ],
    learnings: [
      "Serverless isn't magic. You still have to think about cold starts, connection limits, and state management",
      "TypeScript on both sides of the stack saves a ton of time when you change a data shape",
      "Hono is a really solid framework for edge APIs. I'd pick it again over Express for Workers",
      "Building auth from scratch taught me more than any tutorial. JWTs, hashing, token refresh, all of it",
      "Vite's dev server speed genuinely changes how you build. Going back to Webpack would hurt"
    ]
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="scribeglobe"
        image="/images/BlogSite.jpg"
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
