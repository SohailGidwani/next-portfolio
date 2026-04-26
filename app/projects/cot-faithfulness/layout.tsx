import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CoT Faithfulness Analysis — Llama 3.2 & Qwen 2.5 · Sohail Gidwani",
  description:
    "USC CSCI-544 NLP research: 4 experiments — step truncation (SCR), reasoning corruption (CFR), and biased hint injection (SBH) — testing whether chain-of-thought in Llama 3.2 3B and Qwen 2.5 7B causally drives answers or is post-hoc rationalization, across GSM8K and ARC-Challenge. ~15,000 model queries. Math CoT is partially faithful; science MC is largely post-hoc.",
  keywords: [
    "chain of thought faithfulness",
    "CoT faithfulness",
    "LLM reasoning",
    "LLM interpretability",
    "post-hoc rationalization",
    "causal reasoning",
    "Llama 3.2",
    "Llama 3.2 3B",
    "Qwen 2.5",
    "Qwen 2.5 7B",
    "Ollama",
    "GSM8K",
    "ARC-Challenge",
    "ARC",
    "NLP",
    "CSCI-544",
    "CSCI 544",
    "USC",
    "step truncation",
    "SCR",
    "Step Consistency Rate",
    "CFR",
    "Corruption Following Rate",
    "SBH",
    "Steered-But-Hidden",
    "biased hint injection",
    "reasoning corruption",
    "faithfulness evaluation",
    "chain-of-thought",
    "Sohail Gidwani",
  ],
  alternates: {
    canonical: "/projects/cot-faithfulness",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  publisher: "Sohail Gidwani",
  openGraph: {
    title: "CoT Faithfulness — Is LLM Reasoning Real or Decoration?",
    description:
      "4 experiments on Llama 3.2 3B & Qwen 2.5 7B across GSM8K and ARC-Challenge. Math CoT is partially faithful (+44–50pp accuracy lift). Science MC CoT is largely post-hoc (83% step-1 consistency, flat CFR). SBH reaches 17%.",
    url: "https://sohailgidwani.app/projects/cot-faithfulness",
    siteName: "Sohail Gidwani",
    images: [
      {
        url: "/api/og?title=CoT%20Faithfulness%20Analysis&description=4%20experiments%20probing%20chain-of-thought%20faithfulness%20in%20Llama%203.2%20%26%20Qwen%202.5%20across%20GSM8K%20and%20ARC&type=project&tags=Llama,Qwen,Ollama,NLP,Research",
        width: 1200,
        height: 630,
        alt: "CoT Faithfulness Analysis — Llama 3.2 & Qwen 2.5 · USC CSCI-544",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2026-04-25",
    authors: ["https://sohailgidwani.app"],
    tags: [
      "Chain-of-Thought",
      "LLM Interpretability",
      "Llama",
      "Qwen",
      "NLP Research",
      "GSM8K",
      "ARC",
      "USC",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoT Faithfulness — Is LLM Reasoning Real or Decoration?",
    description:
      "4 experiments on Llama 3.2 3B & Qwen 2.5 7B across GSM8K and ARC-Challenge. Math CoT: partially faithful. Science MC: largely post-hoc. SBH hits 17%.",
    images: [
      "/api/og?title=CoT%20Faithfulness%20Analysis&description=4%20experiments%20probing%20chain-of-thought%20faithfulness%20in%20Llama%203.2%20%26%20Qwen%202.5%20across%20GSM8K%20and%20ARC&type=project&tags=Llama,Qwen,Ollama,NLP,Research",
    ],
    creator: "@sohailgidwani",
  },
}

export default function CoTFaithfulnessLayout({ children }: { children: React.ReactNode }) {
  return children
}
