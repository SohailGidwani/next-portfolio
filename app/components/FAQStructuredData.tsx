import Script from 'next/script'

export default function FAQStructuredData() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Sohail Gidwani's specialization?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail Gidwani specializes in AI/ML engineering, RAG (Retrieval-Augmented Generation) systems, full-stack development, and building intelligent systems. He focuses on practical AI that ships and scales, with expertise in Python, Flask, React, Next.js, and vector databases."
        }
      },
      {
        "@type": "Question",
        "name": "What is Sohail Gidwani's educational background?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail Gidwani is currently pursuing a Master of Science in Computer Science at the University of Southern California (USC), Viterbi School of Engineering. He also holds a Bachelor's degree in Computer Engineering from Thadomal Shahani Engineering College, Mumbai, India."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of projects has Sohail Gidwani worked on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail has worked on various AI/ML projects including: Knowledge Hub (AI-powered document management with OCR and RAG), Image Captioning systems using CNN and Transformer models, ScribeGlobe (full-stack blogging platform), Tech Updates (AI-powered news aggregator), and custom data chatbots for enterprise support."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Sohail Gidwani located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail Gidwani is based in Los Angeles, California, and Mumbai, India. He is open to both remote and on-site opportunities."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies does Sohail Gidwani work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail works with a wide range of technologies including: Machine Learning (TensorFlow, PyTorch, Scikit-learn, HuggingFace), Backend (Python, Flask, Node.js, FastAPI), Frontend (React, Next.js, TypeScript), Databases (PostgreSQL, MongoDB, Qdrant, pgvector), Cloud (Azure, AWS, Cloudflare Workers), and AI/LLM tools (Azure OpenAI, RAG systems, vector databases)."
        }
      },
      {
        "@type": "Question",
        "name": "What is Sohail Gidwani's work experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sohail is currently a Research Assistant at Keck School of Medicine of USC, working on vision-language models for healthcare. Previously, he was a Senior Software Engineer at Insaito Inc., building AI agent platforms and deploying open-source LLMs. He also worked as a Full-Stack/AI Developer at IIFL Finance Ltd, where he built RAG-based chatbots and AI-powered applications."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact Sohail Gidwani?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Sohail Gidwani via email at sohailgidwani15@gmail.com, connect with him on LinkedIn at linkedin.com/in/sohail-gidwani, or check out his work on GitHub at github.com/SohailGidwani."
        }
      },
      {
        "@type": "Question",
        "name": "What are Sohail Gidwani's personal interests?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Beyond coding, Sohail is passionate about story-driven video games (God of War, The Last of Us, Ghost of Tsushima), the Marvel Universe (especially Spider-Man and Iron Man), swimming, coffee culture, and watching sunsets at Santa Monica Pier."
        }
      },
      {
        "@type": "Question",
        "name": "Is Sohail Gidwani available for hire?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Sohail Gidwani is open to opportunities in AI/ML engineering, full-stack development, and intelligent systems development. He is available for both remote and on-site positions."
        }
      }
    ]
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData)
      }}
    />
  )
}
