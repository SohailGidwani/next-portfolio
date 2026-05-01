import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Updates: AI News Aggregator with Semantic Deduplication | Sohail Gidwani',
  description: 'AI-powered news aggregator using Azure OpenAI for summarization and Qdrant vector DB for semantic duplicate detection across multiple RSS feeds.',
  keywords: ['Tech Updates', 'Azure OpenAI', 'Qdrant', 'Vector Search', 'News Aggregator', 'Semantic Search', 'FastAPI', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/tech-updates',
  },
  openGraph: {
    title: 'Tech Updates: AI News Aggregator with Semantic Deduplication | Sohail Gidwani',
    description: 'Azure OpenAI + Qdrant vector DB for AI-powered news aggregation and semantic deduplication.',
    url: 'https://sohailgidwani.app/projects/tech-updates',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Tech%20Updates&description=AI-powered%20tech%20news%20aggregator%20with%20Azure%20OpenAI%20summarization%20and%20Qdrant%20semantic%20deduplication&type=project&tags=Flask,Azure%20OpenAI,Qdrant,Vector%20Search,React',
        width: 1200,
        height: 630,
        alt: 'Tech Updates: AI News Aggregator with Semantic Deduplication | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Updates: AI News Aggregator | Sohail Gidwani',
    description: 'Azure OpenAI + Qdrant semantic deduplication for AI-curated news.',
    images: [
      '/api/og?title=Tech%20Updates&description=AI-powered%20tech%20news%20aggregator%20with%20Azure%20OpenAI%20summarization%20and%20Qdrant%20semantic%20deduplication&type=project&tags=Flask,Azure%20OpenAI,Qdrant,Vector%20Search,React',
    ],
    creator: '@sohailgidwani',
  },
}

export default function TechUpdatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
