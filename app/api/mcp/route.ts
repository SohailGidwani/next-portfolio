import { NextRequest, NextResponse } from 'next/server'

const SITE = 'https://sohailgidwani.app'

const profile = {
  name: 'Sohail Gidwani',
  fullName: 'Sohail Haresh Gidwani',
  label: 'AI/ML Engineer & Full-Stack Developer',
  email: 'sohailgidwani15@gmail.com',
  url: SITE,
  location: { city: 'Los Angeles', region: 'CA', countryCode: 'US', also: 'Mumbai, India' },
  openToWork: true,
  summary: 'AI/ML engineer and full-stack developer graduating with an M.S. in Computer Science from USC in May 2027. Builds production AI systems (RAG pipelines, multi-modal deep learning, LLM-powered applications) and pairs them with clean, user-facing frontends. Thrives in ambiguous, fast-moving environments.',
  profiles: [
    { network: 'GitHub', url: 'https://github.com/SohailGidwani' },
    { network: 'LinkedIn', url: 'https://linkedin.com/in/sohail-gidwani/' },
    { network: 'Portfolio', url: SITE },
  ],
  languages: [
    { language: 'English', fluency: 'Fluent' },
    { language: 'Hindi', fluency: 'Native speaker' },
    { language: 'Sindhi', fluency: 'Native speaker' },
  ],
  interests: ['AI/ML Research', 'Video Games', 'Travel', 'Swimming', 'Coffee'],
}

const projects = [
  {
    name: 'Portage',
    slug: 'portage',
    url: `${SITE}/projects/portage`,
    deepDive: `${SITE}/projects/portage/deep-dive`,
    github: 'https://github.com/SohailGidwani/Portage',
    type: 'application',
    description:
      'Autonomous code-migration agent (Flask → FastAPI): plans a per-file task DAG, rewrites files with an LLM on a git worktree, verifies in a network-off Docker sandbox, recovers under bounded budgets, and reports honestly. One engine, two interfaces: CLI + MCP.',
    highlights: [
      'LangGraph agent checkpointed to Postgres after every node; kill the worker mid-run and it resumes (thread_id = job_id)',
      'Postgres job queue claimed via FOR UPDATE SKIP LOCKED with heartbeat lease; content-hash idempotent Execute',
      'Ephemeral --network none Docker sandbox verification with anti-gaming predicates (passed > 0, recomputed diffs, task truth reloaded from Postgres)',
      'Eight recovery strategies (targeted contract repair, targeted rollback, widen-on-repeat, behavioral retry-all, replan, model escalation, skip-and-continue, give up) bounded by budgets and fully logged in attempts_log with per-attempt cost; a failed targeted repair restores the last coherent cut rather than the original sources',
      'Eval harness runs the real queue/worker path: 10/10 green on the Flaskr + Watchlist K=5 gates, 12/12 on the smaller K=3 tiers, 6/7 on a fresh full-corpus sweep, and 0/9 on the frozen held-out evaluation of three previously unseen repositories, published beside the development gates rather than behind them. All three later reached one strict autonomous development K1 green (42/42, 34/34, 18/18 tests) as development inputs, which is not held-out evidence; regression closure is in progress',
      'MCP server exposes verify_patch_in_sandbox, repo_graph, and blast_radius so co-pilot agents (Claude Code, Cursor) can verify patches before writing',
    ],
    tags: ['Python', 'FastAPI', 'LangGraph', 'Postgres', 'pgvector', 'LiteLLM', 'Docker', 'MCP', 'Next.js', 'Agents'],
    status: 'complete',
  },
  {
    name: 'Knowledge Hub',
    slug: 'knowledge-hub',
    url: `${SITE}/projects/knowledge-hub`,
    deepDive: `${SITE}/projects/knowledge-hub/deep-dive`,
    github: 'https://github.com/SohailGidwani/knowledge_hub',
    type: 'application',
    description: 'Flask + pgvector document manager with OCR, semantic search, and local RAG Q&A via Ollama. Built to manage USC course PDFs and handwritten notes.',
    highlights: [
      'OCR pipeline for handwritten notes and PDFs using Tesseract (multi-pass PSM) with TrOCR fallback',
      'pgvector semantic search (IVFFlat ANN) alongside full-text search (GIN + ts_rank_cd) in PostgreSQL',
      'Z-score hybrid ranking: score = 0.6·z_semantic + 0.4·z_fts with OCR confidence penalty',
      'RAG Q&A with local LLM (Ollama gemma3:1b) that cites source passages via [CIT-#] tags',
      'Containerized with Docker; setup is docker-compose up',
    ],
    tags: ['Flask', 'pgvector', 'RAG', 'OCR', 'Ollama', 'Python', 'PostgreSQL', 'Docker'],
    status: 'complete',
  },
  {
    name: 'CoT Faithfulness Analysis',
    slug: 'cot-faithfulness',
    url: `${SITE}/projects/cot-faithfulness`,
    github: 'https://github.com/SohailGidwani/cot_faithfulness',
    type: 'research',
    description: 'USC CSCI-544 NLP study probing whether chain-of-thought reasoning in LLMs causally drives answers or is post-hoc rationalization.',
    highlights: [
      'SCR (step truncation): removing CoT steps drops accuracy, confirming a causal signal',
      'CFR (corruption): corrupted reasoning still reaches correct answers, indicating partial post-hoc',
      'SBH (biased hints): models follow biased hints over correct CoT, so faithfulness breaks',
      'Models: Llama 3.2 3B and Qwen 2.5 7B via Ollama; benchmarks: GSM8K + ARC-Challenge',
      '~15K queries; conclusion: CoT is partially causal, partially decorative',
    ],
    tags: ['Python', 'LLM', 'NLP', 'Ollama', 'Llama', 'Qwen', 'GSM8K', 'ARC-Challenge', 'Research'],
    status: 'complete',
  },
  {
    name: 'Image Captioning',
    slug: 'image-captioning',
    url: `${SITE}/projects/image-captioning`,
    github: 'https://github.com/SohailGidwani/Image-Caption',
    type: 'application',
    description: 'CNN feature extraction with LSTM and Transformer decoders for automatic image caption generation.',
    highlights: [
      'VGG-16 extracts image features; LSTM and Transformer generate captions',
      'Compared recurrent and attention-based decoders in the same end-to-end pipeline',
      'Deployed as Streamlit web app for interactive demo',
    ],
    tags: ['TensorFlow', 'CNN', 'Transformer', 'VGG-16', 'Streamlit', 'Python'],
    status: 'complete',
  },
  {
    name: 'ScribeGlobe',
    slug: 'scribeglobe',
    url: `${SITE}/projects/scribeglobe`,
    github: 'https://github.com/SohailGidwani/ScribeGlobe',
    type: 'application',
    description: 'Medium-style blogging platform built to understand edge computing: React + Vite frontend, Hono API on Cloudflare Workers, Neon PostgreSQL.',
    highlights: [
      'Hono API running at the edge on Cloudflare Workers (zero cold-start latency)',
      'React + Vite frontend with full auth flow (JWT)',
      'Neon (serverless PostgreSQL) for persistent storage',
    ],
    tags: ['React', 'TypeScript', 'Cloudflare Workers', 'Hono', 'PostgreSQL', 'Neon', 'Edge Computing'],
    status: 'complete',
  },
  {
    name: 'Tech Updates',
    slug: 'tech-updates',
    url: `${SITE}/projects/tech-updates`,
    github: 'https://github.com/SohailGidwani/tech-updates',
    type: 'application',
    description: 'AI-powered news aggregator with Azure OpenAI summarization and Qdrant vector DB for semantic duplicate detection.',
    highlights: [
      'Automated ingestion from multiple RSS feeds',
      'Qdrant vector search for semantic deduplication, merging the same story from different sources',
      'Azure OpenAI GPT-4o for article summarization and category tagging',
    ],
    tags: ['Python', 'Flask', 'Azure OpenAI', 'Qdrant', 'SentenceTransformers', 'React', 'Vector Search'],
    status: 'complete',
  },
]

const experience = [
  {
    company: 'Keck School of Medicine of USC',
    position: 'Student Worker - Research Assistant',
    url: 'https://keck.usc.edu',
    startDate: '2025-10-01',
    endDate: null,
    current: true,
    tags: ['Python', 'PyTorch', 'Deep Learning', 'CLIP', 'RAG', 'FAISS'],
    summary: 'Multimodal AI for Alzheimer\'s disease classification and VQA: neuroimaging + clinical data, end-to-end experimentation infrastructure. Manuscript submitted (MEMOIR-VLM).',
    highlights: [
      'Multimodal pipeline (MEMOIR-VLM): T1 MRI + DTI imaging + clinical data across 2,363 ADNI subjects; 70.7% balanced accuracy on 3-class diagnosis, 93.3% on binary (CN vs Dementia)',
      'Missing-modality cross-attention fusion with stochastic modality dropout, enabling robust inference with any subset of T1, DTI, and clinical inputs (39.4% DTI coverage)',
      'RAG-based VQA: FAISS retrieval + cross-encoder rerank + LLM answer generation over retrieved captions; Mistral 7B wins at 94.7% diagnosis VQA accuracy vs Gemma 4 26B MoE and MedGemma 1.5 4B',
      'Two-stage training: CLIP contrastive pre-training → multi-task fine-tuning across five heads; modality ablation across 7 combinations on ~70M parameter models',
    ],
    researchUrl: `${SITE}/research/memoir-vlm-alzheimers-vqa`,
  },
  {
    company: 'Insaito, Inc.',
    position: 'Senior Software Engineer - I',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    current: false,
    tags: ['TypeScript', 'Next.js', 'Node.js', 'MongoDB', 'LLM', 'MCP'],
    summary: 'Built core infrastructure and product surfaces for an AI agent builder spanning open-source models, OAuth, MCP tools, backend services, and frontend workflows.',
    highlights: [
      'Built backend and frontend workflows for configuring agents, connecting tools, and running Qwen 3 and Mistral Small 24B',
      'Implemented reusable OAuth and MCP foundations designed to support a catalog of 100+ third-party applications; 100+ describes platform capacity, not completed integrations',
    ],
  },
  {
    company: 'IIFL Finance Ltd.',
    position: 'Full Stack Software Developer',
    url: 'https://iifl.com',
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    current: false,
    tags: ['Python', 'Flask', 'Qdrant', 'Azure OpenAI', 'React', 'Node.js'],
    summary: 'Built internal AI tools for India\'s leading NBFC: RAG chatbot, AI fraud detection, automated support.',
    highlights: [
      'AskPandaAI (RAG chatbot): Python + Flask + Qdrant + Azure OpenAI + Zoho ticketing; Certificate of Achievement from CTO',
      'Gold Loan Image Audit: internal post-launch study measured a 15% reduction in potential loan-fraud cases versus the prior review workflow',
      'CapitalGenie: internal post-launch study measured 70% faster issue resolution than the previous support workflow',
      'Compliance: data anonymization + access-control for AI services on sensitive financial data; passed security audits first review',
    ],
  },
]

const education = [
  {
    institution: 'University of Southern California',
    department: 'Viterbi School of Engineering',
    url: 'https://www.usc.edu',
    area: 'Computer Science',
    studyType: 'Master of Science',
    startDate: '2025-08-01',
    endDate: '2027-05-31',
    gpa: '3.75/4.0',
    location: 'Los Angeles, CA',
    courses: [
      'Analysis of Algorithms',
      'Information Retrieval & Web Search Engines',
      'Natural Language Processing',
      'Machine Learning for Data Science',
    ],
  },
  {
    institution: 'Thadomal Shahani Engineering College, University of Mumbai',
    url: 'https://tsec.edu',
    area: 'Computer Engineering',
    studyType: 'Bachelor of Engineering',
    startDate: '2019-08-01',
    endDate: '2023-05-31',
    gpa: '9.05/10',
    location: 'Mumbai, India',
    courses: [
      'Artificial Intelligence',
      'Machine Learning',
      'Advanced DBMS',
      'Data Structures & Algorithms',
      'Software Engineering',
      'Big Data Analytics',
      'Cloud Computing',
      'Computer Networks',
      'Cryptography & System Security',
    ],
  },
]

const skills = [
  {
    category: 'Machine Learning / AI',
    focus: true,
    skills: [
      { name: 'TensorFlow', proficiency: 5 },
      { name: 'PyTorch', proficiency: 4 },
      { name: 'Scikit-learn', proficiency: 5 },
      { name: 'Keras', proficiency: 4 },
      { name: 'OpenCV', proficiency: 4 },
      { name: 'NLTK', proficiency: 4 },
      { name: 'HuggingFace', proficiency: 5 },
      { name: 'spaCy', proficiency: 3 },
      { name: 'Pandas', proficiency: 5 },
      { name: 'NumPy', proficiency: 5 },
      { name: 'Matplotlib', proficiency: 4 },
      { name: 'Seaborn', proficiency: 4 },
      { name: 'MCP (Model Context Protocol)', proficiency: 4 },
      { name: 'LLMOps', proficiency: 4 },
      { name: 'LangChain', proficiency: 4 },
      { name: 'RAG Systems', proficiency: 5 },
      { name: 'FAISS', proficiency: 4 },
    ],
  },
  {
    category: 'Programming Languages',
    skills: [
      { name: 'Python', proficiency: 5 },
      { name: 'TypeScript', proficiency: 3 },
      { name: 'JavaScript', proficiency: 3 },
      { name: 'Java', proficiency: 4 },
      { name: 'C++', proficiency: 3 },
      { name: 'SQL', proficiency: 4 },
    ],
  },
  {
    category: 'Web Development',
    skills: [
      { name: 'React', proficiency: 3 },
      { name: 'Next.js', proficiency: 3 },
      { name: 'Node.js', proficiency: 4 },
      { name: 'Express', proficiency: 4 },
      { name: 'Flask', proficiency: 5 },
      { name: 'FastAPI', proficiency: 4 },
      { name: 'Django', proficiency: 4 },
      { name: 'Hono', proficiency: 3 },
      { name: 'Tailwind CSS', proficiency: 4 },
    ],
  },
  {
    category: 'Databases',
    skills: [
      { name: 'PostgreSQL', proficiency: 4 },
      { name: 'MongoDB', proficiency: 5 },
      { name: 'Qdrant', proficiency: 4 },
      { name: 'Redis', proficiency: 3 },
      { name: 'MySQL', proficiency: 4 },
      { name: 'Elasticsearch', proficiency: 3 },
      { name: 'pgvector', proficiency: 4 },
      { name: 'SQLAlchemy', proficiency: 4 },
    ],
  },
  {
    category: 'Cloud Platforms',
    skills: [
      { name: 'AWS', proficiency: 4 },
      { name: 'Google Cloud', proficiency: 4 },
      { name: 'Azure', proficiency: 3 },
      { name: 'Cloudflare', proficiency: 4 },
      { name: 'Heroku', proficiency: 5 },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', proficiency: 5 },
      { name: 'Docker', proficiency: 4 },
      { name: 'Kubernetes', proficiency: 3 },
      { name: 'N8N', proficiency: 4 },
      { name: 'Linux', proficiency: 4 },
      { name: 'CI/CD', proficiency: 4 },
      { name: 'RESTful APIs', proficiency: 5 },
      { name: 'Agile', proficiency: 5 },
    ],
  },
]

const research = [
  {
    title: 'MEMOIR-VLM: Multimodal Vision-Language Model for Alzheimer\'s Disease Classification and VQA',
    slug: 'memoir-vlm-alzheimers-vqa',
    url: `${SITE}/research/memoir-vlm-alzheimers-vqa`,
    institution: 'Keck School of Medicine of USC',
    status: 'manuscript submitted / in review',
    year: 2025,
    summary: 'Two-stage multimodal vision-language framework for Alzheimer\'s disease classification using T1 MRI, DTI imaging, and clinical data, with a missing-modality-aware encoder and a retrieval-augmented VQA pipeline for case-based clinical question answering.',
    keyResults: [
      '70.7% balanced accuracy on 3-class diagnosis (CN / MCI / Dementia) across 2,363 ADNI subjects',
      '93.3% balanced accuracy and AUC 0.981 on binary classification (CN vs Dementia)',
      'CDR-SB severity MAE 0.97; age MAE 6.31 years',
      'Missing-modality fusion: robust inference with any subset of T1, DTI, and clinical inputs (39.4% DTI coverage)',
      'RAG VQA: Mistral 7B achieves 94.7% diagnosis accuracy; outperforms Gemma 4 26B MoE and MedGemma 1.5 4B',
      '~70M parameter models; 7-combination modality ablation study',
    ],
    methods: [
      'CLIP contrastive pre-training on neuroimaging + clinical pairs',
      'Multi-task fine-tuning across five heads: 3-class diagnosis, binary diagnosis, CDR-SB, age, sex',
      'Cross-attention missing-modality fusion with stochastic modality dropout',
      'FAISS retrieval + cross-encoder rerank + LLM (Mistral 7B / Gemma 4 / MedGemma) over retrieved captions for VQA',
    ],
    tags: ['PyTorch', 'CLIP', 'Multi-modal', 'Alzheimer\'s', 'ADNI', 'RAG', 'VQA', 'Mistral', 'MedGemma'],
    dataset: '2,363 ADNI subjects; T1 MRI (100%), DTI (39.4%), clinical tabular data (100%)',
  },
  {
    title: 'CoT Faithfulness Analysis in LLMs',
    slug: 'cot-faithfulness',
    url: `${SITE}/projects/cot-faithfulness`,
    github: 'https://github.com/SohailGidwani/cot_faithfulness',
    institution: 'USC CSCI-544 (NLP course)',
    status: 'complete',
    year: 2025,
    summary: 'Empirical study of whether chain-of-thought reasoning causally drives LLM outputs or serves as post-hoc rationalization, using 4 controlled experiments across math and science benchmarks.',
    keyResults: [
      'SCR (step truncation) drops accuracy, confirming a partial causal role for CoT',
      'CFR (corruption) still reaches correct answers, confirming partial post-hoc rationalization',
      'SBH (biased hints) causes models to follow hints over correct reasoning, so faithfulness breaks under social pressure',
      'Qwen 2.5 7B more faithful than Llama 3.2 3B across all experiments',
    ],
    methods: [
      'SCR: truncating CoT steps at various positions',
      'CFR: injecting corrupted reasoning chains',
      'SBH: prepending misleading hints before CoT',
      '~15K queries via Ollama on GSM8K (math) and ARC-Challenge (science)',
    ],
    tags: ['NLP', 'LLM', 'Chain-of-Thought', 'Llama 3.2', 'Qwen 2.5', 'GSM8K', 'ARC-Challenge', 'Ollama'],
  },
]

const triumphs = [
  {
    title: 'Certificate of Achievement: AskPandaAI',
    issuer: 'CTO, IIFL Finance Ltd.',
    date: '2024-06-13',
    type: 'award',
    description: 'Recognized by the CTO for designing and implementing NLP-powered internal chatbot (AskPandaAI) for real-time employee access to financial data via RAG.',
  },
  {
    title: 'Tech-a-thon Hackathon: 1st Prize',
    issuer: 'IIFL',
    date: '2023-10-07',
    type: 'award',
    description: 'Won 1st place at IIFL\'s internal hackathon for an AI-powered customer support chatbot.',
  },
  {
    title: 'Rubix Hackathon: Finalist',
    issuer: 'CSI TSEC',
    date: '2022-01-20',
    type: 'award',
    description: 'Reached the finals (top teams out of 50+) with a healthcare consultation MERN web app.',
  },
  {
    title: '0-100 Full Stack Web Development',
    issuer: 'Harkirat Singh',
    date: '2024-04-01',
    type: 'certification',
    description: 'Completed intensive full-stack course covering backend architecture, DevOps practices, and cloud deployment.',
  },
]

const links = {
  portfolio: SITE,
  resume: {
    pdf: `${SITE}/documents/Sohail_Gidwani_Resume.pdf`,
    json: `${SITE}/resume.json`,
  },
  social: {
    github: 'https://github.com/SohailGidwani',
    linkedin: 'https://linkedin.com/in/sohail-gidwani/',
  },
  machineReadable: {
    llmsTxt: `${SITE}/llms.txt`,
    llmsFullTxt: `${SITE}/llms-full.txt`,
    llmsWellKnown: `${SITE}/.well-known/llms.txt`,
    mcpServer: `${SITE}/api/mcp`,
    resumeJson: `${SITE}/resume.json`,
  },
  projects: {
    'portage': `${SITE}/projects/portage`,
    'knowledge-hub': `${SITE}/projects/knowledge-hub`,
    'cot-faithfulness': `${SITE}/projects/cot-faithfulness`,
    'image-captioning': `${SITE}/projects/image-captioning`,
    'scribeglobe': `${SITE}/projects/scribeglobe`,
    'tech-updates': `${SITE}/projects/tech-updates`,
  },
  research: {
    'memoir-vlm-alzheimers-vqa': `${SITE}/research/memoir-vlm-alzheimers-vqa`,
    'cot-faithfulness': `${SITE}/projects/cot-faithfulness`,
  },
  github: {
    profile: 'https://github.com/SohailGidwani',
    repos: {
      'portage': 'https://github.com/SohailGidwani/Portage',
      'knowledge-hub': 'https://github.com/SohailGidwani/knowledge_hub',
      'cot-faithfulness': 'https://github.com/SohailGidwani/cot_faithfulness',
      'image-captioning': 'https://github.com/SohailGidwani/Image-Caption',
      'scribeglobe': 'https://github.com/SohailGidwani/ScribeGlobe',
      'tech-updates': 'https://github.com/SohailGidwani/tech-updates',
    },
  },
}

const contact = {
  email: profile.email,
  linkedin: links.social.linkedin,
  github: links.social.github,
  portfolio: SITE,
  resume: links.resume.pdf,
  preferred_contact: 'email',
  note: 'Open to discussing AI/ML and full-stack engineering opportunities.',
}

const RESOURCE_DESCRIPTIONS: Record<string, string> = {
  'portfolio://profile': 'Personal profile, contact info, social links, and open-to-work status',
  'portfolio://projects': 'All portfolio projects with full descriptions, highlights, tags, and links',
  'portfolio://experience': 'Work experience and research roles with detailed highlights',
  'portfolio://education': 'Academic background, GPA, and coursework',
  'portfolio://skills': 'Full skill inventory across AI/ML, languages, web, databases, cloud, and tools, with proficiency levels (1-5)',
  'portfolio://research': 'Published and in-progress research with key results, methods, and datasets',
  'portfolio://triumphs': 'Awards, hackathon wins, and certifications',
  'portfolio://links': 'Structured index of all important URLs: projects, research, GitHub repos, resume, and machine-readable endpoints',
  'portfolio://contact': 'Contact information and preferred ways to reach Sohail Gidwani.',
}

const RESOURCES = {
  'portfolio://profile': profile,
  'portfolio://projects': projects,
  'portfolio://experience': experience,
  'portfolio://education': education,
  'portfolio://skills': skills,
  'portfolio://research': research,
  'portfolio://triumphs': triumphs,
  'portfolio://links': links,
  'portfolio://contact': contact,
} as const

type ResourceUri = keyof typeof RESOURCES

const PROMPTS = {
  recruiter_summary: {
    description: 'A concise professional summary of Sohail\'s background suited for a recruiter or hiring manager.',
    build: () => [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Using only the profile and experience data below, write a concise professional summary of Sohail Gidwani (3-5 sentences) suited for a recruiter or hiring manager. Lead with his current focus and his strongest, most quantifiable achievements. Keep it factual and free of hype.

PROFILE:
${JSON.stringify(profile)}

EXPERIENCE:
${JSON.stringify(experience)}`,
        },
      },
    ],
  },
  ml_fit: {
    description: 'An assessment of why Sohail is a strong candidate for ML/AI engineering roles, grounded in his projects and research.',
    build: () => [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Using the data below, write an assessment of why Sohail Gidwani is a strong candidate for ML/AI engineering roles. Ground every claim in his specific experience, projects, and research; cite concrete results (metrics, models, datasets). Organize the assessment around production ML systems, research depth, and breadth of the ML/AI stack.

EXPERIENCE:
${JSON.stringify(experience)}

PROJECTS:
${JSON.stringify(projects)}

RESEARCH:
${JSON.stringify(research)}

SKILLS:
${JSON.stringify(skills)}`,
        },
      },
    ],
  },
  full_profile_brief: {
    description: 'A complete brief covering experience, skills, research, and projects, useful for AI clients that want a single-shot context load.',
    build: () => [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Below is the complete portfolio context for Sohail Gidwani, suitable for a single-shot context load. Produce a structured brief covering who he is, his experience, education, skills, research, projects, notable wins, and key links. Preserve specific metrics and URLs.

PROFILE:
${JSON.stringify(profile)}

EXPERIENCE:
${JSON.stringify(experience)}

EDUCATION:
${JSON.stringify(education)}

SKILLS:
${JSON.stringify(skills)}

RESEARCH:
${JSON.stringify(research)}

PROJECTS:
${JSON.stringify(projects)}

TRIUMPHS:
${JSON.stringify(triumphs)}

LINKS:
${JSON.stringify(links)}`,
        },
      },
    ],
  },
} as const

type PromptName = keyof typeof PROMPTS

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
        serverInfo: { name: 'sohail-portfolio-mcp', version: '2.0.0' },
        capabilities: { resources: {}, tools: {}, prompts: {} },
      })

    case 'resources/list':
      return jsonrpc(id, {
        resources: (Object.keys(RESOURCES) as ResourceUri[]).map(uri => ({
          uri,
          name: uri.replace('portfolio://', ''),
          description: RESOURCE_DESCRIPTIONS[uri],
          mimeType: 'application/json',
        })),
      })

    case 'resources/read': {
      const uri = params?.uri as string | undefined
      if (!uri || !(uri in RESOURCES)) {
        return jsonrpcError(id, -32602, 'Unknown resource URI')
      }
      return jsonrpc(id, {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(RESOURCES[uri as ResourceUri]),
        }],
      })
    }

    case 'tools/list':
      return jsonrpc(id, {
        tools: [
          {
            name: 'search_projects',
            description: 'Search portfolio projects by keyword. Matches against project name, description, highlights, and tags.',
            inputSchema: {
              type: 'object',
              properties: {
                keyword: {
                  type: 'string',
                  description: 'Case-insensitive keyword to search for',
                },
              },
              required: ['keyword'],
            },
          },
        ],
      })

    case 'tools/call': {
      const toolName = params?.name as string | undefined
      if (toolName !== 'search_projects') {
        return jsonrpcError(id, -32602, 'Unknown tool')
      }
      const args = params?.arguments as { keyword?: unknown } | undefined
      const keyword = (typeof args?.keyword === 'string' ? args.keyword : '').toLowerCase()
      const matched = projects.filter(project =>
        [project.name, project.description, ...project.highlights, ...project.tags]
          .some(field => field.toLowerCase().includes(keyword))
      )
      return jsonrpc(id, {
        content: [{ type: 'text', text: JSON.stringify(matched) }],
      })
    }

    case 'prompts/list':
      return jsonrpc(id, {
        prompts: (Object.keys(PROMPTS) as PromptName[]).map(name => ({
          name,
          description: PROMPTS[name].description,
        })),
      })

    case 'prompts/get': {
      const promptName = params?.name as string | undefined
      if (!promptName || !(promptName in PROMPTS)) {
        return jsonrpcError(id, -32602, 'Unknown prompt')
      }
      const prompt = PROMPTS[promptName as PromptName]
      return jsonrpc(id, {
        description: prompt.description,
        messages: prompt.build(),
      })
    }

    default:
      return jsonrpcError(id, -32601, 'Method not found')
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function GET() {
  return NextResponse.json({
    name: 'Sohail Gidwani Portfolio MCP Server',
    protocol: 'MCP 2024-11-05',
    version: '2.0.0',
    description: 'Query portfolio data for Sohail Gidwani, AI/ML Engineer & Full-Stack Developer. This endpoint speaks JSON-RPC 2.0 over HTTP POST; a GET (this response) is descriptive only. Send POST requests with Content-Type: application/json.',
    transport: { method: 'POST', contentType: 'application/json', endpoint: `${SITE}/api/mcp` },
    resources: Object.entries(RESOURCE_DESCRIPTIONS).map(([uri, description]) => ({ uri, description })),
    usage: {
      step1_initialize: {
        method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'your-client', version: '1.0' } },
      },
      step2_list: { method: 'resources/list' },
      step3_read: { method: 'resources/read', params: { uri: 'portfolio://profile' } },
    },
    example: {
      curl: `curl -s -X POST ${SITE}/api/mcp -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"resources/read","params":{"uri":"portfolio://profile"}}'`,
      request: {
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: { uri: 'portfolio://profile' },
      },
      response: {
        jsonrpc: '2.0',
        id: 1,
        result: {
          contents: [
            {
              uri: 'portfolio://profile',
              mimeType: 'application/json',
              text: '{"name":"Sohail Gidwani", ...}',
            },
          ],
        },
      },
    },
  })
}
