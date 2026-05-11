"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import {
  Github,
  FolderKanban,
  Brain,
  Database,
  Globe,
  Zap,
  Search,
  LayoutGrid,
  Server,
  ListTree,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import techupdates from '@/public/images/Tech Updates.png'
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

function CodeBlock({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="divide-y divide-border/50">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-3">
            <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TechUpdatesPage() {
  const project = {
    title: "Tech Updates - Personal AI News Aggregator",
    description:
      "A full-stack app that scrapes tech articles, categorizes them with Azure OpenAI, embeds them into Qdrant, and lets me browse or semantically search a personalized feed.",
    cardSummary:
      "Tech Updates is a personal tech news aggregator I built because I was tired of opening five tabs every morning. A Flask backend scrapes articles from Medium, Hacker News–adjacent feeds, and Crunchbase, runs them through Azure OpenAI for categorization, and stores embeddings in Qdrant so I can search the feed by meaning instead of just keywords. The React + Vite frontend serves it all in a clean, paginated UI.",
    image: techupdates,
    tags: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind",
      "Python",
      "Flask",
      "APScheduler",
      "Azure OpenAI",
      "SentenceTransformers",
      "Qdrant",
    ],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    features: [
      {
        icon: <Globe className="w-5 h-5" />,
        title: "Multi-source scraping",
        description:
          "Source-specific Python scrapers pull articles from Medium, YC-related feeds, and Crunchbase, then normalize them into one shape.",
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: "LLM categorization",
        description:
          "Azure OpenAI assigns each article a topic like AI/ML, startups, or web dev, so the feed is sorted before I even open it.",
      },
      {
        icon: <Database className="w-5 h-5" />,
        title: "Qdrant vector store",
        description:
          "Articles are embedded with all-MiniLM-L6-v2 and upserted into a `tech_news` collection for similarity search.",
      },
      {
        icon: <Search className="w-5 h-5" />,
        title: "Semantic search",
        description:
          "Queries get embedded and compared against article vectors, so a search for an idea finds articles that share the meaning, not just the keyword.",
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Scheduled jobs",
        description:
          "Flask-APScheduler triggers scraping from inside the API, so there is no separate worker process to babysit.",
      },
      {
        icon: <LayoutGrid className="w-5 h-5" />,
        title: "Clean React UI",
        description:
          "React + Vite frontend with reusable Tile components, a Modal for details, dark mode, and pagination at 6 articles per page.",
      },
    ],
    technicalDetails: [
      "React + Vite + TypeScript frontend, Tailwind for styling",
      "Python + Flask backend organized around blueprints and utility modules",
      "Flask-APScheduler running scheduled scraping jobs inside the API process",
      "Source-specific scrapers for Medium, YC-related feeds, and Crunchbase",
      "Azure OpenAI for article categorization and light summarization",
      "SentenceTransformers `all-MiniLM-L6-v2` for 384-dim embeddings",
      "Qdrant vector DB with a `tech_news` collection for similarity search",
      "scraped_data.json and categorized_data.json as the simple persistence layer",
      "REST endpoints under /api for scrape, upload, and search",
      "Article tiles, modal details, dark mode toggle, and 6-per-page pagination",
    ],
    decisions: [
      {
        title: "Flask over FastAPI",
        description:
          "I wanted to ship a small REST API quickly. Blueprints made the layout obvious and I did not need anything that Flask could not give me.",
      },
      {
        title: "JSON files instead of a database",
        description:
          "This is a prototype. Plain JSON made the pipeline visible during debugging and meant I did not have to manage a schema while the data shape was still moving.",
      },
      {
        title: "Qdrant for vectors",
        description:
          "I wanted a purpose-built vector DB with a real API and an admin UI, not a library glued into the same Python process.",
      },
      {
        title: "all-MiniLM-L6-v2 locally",
        description:
          "Cheap, fast on CPU, and good enough for short article text. Using a hosted embedding API for a personal project felt like overkill.",
      },
      {
        title: "APScheduler inside Flask",
        description:
          "One process, one place to look at the schedule. For something only I use, a separate worker setup was not worth the operational cost.",
      },
      {
        title: "React + Vite",
        description:
          "Fast dev loop, no SSR needed, and Vite's HMR made iterating on the UI feel almost instant.",
      },
    ],
    challenges: [
      "Every source had a different HTML or feed shape, so each scraper was written by hand. There is no generic scraper that ages well.",
      "Source sites change their layout without warning, and a broken scraper produces empty results silently unless you build health checks for it.",
      "Two sources covering the same story under different titles is a deduplication problem I did not fully solve. Embedding-based dedup is the obvious next step.",
      "Categorization quality depends a lot on prompt design and on whether article text is consistent. Short titles without a body category worse than I expected.",
      "Vector search needed real experimentation: different embedding models cluster differently, and picking a score threshold is more art than science on a small dataset.",
      "Wiring backend JSON into the frontend was a small but real decision: serve it from the API, copy it into the public folder at build time, or fetch it as a static file. I picked the third for simplicity.",
      "Calling Azure OpenAI in a loop hits rate limits fast. Batching plus retry with backoff is not optional once you are processing hundreds of articles.",
    ],
    learnings: [
      "Designing an end-to-end pipeline is harder than the individual pieces suggest. Scraping is easy. Normalization, prompt design, and figuring out where data lives between stages is where the time goes.",
      "Vector databases are a real category of tool, not a buzzword. Once embeddings are stored properly, similarity queries become a one-liner.",
      "Keyword search cannot tell that two articles are about the same idea. Embeddings can, and that one fact justifies the whole vector DB stack.",
      "Data normalization beats model choice. A clean dataset with a small embedding model usually wins over a messy dataset with a fancier model.",
      "Flask + blueprints + a few utility modules is enough to ship a small API. I did not need to pick a framework war to finish this.",
      "Sometimes a frontend that fetches a static JSON file is the right answer. Not every project needs a separate API call for every screen.",
      "A personal project is the cheapest place to try new infrastructure. I would not have used Qdrant for the first time on something with a deadline.",
    ],
    future: [
      "Move from JSON files to a real database (probably Postgres) with a small ORM layer.",
      "Use embeddings to deduplicate stories that show up across multiple sources.",
      "Add user accounts so people can save categories or articles they want to follow.",
      "Generate short article summaries with the LLM, not just a category tag.",
      "Add structured logging and an admin dashboard for scraper health (last run, items pulled, errors).",
      "Score sources by reliability so noisy ones can be downweighted in the feed.",
      "Deploy backend and frontend separately with CI/CD instead of running it locally.",
      "Add tests for the parsers and API. Right now the parsers are tested by 'does it still work when I run it'.",
      "Improve the README so someone other than me can clone and run it in under ten minutes.",
    ],
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
                    Full-stack / AI News Aggregator
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
                  transition={{ duration: 0.5, delay: 0.1 }}
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
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <SectionLabel n="02" label="Overview" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Tech Updates is a personal tech news aggregator. The pipeline pulls articles from a few sources I actually read, tags them with categories like AI/ML, startups, and web dev, and indexes them in a vector database so I can search the feed semantically. The React + Vite frontend displays the articles as tiles with pagination, dark mode, and a modal for details.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    It is not a SaaS product. It is something I built so I would stop wasting twenty minutes every morning bouncing between tabs, and so I had a real reason to put a vector database and an LLM into the same app.
                  </p>
                </motion.section>

                {/* 03 — Why I Built It */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <SectionLabel n="03" label="Why I Built It" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The problem was small but real. I was reading tech news from four or five sources, and there was no single place that pulled them together in a way that respected what I cared about. Most aggregators are either too broad (RSS readers that drown you) or too narrow (one source, one perspective).
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    I also wanted an excuse to play with vector search and LLM categorization. I had read about Qdrant and SentenceTransformers and wanted to wire them together myself instead of nodding along to blog posts. So this project did two things at once: solve my own annoyance, and let me build something end-to-end across scraping, an LLM pipeline, a vector DB, and a frontend.
                  </p>
                </motion.section>

                {/* 04 — How It Works */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <SectionLabel n="04" label="How It Works" />
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">
                    The flow is straightforward, with each step doing one thing:
                  </p>
                  <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {[
                      "Scrapers hit Medium, YC-related feeds, and Crunchbase and pull article metadata: title, details, source, URL.",
                      "A categorization step calls Azure OpenAI to assign each article a topic such as AI/ML, startups, or web dev.",
                      "Articles are written to scraped_data.json and categorized_data.json on disk.",
                      "The same articles are embedded with all-MiniLM-L6-v2 and upserted into a Qdrant collection called tech_news.",
                      "The Flask API exposes endpoints for triggering scraping, uploading to Qdrant, and running search.",
                      "The React frontend fetches categorized_data.json, renders articles as tiles, and shows details in a modal, six per page.",
                    ].map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-0.5 w-6 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    A search request goes to /api/search, which embeds the query, asks Qdrant for the nearest vectors, and returns the matching articles with a similarity score.
                  </p>
                </motion.section>

                {/* 05 — System Architecture */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <SectionLabel n="05" label="System Architecture" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The system has five clear layers. Each one has a single job, and the contract between them is plain JSON.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        icon: <Globe className="w-4 h-4" />,
                        label: "Scraping / Parsing",
                        desc: "Source-specific Python scripts collect articles and normalize them into a common shape (title, details, source, URL, category).",
                      },
                      {
                        icon: <ListTree className="w-4 h-4" />,
                        label: "Processing / Categorization",
                        desc: "Utility functions clean the data and call Azure OpenAI to assign categories. Output is written to JSON.",
                      },
                      {
                        icon: <Server className="w-4 h-4" />,
                        label: "API",
                        desc: "Flask exposes blueprints under /api: scrape + categorize, upload to Qdrant, and search.",
                      },
                      {
                        icon: <Database className="w-4 h-4" />,
                        label: "Vector Search",
                        desc: "SentenceTransformers encodes queries into 384-dim embeddings. Qdrant searches the tech_news collection by similarity.",
                      },
                      {
                        icon: <LayoutGrid className="w-4 h-4" />,
                        label: "Frontend",
                        desc: "React + Vite reads categorized articles and renders the feed with tiles, modal, dark mode, and pagination.",
                      },
                    ].map((layer) => (
                      <div
                        key={layer.label}
                        className="rounded border border-border bg-card p-4"
                      >
                        <div className="mb-2 flex items-center gap-2 text-accent">
                          {layer.icon}
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                            {layer.label}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{layer.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <CodeBlock
                      title="api.endpoints"
                      rows={[
                        "POST /api/scrape_and_categorize  → run scrapers + Azure OpenAI categorization",
                        "POST /api/upload_to_qdrant       → embed articles and upsert into tech_news",
                        "POST /api/search                 → embed query, return top-k matches with score",
                      ]}
                    />
                  </div>
                </motion.section>

                {/* 06 — Backend Implementation */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <SectionLabel n="06" label="Backend Implementation" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The backend is a Flask app organized around blueprints and utility modules. The main app file registers the API blueprint under /api, initializes Flask-APScheduler so scraping can run on a schedule, and wires up the routes. Qdrant credentials and the Azure OpenAI key load from a .env file through python-dotenv, which kept secrets out of source control from day one and meant I could publish the repo without a cleanup pass.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Each endpoint maps to a small utility function so the route handlers stay thin:
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                      <span>
                        <span className="font-mono text-foreground">scrape_and_categorize</span> runs the scrapers, normalizes the output into a common Article shape, calls the categorization helper, and saves both <span className="font-mono text-foreground">scraped_data.json</span> and <span className="font-mono text-foreground">categorized_data.json</span>.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                      <span>
                        <span className="font-mono text-foreground">upload_to_qdrant</span> reads the categorized JSON, encodes each article with SentenceTransformers, and upserts the vectors along with a metadata payload (title, source, URL, category).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                      <span>
                        <span className="font-mono text-foreground">search</span> is the interesting one, and it gets its own section below.
                      </span>
                    </li>
                  </ul>
                </motion.section>

                {/* 07 — Semantic Search with Qdrant */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <SectionLabel n="07" label="Semantic Search with Qdrant" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Semantic search is what makes the feed feel different from a regular news reader. Instead of matching exact words, it compares the meaning of the query to the meaning of every article in the index.
                  </p>
                  <div className="mt-5">
                    <CodeBlock
                      title="search.flow"
                      rows={[
                        "1. User submits a query string",
                        "2. Encode query with all-MiniLM-L6-v2 → 384-dim vector",
                        "3. Qdrant searches tech_news collection by cosine similarity",
                        "4. Top-k articles return with metadata + similarity score",
                        "5. Response: { Title, Details, Category, Type, Source, URL, score }",
                      ]}
                    />
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    The difference from keyword search shows up immediately. A query like &quot;open source models that run on a laptop&quot; can surface an article titled &quot;Mistral 7B on consumer hardware.&quot; Keyword search would miss that. Semantic search does not, because the embeddings cluster on meaning rather than overlapping words.
                  </p>
                </motion.section>

                {/* 08 — Frontend Implementation */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <SectionLabel n="08" label="Frontend Implementation" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The frontend is a React + Vite app written in TypeScript. It defines a small <span className="font-mono text-foreground">Article</span> interface with the same fields the backend produces: <span className="font-mono text-foreground">Title</span>, <span className="font-mono text-foreground">Details</span>, <span className="font-mono text-foreground">URL</span>, <span className="font-mono text-foreground">Source</span>, <span className="font-mono text-foreground">Category</span>.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    The UI fetches <span className="font-mono text-foreground">/categorized_data.json</span> once and renders the list. A few specifics worth calling out:
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {[
                      "Articles render as reusable Tile components, so the layout stays consistent across categories.",
                      "Clicking a tile opens a Modal with the full article details and a link to the source.",
                      "Dark mode toggles by adding a class to the root document element, so it survives page reloads.",
                      "Pagination shows 6 articles per page so the feed stays scannable.",
                      "The frontend is deliberately simple. The interesting work lives in the backend.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                {/* 09 — Key Features */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <SectionLabel n="09" label="Key Features" />
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

                {/* 10 — Technical Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <SectionLabel n="10" label="Technical Stack" />
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

                {/* 11 — Key Decisions */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <SectionLabel n="11" label="Key Decisions" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    A few choices I want to defend, because they are the ones a reviewer would push on first:
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.decisions.map((d, i) => (
                      <div key={i} className="rounded border border-border bg-card p-5">
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                          {d.title}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 12 — Challenges & Takeaways */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                >
                  <SectionLabel n="12" label="Challenges & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Challenges
                      </p>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        What I Learned
                      </p>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* 13 — Future Improvements */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <SectionLabel n="13" label="Future Improvements" />
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">
                    Things I would do if I picked this up again, roughly in order of how much I would learn from each:
                  </p>
                  <ul className="space-y-3">
                    {project.future.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.section>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.75 }}
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
