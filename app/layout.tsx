import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sohail Gidwani - AI Developer | RAG Developer | Full Stack Developer',
  description: 'Sohail Gidwani is a passionate AI Developer from Mumbai, India, specializing in RAG, Full Stack Development, and automation. View portfolio, projects, and experience.',
  keywords: 'Sohail Gidwani, Software Developer, AI Developer, RAG Developer, Full Stack Developer, Mumbai, India, Python, React, Node.js, Machine Learning, Artificial Intelligence, Portfolio',
  authors: [{ name: 'Sohail Gidwani' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portfolio-sohail-gidwanis-projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sohail Gidwani - AI Developer | RAG Developer | Full Stack Developer',
    description: 'Sohail Gidwani is a passionate AI Developer from Mumbai, India, specializing in RAG, Full Stack Development, and automation. View portfolio, projects, and experience.',
    url: 'https://portfolio-sohail-gidwanis-projects.vercel.app',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Sohail Gidwani - AI/ML Software Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sohail Gidwani - AI Developer | RAG Developer | Full Stack Developer',
    description: 'Sohail Gidwani is a passionate AI Developer from Mumbai, India, specializing in RAG, Full Stack Development, and automation.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google68b24d157a03257b', // Google Search Console verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sohail Gidwani",
              "jobTitle": "Software Developer",
              "description": "AI/ML Software Developer specializing in Full Stack Development and automation",
              "url": "https://portfolio-sohail-gidwanis-projects.vercel.app",
              "image": "https://portfolio-sohail-gidwanis-projects.vercel.app/api/og",
              "sameAs": [
                "https://github.com/SohailGidwani",
                "https://linkedin.com/in/sohail-gidwani"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressCountry": "India"
              },
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "University of Mumbai - TSEC"
              },
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Full Stack Development",
                "Python",
                "React",
                "Node.js",
                "TensorFlow",
                "PostgreSQL"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}