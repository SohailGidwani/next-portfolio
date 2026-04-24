import { Metadata } from "next"

export const metadata: Metadata = {
  title:
    "Multi-Modal VLM + RAG VQA for Alzheimer's Detection — Sohail Gidwani Research",
  description:
    "Technical deep dive on a multi-modal vision-language model (T1 MRI, DTI FA, clinical) for Alzheimer's disease prediction, extended with a retrieval-augmented VQA pipeline. 2,363 ADNI subjects, missing-modality cross-attention fusion, 0.707 DX3 balanced accuracy, three-way LLM comparison (Mistral 7B vs Gemma 4 26B vs MedGemma 1.5 4B).",
  keywords: [
    "Alzheimer's disease",
    "multi-modal deep learning",
    "ADNI",
    "medical imaging",
    "T1 MRI",
    "DTI",
    "vision-language model",
    "VLM",
    "retrieval-augmented generation",
    "RAG",
    "VQA",
    "FAISS",
    "cross-attention fusion",
    "missing modality",
    "preclinical AD",
    "amyloid detection",
    "Mistral 7B",
    "Gemma",
    "MedGemma",
    "Keck USC",
    "Sohail Gidwani research",
  ].join(", "),
  alternates: {
    canonical: "/research/multimodal-alzheimers-vqa",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  publisher: "Sohail Gidwani",
  openGraph: {
    title:
      "Multi-Modal VLM + RAG VQA for Alzheimer's Detection",
    description:
      "Multi-modal deep learning pipeline for Alzheimer's prediction on 2,363 ADNI subjects, plus a retrieval-augmented VQA extension with a three-way LLM comparison.",
    url: "https://sohailgidwani.app/research/multimodal-alzheimers-vqa",
    siteName: "Sohail Gidwani Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Multi-Modal VLM for Alzheimer's Detection — Sohail Gidwani Research",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2026-04-23",
    authors: ["https://sohailgidwani.app"],
    tags: [
      "Alzheimer's",
      "Deep Learning",
      "Multi-modal",
      "RAG",
      "VQA",
      "ADNI",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Modal VLM + RAG VQA for Alzheimer's Detection",
    description:
      "Multi-modal deep learning pipeline for Alzheimer's prediction on 2,363 ADNI subjects, plus a retrieval-augmented VQA extension.",
    images: ["/api/og"],
    creator: "@sohailgidwani",
  },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
