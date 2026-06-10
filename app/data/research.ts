// Research registry.
//
// Future-proofing: this is the single source of truth for everything under
// /research. Add a new object to `research` to publish a paper or an
// extension. Roots are entries with `parentId: null`; extensions point at
// their parent via `parentId`. The hub, sitemap, and structured data all read
// from here, so a new paper needs no UI changes.

export type ResearchStatus =
  | "in-review"
  | "in-progress"
  | "planned"
  | "published"

export type ResearchKind = "paper" | "extension"

export interface ResearchMetric {
  value: string
  label: string
}

export interface ResearchEntry {
  /** URL slug under /research and the stable id used for parent links. */
  id: string
  kind: ResearchKind
  /** null for a root paper, otherwise the id of the paper it extends. */
  parentId: string | null
  /** Short name shown as the node label, e.g. "MEMOIR-VLM". */
  shortTitle: string
  /** Full descriptive title. */
  title: string
  /** One or two sentences for the card. */
  summary: string
  status: ResearchStatus
  /** Display year or range, e.g. "2026". */
  year: string
  /** Where the work was done / target venue. */
  venue: string
  tags: string[]
  /** Internal route if a detail page exists; null while it is unwritten. */
  href: string | null
  /** Headline numbers shown on the card (optional). */
  metrics?: ResearchMetric[]
  /** Flags throwaway test content so it can be filtered/removed cleanly. */
  placeholder?: boolean
}

export interface StatusMeta {
  label: string
  /** Tailwind classes for the badge pill. */
  badge: string
  /** Whether to render a small pulsing dot before the label. */
  pulse?: boolean
}

export const STATUS_META: Record<ResearchStatus, StatusMeta> = {
  "in-review": {
    label: "Submitted · In review",
    badge: "border-accent/40 bg-accent/10 text-accent",
    pulse: true,
  },
  "in-progress": {
    label: "In progress",
    badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
    pulse: true,
  },
  planned: {
    label: "Planned",
    badge: "border-border bg-card text-muted-foreground",
  },
  published: {
    label: "Published",
    badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  },
}

export const research: ResearchEntry[] = [
  {
    id: "memoir-vlm-alzheimers-vqa",
    kind: "paper",
    parentId: null,
    shortTitle: "MEMOIR-VLM",
    title:
      "Multimodal Vision-Language Model for Alzheimer's Disease Classification and VQA",
    summary:
      "A two-stage, missing-modality-aware framework over T1 MRI, DTI FA maps, and clinical features for Alzheimer's disease classification, extended with retrieval-augmented VQA for case-based clinical reasoning.",
    status: "in-review",
    year: "2026",
    venue: "Keck School of Medicine of USC",
    tags: ["Multimodal", "ADNI", "RAG VQA", "PyTorch", "Mistral 7B"],
    href: "/research/memoir-vlm-alzheimers-vqa",
    metrics: [
      { value: "2,363", label: "ADNI subjects" },
      { value: "0.933", label: "CN vs Dem Bal. Acc." },
      { value: "~70M", label: "Parameters" },
    ],
  },
]

/** Root papers, in registry order. */
export function getResearchRoots(): ResearchEntry[] {
  return research.filter((r) => r.parentId === null)
}

/** Direct extensions of a given paper, in registry order. */
export function getExtensions(parentId: string): ResearchEntry[] {
  return research.filter((r) => r.parentId === parentId)
}
