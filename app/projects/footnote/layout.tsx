import { Metadata } from 'next'

const ogImage =
  '/api/og?title=Footnote&description=Smart-glasses%20app%20that%20explains%20company%20jargon%20during%20meetings%20on%20Even%20G2%2C%20built%20at%20LA%20Hacks%202026&type=project&tags=Even%20G2,TypeScript,FastAPI,ElevenLabs,Fetch.ai'

export const metadata: Metadata = {
  title: 'Footnote: Meeting Context on Smart Glasses | Sohail Gidwani',
  description:
    'Built at LA Hacks 2026 with Kartik Pradip Shelar. Footnote explains company jargon on Even G2 glasses during a meeting, saves questions with one press, and sends follow-up emails only after you approve them.',
  keywords: ['Footnote', 'Even Realities G2', 'Smart Glasses', 'LA Hacks 2026', 'ElevenLabs', 'StepFun', 'Fetch.ai', 'FastAPI', 'TypeScript', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/footnote',
  },
  openGraph: {
    title: 'Footnote: Meeting Context on Smart Glasses | Sohail Gidwani',
    description:
      'Smart-glasses app built at LA Hacks 2026: the meaning of a word and who to ask on Even G2, questions saved with one press, follow-ups sent only after you approve them.',
    url: 'https://sohailgidwani.app/projects/footnote',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Footnote: Meeting Context on Smart Glasses | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footnote: Meeting Context on Smart Glasses | Sohail Gidwani',
    description: 'Smart-glasses app that explains company jargon during meetings. Built at LA Hacks 2026.',
    images: [ogImage],
    creator: '@sohailgidwani',
  },
}

export default function FootnoteLayout({ children }: { children: React.ReactNode }) {
  return children
}
