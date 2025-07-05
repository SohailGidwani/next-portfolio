import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScribeGlobe - Medium-like Blogging Platform - Sohail Gidwani',
  description: 'A modern, full-stack blogging platform built with React and serverless architecture. Features responsive design, real-time content management, and scalable backend infrastructure.',
  keywords: 'ScribeGlobe, Blog Platform, React, TypeScript, Serverless, Cloudflare Workers, PostgreSQL, Full Stack Development',
  openGraph: {
    title: 'ScribeGlobe - Medium-like Blogging Platform - Sohail Gidwani',
    description: 'A modern, full-stack blogging platform built with React and serverless architecture.',
    url: 'https://portfolio-sohail-gidwanis-projects.vercel.app/projects/scribeglobe',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og',
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
    images: ['/api/og'],
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