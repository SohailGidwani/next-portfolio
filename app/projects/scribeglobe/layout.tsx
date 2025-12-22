import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScribeGlobe - Medium-like Blogging Platform - Sohail Gidwani',
  description: 'A modern, full-stack blogging platform built with React and serverless architecture. Features responsive design, real-time content management, and scalable backend infrastructure.',
  keywords: 'ScribeGlobe, Blog Platform, React, TypeScript, Serverless, Cloudflare Workers, PostgreSQL, Full Stack Development',
  alternates: {
    canonical: '/projects/scribeglobe',
  },
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  openGraph: {
    title: 'ScribeGlobe - Medium-like Blogging Platform - Sohail Gidwani',
    description: 'A modern, full-stack blogging platform built with React and serverless architecture.',
    url: 'https://sohailgidwani.app/projects/scribeglobe',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/images/BlogSite.jpg',
        width: 1200,
        height: 630,
        alt: 'ScribeGlobe Blog Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScribeGlobe - Medium-like Blogging Platform - Sohail Gidwani',
    description: 'A modern, full-stack blogging platform built with React and serverless architecture.',
    images: ['/images/BlogSite.jpg'],
    creator: '@sohailgidwani',
  },
}

export default function ScribeGlobeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
