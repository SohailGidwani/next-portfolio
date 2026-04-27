import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CoT Faithfulness Analysis: LLM Reasoning Research | Sohail Gidwani',
  description: 'USC CSCI-544 NLP research. Four experiments (SCR, CFR, SBH) probing whether chain-of-thought in Llama 3.2 3B and Qwen 2.5 7B causally drives answers or is post-hoc rationalization across GSM8K and ARC-Challenge. ~15K queries via Ollama.',
  keywords: ['CoT Faithfulness', 'Chain of Thought', 'LLM Research', 'Llama', 'Qwen', 'GSM8K', 'NLP', 'USC', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/cot-faithfulness',
  },
  openGraph: {
    title: 'CoT Faithfulness Analysis: LLM Reasoning Research | Sohail Gidwani',
    description: 'NLP research: 4 experiments testing CoT faithfulness in Llama 3.2 and Qwen 2.5 across GSM8K and ARC-Challenge. ~15K queries via Ollama.',
    url: 'https://sohailgidwani.app/projects/cot-faithfulness',
    siteName: 'Sohail Gidwani Portfolio',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'CoT Faithfulness Research' }],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoT Faithfulness Analysis: LLM Research | Sohail Gidwani',
    description: 'Do Llama 3.2 and Qwen 2.5 actually use their chain-of-thought? 4 experiments, 15K queries.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
}

export default function CoTFaithfulnessLayout({ children }: { children: React.ReactNode }) {
  return children
}
