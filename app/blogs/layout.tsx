import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blogs - Sohail Gidwani | Articles and Insights',
  description: 'Read my latest blogs on development, AI/ML, and personal projects.',
  openGraph: {
    title: 'Blogs - Sohail Gidwani | Articles and Insights',
    description: 'Read my latest blogs on development, AI/ML, and personal projects.',
    url: 'https://sohailgidwani.app/blogs',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      { url: '/api/og', width: 1200, height: 630, alt: 'Blogs' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs - Sohail Gidwani | Articles and Insights',
    description: 'Read my latest blogs.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children
}

