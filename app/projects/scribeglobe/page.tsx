import { Badge } from "@/app/components/ui/badge"
import { Code, Database, Globe, Zap } from "lucide-react"
import Image from "next/image"
import blogsite from '@/public/images/BlogSite.jpg'
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectActions from "@/app/projects/components/ProjectActions"
import ProjectSectionLabel from "@/app/projects/components/ProjectSectionLabel"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"

const tocItems = [
  { id: "section-01", n: "01", label: "Preview" },
  { id: "section-02", n: "02", label: "Why I Built It" },
  { id: "section-03", n: "03", label: "How It Works" },
  { id: "section-04", n: "04", label: "Key Features" },
  { id: "section-05", n: "05", label: "Technical Stack" },
  { id: "section-06", n: "06", label: "Friction & Takeaways" },
]

export default function ScribeGlobePage() {
  const project = {
    title: "ScribeGlobe (Medium-like Blogging site)",
    description: "A Medium-style blogging platform I built to learn serverless. React + Vite frontend, Hono running on Cloudflare Workers, Postgres for the data.",
    why: `I wanted to build something real to learn serverless and edge computing, so I made a Medium-style blogging platform from scratch. The idea was simple: if I could get a full CRUD app running on Cloudflare Workers with a real database, I'd actually understand how serverless works beyond the marketing pitch.`,
    how: `The frontend is React + Vite with TypeScript and Tailwind. Nothing fancy, but it's fast and the DX is great. The interesting part is the backend: I used Hono as the framework running on Cloudflare Workers, which means the API runs at the edge, close to wherever the user is. Postgres handles all the data (users, articles, auth tokens).

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
      <div className="min-h-screen overflow-x-clip bg-background text-foreground">
          <ProjectNav />
          {/* Chapter wayfinding: the rail above 1200px, the pill below it. */}
          <SectionTOC items={tocItems} />
          <MobileChapterNav items={tocItems} />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    Full Stack / Serverless
                  </span>
                </div>
                <h1
                  data-vt-title-target
                  className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                  {project.title}
                </h1>
                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <ProjectActions github={project.github} className="mb-8" />
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-xs uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <section>
                  <ProjectSectionLabel n="01" label="Preview" id="section-01" />
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
                </section>

                {/* 02 — Why I Built It */}
                <section>
                  <ProjectSectionLabel n="02" label="Why I Built It" id="section-02" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.why}
                  </p>
                </section>

                {/* 03 — How It Works */}
                <section>
                  <ProjectSectionLabel n="03" label="How It Works" id="section-03" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.how}
                  </p>
                </section>

                {/* 04 — Key Features */}
                <section>
                  <ProjectSectionLabel n="04" label="Key Features" id="section-04" />
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
                </section>

                {/* 05 — Technical Stack */}
                <section>
                  <ProjectSectionLabel n="05" label="Technical Stack" id="section-05" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-xs text-accent/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 06 — Friction & Takeaways */}
                <section>
                  <ProjectSectionLabel n="06" label="Friction & Takeaways" id="section-06" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
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
                </section>

              </div>
            </div>
          </div>
      </div>
    </>
  )
}
