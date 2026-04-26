import { NextRequest, NextResponse } from 'next/server'

const SITE = 'https://sohailgidwani.app'

const profile = {
  name: 'Sohail Gidwani',
  label: 'AI/ML Engineer & Full-Stack Developer',
  email: 'sohailgidwani15@gmail.com',
  url: SITE,
  location: { city: 'Los Angeles', region: 'CA', countryCode: 'US' },
  summary: 'AI/ML engineer and full-stack developer (M.S. CS USC 2027). Builds production RAG pipelines, multi-modal deep learning systems, and LLM-powered applications.',
  profiles: [
    { network: 'GitHub', url: 'https://github.com/SohailGidwani' },
    { network: 'LinkedIn', url: 'https://linkedin.com/in/sohail-gidwani/' },
  ],
}

const projects = [
  {
    name: 'Knowledge Hub',
    slug: 'knowledge-hub',
    url: `${SITE}/projects/knowledge-hub`,
    github: 'https://github.com/SohailGidwani/knowledge_hub',
    type: 'application',
    description: 'Flask + pgvector document manager with OCR, semantic search, and local RAG Q&A via Ollama.',
    tags: ['Flask', 'pgvector', 'RAG', 'OCR', 'Ollama', 'Python'],
  },
  {
    name: 'CoT Faithfulness Analysis',
    slug: 'cot-faithfulness',
    url: `${SITE}/projects/cot-faithfulness`,
    github: 'https://github.com/SohailGidwani/cot_faithfulness',
    type: 'research',
    description: 'USC NLP research: 4 experiments probing CoT faithfulness in Llama 3.2 3B and Qwen 2.5 7B across GSM8K and ARC-Challenge (~15K queries).',
    tags: ['Python', 'LLM', 'NLP', 'Ollama', 'Llama', 'Qwen', 'Research'],
  },
  {
    name: 'Image Captioning',
    slug: 'image-captioning',
    url: `${SITE}/projects/image-captioning`,
    github: 'https://github.com/SohailGidwani/Image-Caption',
    type: 'application',
    description: 'VGG-16 + LSTM/Transformer caption generator. Transformer: 0.80 BLEU (+23% vs baseline). Deployed via Streamlit.',
    tags: ['TensorFlow', 'CNN', 'Transformer', 'Python', 'Streamlit'],
  },
  {
    name: 'ScribeGlobe',
    slug: 'scribeglobe',
    url: `${SITE}/projects/scribeglobe`,
    github: 'https://github.com/SohailGidwani/ScribeGlobe',
    type: 'application',
    description: 'Medium-style blogging platform: React + Vite frontend, Hono on Cloudflare Workers, Neon PostgreSQL.',
    tags: ['React', 'TypeScript', 'Cloudflare Workers', 'Hono', 'PostgreSQL'],
  },
  {
    name: 'Tech Updates',
    slug: 'tech-updates',
    url: `${SITE}/projects/tech-updates`,
    github: 'https://github.com/SohailGidwani/tech-updates',
    type: 'application',
    description: 'AI news aggregator with Azure OpenAI summarization and Qdrant semantic deduplication.',
    tags: ['Python', 'Azure OpenAI', 'Qdrant', 'FastAPI', 'React'],
  },
]

const experience = [
  {
    company: 'Keck School of Medicine of USC',
    position: 'Student Worker - Research Assistant',
    startDate: '2025-10-01',
    endDate: null,
    highlights: [
      "Multi-modal Alzheimer's prediction pipeline: 2,363 ADNI subjects, 72.7% 3-class balanced accuracy, 93.1% binary",
      'Missing-modality cross-attention fusion; amyloid detection sensitivity 29% → 56%',
      'CLIP pre-training + multi-task fine-tuning on ~71M parameter models',
    ],
  },
  {
    company: 'Insaito, Inc.',
    position: 'Senior Software Engineer - I',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    highlights: [
      'AI agent builder platform with OAuth for 100+ apps',
      'Open-source LLM deployment (Qwen 3, Mistral Small 24B) and MCP servers',
      'Serverless agent orchestration with concurrent multi-step tool-calling',
    ],
  },
  {
    company: 'IIFL Finance Ltd.',
    position: 'Full Stack Software Developer',
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    highlights: [
      'Internal RAG chatbot (Flask, Qdrant, Azure OpenAI) integrated with Zoho ticketing',
      'Gold Loan Image Audit with GroundingDINO + Swin-Transformer; 15% fraud reduction',
      'CapitalGenie (GPT-4o) cut issue resolution time by 70%',
    ],
  },
]

const education = [
  {
    institution: 'University of Southern California',
    area: 'Computer Science',
    studyType: 'Master of Science',
    startDate: '2025-08-01',
    endDate: '2027-05-31',
    gpa: '3.5/4.0',
    courses: ['Analysis of Algorithms', 'Information Retrieval & Web Search', 'NLP', 'ML for Data Science'],
  },
  {
    institution: 'Thadomal Shahani Engineering College, University of Mumbai',
    area: 'Computer Engineering',
    studyType: 'Bachelor of Engineering',
    startDate: '2019-08-01',
    endDate: '2023-05-31',
    gpa: '9.05/10',
  },
]

const RESOURCES = {
  'portfolio://profile': profile,
  'portfolio://projects': projects,
  'portfolio://experience': experience,
  'portfolio://education': education,
} as const

type ResourceUri = keyof typeof RESOURCES

function jsonrpc(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result })
}

function jsonrpcError(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } })
}

export async function POST(request: NextRequest) {
  let body: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> }
  try {
    body = await request.json()
  } catch {
    return jsonrpcError(null, -32700, 'Parse error')
  }

  const { id, method, params } = body

  switch (method) {
    case 'initialize':
      return jsonrpc(id, {
        protocolVersion: '2024-11-05',
        capabilities: { resources: { subscribe: false, listChanged: false } },
        serverInfo: { name: 'sohail-gidwani-portfolio', version: '1.0.0' },
      })

    case 'resources/list':
      return jsonrpc(id, {
        resources: (Object.keys(RESOURCES) as ResourceUri[]).map(uri => ({
          uri,
          name: uri.replace('portfolio://', ''),
          description: {
            'portfolio://profile': 'Personal profile, contact info, and social links',
            'portfolio://projects': 'All portfolio projects with descriptions, tech stack, and links',
            'portfolio://experience': 'Work experience and research roles',
            'portfolio://education': 'Academic background and coursework',
          }[uri],
          mimeType: 'application/json',
        })),
      })

    case 'resources/read': {
      const uri = params?.uri as string | undefined
      if (!uri || !(uri in RESOURCES)) {
        return jsonrpcError(id, -32602, `Unknown resource: ${uri ?? '(none)'}`)
      }
      return jsonrpc(id, {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(RESOURCES[uri as ResourceUri]),
        }],
      })
    }

    default:
      return jsonrpcError(id, -32601, `Method not found: ${method}`)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function GET() {
  return NextResponse.json({
    name: 'Sohail Gidwani Portfolio MCP Server',
    protocol: 'MCP 2024-11-05',
    description: 'Query portfolio data for Sohail Gidwani. POST JSON-RPC 2.0 to this endpoint.',
    resources: Object.keys(RESOURCES),
    usage: {
      initialize: { method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'your-client', version: '1.0' } } },
      list: { method: 'resources/list' },
      read: { method: 'resources/read', params: { uri: 'portfolio://profile' } },
    },
  })
}
