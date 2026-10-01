import type { Metadata } from "next"
import Script from "next/script"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import { research } from "@/app/data/research"
import ResearchHub from "./components/ResearchHub"

const SITE = "https://sohailgidwani.app"

export const metadata: Metadata = {
  title: "Research | Sohail Gidwani",
  description:
    "Published and ongoing research by Sohail Gidwani, shown as a living lineage of papers and their extensions. Includes MEMOIR-VLM, a multimodal vision-language model for Alzheimer's disease classification and question answering, published in Frontiers in Computational Neuroscience.",
  keywords: [
    "Sohail Gidwani research",
    "MEMOIR-VLM",
    "multimodal deep learning",
    "Alzheimer's disease",
    "ADNI",
    "vision-language model",
    "retrieval-augmented VQA",
    "medical AI",
    "Keck USC",
  ].join(", "),
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research | Sohail Gidwani",
    description:
      "A living lineage of research papers and their extensions, including MEMOIR-VLM for Alzheimer's disease classification and VQA.",
    url: `${SITE}/research`,
    siteName: "Sohail Gidwani Portfolio",
    type: "website",
    locale: "en_US",
    images: [{ url: "/api/og?title=Research&description=Published%20and%20ongoing%20research%2C%20including%20MEMOIR-VLM%2C%20published%20in%20Frontiers%20in%20Computational%20Neuroscience.&type=none", width: 1200, height: 630, alt: "Research by Sohail Gidwani" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | Sohail Gidwani",
    description:
      "A living lineage of research papers and their extensions, including MEMOIR-VLM for Alzheimer's disease classification and VQA.",
    creator: "@sohailgidwani",
    images: ["/api/og?title=Research&description=Published%20and%20ongoing%20research%2C%20including%20MEMOIR-VLM%2C%20published%20in%20Frontiers%20in%20Computational%20Neuroscience.&type=none"],
  },
}

export default function ResearchPage() {
  const indexable = research.filter((r) => !r.placeholder && r.href)

  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Research: Sohail Gidwani",
    url: `${SITE}/research`,
    description:
      "Research papers and their extensions by Sohail Gidwani, including MEMOIR-VLM for Alzheimer's disease classification and VQA.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: indexable.map((entry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${entry.shortTitle}: ${entry.title}`,
        url: `${SITE}${entry.href}`,
      })),
    },
  }

  return (
    <>
      <Script
        id="research-collection-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
      <BreadcrumbStructuredData
        id="research-index-breadcrumb"
        items={[{ name: "Research", item: "/research" }]}
      />
      <ResearchHub />
    </>
  )
}
