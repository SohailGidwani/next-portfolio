import Script from 'next/script'

export default function ProjectStructuredData() {
  const projectsData = [
    {
      "@type": "CreativeWork",
      "name": "Knowledge Hub - AI-Powered Document Management",
      "description": "Document management system with OCR, semantic search, and RAG-powered question answering.",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/projects/knowledge-hub",
      "codeRepository": "https://github.com/SohailGidwani/knowledge_hub",
      "keywords": ["Python", "Flask", "PostgreSQL", "pgvector", "OCR", "RAG", "Semantic Search"],
      "dateCreated": "2024",
      "genre": "AI/ML Project"
    },
    {
      "@type": "ScholarlyArticle",
      "name": "CoT Faithfulness Analysis",
      "headline": "CoT Faithfulness Analysis",
      "description": "USC NLP research project testing whether chain-of-thought reasoning causally drives answers or acts as post-hoc rationalization across Llama 3.2, Qwen 2.5, GSM8K, and ARC-Challenge.",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/projects/cot-faithfulness",
      "codeRepository": "https://github.com/SohailGidwani/cot_faithfulness",
      "keywords": ["Python", "LLM", "Ollama", "NLP", "Research", "GSM8K", "ARC", "Chain-of-Thought"],
      "dateCreated": "2025",
      "genre": "AI Research Project"
    },
    {
      "@type": "ScholarlyArticle",
      "name": "Multi-Modal Alzheimer's VQA Research",
      "headline": "Multi-Modal Missing-Modality Model + Retrieval-Augmented VQA for Alzheimer's Disease Prediction",
      "description": "Research system combining T1 MRI, DTI, and clinical data with missing-modality fusion and retrieval-augmented VQA for Alzheimer's disease prediction.",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/research/multimodal-alzheimers-vqa",
      "keywords": ["Alzheimer's disease", "multi-modal deep learning", "ADNI", "RAG VQA", "PyTorch", "Mistral 7B"],
      "dateCreated": "2026",
      "genre": "Medical AI Research"
    },
    {
      "@type": "CreativeWork",
      "name": "Image Feature Detection & Captioning",
      "description": "AI-powered image captioning system using CNN, VGG-16, LSTM, and Transformer models with Streamlit web interface",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/projects/image-captioning",
      "codeRepository": "https://github.com/SohailGidwani/Image-Caption",
      "keywords": ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit", "Machine Learning", "Computer Vision"],
      "dateCreated": "2024",
      "genre": "Machine Learning Project"
    },
    {
      "@type": "CreativeWork",
      "name": "ScribeGlobe (Medium-like Blogging site)",
      "description": "Full-stack blogging platform built with React.js, Vite, TypeScript, and serverless backend using Hono on Cloudflare Workers",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/projects/scribeglobe",
      "codeRepository": "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
      "keywords": ["React", "Vite", "TypeScript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL", "Full Stack"],
      "dateCreated": "2024",
      "genre": "Web Application"
    },
    {
      "@type": "CreativeWork",
      "name": "Tech-updates (Personal Tech News Aggregator)",
      "description": "AI-powered news aggregator that scrapes and categorizes tech articles using Azure OpenAI and Qdrant vector database",
      "author": { "@id": "https://sohailgidwani.app/#person" },
      "url": "https://sohailgidwani.app/projects/tech-updates",
      "codeRepository": "https://github.com/SohailGidwani/Project-TechUpdates",
      "keywords": ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant", "PostgreSQL", "Web Scraping", "AI"],
      "dateCreated": "2024",
      "genre": "News Aggregator"
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sohail Gidwani's Projects",
    "description": "Featured projects by Sohail Gidwani including AI/ML applications, web development, and full-stack solutions",
    "itemListElement": projectsData.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": project
    }))
  }

  return (
    <Script
      id="projects-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
} 
