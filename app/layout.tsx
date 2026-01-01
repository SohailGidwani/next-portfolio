import '@/app/globals.css'
import { Fraunces, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Sohail Gidwani - AI Developer | AI Agent Engineer | RAG Developer | Full Stack Developer',
  description: 'Sohail Gidwani is a passionate AI Agent Engineer specializing in RAG, Full Stack Development, and automation. USC Computer Science graduate student interested in AI, gaming, and travel. View portfolio, projects, and experience.',
  keywords: 'Sohail Gidwani, Software Developer, AI Agent Engineer, AI Developer, RAG Developer, Full Stack Developer, Mumbai, India, Python, React, Node.js, Machine Learning, Artificial Intelligence, Portfolio, Gaming, Travel, Personal Interests',
  authors: [{ name: 'Sohail Gidwani' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sohailgidwani.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sohail Gidwani - AI Developer | AI Agent Engineer | RAG Developer | Full Stack Developer',
    description: 'Sohail Gidwani is a passionate AI Developer specializing in RAG, Full Stack Development, and automation. USC Computer Science graduate student interested in AI, gaming, and travel.',
    url: 'https://sohailgidwani.app',
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
    title: 'Sohail Gidwani - AI Developer | AI Agent Engineer | RAG Developer | Full Stack Developer',
    description: 'Sohail Gidwani is a passionate AI Developer specializing in RAG, Full Stack Development, and automation. USC CS student interested in AI, gaming, and travel.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f5efe7" />
        <meta name="msapplication-TileColor" content="#f5efe7" />
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://sohailgidwani.app/#person",
                  "name": "Sohail Gidwani",
                  "givenName": "Sohail",
                  "familyName": "Gidwani",
                  "jobTitle": "AI / CS Engineer",
                  "description": "AI/ML software developer specializing in full-stack development, RAG systems, and applied intelligence. Currently pursuing M.S. in Computer Science at USC.",
                  "url": "https://sohailgidwani.app",
                  "image": "https://sohailgidwani.app/api/og",
                  "email": "sohailgidwani15@gmail.com",
                  "sameAs": [
                    "https://github.com/SohailGidwani",
                    "https://www.linkedin.com/in/sohail-gidwani/"
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Los Angeles",
                    "addressRegion": "CA",
                    "addressCountry": "US"
                  },
                  "alumniOf": [
                    {
                      "@type": "CollegeOrUniversity",
                      "name": "University of Southern California",
                      "department": "Viterbi School of Engineering",
                      "url": "https://www.usc.edu"
                    },
                    {
                      "@type": "CollegeOrUniversity",
                      "name": "Thadomal Shahani Engineering College",
                      "url": "https://tsec.edu"
                    }
                  ],
                  "hasCredential": {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "degree",
                    "educationalLevel": "Master's Degree",
                    "name": "M.S. in Computer Science"
                  },
                  "worksFor": {
                    "@type": "EducationalOrganization",
                    "name": "Keck School of Medicine of USC",
                    "url": "https://keck.usc.edu"
                  },
                  "knowsAbout": [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "Large Language Models",
                    "RAG Systems",
                    "Full Stack Development",
                    "Python",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                    "TensorFlow",
                    "PyTorch",
                    "PostgreSQL",
                    "Vector Databases"
                  ],
                  "hasOccupation": [
                    {
                      "@type": "Occupation",
                      "name": "Research Assistant",
                      "occupationLocation": {
                        "@type": "City",
                        "name": "Los Angeles"
                      }
                    },
                    {
                      "@type": "Occupation",
                      "name": "Full-Stack AI Developer",
                      "skills": "Python, Flask, React, PostgreSQL, Vector Databases, LLM Integration"
                    }
                  ],
                  "interestIn": [
                    "Artificial Intelligence",
                    "Video Games",
                    "Gaming",
                    "Travel",
                    "Technology",
                    "Machine Learning Research"
                  ],
                  "knowsLanguage": [
                    {
                      "@type": "Language",
                      "name": "English"
                    },
                    {
                      "@type": "Language",
                      "name": "Hindi"
                    }
                  ],
                  "hobbies": [
                    "Video Games (God of War, The Last of Us, Ghost of Tsushima, Spider-Man, FIFA)",
                    "Marvel Universe (Spider-Man, Iron Man)",
                    "Swimming",
                    "Coffee",
                    "Watching Sunsets at Santa Monica Pier"
                  ],
                  "hasSkill": [
                    {
                      "@type": "DefinedTerm",
                      "name": "TensorFlow",
                      "inDefinedTermSet": "Machine Learning / AI"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "PyTorch",
                      "inDefinedTermSet": "Machine Learning / AI"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "Flask",
                      "inDefinedTermSet": "Backend Development"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "React",
                      "inDefinedTermSet": "Frontend Development"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "Next.js",
                      "inDefinedTermSet": "Frontend Development"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "PostgreSQL",
                      "inDefinedTermSet": "Databases"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "RAG Systems",
                      "inDefinedTermSet": "Machine Learning / AI"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "Vector Databases (Qdrant, pgvector)",
                      "inDefinedTermSet": "Databases"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "Azure OpenAI",
                      "inDefinedTermSet": "Cloud & AI Services"
                    },
                    {
                      "@type": "DefinedTerm",
                      "name": "Docker",
                      "inDefinedTermSet": "DevOps & Cloud"
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sohailgidwani.app/#website",
                  "name": "Sohail Gidwani Portfolio",
                  "url": "https://sohailgidwani.app",
                  "publisher": {
                    "@id": "https://sohailgidwani.app/#person"
                  },
                  "inLanguage": "en",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://sohailgidwani.app/#projects",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://sohailgidwani.app/#profilepage",
                  "url": "https://sohailgidwani.app",
                  "name": "Sohail Gidwani - AI Developer Portfolio",
                  "mainEntity": {
                    "@id": "https://sohailgidwani.app/#person"
                  },
                  "dateCreated": "2024-01-01",
                  "dateModified": new Date().toISOString().split('T')[0],
                  "inLanguage": "en"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${body.variable} ${display.variable} ${mono.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
