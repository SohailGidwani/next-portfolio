// Research registry.
//
// Future-proofing: this is the single source of truth for everything under
// /research. Add a new object to `research` to publish a paper, a study, or
// an extension. Roots are entries with `parentId: null`; extensions point at
// their parent via `parentId`. The hub, sitemap, and structured data all read
// from here, so a new entry needs no UI changes. Entries without an `href`
// stay out of the sitemap and the structured data.

export type ResearchStatus =
  | "in-review"
  | "accepted"
  | "in-progress"
  | "planned"
  | "published"

/** paper: accepted or published. study: ongoing work with no paper yet. */
export type ResearchKind = "paper" | "study" | "extension"

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
  /** Tailwind classes for the badge. */
  badge: string
}

// One accent for the whole site: settled states (accepted, published) take
// it, open ones stay neutral. No second colour and no pulsing dot.
const SETTLED = "border-accent/40 bg-accent/10 text-accent"
const OPEN = "border-border bg-card text-muted-foreground"

export const STATUS_META: Record<ResearchStatus, StatusMeta> = {
  "in-review": { label: "Submitted · In review", badge: OPEN },
  // Accepted but not yet out: the DOI does not resolve until the journal
  // publishes, so this must not borrow the "published" label. Kept to one
  // word: the badge is shrink-0 and a longer label overflowed a 390px card.
  accepted: { label: "Accepted", badge: SETTLED },
  "in-progress": { label: "In progress", badge: OPEN },
  planned: { label: "Planned", badge: OPEN },
  published: { label: "Published", badge: SETTLED },
}

export const research: ResearchEntry[] = [
  {
    id: "memoir-vlm-alzheimers-vqa",
    kind: "paper",
    parentId: null,
    shortTitle: "MEMOIR-VLM",
    title:
      "A multimodal vision-language model for Alzheimer's disease classification and question answering",
    summary:
      "A missing-modality-aware encoder over T1 MRI, DTI FA maps, and clinical scores that diagnoses from any available subset, with a retrieval-augmented language layer that surfaces comparable cases. Validated zero-shot on OASIS-3.",
    status: "accepted",
    year: "2026",
    venue: "Frontiers in Computational Neuroscience",
    tags: ["Multimodal", "ADNI", "OASIS-3", "RAG VQA", "PyTorch"],
    href: "/research/memoir-vlm-alzheimers-vqa",
    // Corrected model only (CDR-SB removed from the inputs). The retracted
    // 0.933 and the unsupported ~70M parameter count must not come back.
    metrics: [
      { value: "2,363", label: "ADNI subjects" },
      { value: "91.3%", label: "CN vs Dem Bal. Acc." },
      { value: "78.7%", label: "OASIS-3 zero-shot" },
    ],
  },
  {
    id: "neuro-var-jepa",
    kind: "study",
    parentId: null,
    shortTitle: "Neuro-Var-JEPA",
    title: "Self-supervised 3D Vision Transformer encoders for brain MRI",
    // Settled findings only: Phase 3 (region ordering, cohort transfer) has
    // no result yet, and the work is comparative, so nothing here may claim
    // clinical usefulness or a win over volumetric baselines.
    summary:
      "Pre-trains 3D Vision Transformers on unlabeled brain MRI by predicting hidden regions in embedding space, then probes them for Alzheimer's staging, dementia detection and brain age. A variational objective beats the deterministic baseline on all three tasks at 25% of the pre-training data but loses at full data. Cross-cohort transfer is in progress.",
    status: "in-progress",
    year: "2026",
    venue: "Keck School of Medicine of USC",
    tags: ["Self-supervised", "3D ViT", "JEPA", "Brain MRI", "PyTorch"],
    // No write-up yet, so the card is not a link and the entry stays out of
    // the sitemap and structured data.
    href: null,
    metrics: [
      { value: "16,024", label: "T1 MRI scans" },
      { value: "4", label: "Cohorts" },
      { value: "82", label: "Pre-training runs" },
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
