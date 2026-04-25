import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ScribeGlobe — Serverless Blogging Platform · Sohail Gidwani",
  description:
    "Full-stack blogging platform with a React + Vite frontend and Hono running on Cloudflare Workers. TypeScript end-to-end, JWT auth, markdown editor with live preview, and zero idle-server costs.",
  keywords: [
    "ScribeGlobe",
    "blogging platform",
    "Cloudflare Workers",
    "Hono",
    "serverless",
    "React",
    "Vite",
    "TypeScript",
    "PostgreSQL",
    "full-stack",
    "Sohail Gidwani",
  ],
  alternates: {
    canonical: "/projects/scribeglobe",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  openGraph: {
    title: "ScribeGlobe — Serverless Blogging on Cloudflare Workers",
    description:
      "React + Vite frontend, Hono API at the edge. TypeScript end-to-end, JWT auth, markdown with live preview.",
    url: "https://sohailgidwani.app/projects/scribeglobe",
    siteName: "Sohail Gidwani",
    images: [
      {
        url: "/api/og?title=ScribeGlobe&description=Serverless%20blogging%20platform%20with%20Hono%20on%20Cloudflare%20Workers&type=project&tags=React,Hono,TypeScript,Cloudflare",
        width: 1200,
        height: 630,
        alt: "ScribeGlobe — Serverless Blogging Platform",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScribeGlobe — Serverless Blogging on Cloudflare Workers",
    description:
      "React + Vite frontend, Hono API at the edge. TypeScript end-to-end, JWT auth, markdown with live preview.",
    images: [
      "/api/og?title=ScribeGlobe&description=Serverless%20blogging%20platform%20with%20Hono%20on%20Cloudflare%20Workers&type=project&tags=React,Hono,TypeScript,Cloudflare",
    ],
    creator: "@sohailgidwani",
  },
}

export default function ScribeGlobeLayout({ children }: { children: React.ReactNode }) {
  return children
}
