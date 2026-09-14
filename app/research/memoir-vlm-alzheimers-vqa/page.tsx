import type { ReactNode } from "react"
import Link from "next/link"
import Script from "next/script"
import { Home, FileText, Github, Brain, Microscope, MessageSquare } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import ReadingProgress from "@/app/components/ReadingProgress"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"
import MobileSection from "@/app/components/MobileSection"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import VLMArchitecture from "./components/VLMArchitecture"
import VQAPipeline from "./components/VQAPipeline"
import AblationChart from "./components/AblationChart"
import LLMComparison from "./components/LLMComparison"
import PairedDifferences from "./components/PairedDifferences"

// Every number on this page is from the accepted paper's corrected model,
// which removed CDR-SB from the clinical inputs. The original (leaky) figures
// appear only in the labeled comparison table in Results. Some tables in the
// author's proof still carry pre-correction values (0.707 / 0.933, "six task
// heads", "6 continuous features"); the corrected prose and Tables 10 and 21
// win every conflict, so do not "fix" this page back from those tables.

const DOI = "10.3389/fncom.2026.1902258"

const tocItems = [
  { id: "section-01", n: "01", label: "The Clinical Ask" },
  { id: "section-02", n: "02", label: "Dataset" },
  { id: "section-03", n: "03", label: "Model Architecture" },
  { id: "section-04", n: "04", label: "Training Procedure" },
  { id: "section-05", n: "05", label: "Results" },
  { id: "section-06", n: "06", label: "Modality Ablation" },
  { id: "section-07", n: "07", label: "RAG VQA Extension" },
  { id: "section-08", n: "08", label: "LLM Comparison" },
  { id: "section-09", n: "09", label: "External Validation" },
  { id: "section-10", n: "10", label: "Key Findings" },
]

function Stat({
  value,
  label,
  primary,
}: {
  value: string
  label: ReactNode
  primary?: boolean
}) {
  return (
    <div className={`border-l-2 ${primary ? "border-accent" : "border-border"} pl-4`}>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

export default function MultiModalAlzheimersVQAPage() {
  // ── Corrected ablation (paper Table 21a). Only the four clinical-inclusive
  // configurations have corrected values; the imaging-only bars in the proof's
  // Table 14b are pre-correction, so they stay out of the chart. ──
  const ablationPanels = [
    {
      title: "DX 3-class (Bal. Acc.)",
      subtitle: "CN / MCI / Dementia · n = 474",
      bars: [
        { label: "T1 + DTI + Clin", value: 0.682 },
        { label: "T1 + Clin", value: 0.683 },
        { label: "DTI + Clin", value: 0.701, highlight: true },
        { label: "Clin only", value: 0.666 },
      ],
    },
    {
      title: "DX Binary (Bal. Acc.)",
      subtitle: "CN vs Dementia · n = 311",
      bars: [
        { label: "T1 + DTI + Clin", value: 0.913 },
        { label: "T1 + Clin", value: 0.906 },
        { label: "DTI + Clin", value: 0.91 },
        { label: "Clin only", value: 0.893 },
      ],
    },
  ]

  // ── Paired bootstrap comparisons, three-class diagnosis (Table 21a). ──
  const pairedDX3 = [
    { id: "A", a: { name: "Clinical only", value: 0.666 }, b: { name: "DTI + Clinical", value: 0.701 }, diff: 0.034, lo: 0.009, hi: 0.06, p: "0.012" },
    { id: "B", a: { name: "Clinical only", value: 0.666 }, b: { name: "Full", value: 0.682 }, diff: 0.016, lo: -0.031, hi: 0.062, p: "0.498" },
    { id: "C", a: { name: "Clinical only", value: 0.666 }, b: { name: "T1 + Clinical", value: 0.683 }, diff: 0.016, lo: -0.028, hi: 0.062, p: "0.488" },
    { id: "D", a: { name: "Full", value: 0.682 }, b: { name: "Clinical MLP", value: 0.705 }, diff: 0.023, lo: -0.023, hi: 0.068, p: "0.379" },
    { id: "E", a: { name: "Full", value: 0.682 }, b: { name: "AutoGluon", value: 0.699 }, diff: 0.016, lo: -0.031, hi: 0.064, p: "0.549" },
  ]

  // ── Structured data (ScholarlyArticle) ──
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline:
      "MEMOIR-VLM: A Multimodal Vision-Language Model for Alzheimer's Disease Classification and Question Answering",
    author: [
      {
        "@type": "Person",
        name: "Sohail Gidwani",
        url: "https://sohailgidwani.app",
        affiliation: {
          "@type": "Organization",
          name: "Keck School of Medicine of USC",
        },
      },
      { "@type": "Person", name: "Tamoghna Chattopadhyay" },
      { "@type": "Person", name: "Sophia I. Thomopoulos" },
      { "@type": "Person", name: "Paul M. Thompson" },
      { "@type": "Organization", name: "Alzheimer's Disease Neuroimaging Initiative" },
    ],
    identifier: { "@type": "PropertyValue", propertyID: "DOI", value: DOI },
    // No datePublished until the journal publishes: schema.org has no
    // "accepted" state, and a date is a publication claim.
    dateModified: "2026-09-13",
    keywords: [
      "Alzheimer's disease",
      "multimodal deep learning",
      "missing modality",
      "ADNI",
      "OASIS-3",
      "retrieval-augmented VQA",
    ],
    description:
      "MEMOIR-VLM is a two-stage multimodal vision-language framework for Alzheimer's disease classification using T1 MRI, DTI FA maps, and structured clinical scores, accepted at Frontiers in Computational Neuroscience. A missing-modality-aware encoder performs diagnosis and clinical prediction from any available subset of inputs (91.3% CN vs dementia and 68.2% 3-class balanced accuracy after removing a CDR-SB input leak) and transfers zero-shot to OASIS-3 (78.7% balanced accuracy). A retrieval-augmented language layer serves as an interpretable interface over comparable cases, not as a diagnostic classifier.",
    isAccessibleForFree: true,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: "Sohail Gidwani",
    },
  }

  return (
    <>
      <Script
        id="research-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BreadcrumbStructuredData
        id="research-breadcrumb"
        items={[
          { name: "MEMOIR-VLM Alzheimer's Research", item: "/research/memoir-vlm-alzheimers-vqa" },
        ]}
      />

      <div className="min-h-screen overflow-x-clip bg-background text-foreground">
        {/* ─── Top nav ─── */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
          <ReadingProgress />
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/#experience"
              className="inline-flex items-center gap-1.5 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <SectionTOC items={tocItems} />
        {/* Wayfinding below the 1200px rail: the two never show at once. */}
        <MobileChapterNav items={tocItems} />

        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  Research / Keck USC
                </span>
              </div>
              {/* The published title separates name and subtitle with an em
                  dash; the site renders it with a colon, as everywhere else. */}
              <h1 className="font-display mb-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                MEMOIR-VLM: a multimodal vision-language model for Alzheimer&apos;s disease
                classification and question answering
              </h1>

              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">Sohail Gidwani</span>, Tamoghna Chattopadhyay,
                Sophia I. Thomopoulos, Paul M. Thompson, and the Alzheimer&apos;s Disease
                Neuroimaging Initiative
              </p>

              {/* The DOI stays text until it resolves: the journal registers it
                  at publication, and a dead link is worse than none. */}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Accepted, in production
                </span>
                {/* Phones wrap the journal onto its own line; a separator
                    left there would dangle at the end of the first. */}
                <span aria-hidden className="hidden sm:inline">·</span>
                <span>Frontiers in Computational Neuroscience</span>
              </p>
              <p className="mb-8 mt-1 font-mono text-xs text-muted-foreground">doi: {DOI}</p>

              {/* Equal columns: a flex row let the longest label push the
                  fourth stat onto a line of its own. */}
              <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <Stat value="2,363" label="ADNI subjects" primary />
                <Stat value="68.2%" label="3-class Bal. Acc." />
                <Stat value="91.3%" label="CN vs Dem Bal. Acc." />
                <Stat
                  value="78.7%"
                  label={
                    <>
                      OASIS-3 <span className="whitespace-nowrap">zero-shot</span> Bal. Acc.
                    </>
                  }
                />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                MEMOIR-VLM is a two-stage framework for Alzheimer&apos;s disease characterization
                from T1-weighted MRI, DTI fractional anisotropy maps, and structured clinical
                scores. A missing-modality-aware encoder does the diagnosis: one set of weights
                runs on any available subset of inputs and predicts diagnosis, CDR-SB severity,
                age, and sex. A retrieval-augmented language layer on top retrieves comparable
                cases and writes readable summaries grounded in them. It is an interpretable
                interface, not a better classifier.
              </p>

              <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {[
                  "PyTorch",
                  "3D ResNet-18",
                  "Cross-Attention",
                  "CLIP",
                  "FAISS",
                  "RAG",
                  "Mistral 7B",
                  "Gemma 4 26B",
                  "MedGemma",
                  "ADNI",
                  "OASIS-3",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-[3px] border border-border bg-background/60 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-20">
              {/* 01 · Clinical Motivation */}
              <MobileSection
                n="01" label="The Clinical Ask" id="section-01"
                summary="Why Alzheimer's assessment needs several scan types at once, and why most systems break when one of them is missing."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Alzheimer&apos;s disease assessment is inherently multimodal. Structural MRI
                    captures neurodegeneration, DTI reflects white-matter microstructural integrity,
                    and cognitive and biomarker variables summarize clinical status. In practice,
                    however, these modalities are not always available together. DTI is often
                    missing, cognitive batteries may be incomplete, and many deep learning systems
                    require complete inputs or only produce a categorical label.
                  </p>
                  <p>
                    This project asks whether a single{" "}
                    <strong className="font-semibold text-foreground">
                      missing-modality-aware model
                    </strong>{" "}
                    can integrate whatever data is available, classify disease stage, estimate
                    clinical severity, retrieve similar historical cases, and support
                    natural-language questions over brain-scan-derived representations.
                  </p>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    Primary target
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    One multimodal model for Alzheimer&apos;s diagnosis and clinical prediction
                    that keeps working when inputs are missing. The encoder predicts CN / MCI /
                    Dementia, CN vs Dementia, CDR-SB severity, age, and sex. The frozen encoder
                    then feeds a retrieval-augmented language layer that returns comparable cases
                    and plain-language summaries, so a prediction can be inspected rather than
                    just read.
                  </p>
                </div>
              </MobileSection>

              {/* 02 · Dataset */}
              <MobileSection
                n="02" label="Dataset" id="section-02"
                summary="Development and internal testing used 2,363 ADNI subjects, with zero-shot external validation on 1,048 OASIS-3 subjects."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The{" "}
                    <strong className="font-semibold text-foreground">
                      Alzheimer&apos;s Disease Neuroimaging Initiative (ADNI)
                    </strong>{" "}
                    cohort was filtered to subjects with valid diagnostic labels and T1 MRI, then
                    deduplicated to one scan per subject before any split, leaving{" "}
                    <strong className="font-semibold text-foreground">2,363 subjects</strong>.
                    DTI-FA was available for 930 of them (39.4%). The FAISS reference index is
                    built only from training subjects, so a test subject can never retrieve
                    itself.
                  </p>
                  <p>
                    External validation used{" "}
                    <strong className="font-semibold text-foreground">
                      1,048 OASIS-3 subjects
                    </strong>{" "}
                    (one session each: 751 CN, 297 impaired), which have T1 MRI and clinical
                    scores but no processed diffusion data. None of it was used for training,
                    model selection, or index construction.
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto rounded border border-border bg-card/40 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    ADNI · 80 / 20 split, stratified by diagnosis
                  </p>
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        <th className="py-2 text-left font-normal">Class</th>
                        <th className="py-2 text-right font-normal">Train</th>
                        <th className="py-2 text-right font-normal">Test</th>
                        <th className="py-2 text-right font-normal">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {[
                        ["CN - Cognitively Normal", 669, 168, 837],
                        ["MCI - Mild Cognitive Impairment", 650, 163, 813],
                        ["Dementia", 570, 143, 713],
                      ].map(([name, tr, te, tot]) => (
                        <tr key={name as string}>
                          <td className="py-2 text-foreground">{name}</td>
                          <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                            {tr}
                          </td>
                          <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                            {te}
                          </td>
                          <td className="py-2 text-right font-mono tabular-nums text-foreground">
                            {tot}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-mono text-[11px] uppercase tracking-[0.15em]">
                        <td className="py-2 text-accent">Total</td>
                        <td className="py-2 text-right tabular-nums text-accent">1,889</td>
                        <td className="py-2 text-right tabular-nums text-accent">474</td>
                        <td className="py-2 text-right tabular-nums text-accent">2,363</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "100%", label: "T1 MRI (9DOF 2mm)" },
                    { value: "39.4%", label: "DTI FA coverage · 930 subjects" },
                  ].map((m) => (
                    <div key={m.label} className="rounded border border-border bg-card/40 p-4">
                      <p className="font-display text-xl font-bold text-foreground">{m.value}</p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Per-score, not "~100%": MoCA is missing for a third of the
                    training set, and those gaps are mean-imputed. */}
                <div className="mt-3 rounded border border-border bg-card/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Clinical score availability · training set
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-x-4 gap-y-3 sm:grid-cols-5">
                    {[
                      ["91.5%", "APOE"],
                      ["91.2%", "MMSE"],
                      ["90.3%", "ADAS-11"],
                      ["89.3%", "ADAS-13"],
                      ["63.9%", "MoCA"],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <p className="font-display text-lg font-bold text-foreground">{value}</p>
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    MEMOIR-VLM avoids imputing missing imaging modalities. Individual missing
                    clinical scores, such as an absent MoCA, are mean-imputed.
                  </p>
                </div>
              </MobileSection>

              {/* 03 · VLM Architecture */}
              <MobileSection
                n="03" label="Model Architecture" id="section-03"
                summary="Three modality encoders, per-modality masking, and the cross-attention fusion that feeds five prediction heads."
                figure={
                  <DiagramLightbox title="VLM Architecture">
                    <VLMArchitecture />
                  </DiagramLightbox>
                }
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The model is a multimodal vision-language model with missing-modality
                    support. Three modality-specific encoders produce ℓ2-normalized 512-d
                    embeddings, each gated by a per-modality masking probability during training.
                    The masked embeddings are fused via 8-head cross-attention with a learnable
                    pool query, producing a fused representation{" "}
                    <span className="font-mono text-foreground">z_f ∈ ℝ⁵¹²</span> that feeds five
                    MLP task heads.
                  </p>
                </div>


                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <Brain className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">
                        Imaging encoders
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Two independent 3D ResNet-18 networks for T1 MRI and DTI FA maps. Input
                      volumes are 91×109×91, output is 512-d followed by a linear projection +
                      LayerNorm.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <FileText className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">
                        Clinical encoder
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      MLP over 4 continuous clinical scores (ADAS-11, ADAS-13, MMSE, MoCA) plus an
                      APOE genotype embedding. Output: 512-d, ℓ2-normalized. CDR-SB is a
                      prediction target, never an input.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    Design decision: targets stay out of the inputs
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Diagnosis, sex, age, and CDR-SB are prediction targets, not inputs. An earlier
                    version also fed CDR-SB into the clinical encoder. CDR-SB is one of the
                    targets and tracks diagnosis closely, so that was a cognitive-score leak; the
                    final model removes it, and every number on this page comes from the corrected
                    model unless it is marked original. The remaining scores still correlate with
                    diagnosis, which is itself partly derived from cognitive testing, so the paper
                    makes no claim that the model finds signal those scores do not already carry.
                  </p>
                </div>
              </MobileSection>

              {/* 04 · Training */}
              <MobileSection
                n="04" label="Training Procedure" id="section-04"
                summary="Two stages: contrastive pre-training across modality pairs, then multi-task fine-tuning at differential learning rates."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Training runs in two stages. Stage 1 is contrastive pre-training: a
                    pairwise CLIP/InfoNCE loss between all three modality pairs (T1–DTI,
                    T1–Clinical, DTI–Clinical), computed only on pairs where both modalities are
                    present. Stage 2B is multi-task fine-tuning across five heads with differential
                    learning rates (backbone 10⁻⁵, heads 5×10⁻⁴). The best composite checkpoint
                    came at epoch 5, after which the model began to overfit, and that checkpoint
                    is the one evaluated.
                  </p>
                  <p>
                    During training, modalities are randomly dropped so the model learns to work
                    with any subset at inference time. T1 is dropped 10% of the time, DTI 30%,
                    Clinical 5%. DTI gets the highest drop rate because only 39.4% of subjects
                    have it, so the model needs to handle &quot;missing DTI&quot; as the
                    normal case, not the exception.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card/40 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                      Stage 1 · Contrastive
                    </p>
                    <p className="mt-2 font-display text-lg text-foreground">
                      30 epochs · pairwise InfoNCE
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      lr 1×10⁻⁴ · AdamW · cosine anneal
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card/40 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                      Stage 2B · Multi-task
                    </p>
                    <p className="mt-2 font-display text-lg text-foreground">
                      5 joint heads · best at epoch 5
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      focal (γ=2) + smooth L1 · AMP FP16
                    </p>
                  </div>
                </div>
              </MobileSection>

              {/* 05 · Results */}
              <MobileSection
                n="05" label="Results" id="section-05"
                summary="The corrected encoder on the held-out 474-subject ADNI test set, beside the original numbers it replaced."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Evaluated on the held-out 474-subject test set with all available modalities.
                    The final column is the corrected model. The original column is the earlier
                    version that still had CDR-SB among its inputs, kept so the correction is
                    visible rather than silently overwritten.
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto rounded border border-border bg-card/40 p-5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        <th className="py-2 text-left font-normal">Task</th>
                        <th className="py-2 text-right font-normal text-foreground">Final</th>
                        <th className="py-2 pl-4 text-right font-normal">Original</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 font-mono tabular-nums">
                      {[
                        ["DX 3-class balanced accuracy", "0.682", "0.707", true],
                        ["DX 3-class macro-F1", "0.681", "0.703", false],
                        ["CN vs Dementia balanced accuracy", "0.913", "0.933", false],
                        ["Sex accuracy", "0.555", "0.575", false],
                        ["Age MAE (years) ↓", "5.96", "6.31", false],
                        ["CDR-SB MAE ↓", "1.11", "0.97", false],
                      ].map((row) => {
                        const highlight = row[3] as boolean
                        return (
                          <tr key={row[0] as string}>
                            <td
                              className={`py-2 font-sans ${
                                highlight ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {row[0]}
                              {highlight ? (
                                <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                                  primary
                                </span>
                              ) : null}
                            </td>
                            <td
                              className={`py-2 text-right text-foreground ${
                                highlight ? "font-bold" : ""
                              }`}
                            >
                              {row[1]}
                            </td>
                            <td className="py-2 pl-4 text-right text-muted-foreground/60">
                              {row[2]}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Original: the earlier model with CDR-SB among its inputs. CDR-SB error rises
                    to 1.11 because the original figure had the target partly present in its own
                    inputs; that is the leak being removed, not the model getting worse. No AUC is
                    listed because the paper reports AUC only for the original model.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-accent/30 bg-accent/5 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                      CN vs Dementia
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.913 Bal. Acc.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      The extremes of the disease spectrum separate cleanly. MCI remains the
                      hardest boundary: it sits between CN and dementia and overlaps both.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Severity &amp; age
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      1.11 CDR-SB MAE · 5.96 yr age MAE
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Learned jointly with diagnosis from the same fused embedding, which is also
                      what retrieval searches in section 07.
                    </p>
                  </div>
                </div>
              </MobileSection>

              {/* 06 · Modality Ablation */}
              <MobileSection
                n="06" label="Modality Ablation" id="section-06"
                summary="Masking inputs on the same trained model: where the diagnostic signal comes from, and which differences survive a significance test."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Every modality subset runs through the same trained weights, with the missing
                    modalities masked at inference. The chart shows the four configurations that
                    include clinical scores. With the clinical encoder masked entirely, imaging
                    alone retains DX3 0.58 and DX2 0.84 (T1 + DTI), and DTI-FA by itself sits near
                    the three-class chance line at 0.392.
                  </p>
                </div>

                <AblationChart
                  panels={ablationPanels}
                  caption="Highlighted: the only configuration whose gain over clinical-only is statistically supported. On CN vs Dementia no configuration separates from clinical-only."
                />

                <PairedDifferences
                  title="Paired differences · DX 3-class"
                  subtitle="Positive favors the second configuration · n = 474"
                  domain={[-0.05, 0.1]}
                  rows={pairedDX3}
                  caption="Stratified paired-bootstrap 95% intervals (10,000 resamples of the test set) with McNemar's exact p. Only A clears zero; B to E are secondary, and Holm adjustment takes each to p = 1.00. On the 179 test subjects who actually have DTI, A roughly doubles to +0.071 [+0.002, +0.141]. The model was trained once, so the intervals do not capture training-seed variability."
                />

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    What the ablation supports
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Clinical scores carry most of the diagnostic signal. DTI contributes a
                    statistically measurable gain when combined with clinical information for
                    3-class diagnosis, but imaging alone is not sufficient for staging, so imaging
                    and cognitive assessment are complementary rather than redundant. The full
                    model is not significantly better than clinical-only on diagnosis, and simple
                    clinical baselines are statistically indistinguishable from it, not better. On
                    CN vs Dementia none of the comparisons clears zero. Where imaging does win
                    clearly is age: imaging-only beats clinical-only by 0.63 years MAE [+0.14,
                    +1.11], Wilcoxon p = 0.005.
                  </p>
                </div>
              </MobileSection>

              {/* 07 · VQA Pipeline */}
              <MobileSection
                n="07" label="Retrieval-Augmented VQA Extension" id="section-07"
                summary="Retrieval, reranking, and generation over similar cases, and the audit that found where its headline accuracy came from."
                figure={
                  <DiagramLightbox title="RAG VQA Pipeline">
                    <VQAPipeline />
                  </DiagramLightbox>
                }
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The encoder gives you a prediction. What it doesn&apos;t give you is an
                    explanation, or any way to ask follow-up questions in natural language.
                    That&apos;s what the VQA extension adds. The frozen encoder turns a query case
                    into a 512-d fused embedding. FAISS retrieves the 50 most similar training
                    subjects, a cross-encoder re-scores the top 20 of those, and the 5 most
                    relevant go to Mistral 7B as context for its answer.
                  </p>
                  <p>
                    The LLM never receives raw brain images. T1, DTI, and clinical inputs are
                    encoded into a 512-dimensional fused representation. FAISS retrieves similar
                    training subjects in embedding space, and only retrieved textual captions are
                    passed to the LLM as context.
                  </p>
                </div>


                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <Microscope className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">
                        Text encoder
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-xs">all-MiniLM-L6-v2</span>, MLM-pretrained
                      on 26,889 clinical sentences (25K synthetic + 1,889 real captions), then
                      contrastively aligned to the imaging embedding space. 384-d output
                      projected up to 512-d.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <MessageSquare className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">
                        Retrieval + rerank
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      FAISS IndexFlatIP over 1,889 ℓ2-normalized training vectors, exact
                      inner-product search, top-50. Cross-encoder{" "}
                      <span className="font-mono text-xs">ms-marco-MiniLM-L-6-v2</span> re-scores
                      the top 20 and keeps 5.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="font-semibold text-foreground">
                      The 94.7% was label exposure, not diagnosis.
                    </strong>{" "}
                    With labeled captions the pipeline reached 94.7% diagnosis accuracy. But the
                    captions of retrieved training subjects state their diagnosis, which opens two
                    routes to the answer without any inference: the cross-encoder can rerank
                    neighbors by matching the diagnosis text, and the language model can copy the
                    majority label from its context. The final paper treats 94.7% as a
                    label-exposure artifact.
                  </p>
                  <p>
                    The deployment-realistic test withholds the diagnosis field, since a new
                    patient&apos;s diagnosis is unknown. Under masked captions no evaluated LLM
                    exceeds a retrieval-only k-NN majority vote of 67.3%, which itself only
                    matches the encoder&apos;s 68.2% 3-class accuracy.
                  </p>
                </div>

                <AblationChart
                  panels={[
                    {
                      title: "Diagnosis, labels masked",
                      subtitle: "3-class · LLMs and k-NN on 150 stratified test subjects",
                      bars: [
                        { label: "Encoder (DX3)", value: 0.682, highlight: true },
                        { label: "k-NN majority", value: 0.673 },
                        { label: "Gemma 4 26B", value: 0.653 },
                        { label: "Mistral 7B", value: 0.473 },
                        { label: "MedGemma 1.5 4B", value: 0.413 },
                      ],
                    },
                  ]}
                  caption="The encoder figure is its balanced accuracy on the full 474-subject test set. Retrieval does not beat the encoder, and no language model beats retrieval."
                />

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    Where the diagnosis comes from
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    The multimodal encoder performs diagnosis. The retrieval-augmented language
                    layer provides case-based reasoning, comparable historical cases, and
                    natural-language summaries grounded in retrieved evidence. Building the
                    reference index from label-free captions is a requirement of that setup, not
                    an implementation detail.
                  </p>
                </div>
              </MobileSection>

              {/* 08 · LLM Comparison */}
              <MobileSection
                n="08" label="LLM Backbone Comparison" id="section-08"
                summary="Three backbones on identical retrieved context, and a ranking that flips once the labels are hidden."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Three models were given the same retrieved context: Mistral 7B Instruct v0.3
                    (general-purpose, dense), Gemma 4 26B MoE (larger, mixture-of-experts), and
                    MedGemma 1.5 4B IT (smaller, fine-tuned on medical data), all quantized to
                    4-bit NF4. Retrieval is identical across them, so any difference comes from
                    the generation step alone.
                  </p>
                </div>

                <LLMComparison
                  rows={[
                    {
                      metric: "Diagnosis · labeled",
                      sublabel: "label-exposure artifact",
                      mistral: 0.947,
                      gemma: 0.927,
                      medgemma: 0.507,
                    },
                    {
                      metric: "Diagnosis · masked",
                      sublabel: "deployment-realistic · tick = k-NN 0.673",
                      mistral: 0.473,
                      gemma: 0.653,
                      medgemma: 0.413,
                      higher: "gemma",
                      reference: 0.673,
                    },
                    {
                      metric: "Format adherence",
                      sublabel: "parseable outputs",
                      mistral: 1,
                      gemma: 1,
                      medgemma: 0.667,
                      format: (v: number) => (v >= 0.995 ? "≈100%" : `${(v * 100).toFixed(1)}%`),
                    },
                  ]}
                  caption="Same retrieved context across all three models; only the generation model changes. Under labeled captions Mistral 7B looked strongest because it copied the stated labels most faithfully. With labels masked the ranking inverts: Gemma 4 26B leads, and still falls short of the retrieval-only vote."
                />

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    Why Mistral 7B stays in the pipeline
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Not for diagnosis. In the label-masked setting Gemma 4 26B performs best among
                    the tested LLMs, but none surpasses the retrieval-only baseline. Mistral 7B
                    remains the natural-language interface backbone because it holds the output
                    format (about 100% parseable, against 66.7% for MedGemma), produces
                    high-fidelity text, and runs in about 4.5 GB of GPU memory with 4 to 6 s
                    end-to-end inference.
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto rounded border border-border bg-card/40 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Text quality · Mistral 7B, top-10 context, 150 subjects
                  </p>
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      {/* Metrics as rows: two value columns fit a phone, where
                          four pushed BERTScore and SBERT behind a scroll. */}
                      <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        <th className="py-2 text-left font-normal">Metric</th>
                        <th className="py-2 pl-4 text-right font-normal text-foreground">VQA</th>
                        <th className="py-2 pl-4 text-right font-normal">Captioning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 font-mono text-xs tabular-nums">
                      {[
                        ["BLEU", "0.066 ± 0.038", "0.044 ± 0.025", false],
                        ["ROUGE-L", "0.345 ± 0.084", "0.211 ± 0.057", false],
                        ["BERTScore", "0.894 ± 0.022", "0.866 ± 0.017", true],
                        ["SBERT", "0.811 ± 0.076", "0.767 ± 0.077", true],
                      ].map(([metric, vqa, caption, semantic]) => (
                        <tr key={metric as string}>
                          <td className="whitespace-nowrap py-2 font-sans text-sm text-foreground">
                            {metric}
                          </td>
                          <td
                            className={`whitespace-nowrap py-2 pl-4 text-right ${
                              semantic ? "font-bold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {vqa}
                          </td>
                          <td className="whitespace-nowrap py-2 pl-4 text-right text-muted-foreground">
                            {caption}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Lexical overlap is modest because the references are structured templates and
                    the model writes free prose; semantic similarity is strong. The layer reads as
                    a readable, evidence-grounded interface rather than a diagnostic classifier.
                  </p>
                </div>
              </MobileSection>

              {/* 09 · External Validation */}
              <MobileSection
                n="09" label="External Validation" id="section-09"
                summary="The unchanged ADNI-trained weights, run zero-shot on 1,048 OASIS-3 subjects with no diffusion imaging at all."
              >
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    OASIS-3 has T1 MRI and clinical scores but no processed diffusion maps, so the
                    same ADNI-trained weights run on it with the DTI branch masked: exactly the
                    missing-modality path the model was trained for. No OASIS-3 data touched
                    training, model selection, or the retrieval index.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-accent/30 bg-accent/5 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                      CN vs impaired · n = 1,048
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.787 Bal. Acc. · 0.889 AUC
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Binary diagnosis transfers across sites, scanners, and protocols with a
                      whole modality absent.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      What does not transfer
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.524 3-class · 8.43 yr age MAE
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Three-class accuracy degrades, driven by an MCI class that is small in
                      OASIS-3. Age fails because OASIS-3 skews younger than ADNI. CDR-SB MAE is
                      nominally lower (0.90 vs 1.11), but only because the cohort is mostly
                      cognitively normal.
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  A model that needed every modality, or imputed the missing one, could not run
                  here without extra machinery. This is the clearest evidence that the
                  missing-modality mechanism is load-bearing. OASIS-3 is still a North American
                  research cohort, so it shows cross-site transfer, not generalization to diverse
                  clinical populations.
                </p>
              </MobileSection>

              {/* 10 · Key Findings */}
              <MobileSection
                n="10" label="Key Findings" id="section-10"
                summary="What the corrected results support, and what they do not."
              >
                <div className="space-y-4">
                  {[
                    {
                      headline: "Corrected encoder performance",
                      body:
                        "After removing CDR-SB from the input space, MEMOIR-VLM reaches 91.3% balanced accuracy for CN vs Dementia and 68.2% for 3-class diagnosis. MCI remains the hardest class boundary.",
                    },
                    {
                      headline: "One set of weights for every modality subset",
                      body:
                        "One shared set of weights operates across all seven non-empty combinations of T1w MRI, DTI-FA, and clinical inputs, with no separate model per subset and no imaging imputation. Only 39.4% of subjects had usable DTI.",
                    },
                    {
                      headline: "DTI adds measurable 3-class signal alongside clinical context",
                      body:
                        "Adding DTI-FA to clinical inputs raises 3-class balanced accuracy from 0.666 to 0.701, a +0.034 gain whose 95% interval excludes zero (McNemar p = 0.012). Imaging alone is not enough for staging.",
                    },
                    {
                      headline: "RAG VQA is interpretability infrastructure, not a better classifier",
                      body:
                        "The 94.7% labeled-caption accuracy was a label-exposure artifact. Once diagnosis labels are removed from retrieved captions, no evaluated LLM exceeds the retrieval-only baseline. The encoder remains the diagnostic component.",
                    },
                    {
                      headline: "Zero-shot external validation",
                      body:
                        "On 1,048 OASIS-3 subjects with diffusion imaging entirely absent, the unchanged ADNI-trained model retains 78.7% balanced accuracy for CN vs impaired (AUC 0.889).",
                    },
                    {
                      headline: "Faithful natural-language summaries",
                      body:
                        "VQA summaries reach BERTScore 0.894 and SBERT cosine similarity 0.811, which supports the language layer as a readable clinical interface.",
                    },
                  ].map((f) => (
                    <div key={f.headline} className="border-l-2 border-accent pl-4">
                      <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                        {f.headline}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        {f.body}
                      </p>
                    </div>
                  ))}
                </div>
              </MobileSection>

              {/* ─── Footer CTA ─── */}
              <section className="rounded border border-border bg-card/40 p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  Publication
                </p>
                <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                  Accepted · Frontiers in Computational Neuroscience
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Accepted 27 August 2026 and now in production; the DOI resolves once the article
                  is published. The work was done at the Imaging Genetics Center, Keck School of
                  Medicine of USC.
                </p>
                <p className="mt-4 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                  Gidwani S, Chattopadhyay T, Thomopoulos SI, Thompson PM and the Alzheimer&apos;s
                  Disease Neuroimaging Initiative (2026). MEMOIR-VLM: a multimodal
                  vision-language model for Alzheimer&apos;s disease classification and question
                  answering. <em>Front. Comput. Neurosci.</em> 20:1902258.{" "}
                  <span className="whitespace-nowrap font-mono text-xs">doi: {DOI}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Future work extends MEMOIR-VLM to amyloid prediction supervised on PET-derived
                  labels, with cognitive variables kept out of the inputs, the most direct route
                  to testing what the imaging pathway carries on its own.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/#experience"
                    className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground transition hover:border-accent/40 hover:text-accent"
                  >
                    <Home className="h-3.5 w-3.5" />
                    Back to portfolio
                  </Link>
                  <a
                    href="https://github.com/SohailGidwani"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub profile
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
