"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Github, FolderKanban, Code, Database, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import blogsite from '@/public/images/BlogSite.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{n}</span>
        <div className="h-px w-5 bg-border" />
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
        {label}
      </h2>
    </div>
  )
}

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
        icon: <Globe className="w-5 h-5" />,
        title: "Modern Frontend",
        description: "React + Vite, so hot reloads are instant and the production build is tiny"
      },
      {
        icon: <Database className="w-5 h-5" />,
        title: "Serverless Backend",
        description: "Hono on Cloudflare Workers, so the API runs at the edge and I'm not paying for idle servers"
      },
      {
        icon: <Code className="w-5 h-5" />,
        title: "Type Safety",
        description: "TypeScript everywhere, frontend and backend. Catches most of my dumb mistakes at compile time"
      },
      {
        icon: <Zap className="w-5 h-5" />,
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
        projectType="app"
      />
      <Suspense fallback={<ProjectSkeleton />}>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    Full Stack / Serverless
                  </span>
                </div>
                <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <SectionLabel n="01" label="Preview" />
                  <div className="relative aspect-video overflow-hidden rounded border border-border">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.section>

                {/* 02 — Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <SectionLabel n="02" label="Overview" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.longDescription}
                  </p>
                </motion.section>

                {/* 03 — Key Features */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <SectionLabel n="03" label="Key Features" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="rounded border border-border bg-card p-5 transition-colors hover:border-accent/40"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="text-accent">{feature.icon}</div>
                          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 04 — Technical Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <SectionLabel n="04" label="Technical Stack" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* 05 — Friction & Takeaways */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <SectionLabel n="05" label="Friction & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Friction
                      </p>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        Takeaways
                      </p>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="flex flex-wrap gap-3 border-t border-border pt-8"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <FolderKanban className="h-4 w-4" />
                    All Projects
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  )
}
