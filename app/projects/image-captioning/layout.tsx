import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Image Feature Detection & Captioning — Sohail Gidwani",
  description:
    "CNN + Transformer pipeline for automatic image captioning. VGG-16 encoder with two decoders benchmarked head-to-head: LSTM at 0.65 BLEU vs Transformer at 0.80 — a 23% improvement. Wrapped in a Streamlit app.",
  keywords: [
    "image captioning",
    "computer vision",
    "CNN",
    "VGG-16",
    "Transformer",
    "LSTM",
    "BLEU",
    "TensorFlow",
    "Streamlit",
    "NLP",
    "Sohail Gidwani",
  ],
  alternates: {
    canonical: "/projects/image-captioning",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  openGraph: {
    title: "Image Captioning — CNN + Transformer, 0.80 BLEU",
    description:
      "VGG-16 encoder + Transformer decoder outperforms LSTM baseline by 23% on BLEU. Live demo via Streamlit.",
    url: "https://sohailgidwani.app/projects/image-captioning",
    siteName: "Sohail Gidwani",
    images: [
      {
        url: "/api/og?title=Image%20Captioning&description=CNN%20%2B%20Transformer%20pipeline%3A%200.80%20BLEU%20vs%200.65%20LSTM%20baseline&type=project&tags=TensorFlow,CNN,Transformer,VGG-16",
        width: 1200,
        height: 630,
        alt: "Image Feature Detection & Captioning — 0.80 BLEU",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Captioning — CNN + Transformer, 0.80 BLEU",
    description:
      "VGG-16 encoder + Transformer decoder outperforms LSTM baseline by 23% on BLEU. Live demo via Streamlit.",
    images: [
      "/api/og?title=Image%20Captioning&description=CNN%20%2B%20Transformer%20pipeline%3A%200.80%20BLEU%20vs%200.65%20LSTM%20baseline&type=project&tags=TensorFlow,CNN,Transformer,VGG-16",
    ],
    creator: "@sohailgidwani",
  },
}

export default function ImageCaptioningLayout({ children }: { children: React.ReactNode }) {
  return children
}
