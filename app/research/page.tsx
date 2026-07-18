import type { Metadata } from "next"
import Script from "next/script"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import { research } from "@/app/data/research"
import ResearchHub from "./components/ResearchHub"

const SITE = "https://sohailgidwani.app"

export const metadata: Metadata = {
  title: "Research | Sohail Gidwani",
  description:
    "Submitted and ongoing research by Sohail Gidwani, shown as a living lineage of papers and their extensions. Includes MEMOIR-VLM, a multimodal vision-language model for Alzheimer's disease classification and VQA.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | Sohail Gidwani",
    description:
      "A living lineage of research papers and their extensions, including MEMOIR-VLM for Alzheimer's disease classification and VQA.",
    creator: "@sohailgidwani",
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
