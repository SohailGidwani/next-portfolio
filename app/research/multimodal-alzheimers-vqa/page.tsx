import Link from "next/link"
import Script from "next/script"
import { Home, FileText, Github, Brain, Microscope, MessageSquare } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import VLMArchitecture from "./components/VLMArchitecture"
import VQAPipeline from "./components/VQAPipeline"
import ConfusionMatrix from "./components/ConfusionMatrix"
import AblationChart from "./components/AblationChart"
import TrainingChart from "./components/TrainingChart"
import LLMComparison from "./components/LLMComparison"

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6">
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
    amyloid: [
      0.72, 0.747, 0.753, 0.718, 0.73, 0.747, 0.738, 0.757, 0.706, 0.731,
      0.742, 0.746, 0.682, 0.739, 0.722, 0.71, 0.728, 0.675, 0.707, 0.711,
      0.71, 0.706, 0.706, 0.676, 0.698, 0.71, 0.704, 0.722, 0.715, 0.722,
    ],
    cnAmyloid: [
      0.594, 0.595, 0.617, 0.578, 0.601, 0.594, 0.679, 0.623, 0.598, 0.707,
      0.602, 0.652, 0.624, 0.665, 0.664, 0.656, 0.658, 0.637, 0.621, 0.649,
      0.64, 0.656, 0.617, 0.624, 0.632, 0.632, 0.634, 0.633, 0.633, 0.656,
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
        { label: ablationCombos[0], value: 0.933 },
        { label: ablationCombos[1], value: 0.932 },
        { label: ablationCombos[2], value: 0.938, highlight: true },
        { label: ablationCombos[3], value: 0.938 },
        { label: ablationCombos[4], value: 0.848 },
        { label: ablationCombos[5], value: 0.833 },
        { label: ablationCombos[6], value: 0.528 },
      ],
    },
    {
      title: "Amyloid (Bal. Acc.)",
      subtitle: "Overall positivity",
      bars: [
        { label: ablationCombos[0], value: 0.733 },
        { label: ablationCombos[1], value: 0.699 },
        { label: ablationCombos[2], value: 0.746, highlight: true },
        { label: ablationCombos[3], value: 0.713 },
        { label: ablationCombos[4], value: 0.621 },
        { label: ablationCombos[5], value: 0.587 },
        { label: ablationCombos[6], value: 0.575 },
      ],
    },
    {
      title: "CN Amyloid (Bal. Acc.)",
      subtitle: "Preclinical screen",
      bars: [
        { label: ablationCombos[0], value: 0.688, highlight: true },
        { label: ablationCombos[1], value: 0.642 },
        { label: ablationCombos[2], value: 0.623 },
        { label: ablationCombos[3], value: 0.557 },
        { label: ablationCombos[4], value: 0.549 },
        { label: ablationCombos[5], value: 0.494 },
        { label: ablationCombos[6], value: 0.552 },
      ],
    },
  ]

  // ── Structured data (ScholarlyArticle) ──
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline:
      "Multi-Modal Missing-Modality Model + Retrieval-Augmented VQA for Alzheimer's Disease Prediction",
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
    dateModified: "2026-04-24",
    keywords: [
      "Alzheimer's disease",
      "multi-modal deep learning",
      "ADNI",
      "RAG VQA",
      "Mistral 7B",
    ],
    description:
      "A multi-modal vision-language model (T1 MRI + DTI FA + clinical) trained on 2,363 ADNI subjects, with missing-modality cross-attention fusion. Extended with a retrieval-augmented VQA pipeline benchmarked across Mistral 7B, Gemma 4 26B MoE, and MedGemma 1.5 4B.",
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

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        {/* ─── Top nav ─── */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
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
                Multi-Modal Missing-Modality VLM + Retrieval-Augmented VQA for Alzheimer&apos;s Detection
              </h1>

              {/* Stats row */}
              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Stat value="2,363" label="ADNI subjects" primary />
                <Stat value="~70M" label="Model params" />
                <Stat value="0.707" label="DX 3-class Bal. Acc." />
                <Stat value="0.933" label="CN vs Dem Bal. Acc." />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                A custom vision-language model that ingests T1 MRI, DTI FA maps, and clinical
                scores to predict six tasks, including preclinical amyloid detection.
                Extended with a FAISS-based retrieval pipeline and a three-way LLM comparison
                (Mistral 7B, Gemma 4 26B MoE, MedGemma 1.5 4B) for visual question answering over
                brain scans.
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
                <SectionLabel n="01" label="The Clinical Ask" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Under the NIA-AA A/T/N framework, cognitively normal (CN) individuals who test
                    positive for amyloid are already on the Alzheimer&apos;s disease biological
                    continuum. This is{" "}
                    <strong className="font-semibold text-foreground">preclinical AD</strong>:
                    no symptoms yet, but a 3 to 5x increased risk of progressing to MCI or dementia
                    within 3 to 5 years. Anti-amyloid therapies (Lecanemab, Donanemab) work best
                    at this stage.
                  </p>
                  <p>
                    The problem is finding these people. Amyloid PET scans cost $3{","}000 to $6{","}000
                    each. CSF draws are invasive. Neither works at screening scale. This project
                    asks whether{" "}
                    <strong className="font-semibold text-foreground">
                      structural MRI + DTI + routine clinical scores
                    </strong>{" "}
                    can do that job. No PET infrastructure needed. Just the imaging and labs most
                    patients already have.
                  </p>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Primary target
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Detect amyloid positivity in CN subjects well enough to work as a{" "}
                    <strong>rule-out triage tool</strong>. High specificity matters here: if the
                    model predicts CN amyloid-negative, those subjects can skip the expensive PET scan.
                  </p>
                </div>
              </section>

              {/* 02 — Dataset */}
              <section>
                <SectionLabel n="02" label="Dataset" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    All data comes from the{" "}
                    <strong className="font-semibold text-foreground">
                      Alzheimer&apos;s Disease Neuroimaging Initiative (ADNI)
                    </strong>
                    . After filtering to subjects with valid DX labels and 9DOF T1 paths,
                    deduplicating to one scan per subject, and recovering DTI paths from an
                    earlier dataset cut, the combined v3 cohort is{" "}
                    <strong className="font-semibold text-foreground">2,363 subjects</strong> with
                    DTI coverage of 39.4% (nearly doubled from the earlier 19.8%).
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
                <SectionLabel n="03" label="Model Architecture" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The model is a multi-modal vision-language model with missing-modality
                    support. Three modality-specific encoders produce ℓ2-normalized 512-d
                    embeddings, each gated by a per-modality masking probability during training.
                    The masked embeddings are fused via 8-head cross-attention with a learnable
                    pool query, producing a fused representation{" "}
                    <span className="font-mono text-foreground">z_f ∈ ℝ⁵¹²</span> that feeds six
                    MLP task heads.
                  </p>
                </div>

                <VLMArchitecture />

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
                      MLP over 6 continuous features (CDR-SB, ADAS-11/13, MMSE, MoCA, AV45 SUVR)
                      plus an APOE genotype embedding. Output: 512-d, ℓ2-normalized.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Design decision: no label leakage
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    An earlier iteration fed{" "}
                    <span className="font-mono text-xs">DX_code</span>,{" "}
                    <span className="font-mono text-xs">SEX_code</span>, and{" "}
                    <span className="font-mono text-xs">Amyloid_code</span> into the clinical
                    encoder. Those are the same variables the task heads are trying to predict, so
                    the accuracy numbers (DX3 at 97.6%, sex at 98.3%) were meaningless. The v2/v3
                    model{" "}
                    <strong>removes these inputs entirely</strong>. DX, sex, age, and amyloid are
                    prediction targets only; the clinical encoder receives 7 features. Every number
                    on this page is leakage-free.
                  </p>
                </div>
              </section>

              {/* 04 — Training */}
              <section>
                <SectionLabel n="04" label="Training Procedure" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Training runs in two stages. Stage 1 is contrastive pre-training: a
                    pairwise CLIP/InfoNCE loss between all three modality pairs (T1–DTI,
                    T1–Clinical, DTI–Clinical), computed only on pairs where both modalities are
                    present. Stage 2B is multi-task fine-tuning across six heads with differential
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
                      30 epochs · 6 joint heads
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      focal (γ=2) + smooth L1 · AMP FP16
                    </p>
                  </div>
                </div>

                <TrainingChart
                  series={[
                    { name: "DX3 Bal. Acc.", data: training.dx3, color: "var(--accent)" },
                    { name: "Amyloid Bal. Acc.", data: training.amyloid, color: "#ef4444" },
                    {
                      name: "CN Amyloid Bal. Acc.",
                      data: training.cnAmyloid,
                      color: "#a855f7",
                    },
                    {
                      name: "Sex Acc.",
                      data: training.sex,
                      color: "#10b981",
                      dashed: true,
                    },
                  ]}
                  xMax={30}
                  bestEpoch={5}
                  caption="Stage 2B training history. Best composite score at epoch 5; later epochs show overfitting, particularly on amyloid. The model used downstream is the epoch-5 checkpoint."
                />
              </section>

              {/* 05 — Results */}
              <section>
                <SectionLabel n="05" label="Results" />
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
                        ["Amyloid (A𝛽+ / A𝛽−)", "0.733", "0.733", "0.806", false],
                        ["CN Amyloid - preclinical", "0.688", "0.695", "0.685", true],
                        ["MCI Amyloid", "0.604", "0.595", "0.723", false],
                        ["Dementia Amyloid", "0.484", "0.456", "0.906", false],
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
                  <div className="rounded border border-border bg-card p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      CN amyloid (preclinical screen)
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.846 spec · 0.529 sens
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      High specificity, moderate sensitivity. That tradeoff is intentional for a
                      triage screen. When the model predicts CN amyloid-negative, it is right 85%
                      of the time.
                    </p>
                  </div>
                  <div className="rounded border border-accent/30 bg-accent/5 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      Dementia amyloid
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      0.906 AUC
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      By the time disease is established, the signal is clear. Amyloid-positivity
                      in dementia is correctly identified almost 97% of the time (sens = 0.969).
                    </p>
                  </div>
                </div>
              </section>

              {/* 06 — Modality Ablation */}
              <section>
                <SectionLabel n="06" label="Modality Ablation" />
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
                  caption="DTI+Clin wins three of the four tasks (DX Binary, overall Amyloid, tied on DX 3-class). For preclinical CN amyloid though, you need all three: T1 + DTI + Clinical reaches 0.688 Bal. Acc. vs. Clinical-only at 0.557, a 13.1 point gap on the hardest task. DTI alone is the weakest combination overall, but it still carries real signal for severe dementia cases."
                />
              </section>

              {/* 07 — VQA Pipeline */}
              <section>
                <SectionLabel n="07" label="Retrieval-Augmented VQA Extension" />
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The VLM gives you a prediction and a confidence score. What it doesn&apos;t
                    give you is an explanation, or any way to ask follow-up questions in natural
                    language. That&apos;s what the VQA extension adds. The frozen VLM encodes a
                    query scan into a 512-d embedding. FAISS finds the 50 most similar training
                    subjects by inner product. A cross-encoder reranks those 50 down to the top 5
                    most relevant matches. Those 5 captions become the context fed to a language
                    model, which answers clinical questions about the scan.
                  </p>
                </div>

                <VQAPipeline />

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
                <SectionLabel n="08" label="LLM Backbone Comparison" />
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
                      sublabel: "Standard · full modality",
                      mistral: 0.947,
                      gemma: 0.927,
                      medgemma: 0.507,
                      higher: "mistral",
                    },
                    {
                      metric: "VQA Diagnosis",
                      sublabel: "DTI-only query",
                      mistral: 0.753,
                      gemma: 0.533,
                      medgemma: 0.627,
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
                  caption="Same retrieved context across all three models; only the generation model changes. Mistral 7B wins every metric: diagnosis VQA accuracy and text quality (BERTScore, SBERT). MedGemma's medical fine-tune loses to a general-purpose 7B model. At this size, instruction-following matters more than domain knowledge."
                />

                <div className="mt-6 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Headline finding
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    <strong>Scale beats domain.</strong> Mistral 7B, a general-purpose dense
                    model, outperforms both a 26B MoE and a medically fine-tuned 4B on every
                    metric. The retrieved context already supplies the medical knowledge. What
                    matters is whether the model can follow instructions and format its output
                    correctly.
                  </p>
                </div>
              </section>

              {/* 09 — Key Findings */}
              <section>
                <SectionLabel n="09" label="Key Findings" />
                <div className="space-y-4">
                  {[
                    {
                      headline: "Imaging adds real signal to preclinical AD screening",
                      body:
                        "CN amyloid Bal. Acc. goes from 0.557 (Clinical-only) to 0.688 (T1 + DTI + Clinical), a 13.1 point gain on the hardest and most clinically useful task. Specificity sits at 0.846, which is what you want for a triage tool.",
                    },
                    {
                      headline: "The model works even without DTI",
                      body:
                        "Modality dropout during training (T1 10%, DTI 30%, Clinical 5%) means the model handles any combination at inference. In practice it works for the 60% of subjects who only have T1 + Clinical, not just the 39.4% with full DTI coverage.",
                    },
                    {
                      headline: "DTI + Clinical is strong, except for CN amyloid",
                      body:
                        "DTI + Clinical wins DX Binary (0.938) and overall Amyloid (0.746). For CN amyloid specifically though, T1 matters: DTI + Clinical drops to 0.623 while the full stack reaches 0.688.",
                    },
                    {
                      headline: "Mistral 7B is the best VQA model here",
                      body:
                        "A general-purpose 7B dense model beats a 26B MoE and a medically fine-tuned 4B on both diagnosis accuracy (94.7% vs 92.7% vs 50.7%) and text quality. The retrieved context does the medical heavy lifting. The model just needs to read it and respond clearly.",
                    },
                    {
                      headline: "VQA holds up even when retrieval is poor",
                      body:
                        "Under a DTI-only query, FAISS retrieval at @5 drops to 40.9%. Mistral 7B still reaches 75.3% VQA accuracy on those same queries. The LLM can extract useful signal even from partially mismatched context.",
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
                  Paper in preparation · code to be released on publication
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  This work was completed at the Keck School of Medicine of USC. Once the paper is
                  submitted I&apos;ll link the manuscript and GitHub repo here.
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
