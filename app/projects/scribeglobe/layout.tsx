import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScribeGlobe: Serverless Blogging on Cloudflare Workers | Sohail Gidwani',
  description: 'Medium-style blogging platform built with React + Vite frontend, Hono API on Cloudflare Workers edge, and PostgreSQL (Neon) for storage.',
  keywords: ['ScribeGlobe', 'Cloudflare Workers', 'Hono', 'React', 'TypeScript', 'Edge Computing', 'Serverless', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/scribeglobe',
  },
  openGraph: {
    title: 'ScribeGlobe: Serverless Blogging on Cloudflare Workers | Sohail Gidwani',
    description: 'Medium-style blogging platform: React + Vite frontend, Hono on Cloudflare Workers, Neon PostgreSQL.',
    url: 'https://sohailgidwani.app/projects/scribeglobe',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=ScribeGlobe&description=Medium-style%20blogging%20platform%20on%20Cloudflare%20Workers%20with%20Hono%2C%20React%2C%20and%20Neon%20Postgres&type=project&tags=React,Hono,Cloudflare,Edge,Postgres',
        width: 1200,
        height: 630,
        alt: 'ScribeGlobe: Serverless Blogging on Cloudflare Workers | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScribeGlobe: Serverless Blogging on Cloudflare Workers | Sohail Gidwani',
    description: 'React + Hono + Cloudflare Workers blogging platform.',
    images: [
      '/api/og?title=ScribeGlobe&description=Medium-style%20blogging%20platform%20on%20Cloudflare%20Workers%20with%20Hono%2C%20React%2C%20and%20Neon%20Postgres&type=project&tags=React,Hono,Cloudflare,Edge,Postgres',
    ],
    creator: '@sohailgidwani',
  },
}

export default function ScribeGlobeLayout({ children }: { children: React.ReactNode }) {
  return children
}
