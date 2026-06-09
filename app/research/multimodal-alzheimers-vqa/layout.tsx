import { Metadata } from "next"

export const metadata: Metadata = {
  title:
    "MEMOIR-VLM: Multimodal VLM for Alzheimer's Classification and VQA | Sohail Gidwani Research",
  description:
    "Technical deep dive on MEMOIR-VLM, a two-stage multimodal vision-language framework (T1 MRI, DTI FA, clinical) for Alzheimer's disease classification and VQA. 2,363 ADNI subjects, missing-modality cross-attention fusion, 0.707 DX3 balanced accuracy, retrieval-augmented VQA with a three-way LLM comparison (Mistral 7B vs Gemma 4 26B vs MedGemma 1.5 4B).",
  keywords: [
    "Alzheimer's disease",
    "multimodal deep learning",
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
    "Alzheimer's classification",
    "MEMOIR-VLM",
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
      "MEMOIR-VLM: Multimodal VLM for Alzheimer's Classification and VQA",
    description:
      "Missing-modality-aware multimodal deep learning for Alzheimer's disease classification on 2,363 ADNI subjects, plus a retrieval-augmented VQA extension with a three-way LLM comparison.",
    url: "https://sohailgidwani.app/research/multimodal-alzheimers-vqa",
    siteName: "Sohail Gidwani Portfolio",
    images: [
      {
        url: "/api/og?title=MEMOIR-VLM%3A%20Multimodal%20VLM%20for%20Alzheimer%27s%20Classification%20%2B%20VQA&description=Missing-modality-aware%20deep%20learning%20on%202%2C363%20ADNI%20subjects%20with%20retrieval-augmented%20VQA&type=project&tags=VLM,RAG,ADNI,MRI,LLM",
        width: 1200,
        height: 630,
        alt: "MEMOIR-VLM: Multimodal VLM for Alzheimer's Classification and VQA | Sohail Gidwani Research",
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
    title: "MEMOIR-VLM: Multimodal VLM for Alzheimer's Classification and VQA",
    description:
      "Missing-modality-aware multimodal deep learning for Alzheimer's classification on 2,363 ADNI subjects, plus a retrieval-augmented VQA extension.",
    images: [
      "/api/og?title=MEMOIR-VLM%3A%20Multimodal%20VLM%20for%20Alzheimer%27s%20Classification%20%2B%20VQA&description=Missing-modality-aware%20deep%20learning%20on%202%2C363%20ADNI%20subjects%20with%20retrieval-augmented%20VQA&type=project&tags=VLM,RAG,ADNI,MRI,LLM",
    ],
    creator: "@sohailgidwani",
  },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
