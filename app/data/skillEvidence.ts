// Where each tool on the Skills cards was actually used, shown when a card is
// opened. Every entry is backed by the site's own write-ups or by Sohail's
// word (noted), and nothing here is inferred from a passing mention: a tool
// named only as a future improvement, as a choice not taken, or as part of
// an app Portage migrates does not count. At most three places per tool; a
// tool with no entry shows no popover rather than an empty one.

export interface UsedIn {
  /** What it was: a project, a paper, a role. */
  label: string
  /** A few words on how, when that adds something. */
  detail?: string
  /** A page to go to... */
  href?: string
  /** ...or a role card in Experience to open. */
  experience?: "keck-usc" | "insaito" | "iifl"
}

const KECK: UsedIn = { label: "Keck research", experience: "keck-usc" }
const IIFL: UsedIn = { label: "IIFL Finance", experience: "iifl" }
const INSAITO: UsedIn = { label: "Insaito", experience: "insaito" }
const MEMOIR: UsedIn = { label: "MEMOIR-VLM", href: "/research/memoir-vlm-alzheimers-vqa" }
const JEPA: UsedIn = { label: "Neuro-Var-JEPA", href: "/research" }
const PORTAGE: UsedIn = { label: "Portage", href: "/projects/portage" }
const KNOWLEDGE_HUB: UsedIn = { label: "Knowledge Hub", href: "/projects/knowledge-hub" }
const SCRIBEGLOBE: UsedIn = { label: "ScribeGlobe", href: "/projects/scribeglobe" }
const TECH_UPDATES: UsedIn = { label: "Tech Updates", href: "/projects/tech-updates" }
const COT: UsedIn = { label: "CoT Faithfulness", href: "/projects/cot-faithfulness" }
const THIS_SITE: UsedIn = { label: "This site" }

export const SKILL_EVIDENCE: Record<string, UsedIn[]> = {
  Python: [KECK, IIFL, INSAITO],
  // Sohail: Gemma, Mistral and other models at Keck.
  HuggingFace: [{ ...KECK, detail: "Gemma, Mistral" }],
  Qdrant: [IIFL, TECH_UPDATES],
  Azure: [IIFL, { ...TECH_UPDATES, detail: "Azure OpenAI" }],
  Flask: [IIFL, INSAITO, KNOWLEDGE_HUB],
  // Sohail: SQLAlchemy in AskPandaAI at IIFL as well.
  SQLAlchemy: [{ ...IIFL, detail: "AskPandaAI" }, KNOWLEDGE_HUB],
  Docker: [PORTAGE, KNOWLEDGE_HUB],
  // Sohail: Pandas and scikit-learn at Keck.
  Pandas: [KECK],
  PyTorch: [MEMOIR, JEPA],
  OpenCV: [{ ...KNOWLEDGE_HUB, detail: "OCR pipeline" }],
  "Scikit-learn": [KECK],
  FastAPI: [PORTAGE],
  // Sohail: AskPandaAI first ran on EC2, S3 and API Gateway, before the move to Azure.
  AWS: [{ ...IIFL, detail: "AskPandaAI on EC2, S3" }],
  TypeScript: [SCRIBEGLOBE, TECH_UPDATES],
  "Next.js": [{ ...PORTAGE, detail: "frontend" }, THIS_SITE],
  React: [SCRIBEGLOBE, TECH_UPDATES],
  "Tailwind CSS": [SCRIBEGLOBE, TECH_UPDATES, THIS_SITE],
  "Node.js": [INSAITO],
  PostgreSQL: [PORTAGE, SCRIBEGLOBE, { ...KNOWLEDGE_HUB, detail: "pgvector" }],
  CloudFlare: [{ ...SCRIBEGLOBE, detail: "Workers" }],
  "Claude Code": [{ ...PORTAGE, detail: "co-pilot over MCP" }],
  MCP: [PORTAGE, INSAITO],
  Ollama: [{ ...KNOWLEDGE_HUB, detail: "local RAG" }, COT],
  "Google Cloud": [INSAITO],
}
