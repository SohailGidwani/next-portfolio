import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledge Hub: AI Document Management | Sohail Gidwani',
  description: 'Flask + PostgreSQL app with pgvector that does OCR on handwritten notes and PDFs, enables semantic search, and answers questions via local RAG with Ollama.',
  keywords: ['Knowledge Hub', 'RAG', 'pgvector', 'OCR', 'Flask', 'Ollama', 'Sohail Gidwani', 'AI project'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/knowledge-hub',
  },
  openGraph: {
    title: 'Knowledge Hub: AI Document Management | Sohail Gidwani',
    description: 'Flask + PostgreSQL app with pgvector that does OCR on handwritten notes and PDFs, enables semantic search, and answers questions via local RAG with Ollama.',
    url: 'https://sohailgidwani.app/projects/knowledge-hub',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Knowledge%20Hub&description=Flask%20%2B%20pgvector%20RAG%20app%20with%20OCR%20on%20notes%20and%20PDFs%2C%20plus%20local%20LLM%20Q%26A%20via%20Ollama&type=project&tags=Flask,pgvector,RAG,OCR,Postgres',
        width: 1200,
        height: 630,
        alt: 'Knowledge Hub: AI Document Management | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Hub: AI Document Management | Sohail Gidwani',
    description: 'RAG document manager with OCR, pgvector semantic search, and local LLM Q&A.',
    images: [
      '/api/og?title=Knowledge%20Hub&description=Flask%20%2B%20pgvector%20RAG%20app%20with%20OCR%20on%20notes%20and%20PDFs%2C%20plus%20local%20LLM%20Q%26A%20via%20Ollama&type=project&tags=Flask,pgvector,RAG,OCR,Postgres',
    ],
    creator: '@sohailgidwani',
  },
}

export default function KnowledgeHubLayout({ children }: { children: React.ReactNode }) {
  return children
}
