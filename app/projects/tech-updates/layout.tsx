import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech Updates — AI News Aggregator · Sohail Gidwani",
  description:
    "Personal tech news aggregator pulling from Medium, YC, and Crunchbase on a schedule. Azure OpenAI auto-categorizes articles; Qdrant stores embeddings so similar stories surface together via cosine similarity.",
  keywords: [
    "Tech Updates",
    "news aggregator",
    "web scraping",
    "Azure OpenAI",
    "Qdrant",
    "vector database",
    "Flask",
    "React",
    "PostgreSQL",
    "AI categorization",
    "Sohail Gidwani",
  ],
  alternates: {
    canonical: "/projects/tech-updates",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  publisher: "Sohail Gidwani",
  openGraph: {
    title: "Tech Updates — AI-Categorized News Aggregator",
    description:
      "Scrapes Medium, YC, and Crunchbase. Azure OpenAI tags articles by topic; Qdrant surfaces similar stories via embedding search.",
    url: "https://sohailgidwani.app/projects/tech-updates",
    siteName: "Sohail Gidwani",
    images: [
      {
        url: "/api/og?title=Tech%20Updates&description=AI-categorized%20news%20from%20Medium%2C%20YC%2C%20and%20Crunchbase%20with%20vector%20similarity%20search&type=project&tags=Flask,Azure%20OpenAI,Qdrant,React",
        width: 1200,
        height: 630,
        alt: "Tech Updates — AI News Aggregator",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2026-04-01",
    authors: ["https://sohailgidwani.app"],
    tags: ["Azure OpenAI", "LLM", "Qdrant", "Vector Search", "Flask", "React"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Updates — AI-Categorized News Aggregator",
    description:
      "Scrapes Medium, YC, and Crunchbase. Azure OpenAI tags articles by topic; Qdrant surfaces similar stories via embedding search.",
    images: [
      "/api/og?title=Tech%20Updates&description=AI-categorized%20news%20from%20Medium%2C%20YC%2C%20and%20Crunchbase%20with%20vector%20similarity%20search&type=project&tags=Flask,Azure%20OpenAI,Qdrant,React",
    ],
    creator: "@sohailgidwani",
  },
}

export default function TechUpdatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
