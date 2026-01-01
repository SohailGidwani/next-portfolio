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
        url: '/api/og?title=ScribeGlobe&description=Medium-like%20platform%20with%20a%20serverless%20backend%20on%20Cloudflare%20Workers&type=project&tags=React,Hono,PostgreSQL,Cloudflare',
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
    images: ['/api/og?title=ScribeGlobe&description=Medium-like%20platform%20with%20a%20serverless%20backend%20on%20Cloudflare%20Workers&type=project&tags=React,Hono,PostgreSQL,Cloudflare'],
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
