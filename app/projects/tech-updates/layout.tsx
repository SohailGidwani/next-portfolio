import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Updates: Personal AI News Aggregator | Sohail Gidwani',
  description: 'Full-stack app that scrapes tech articles from multiple sources, categorizes them with Azure OpenAI, embeds them into Qdrant, and serves a React + Vite frontend with semantic search.',
  keywords: ['Tech Updates', 'Azure OpenAI', 'Qdrant', 'Vector Search', 'News Aggregator', 'Semantic Search', 'Flask', 'SentenceTransformers', 'React', 'Vite', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/tech-updates',
  },
  openGraph: {
    title: 'Tech Updates: Personal AI News Aggregator | Sohail Gidwani',
    description: 'Flask + Azure OpenAI + Qdrant + React. Personal tech news aggregator with LLM categorization and semantic search.',
    url: 'https://sohailgidwani.app/projects/tech-updates',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Tech%20Updates&description=Personal%20AI%20news%20aggregator%20with%20Azure%20OpenAI%20categorization%20and%20Qdrant%20semantic%20search&type=project&tags=Flask,Azure%20OpenAI,Qdrant,SentenceTransformers,React',
        width: 1200,
        height: 630,
        alt: 'Tech Updates: Personal AI News Aggregator | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Updates: Personal AI News Aggregator | Sohail Gidwani',
    description: 'Flask + Azure OpenAI + Qdrant + React. Scrapes tech news, categorizes with an LLM, and lets you search by meaning.',
    images: [
      '/api/og?title=Tech%20Updates&description=Personal%20AI%20news%20aggregator%20with%20Azure%20OpenAI%20categorization%20and%20Qdrant%20semantic%20search&type=project&tags=Flask,Azure%20OpenAI,Qdrant,SentenceTransformers,React',
    ],
    creator: '@sohailgidwani',
  },
}

export default function TechUpdatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
