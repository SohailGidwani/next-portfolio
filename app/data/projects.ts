import portage from "@/public/images/portage/portal-01-dashboard.png"
import knowledgeHub from "@/public/images/KnowledgeHub_5.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"
import cotfaithfulness from "@/public/images/cot_faithfulness.jpeg"
import type { StaticImageData } from "next/image"

export interface ProjectData {
  id: string
  title: string
  kind: string
  shortDescription: string
  description: string
  outcome: string
  image: StaticImageData
  tags: string[]
  github: string
  demo?: string
  deepDive?: string
  /** Shown in the home-page Projects section (all projects appear on /projects). */
  featured: boolean
}

export const projects: ProjectData[] = [
  {
    id: "portage",
    title: "Portage",
    kind: "Agentic AI",
    shortDescription: "An autonomous agent that migrates Flask apps to FastAPI and proves it with the repo's own tests.",
    description:
      "LangGraph agent that plans a per-file task DAG, rewrites each file with an LLM, verifies in a network-off Docker sandbox, and recovers from failures under bounded budgets. Checkpointed to Postgres, so you can kill the worker mid-run and it resumes. Evaluated on 6 pinned repositories at K=3.",
    outcome: "6 pinned repositories · K=3 evaluation grid · checkpoint-resume recovery",
    image: portage,
    tags: ["LangGraph", "FastAPI", "Postgres", "Docker", "MCP", "Agents"],
    github: "https://github.com/SohailGidwani/Portage",
    deepDive: "/projects/portage/deep-dive",
    // Uncomment once the compose stack is hosted (Phase 8). This renders the
    // "Live" chip on the home page and /projects cards.
    // demo: "https://YOUR_PORTAGE_DEMO_URL",
    featured: true,
  },
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    kind: "Applied AI",
    shortDescription: "Upload notes, search them semantically, ask questions with RAG.",
    description:
      "Flask + Postgres app with pgvector that does OCR on handwritten notes and uses Ollama to answer questions over my course docs. Built it because I was tired of digging through PDFs.",
    outcome: "Local-first OCR · hybrid retrieval · cited RAG answers",
    image: knowledgeHub,
    tags: ["Flask", "pgvector", "RAG", "OCR"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
    deepDive: "/projects/knowledge-hub/deep-dive",
    featured: true,
  },
  {
    id: "cot-faithfulness",
    title: "CoT Faithfulness Analysis",
    kind: "AI Research",
    shortDescription: "Do LLMs actually use their chain-of-thought, or is it just decoration?",
    description:
      "CSCI-544 course project at USC. Four experiments probing whether CoT reasoning in Llama 3.2 and Qwen 2.5 causally drives answers or is post-hoc rationalization — across math and science benchmarks.",
    outcome: "~15,000 deterministic queries · 500 benchmark samples · 4 experiments",
    image: cotfaithfulness,
    tags: ["Python", "LLM", "Ollama", "NLP", "Research"],
    github: "https://github.com/SohailGidwani/cot_faithfulness",
    featured: true,
  },
  {
    id: "image-captioning",
    title: "Image Captioning",
    kind: "Computer Vision",
    shortDescription: "Give it an image, get a caption using CNN features and learned sequence decoders.",
    description:
      "CNN/VGG-16 extracts image features, then LSTM and Transformer decoders generate captions. Wrapped in Streamlit so the complete inference pipeline can be tried from a browser.",
    outcome: "Compared LSTM and Transformer decoders in an end-to-end Streamlit pipeline",
    image: imagecaption,
    tags: ["TensorFlow", "CNN", "Transformer"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    featured: true,
  },
  {
    id: "scribeglobe",
    title: "ScribeGlobe",
    kind: "Full-Stack",
    shortDescription: "A Medium clone built on Cloudflare Workers. Serverless all the way.",
    description:
      "React + Vite frontend, Hono APIs running on Cloudflare Workers, Postgres for storage. Basically, I wanted to understand edge computing so I built a whole blogging platform.",
    outcome: "React client · Hono API · Cloudflare Workers edge deployment",
    image: blogsite,
    tags: ["React", "Hono", "PostgreSQL"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    featured: false,
  },
  {
    id: "tech-updates",
    title: "Tech Updates",
    kind: "Applied AI",
    shortDescription: "Scrapes tech news, an LLM sorts it, Qdrant makes it searchable.",
    description:
      "Personal tech news aggregator I built so I would stop opening five tabs every morning. A Flask backend scrapes Medium, YC-related feeds, and Crunchbase, Azure OpenAI categorizes the articles, and embeddings in Qdrant power semantic search. React + Vite serves the feed.",
    outcome: "Multi-source ingestion · LLM categorization · Qdrant semantic search",
    image: techupdates,
    tags: ["Flask", "Azure OpenAI", "Qdrant", "React"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    featured: true,
  },
]
