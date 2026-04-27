import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Knowledge Hub: Technical Deep Dive | Sohail Gidwani",
  description:
    "Full technical breakdown of Knowledge Hub: architecture, OCR pipeline (Tesseract + TrOCR), pgvector semantic search, full-text search in Postgres, hybrid ranking with z-score normalization, and RAG with a local Ollama LLM.",
  keywords: [
    "Knowledge Hub",
    "RAG system",
    "pgvector",
    "semantic search",
    "full-text search",
    "Postgres",
    "OCR",
    "Tesseract",
    "TrOCR",
    "hybrid ranking",
    "Ollama",
    "Flask API",
    "vector embeddings",
    "IVFFlat",
    "sentence-transformers",
    "document management",
    "Sohail Gidwani project",
  ].join(", "),
  alternates: {
    canonical: "/projects/knowledge-hub/deep-dive",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  publisher: "Sohail Gidwani",
  openGraph: {
    title: "Knowledge Hub: Technical Deep Dive",
    description:
      "Architecture, OCR pipeline, pgvector semantic search, hybrid ranking, and RAG implementation details for the Knowledge Hub document management system.",
    url: "https://sohailgidwani.app/projects/knowledge-hub/deep-dive",
    siteName: "Sohail Gidwani Portfolio",
    images: [
      {
        url: "/api/og?title=Knowledge%20Hub%20Technical%20Deep%20Dive&description=OCR%20%2B%20pgvector%20%2B%20hybrid%20ranking%20%2B%20local%20RAG%20implementation&type=project&tags=Flask,pgvector,RAG,OCR,Postgres",
        width: 1200,
        height: 630,
        alt: "Knowledge Hub Technical Deep Dive | Sohail Gidwani",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowledge Hub: Technical Deep Dive",
    description:
      "OCR pipeline, pgvector semantic search, hybrid ranking, and local RAG with Ollama.",
    images: [
      "/api/og?title=Knowledge%20Hub%20Technical%20Deep%20Dive&description=OCR%20%2B%20pgvector%20%2B%20hybrid%20ranking%20%2B%20local%20RAG%20implementation&type=project&tags=Flask,pgvector,RAG,OCR,Postgres",
    ],
    creator: "@sohailgidwani",
  },
}

export default function DeepDiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
