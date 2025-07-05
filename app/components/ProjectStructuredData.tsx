import Script from 'next/script'

export default function ProjectStructuredData() {
  const projectsData = [
    {
      "@type": "CreativeWork",
      "name": "Image Feature Detection & Captioning",
      "description": "AI-powered image captioning system using CNN, VGG-16, LSTM, and Transformer models with Streamlit web interface",
      "author": {
        "@type": "Person",
        "name": "Sohail Gidwani"
      },
      "url": "https://github.com/SohailGidwani/Image-Caption",
      "keywords": ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit", "Machine Learning", "Computer Vision"],
      "dateCreated": "2024",
      "genre": "Machine Learning Project"
    },
    {
      "@type": "WebApplication",
      "name": "ScribeGlobe (Medium-like Blogging site)",
      "description": "Full-stack blogging platform built with React.js, Vite, TypeScript, and serverless backend using Hono on Cloudflare Workers",
      "author": {
        "@type": "Person",
        "name": "Sohail Gidwani"
      },
      "url": "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
      "keywords": ["React", "Vite", "TypeScript", "Tailwind", "HONO", "CloudFlare", "PostgreSQL", "Full Stack"],
      "dateCreated": "2024",
      "genre": "Web Application"
    },
    {
      "@type": "WebApplication",
      "name": "Tech-updates (Personal Tech News Aggregator)",
      "description": "AI-powered news aggregator that scrapes and categorizes tech articles using Azure OpenAI and Qdrant vector database",
      "author": {
        "@type": "Person",
        "name": "Sohail Gidwani"
      },
      "url": "https://github.com/SohailGidwani/Project-TechUpdates",
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