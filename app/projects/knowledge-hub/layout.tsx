import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledge Hub - AI-Powered Document Management | Sohail Gidwani',
  description: 'A comprehensive document management and ingestion service built with Flask, SQLAlchemy, and Postgres+pgvector. Features OCR capabilities, semantic search, and AI-powered question answering for academic research.',
  keywords: 'Knowledge Hub, Document Management, AI, OCR, Vector Search, RAG, Flask, PostgreSQL, pgvector, Academic Tools, USC, MS CS',
  alternates: {
    canonical: '/projects/knowledge-hub',
  },
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  openGraph: {
    title: 'Knowledge Hub - AI-Powered Document Management | Sohail Gidwani',
    description: 'A comprehensive document management and ingestion service with OCR, semantic search, and AI-powered Q&A for academic research.',
    url: 'https://sohailgidwani.app/projects/knowledge-hub',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Knowledge%20Hub&description=AI-powered%20document%20management%20with%20OCR%2C%20semantic%20search%2C%20and%20RAG-based%20Q%26A&type=project&tags=Flask,pgvector,RAG,OCR',
        width: 1200,
        height: 630,
        alt: 'Knowledge Hub - AI-Powered Document Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Hub - AI-Powered Document Management',
    description: 'A comprehensive document management system with OCR, semantic search, and AI-powered Q&A for academic research.',
    images: ['/api/og?title=Knowledge%20Hub&description=AI-powered%20document%20management%20with%20OCR%2C%20semantic%20search%2C%20and%20RAG-based%20Q%26A&type=project&tags=Flask,pgvector,RAG,OCR'],
    creator: '@sohailgidwani',
  },
}

export default function KnowledgeHubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
