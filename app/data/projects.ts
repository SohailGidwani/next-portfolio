import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"
import cotfaithfulness from "@/public/images/cot_faithfulness.jpeg"
import type { StaticImageData } from "next/image"

export interface ProjectData {
  id: string
  title: string
  shortDescription: string
  description: string
  image: StaticImageData
  tags: string[]
  github: string
  demo?: string
  featured: boolean
}

export const projects: ProjectData[] = [
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    shortDescription: "Upload notes, search them semantically, ask questions with RAG.",
    description:
      "Flask + Postgres app with pgvector that does OCR on handwritten notes and uses Ollama to answer questions over my course docs. Built it because I was tired of digging through PDFs.",
    image: knowledgeHub,
    tags: ["Flask", "pgvector", "RAG", "OCR"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
    featured: true,
  },
  {
    id: "cot-faithfulness",
    title: "CoT Faithfulness Analysis",
    shortDescription: "Do LLMs actually use their chain-of-thought, or is it just decoration?",
    description:
      "CSCI-544 course project at USC. Four experiments probing whether CoT reasoning in Llama 3.2 and Qwen 2.5 causally drives answers or is post-hoc rationalization — across math and science benchmarks.",
    image: cotfaithfulness,
    tags: ["Python", "LLM", "Ollama", "NLP", "Research"],
    github: "https://github.com/SohailGidwani/cot_faithfulness",
    featured: true,
  },
  {
    id: "image-captioning",
    title: "Image Captioning",
    shortDescription: "Give it an image, get a caption. Transformer model hit 0.80 BLEU.",
    description:
      "CNN/VGG-16 pulls features from images, then an LSTM and Transformer generate captions. The Transformer version hit 0.80 BLEU. Wrapped it in Streamlit so anyone could try it.",
    image: imagecaption,
    tags: ["TensorFlow", "CNN", "Transformer"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    featured: true,
  },
  {
    id: "scribeglobe",
    title: "ScribeGlobe",
    shortDescription: "A Medium clone built on Cloudflare Workers. Serverless all the way.",
    description:
      "React + Vite frontend, Hono APIs running on Cloudflare Workers, Postgres for storage. Basically, I wanted to understand edge computing so I built a whole blogging platform.",
    image: blogsite,
    tags: ["React", "Hono", "PostgreSQL"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    featured: true,
  },
  {
    id: "tech-updates",
    title: "Tech Updates",
    shortDescription: "Scrapes tech news from multiple sources, AI sorts it for me.",
    description:
      "Python scrapes articles from Medium, YC, and Crunchbase. Azure OpenAI categorizes them, Qdrant stores the vectors, and a Flask + React frontend serves it all up.",
    image: techupdates,
    tags: ["Flask", "Azure OpenAI", "Qdrant"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    featured: false,
  },
]
