import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects - Sohail Gidwani | AI/ML & Full Stack Developer',
  description: 'Explore my portfolio of AI/ML and full-stack development projects. Each project showcases different aspects of my technical skills and problem-solving approach.',
  keywords: 'Sohail Gidwani Projects, AI/ML Projects, Full Stack Development, Image Captioning, Blog Platform, News Aggregator, Portfolio',
  alternates: {
    canonical: '/projects',
  },
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  openGraph: {
    title: 'Projects - Sohail Gidwani | AI/ML & Full Stack Developer',
    description: 'Explore my portfolio of AI/ML and full-stack development projects. Each project showcases different aspects of my technical skills and problem-solving approach.',
    url: 'https://sohailgidwani.app/projects',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Sohail Gidwani Projects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Sohail Gidwani | AI/ML & Full Stack Developer',
    description: 'Explore my portfolio of AI/ML and full-stack development projects.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
