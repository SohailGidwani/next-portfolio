import { Badge } from "@/app/components/ui/badge"
import { FolderKanban, Database, Brain, Search, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import knowledgeHub1 from '@/public/images/KnowledgeHub_1.png'
import knowledgeHub2 from '@/public/images/KnowledgeHub_2.png'
import knowledgeHub3 from '@/public/images/KnowledgeHub_3.png'
import knowledgeHub4 from '@/public/images/KnowledgeHub_4.png'
import knowledgeHub5 from '@/public/images/KnowledgeHub_5.png'
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectImageLightbox, { ProjectImageTrigger } from "@/app/components/ProjectImageLightbox"
import ProjectActions from "@/app/projects/components/ProjectActions"
import ProjectSectionLabel from "@/app/projects/components/ProjectSectionLabel"

export default function KnowledgeHubPage() {
  const project = {
    title: "Knowledge Hub - AI-Powered Document Management",
    description: "A document manager I built for my USC coursework. It does OCR on handwritten notes and PDFs, runs semantic search with pgvector, and answers questions about your docs using a local LLM.",
    why: `I built Knowledge Hub because I was tired of digging through hundreds of course PDFs and lecture notes during my MS in CS at USC. I wanted one place where I could dump all my documents and actually find what I needed quickly.`,
    how: `The system takes in PDFs and images, runs OCR to extract text (even from handwritten notes), chunks everything up, and stores vector embeddings in PostgreSQL with pgvector. That gives me two ways to search: regular full-text search and semantic search, where I can ask a question in plain English and get back the most relevant passages.

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
        icon: <Database className="w-5 h-5" />,
        title: "Document Management",
        description: "Upload docs, and the system pulls out metadata and organizes everything automatically"
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: "AI-Powered OCR",
        description: "Extracts text from PDFs and images using OpenCV, PyMuPDF, and Tesseract"
      },
      {
        icon: <Search className="w-5 h-5" />,
        title: "Semantic Search",
        description: "Find related content with vector similarity search, powered by pgvector and Sentence-Transformers"
      },
      {
        icon: <FileText className="w-5 h-5" />,
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

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="knowledge-hub"
        image="/images/KnowledgeHub_1.png"
        keywords={project.tags}
        github={project.github}
        projectType="app"
      />
      <ProjectImageLightbox images={allImages}>
        <div className="min-h-screen overflow-x-clip bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    AI / RAG System
                  </span>
                </div>
                <h1
                  data-vt-title-target
                  className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                  {project.title}
                </h1>

                {/* Stat callout row */}
                <div className="mb-6 flex flex-wrap items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">100%</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Local / No Cloud</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">Hybrid</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Search Mode</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">RAG</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">With Citations</p>
                  </div>
                </div>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <ProjectActions
                  github={project.github}
                  deepDive="/projects/knowledge-hub/deep-dive"
                  className="mb-8"
                />
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

                {/* 01 — System Overview */}
                <section>
                  <ProjectSectionLabel n="01" label="System Overview" />
                  <ProjectImageTrigger
                    index={0}
                    label={`Expand ${project.images.howItWorks.alt}`}
                    className="relative block aspect-[21/9] w-full cursor-pointer overflow-hidden rounded border border-border text-left transition-colors hover:border-accent/40"
                  >
                    <Image
                      src={project.images.howItWorks.src}
                      alt={project.images.howItWorks.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                    <div className="absolute bottom-3 right-3 rounded border border-border bg-background/80 px-2 py-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        Click to expand
                      </span>
                    </div>
                  </ProjectImageTrigger>
                </section>

                {/* 02 — Why I Built It */}
                <section>
                  <ProjectSectionLabel n="02" label="Why I Built It" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.why}
                  </p>
                </section>

                {/* 03 — How It Works */}
                <section>
                  <ProjectSectionLabel n="03" label="How It Works" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.how}
                  </p>
                </section>

                {/* 04 — Upload & Processing */}
                <section>
                  <ProjectSectionLabel n="04" label="Upload & Processing" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.upload.map((image, index) => (
                      <ProjectImageTrigger
                        key={image.alt}
                        index={index + 1}
                        label={`Expand ${image.alt}`}
                        className="relative block aspect-video w-full cursor-pointer overflow-hidden rounded border border-border text-left transition-colors hover:border-accent/40"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </ProjectImageTrigger>
                    ))}
                  </div>
                </section>

                {/* 05 — AI Question Answering */}
                <section>
                  <ProjectSectionLabel n="05" label="AI Question Answering" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.llmResponses.map((image, index) => (
                      <ProjectImageTrigger
                        key={image.alt}
                        index={index + 3}
                        label={`Expand ${image.alt}`}
                        className="relative block aspect-video w-full cursor-pointer overflow-hidden rounded border border-border text-left transition-colors hover:border-accent/40"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </ProjectImageTrigger>
                    ))}
                  </div>
                </section>

                {/* 06 — Key Features */}
                <section>
                  <ProjectSectionLabel n="06" label="Key Features" />
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

                {/* 07 — Technical Stack */}
                <section>
                  <ProjectSectionLabel n="07" label="Technical Stack" />
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

                {/* 08 — Friction & Takeaways */}
                <section>
                  <ProjectSectionLabel n="08" label="Friction & Takeaways" />
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

                {/* Technical Deep Dive CTA */}
                <div className="rounded border border-accent/30 bg-accent/5 p-6">
                  <div className="mb-1 font-mono text-xs uppercase tracking-[0.22em] text-accent">Technical Deep Dive</div>
                  <h3 className="mb-2 font-display text-lg font-bold text-foreground">Architecture, OCR Pipeline & Hybrid Ranking</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    Every moving part explained: system architecture diagram, ingestion pipeline, full-text search in Postgres, pgvector semantic search with IVFFlat, z-score hybrid ranking, and the RAG prompt structure, with interactive SVG diagrams.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/projects/knowledge-hub/deep-dive"
                      className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                    >
                      <FolderKanban className="h-4 w-4" />
                      Read Deep Dive
                    </Link>
                    <a
                      href={project.technicalDocument.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                    >
                      <FileText className="h-4 w-4" />
                      PDF Version ({project.technicalDocument.size})
                    </a>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3 border-t border-border pt-8">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <FolderKanban className="h-4 w-4" />
                    All Projects
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </ProjectImageLightbox>
    </>
  )
}
