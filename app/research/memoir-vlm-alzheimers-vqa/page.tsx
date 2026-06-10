import Link from "next/link"
import Script from "next/script"
import { Home, FileText, Github, Brain, Microscope, MessageSquare } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import ReadingProgress from "@/app/components/ReadingProgress"
import SectionTOC from "@/app/components/SectionTOC"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import VLMArchitecture from "./components/VLMArchitecture"
import VQAPipeline from "./components/VQAPipeline"
import ConfusionMatrix from "./components/ConfusionMatrix"
import AblationChart from "./components/AblationChart"
import TrainingChart from "./components/TrainingChart"
import LLMComparison from "./components/LLMComparison"

function SectionLabel({ n, label, id }: { n: string; label: string; id?: string }) {
  return (
    <div id={id} className="mb-6 scroll-mt-24">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{n}</span>
        <div className="h-px w-5 bg-border" />
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
        {label}
      </h2>
    </div>
  )
}

const tocItems = [
  { id: "section-01", n: "01", label: "The Clinical Ask" },
  { id: "section-02", n: "02", label: "Dataset" },
  { id: "section-03", n: "03", label: "Model Architecture" },
  { id: "section-04", n: "04", label: "Training Procedure" },
  { id: "section-05", n: "05", label: "Results" },
  { id: "section-06", n: "06", label: "Modality Ablation" },
  { id: "section-07", n: "07", label: "RAG VQA Extension" },
  { id: "section-08", n: "08", label: "LLM Comparison" },
  { id: "section-09", n: "09", label: "Key Findings" },
]

function Stat({
  value,
  label,
  primary,
}: {
  value: string
  label: string
  primary?: boolean
}) {
  return (
    <div className={`border-l-2 ${primary ? "border-accent" : "border-border"} pl-4`}>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

export default function MultiModalAlzheimersVQAPage() {
  // ── Training history data (Stage 2B, 30 epochs) ──
  const training = {
    dx3: [
      0.621, 0.624, 0.613, 0.659, 0.662, 0.672, 0.653, 0.639, 0.64, 0.677,
      0.672, 0.674, 0.609, 0.675, 0.661, 0.688, 0.714, 0.662, 0.704, 0.711,
      0.72, 0.718, 0.71, 0.698, 0.707, 0.715, 0.701, 0.725, 0.715, 0.727,
    ],
    sex: [
      0.542, 0.568, 0.559, 0.538, 0.586, 0.576, 0.597, 0.565, 0.605, 0.599,
      0.603, 0.591, 0.599, 0.591, 0.589, 0.599, 0.589, 0.597, 0.601, 0.614,
      0.612, 0.605, 0.603, 0.601, 0.603, 0.605, 0.614, 0.605, 0.605, 0.61,
    ],
  }

  // ── Ablation data (balanced accuracy across 7 modality combinations) ──
  const ablationCombos = [
    "T1 + DTI + Clin",
    "T1 + Clin",
    "DTI + Clin",
    "Clin only",
    "T1 + DTI",
    "T1 only",
    "DTI only",
  ]
  const ablationPanels = [
    {
      title: "DX 3-class (Bal. Acc.)",
      subtitle: "CN / MCI / Dementia",
      bars: [
        { label: ablationCombos[0], value: 0.707, highlight: true },
        { label: ablationCombos[1], value: 0.692 },
        { label: ablationCombos[2], value: 0.701 },
        { label: ablationCombos[3], value: 0.7 },
        { label: ablationCombos[4], value: 0.598 },
        { label: ablationCombos[5], value: 0.587 },
        { label: ablationCombos[6], value: 0.388 },
      ],
    },
    {
      title: "DX Binary (Bal. Acc.)",
      subtitle: "CN vs Dementia",
      bars: [
        { label: ablationCombos[0], value: 0.933, highlight: true },
        { label: ablationCombos[1], value: 0.932 },
        { label: ablationCombos[2], value: 0.938 },
        { label: ablationCombos[3], value: 0.938 },
        { label: ablationCombos[4], value: 0.848 },
        { label: ablationCombos[5], value: 0.833 },
        { label: ablationCombos[6], value: 0.528 },
      ],
    },
  ]

  // ── Structured data (ScholarlyArticle) ──
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline:
      "MEMOIR-VLM: A Multimodal Vision-Language Model for Alzheimer's Disease Classification and Question Answering",
    author: {
      "@type": "Person",
      name: "Sohail Gidwani",
      url: "https://sohailgidwani.app",
      affiliation: {
        "@type": "Organization",
        name: "Keck School of Medicine of USC",
      },
    },
    datePublished: "2026-04-23",
    dateModified: "2026-06-10",
    keywords: [
      "Alzheimer's disease",
      "multimodal deep learning",
      "missing modality",
      "ADNI",
      "retrieval-augmented VQA",
      "Mistral 7B",
    ],
    description:
      "MEMOIR-VLM is a two-stage multimodal vision-language framework for Alzheimer's disease classification using T1 MRI, DTI FA maps, and structured clinical features. A missing-modality-aware encoder predicts diagnosis, clinical severity, age, and sex, and a retrieval-augmented VQA pipeline (FAISS + cross-encoder rerank + LLM) enables case-based reasoning, benchmarked across Mistral 7B, Gemma 4 26B MoE, and MedGemma 1.5 4B.",
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

        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Research / Keck USC
                </span>
              </div>
              <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                MEMOIR-VLM: Multimodal Vision-Language Model for Alzheimer&apos;s Disease Classification and VQA
              </h1>

              {/* Stats row */}
              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Stat value="2,363" label="ADNI subjects" primary />
                <Stat value="~70M" label="Model params" />
                <Stat value="0.707" label="DX 3-class Bal. Acc." />
                <Stat value="0.933" label="CN vs Dem Bal. Acc." />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                MEMOIR-VLM is a two-stage multimodal vision-language framework for Alzheimer&apos;s
                disease characterization using T1-weighted MRI, DTI fractional anisotropy maps, and
                structured clinical features. A missing-modality-aware encoder learns a shared
                representation for diagnosis, clinical severity, age, and sex prediction, while a
                retrieval-augmented VQA pipeline enables case-based reasoning and natural-language
                answers grounded in similar ADNI subjects.
              </p>

              <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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
              {/* 01 — Clinical Motivation */}
              <section>
                <SectionLabel n="01" label="The Clinical Ask" id="section-01" />
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
                    natural-language VQA over brain-scan-derived representations.
                  </p>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Primary target
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Build a robust multimodal AI system for Alzheimer&apos;s disease diagnosis and
                    clinical reasoning. The model predicts CN / MCI / Dementia, CN vs Dementia,
                    CDR-SB severity, age, and sex, then extends the frozen encoder into a
                    retrieval-augmented VQA pipeline for interpretable case-based answers.
                  </p>
                </div>
              </section>

              {/* 02 — Dataset */}
              <section>
                <SectionLabel n="02" label="Dataset" id="section-02" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    All data comes from the{" "}
                    <strong className="font-semibold text-foreground">
                      Alzheimer&apos;s Disease Neuroimaging Initiative (ADNI)
                    </strong>
                    . After filtering to subjects with valid DX labels and 9DOF T1 paths and
                    deduplicating to one scan per subject, the cohort is{" "}
                    <strong className="font-semibold text-foreground">2,363 subjects</strong>. All
                    subjects had valid diagnostic labels and T1-weighted MRI. DTI-FA was available
                    for a subset of 930 participants, corresponding to 39.4% of the full cohort.
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto rounded border border-border bg-card/40 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    80 / 20 stratified split by diagnosis
                  </p>
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "100%", label: "T1 MRI (9DOF 2mm)" },
                    { value: "39.4%", label: "DTI FA coverage" },
                    { value: "~100%", label: "Clinical scores" },
                  ].map((m) => (
                    <div key={m.label} className="rounded border border-border bg-card/40 p-4">
                      <p className="font-display text-xl font-bold text-foreground">{m.value}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 03 — VLM Architecture */}
              <section>
                <SectionLabel n="03" label="Model Architecture" id="section-03" />
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

                <DiagramLightbox title="VLM Architecture">
                  <VLMArchitecture />
                </DiagramLightbox>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <Brain className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
                        Clinical encoder
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      MLP over 5 continuous clinical features (CDR-SB, ADAS-11, ADAS-13, MMSE,
                      MoCA) plus an APOE genotype embedding. Output: 512-d, ℓ2-normalized.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Design decision: no label leakage
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Target variables are excluded from the clinical input space. Diagnosis, sex,
                    and age are prediction targets rather than inputs. The clinical encoder only
                    receives cognitive / clinical scores and APOE genotype, forcing the model to
                    learn relationships among imaging features and clinical indicators rather than
                    copying labels.
                  </p>
                </div>
              </section>

              {/* 04 — Training */}
              <section>
                <SectionLabel n="04" label="Training Procedure" id="section-04" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Training runs in two stages. Stage 1 is contrastive pre-training: a
                    pairwise CLIP/InfoNCE loss between all three modality pairs (T1–DTI,
                    T1–Clinical, DTI–Clinical), computed only on pairs where both modalities are
                    present. Stage 2B is multi-task fine-tuning across five heads with differential
                    learning rates (backbone 10⁻⁵, heads 5×10⁻⁴).
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      Stage 1 · Contrastive
                    </p>
                    <p className="mt-2 font-display text-lg text-foreground">
                      30 epochs · pairwise InfoNCE
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      lr 1×10⁻⁴ · AdamW · cosine anneal
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card/40 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      Stage 2B · Multi-task
                    </p>
                    <p className="mt-2 font-display text-lg text-foreground">
                      30 epochs · 5 joint heads
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      focal (γ=2) + smooth L1 · AMP FP16
                    </p>
                  </div>
                </div>

                <TrainingChart
                  series={[
                    { name: "DX3 Bal. Acc.", data: training.dx3, color: "var(--accent)" },
                    {
                      name: "Sex Acc.",
                      data: training.sex,
                      color: "#10b981",
                      dashed: true,
                    },
                  ]}
                  xMax={30}
                  bestEpoch={5}
                  caption="Stage 2B training history. Best composite checkpoint selected at epoch 5; later epochs showed overfitting. The epoch-5 checkpoint was used for downstream evaluation."
                />
              </section>

              {/* 05 — Results */}
              <section>
                <SectionLabel n="05" label="Results" id="section-05" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Evaluated on the held-out 474-subject test set using all available modalities.
                    Headline metrics on the best model (Stage 2B, epoch 5):
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto rounded border border-border bg-card/40 p-5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        <th className="py-2 text-left font-normal">Task</th>
                        <th className="py-2 text-right font-normal">Bal. Acc.</th>
                        <th className="py-2 text-right font-normal">Macro F1</th>
                        <th className="py-2 text-right font-normal">AUC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 font-mono tabular-nums">
                      {[
                        ["DX 3-class (CN / MCI / Dem)", "0.707", "0.703", "0.865", true],
                        ["DX Binary (CN vs Dem)", "0.933", "0.932", "0.981", false],
                        ["Sex", "0.575", "0.563", "0.597", false],
                      ].map((row) => {
                        const highlight = row[4] as boolean
                        return (
                          <tr key={row[0] as string}>
                            <td
                              className={`py-2 font-sans ${
                                highlight ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {row[0]}
                              {highlight ? (
                                <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.15em] text-accent">
                                  primary
                                </span>
                              ) : null}
                            </td>
                            <td
                              className={`py-2 text-right ${
                                highlight ? "font-bold text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {row[1]}
                            </td>
                            <td className="py-2 text-right text-muted-foreground">{row[2]}</td>
                            <td className="py-2 text-right text-muted-foreground">{row[3]}</td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td className="py-2 text-muted-foreground">Age (years, MAE ↓)</td>
                        <td className="py-2 text-right text-muted-foreground" colSpan={3}>
                          6.31
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-muted-foreground">CDR-SB (MAE ↓)</td>
                        <td className="py-2 text-right text-muted-foreground" colSpan={3}>
                          0.97
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    DX 3-class confusion matrix · full test set (n=474)
                  </p>
                  <ConfusionMatrix
                    labels={["CN", "MCI", "Dem"]}
                    matrix={[
                      [
                        { count: 119, percent: 70.8 },
                        { count: 48, percent: 28.6 },
                        { count: 1, percent: 0.6 },
                      ],
                      [
                        { count: 40, percent: 24.5 },
                        { count: 90, percent: 55.2 },
                        { count: 33, percent: 20.2 },
                      ],
                      [
                        { count: 2, percent: 1.4 },
                        { count: 18, percent: 12.6 },
                        { count: 123, percent: 86.0 },
                      ],
                    ]}
                    rowTotals={[168, 163, 143]}
                    caption="Rows = true class, columns = predicted. Each cell shows count and row-normalized %. MCI is the hardest class at 55% recall. It sits between CN and Dementia so the model hedges in both directions. Dementia recall is the strongest at 86%, with only 2 misclassified as CN."
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-accent/30 bg-accent/5 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      CN vs Dementia
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.933 Bal. Acc. · 0.981 AUC
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Strong separation between the extremes of the disease spectrum. The model
                      cleanly distinguishes cognitively normal subjects from those with dementia.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Severity &amp; demographics
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.97 CDR-SB MAE · 6.31 yr age MAE
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Alongside diagnosis, the shared representation supports clinical severity
                      (CDR-SB) and age regression, learned jointly from the same fused embedding.
                    </p>
                  </div>
                </div>
              </section>

              {/* 06 — Modality Ablation */}
              <section>
                <SectionLabel n="06" label="Modality Ablation" id="section-06" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Every one of the seven possible modality subsets was evaluated using the same
                    trained model, with non-selected modalities masked at inference time. This
                    shows where the signal actually comes from and which combination works best
                    for each task.
                  </p>
                </div>

                <AblationChart
                  panels={ablationPanels}
                  caption="Clinical scores carry the strongest diagnostic signal, with clinical-only performance approaching the full-modality model for 3-class diagnosis. Imaging remains useful, especially for non-diagnostic tasks and for deployment settings where clinical information is incomplete. The modality-dropout strategy prevents catastrophic degradation when DTI or clinical variables are missing."
                />
              </section>

              {/* 07 — VQA Pipeline */}
              <section>
                <SectionLabel n="07" label="Retrieval-Augmented VQA Extension" id="section-07" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The encoder gives you a prediction and a confidence score. What it doesn&apos;t
                    give you is an explanation, or any way to ask follow-up questions in natural
                    language. That&apos;s what the VQA extension adds. The frozen encoder turns a
                    query case into a 512-d embedding. FAISS finds the 50 most similar training
                    subjects by inner product. A cross-encoder reranks those 50 down to the top 5
                    most relevant matches. Those 5 captions become the context fed to a language
                    model, which answers clinical questions about the case.
                  </p>
                  <p>
                    The LLM never receives raw brain images. T1, DTI, and clinical inputs are
                    encoded into a 512-dimensional fused representation. FAISS retrieves similar
                    training subjects in embedding space, and only retrieved textual captions are
                    passed to the LLM as context.
                  </p>
                </div>

                <DiagramLightbox title="RAG VQA Pipeline">
                  <VQAPipeline />
                </DiagramLightbox>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <Microscope className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
                        Retrieval + rerank
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      FAISS IndexFlatIP over 1,889 ℓ2-normalized training vectors, exact
                      inner-product search. Cross-encoder:{" "}
                      <span className="font-mono text-xs">ms-marco-MiniLM-L-6-v2</span>,
                      reranking top-50 to top-5.
                    </p>
                  </div>
                </div>
              </section>

              {/* 08 — LLM Comparison */}
              <section>
                <SectionLabel n="08" label="LLM Backbone Comparison" id="section-08" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Three models were given the same retrieved context: Mistral 7B Instruct v0.3
                    (general-purpose, dense), Gemma 4 26B MoE (larger, mixture-of-experts), and
                    MedGemma 1.5 4B IT (smaller, fine-tuned on medical data). All quantized to
                    4-bit NF4. The question was simple: does a medical fine-tune beat a bigger
                    general model on this task?
                  </p>
                </div>

                <LLMComparison
                  rows={[
                    {
                      metric: "VQA Diagnosis",
                      sublabel: "full modality (T1 + DTI + Clinical)",
                      mistral: 0.947,
                      gemma: 0.927,
                      medgemma: 0.507,
                      higher: "mistral",
                    },
                    {
                      metric: "BERTScore",
                      sublabel: "contextual similarity",
                      mistral: 0.894,
                      gemma: 0.845,
                      medgemma: 0.823,
                      higher: "mistral",
                    },
                    {
                      metric: "SBERT CosSim",
                      sublabel: "sentence-level",
                      mistral: 0.811,
                      gemma: 0.81,
                      medgemma: 0.428,
                      higher: "mistral",
                    },
                  ]}
                  caption="Same retrieved context across all three models; only the generation model changes. Mistral 7B wins every metric: diagnosis VQA accuracy and text quality (BERTScore, SBERT). MedGemma's medical fine-tune loses to a general-purpose 7B model. At this size, instruction-following matters more than raw model size or medical fine-tuning."
                />

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Headline finding
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    <strong>Instruction-following beats size and domain.</strong> Mistral 7B, a
                    general-purpose dense model, outperforms both a 26B MoE and a medically
                    fine-tuned 4B on every metric. The retrieved context already supplies the
                    medical knowledge. What matters is whether the model can follow instructions
                    and format its output correctly.
                  </p>
                </div>
              </section>

              {/* 09 — Key Findings */}
              <section>
                <SectionLabel n="09" label="Key Findings" id="section-09" />
                <div className="space-y-4">
                  {[
                    {
                      headline: "Clinical scores dominate diagnosis, but imaging adds robustness",
                      body:
                        "Clinical-only performance approaches the full model for 3-class diagnosis, confirming that cognitive scores carry much of the diagnostic signal. Imaging still contributes useful structure, especially when clinical data is incomplete and for tasks such as age and severity estimation.",
                    },
                    {
                      headline: "The model handles missing modalities",
                      body:
                        "Stochastic modality dropout during training allows the encoder to operate with any subset of T1, DTI, and clinical inputs. This is important because only 39.4% of subjects had usable DTI.",
                    },
                    {
                      headline: "Binary CN vs Dementia separation is strong",
                      body:
                        "The model reaches 93.3% balanced accuracy and AUC 0.981 for CN vs Dementia, showing strong separation between the extremes of the Alzheimer's disease spectrum.",
                    },
                    {
                      headline: "MCI remains the hardest class",
                      body:
                        "MCI recall is 55%, with errors split toward both CN and Dementia. This reflects the transitional and heterogeneous nature of MCI rather than a simple modeling failure.",
                    },
                    {
                      headline: "Retrieval-augmented VQA improves interpretability",
                      body:
                        "The VQA pipeline retrieves similar training cases and uses their captions as grounded context for the LLM, producing natural-language answers instead of only class probabilities.",
                    },
                    {
                      headline: "Mistral 7B is the best VQA backbone",
                      body:
                        "Mistral 7B achieves 94.7% VQA diagnosis accuracy and outperforms Gemma 4 26B MoE and MedGemma 1.5 4B IT under the same retrieval context.",
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
              </section>

              {/* ─── Footer CTA ─── */}
              <section className="rounded border border-border bg-card/40 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  Status
                </p>
                <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                  Manuscript submitted / in review
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  This work has been submitted as{" "}
                  <em>
                    MEMOIR-VLM: A Multimodal Vision-Language Model for Alzheimer&apos;s Disease
                    Classification and Question Answering
                  </em>
                  . It was completed at the Keck School of Medicine of USC. Code and manuscript
                  links will be added when publicly available. Future work will extend MEMOIR-VLM
                  to amyloid prediction using amyloid-specific supervision while avoiding
                  biomarker leakage.
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
