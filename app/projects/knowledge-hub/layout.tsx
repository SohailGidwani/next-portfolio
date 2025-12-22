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
        url: '/images/KnowledgeHub_1.png',
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
    images: ['/images/KnowledgeHub_1.png'],
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
