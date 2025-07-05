import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech-updates - AI-Powered News Aggregator - Sohail Gidwani',
  description: 'An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources. Features advanced content management and real-time updates.',
  keywords: 'Tech News Aggregator, AI, Web Scraping, Azure OpenAI, Qdrant, Vector Database, Flask, React, PostgreSQL',
  openGraph: {
    title: 'Tech-updates - AI-Powered News Aggregator - Sohail Gidwani',
    description: 'An intelligent news aggregator that uses AI to scrape, categorize, and present personalized tech news from multiple sources.',
    url: 'https://portfolio-sohail-gidwanis-projects.vercel.app/projects/tech-updates',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og',
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
    images: ['/api/og'],
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