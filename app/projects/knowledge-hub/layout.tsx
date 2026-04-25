import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Knowledge Hub — AI-Powered Document Manager · Sohail Gidwani",
  description:
    "A local-first document manager built for USC coursework. OCR on handwritten notes and PDFs, hybrid semantic search with pgvector, and RAG-based Q&A using a local LLM via Ollama — no API keys, no cloud dependency.",
  keywords: [
    "Knowledge Hub",
    "document management",
    "RAG",
    "OCR",
    "pgvector",
    "semantic search",
    "Flask",
    "PostgreSQL",
    "Docker",
    "Ollama",
    "Sohail Gidwani",
  ],
  alternates: {
    canonical: "/projects/knowledge-hub",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  openGraph: {
    title: "Knowledge Hub — Local RAG Document Manager",
    description:
      "OCR + pgvector hybrid search + local LLM Q&A with citations. 100% offline, zero API keys.",
    url: "https://sohailgidwani.app/projects/knowledge-hub",
    siteName: "Sohail Gidwani",
    images: [
      {
        url: "/api/og?title=Knowledge%20Hub&description=Local%20RAG%20document%20manager%20with%20OCR%2C%20hybrid%20search%2C%20and%20LLM%20Q%26A&type=project&tags=Flask,pgvector,RAG,OCR",
        width: 1200,
        height: 630,
        alt: "Knowledge Hub — AI-Powered Document Manager",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowledge Hub — Local RAG Document Manager",
    description:
      "OCR + pgvector hybrid search + local LLM Q&A with citations. 100% offline, zero API keys.",
    images: [
      "/api/og?title=Knowledge%20Hub&description=Local%20RAG%20document%20manager%20with%20OCR%2C%20hybrid%20search%2C%20and%20LLM%20Q%26A&type=project&tags=Flask,pgvector,RAG,OCR",
    ],
    creator: "@sohailgidwani",
  },
}

export default function KnowledgeHubLayout({ children }: { children: React.ReactNode }) {
  return children
}
