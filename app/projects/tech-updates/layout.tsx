import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech-updates - AI-Powered News Aggregator - Sohail Gidwani',
  description: 'An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources. Features advanced content management and real-time updates.',
  keywords: 'Tech News Aggregator, AI, Web Scraping, Azure OpenAI, Qdrant, Vector Database, Flask, React, PostgreSQL',
  alternates: {
    canonical: '/projects/tech-updates',
  },
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  openGraph: {
    title: 'Tech-updates - AI-Powered News Aggregator - Sohail Gidwani',
    description: 'An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources.',
    url: 'https://sohailgidwani.app/projects/tech-updates',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Tech%20Updates&description=Personal%20tech-news%20aggregator%20with%20AI-driven%20categorization&type=project&tags=Flask,Azure%20OpenAI,Qdrant,React',
        width: 1200,
        height: 630,
        alt: 'Tech Updates News Aggregator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech-updates - AI-Powered News Aggregator - Sohail Gidwani',
    description: 'An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources.',
    images: ['/api/og?title=Tech%20Updates&description=Personal%20tech-news%20aggregator%20with%20AI-driven%20categorization&type=project&tags=Flask,Azure%20OpenAI,Qdrant,React'],
    creator: '@sohailgidwani',
  },
}

export default function TechUpdatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
