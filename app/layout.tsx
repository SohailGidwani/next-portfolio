import '@/app/globals.css'
import { Funnel_Display, Funnel_Sans, Martian_Mono } from 'next/font/google'
import ViewTransitions from './components/ViewTransitions'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from './components/ThemeProvider'
import FaviconSync from './components/FaviconSync'
import ThemeColorSync from './components/ThemeColorSync'
import type { Viewport } from 'next'

// Funnel: the Display cut for headings, the Sans cut for everything people
// read. Both are variable (300 to 800), so every weight the CSS asks for is
// real and none is synthesized.
const fd = Funnel_Display({
  subsets: ['latin'],
  variable: '--fd',
})

const fb = Funnel_Sans({
  subsets: ['latin'],
  variable: '--fb',
})

const fm = Martian_Mono({
  subsets: ['latin'],
  variable: '--fm',
  axes: ['wdth'],
  // Mono only styles small utility labels, never LCP text; keeping it out of
  // the preload set frees critical bandwidth for the text faces.
  preload: false,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
    // Must track the dark --bg in globals.css: on mobile this paints the
    // browser chrome, so a stale value leaves a visible seam above the page.
    { media: '(prefers-color-scheme: dark)', color: '#07080b' },
  ],
}

export const metadata = {
  title: 'Sohail Gidwani - AI Developer | AI Agent Engineer',
  description: 'Sohail Gidwani builds agentic and production AI systems: RAG platforms, agent infrastructure, and the evaluations that test them. M.S. Computer Science at USC. Projects, research, and experience.',
  keywords: 'Sohail Gidwani, AI Engineer, AI Agent Engineer, Agentic AI, RAG, LLM Evaluation, Machine Learning Engineer, Full Stack Developer, Python, TypeScript, React, Next.js, USC, Los Angeles, Portfolio',
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
    title: 'Sohail Gidwani - AI Developer | AI Agent Engineer',
    description: 'Agentic and production AI engineer: RAG platforms, agent infrastructure, and published evaluations, including a Frontiers paper on multimodal Alzheimer\'s classification. M.S. Computer Science at USC.',
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
    title: 'Sohail Gidwani - AI Developer | AI Agent Engineer',
    description: 'Agentic and production AI engineer: RAG platforms, agent infrastructure, and published evaluations. M.S. Computer Science at USC.',
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
    google: 'google68b24d157a03257b',
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
        {/* FaviconSync swaps the rel="icon" links to their light twins while the
            site is light. */}
        <link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=5" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=5" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="manifest" href="/site.webmanifest?v=5" />
        <meta name="msapplication-TileColor" content="#07080b" />
        <link rel="author" href="https://sohailgidwani.app" />
        <link rel="alternate" type="text/plain" title="LLM information" href="/llms.txt" />
        <script
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
                  "description": "AI/ML engineer specializing in agentic systems, RAG, and full-stack products. Currently pursuing an M.S. in Computer Science at USC (Expected May 2027).",
                  "url": "https://sohailgidwani.app",
                  "image": "https://sohailgidwani.app/api/og",
                  "email": "sohailgidwani15@gmail.com",
                  "sameAs": [
                    "https://github.com/SohailGidwani",
                    "https://www.linkedin.com/in/sohail-gidwani/",
                    "https://x.com/sohailgidwani",
                    "https://orcid.org/0009-0009-3348-3911",
                    "https://scholar.google.com/citations?user=bb3RfPcAAAAJ"
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Los Angeles",
                    "addressRegion": "CA",
                    "addressCountry": "US"
                  },
                  "affiliation": {
                    "@type": "CollegeOrUniversity",
                    "name": "University of Southern California",
                    "department": "Viterbi School of Engineering",
                    "url": "https://www.usc.edu",
                    "description": "Current M.S. in Computer Science student; Expected May 2027"
                  },
                  "alumniOf": {
                    "@type": "CollegeOrUniversity",
                    "name": "Thadomal Shahani Engineering College",
                    "url": "https://tsec.edu"
                  },
                  "hasCredential": {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "degree",
                    "educationalLevel": "Bachelor's Degree",
                    "name": "B.E. in Computer Engineering"
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
                    "Agentic AI",
                    "Full Stack Development",
                    "Python",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                    "TensorFlow",
                    "PyTorch",
                    "Ollama",
                    "Claude Code",
                    "Model Context Protocol (MCP)",
                    "PostgreSQL",
                    "Prisma",
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
                  "nationality": {
                    "@type": "Country",
                    "name": "India"
                  },
                  "knowsLanguage": [
                    { "@type": "Language", "name": "English" },
                    { "@type": "Language", "name": "Hindi" },
                    { "@type": "Language", "name": "Sindhi" }
                  ],
                  "hobbies": [
                    "Video Games (God of War, The Last of Us, Ghost of Tsushima, Spider-Man, FIFA)",
                    "Marvel Universe (Spider-Man, Iron Man)",
                    "Swimming",
                    "Coffee",
                    "Watching Sunsets at Santa Monica Pier"
                  ],
                  "hasSkill": [
                    { "@type": "DefinedTerm", "name": "TensorFlow", "inDefinedTermSet": "Machine Learning / AI" },
                    { "@type": "DefinedTerm", "name": "PyTorch", "inDefinedTermSet": "Machine Learning / AI" },
                    { "@type": "DefinedTerm", "name": "Flask", "inDefinedTermSet": "Backend Development" },
                    { "@type": "DefinedTerm", "name": "React", "inDefinedTermSet": "Frontend Development" },
                    { "@type": "DefinedTerm", "name": "Next.js", "inDefinedTermSet": "Frontend Development" },
                    { "@type": "DefinedTerm", "name": "PostgreSQL", "inDefinedTermSet": "Databases" },
                    { "@type": "DefinedTerm", "name": "RAG Systems", "inDefinedTermSet": "Machine Learning / AI" },
                    { "@type": "DefinedTerm", "name": "Vector Databases (Qdrant, pgvector)", "inDefinedTermSet": "Databases" },
                    { "@type": "DefinedTerm", "name": "Azure OpenAI", "inDefinedTermSet": "Cloud & AI Services" },
                    { "@type": "DefinedTerm", "name": "Docker", "inDefinedTermSet": "DevOps & Cloud" },
                    { "@type": "DefinedTerm", "name": "Ollama", "inDefinedTermSet": "Machine Learning / AI" },
                    { "@type": "DefinedTerm", "name": "Claude Code", "inDefinedTermSet": "Agentic AI & Developer Tools" },
                    { "@type": "DefinedTerm", "name": "Model Context Protocol (MCP)", "inDefinedTermSet": "Agentic AI & Developer Tools" },
                    { "@type": "DefinedTerm", "name": "FastAPI", "inDefinedTermSet": "Backend Development" },
                    { "@type": "DefinedTerm", "name": "Prisma", "inDefinedTermSet": "Databases" },
                    { "@type": "DefinedTerm", "name": "SQLAlchemy", "inDefinedTermSet": "Databases" }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sohailgidwani.app/#website",
                  "name": "Sohail Gidwani Portfolio",
                  "url": "https://sohailgidwani.app",
                  "publisher": { "@id": "https://sohailgidwani.app/#person" },
                  "inLanguage": "en"
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://sohailgidwani.app/#profilepage",
                  "url": "https://sohailgidwani.app",
                  "name": "Sohail Gidwani - AI Developer Portfolio",
                  "mainEntity": { "@id": "https://sohailgidwani.app/#person" },
                  "dateCreated": "2024-01-01",
                  "dateModified": "2026-06-12",
                  "inLanguage": "en"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${fd.variable} ${fb.variable} ${fm.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ViewTransitions />
          <FaviconSync />
          <ThemeColorSync />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
