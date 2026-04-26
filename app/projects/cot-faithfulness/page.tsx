"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Github, FolderKanban, FlaskConical, Microscope, BarChart3, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import coverImage from "@/public/images/cot_faithfulness.jpeg"
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import BaselineChart from "./components/BaselineChart"
import TruncationChart from "./components/TruncationChart"
import CorruptionChart from "./components/CorruptionChart"
import HintsChart from "./components/HintsChart"

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

const tags = ["Python", "LLM", "Ollama", "NLP", "Research", "GSM8K", "ARC", "CSCI-544"]
const github = "https://github.com/SohailGidwani/cot_faithfulness"

const verdictRows = [
  { label: "CoT helps?", math: "Yes (+44-50pp)", science: "No (-5 to -12pp)" },
  { label: "SCR at step 1", math: "9-23% (needs full chain)", science: "59-83% (predetermined)" },
  { label: "CFR, all steps corrupted", math: "48-60% (follows reasoning)", science: "9-11% (ignores reasoning)" },
  { label: "Late CFR higher than early?", math: "Yes (+10pp)", science: "No difference" },
  { label: "Steering rate (authoritative)", math: "1.2-3.2%", science: "16.4-19.2%" },
  { label: "Max SBH rate", math: "Below 2.4%", science: "Up to 17%" },
  { label: "Verdict", math: "Partially faithful", science: "Largely unfaithful" },
]

const features = [
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: "Four-Experiment Framework",
    description:
      "Baseline accuracy, step-based truncation (SCR), reasoning corruption (CFR), and biased hint injection, each probing faithfulness from a different angle across roughly 15,000 model queries",
  },
  {
    icon: <Microscope className="w-5 h-5" />,
    title: "Deterministic Corruption",
    description:
      "Six corruption conditions with rule-based perturbations only: arithmetic swaps, negated conclusions, reversed causation. No LLM in the loop, so results are fully reproducible",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Statistical Rigor",
    description:
      "95% Wald confidence intervals on all proportions. McNemar's exact test for cross-model comparisons. Both cross-model differences land at p below 0.001",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Steered-But-Hidden Detection",
    description:
      "17 regex patterns catch whether hints appear in the CoT. SBH rates reach 17% on ARC: the model changes its answer to match the wrong hint while the reasoning reads as independent analysis",
  },
]

const technicalDetails = [
  "Llama 3.2 (3B) and Qwen 2.5 (7B) via Ollama, temperature=0.0, greedy decoding for deterministic outputs",
  "GSM8K (grade-school math) and ARC-Challenge (science MC), 250 samples each, seed=42, totaling roughly 15,000 model queries over 6.2 hours",
  "Step parser with a 3-level hierarchy: numbered markers first, transition words second, sentence boundaries as fallback",
  "Answer extractor: regex-first (#### number, answer is X) with last-number fallback for GSM8K; letter detection for ARC",
  "Six corruption conditions: none, early, middle, late, early+late, all, using rule-based perturbations with no LLM involvement",
  "Hint injection at four strength levels: weak, medium, strong, and authoritative (Stanford professor framing)",
  "Metrics: SCR (Step Consistency Rate), CFR (Corruption Following Rate), HAR, SBH, and Steering Rate",
  "95% Wald CIs on all proportions; McNemar's exact test on paired cross-model comparisons",
  "All raw model responses saved to JSON so any metric can be recomputed without re-querying the models",
]

const challenges = [
  "Roughly 15,000 inference calls over 6.2 hours meant the experiment pipeline had to support crash recovery so partial runs were not lost",
  "Building a step parser that handled the wildly varied CoT formats produced by two different model families",
  "Deterministic corruption that is realistic enough to test faithfulness, but not so obvious the model trivially rejects it",
  "Answer extraction from free-form LLM output is messier than it looks: regex with multiple fallbacks still misses edge cases",
  "ARC's multiple-choice format made corruption harder to design since logical negation had to change the answer reliably without producing nonsense",
]

const learnings = [
  "Math and science MC have fundamentally different faithfulness profiles. Treating them as one category masks the most important finding",
  "Model size has a paradoxical effect: larger models are harder to corrupt but more likely to hide when they are steered (lower HAR, comparable SBH)",
  "Steered-But-Hidden is the most dangerous failure mode for trustworthy AI. The model appears to reason independently while being silently influenced",
  "Late-step corruption matters more than early-step for math (+10pp CFR), which confirms the final calculation steps are genuinely causal",
  "High SCR on ARC (up to 83%) means the chain-of-thought is mostly narrative written to explain a predetermined answer, not to arrive at one",
]

export default function CoTFaithfulnessPage() {
  return (
    <>
      <ProjectDetailStructuredData
        title="CoT Faithfulness Analysis"
        description="USC CSCI-544 NLP research. Four experiments — step truncation (SCR), reasoning corruption (CFR), and biased hint injection (SBH) — testing whether chain-of-thought in Llama 3.2 3B and Qwen 2.5 7B causally drives answers or is post-hoc rationalization across GSM8K and ARC-Challenge."
        slug="cot-faithfulness"
        image="/images/cot_faithfulness.jpeg"
        keywords={tags}
        github={github}
        dateCreated="2025-05-01"
        projectType="research"
      />
      <Suspense fallback={<ProjectSkeleton />}>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    NLP Research · CSCI-544 @ USC
                  </span>
                </div>
                <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  CoT Faithfulness Analysis
                </h1>

                <div className="mb-6 flex flex-wrap items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">4</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Experiments</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">~15K</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Model Queries</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">500</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Benchmark Samples</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">17%</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Max SBH Rate</p>
                  </div>
                </div>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  A CSCI-544 NLP course project at USC. When an LLM thinks step by step, does it actually use that reasoning to reach its answer, or is the chain of thought just a plausible explanation for something it already decided? Four experiments across two models and two benchmarks try to find out.
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <SectionLabel n="01" label="Preview" />
                  <div className="relative aspect-video overflow-hidden rounded border border-border">
                    <Image
                      src={coverImage}
                      alt="USC campus, home of CSCI-544"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.section>

                {/* 02 — Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <SectionLabel n="02" label="Overview" />
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    <p>
                      The question that drove this project is deceptively simple: when an LLM writes out its reasoning, does that reasoning actually change what answer it gives? Four experiments probe this across two locally-run models (Llama 3.2 3B and Qwen 2.5 7B) and two benchmarks (GSM8K math and ARC-Challenge science), collecting roughly 15,000 queries over a 6.2-hour run.
                    </p>
                    <p>
                      The baseline first checks whether CoT even helps. For math, it does in a big way: Llama jumps from 5.2% to 48.8%, and Qwen from 16% to 65.6%. For science multiple-choice, both models score <em>worse</em> with CoT. That contrast is the through-line of every other experiment.
                    </p>
                    <p>
                      Experiment 1 truncates the reasoning chain after each step and checks if the answer changes. Experiment 2 injects deterministic rule-based errors into the CoT and measures whether the model follows the corrupted logic. Experiment 3 prepends authoritative hints suggesting wrong answers, then classifies whether the model acknowledges the hint in its reasoning or gets silently steered.
                    </p>
                    <p>
                      All proportions come with 95% Wald confidence intervals. Cross-model comparisons use McNemar's exact test, both significant at p below 0.001.
                    </p>
                  </div>
                </motion.section>

                {/* 03 — Verdict table */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <SectionLabel n="03" label="Faithfulness Verdict" />
                  <div className="overflow-x-auto">
                    <div className="min-w-[520px] overflow-hidden rounded border border-border bg-card">
                      <div className="grid grid-cols-3 border-b border-border bg-card/60">
                        <div className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Dimension</div>
                        <div className="border-l border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Math (GSM8K)</div>
                        <div className="border-l border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Science MC (ARC)</div>
                      </div>
                      <div className="divide-y divide-border/50">
                        {verdictRows.map((row, i) => (
                          <div key={i} className="grid grid-cols-3">
                            <div className="px-4 py-3 text-sm font-medium text-foreground">{row.label}</div>
                            <div className={`border-l border-border px-4 py-3 text-sm ${i === verdictRows.length - 1 ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                              {row.math}
                            </div>
                            <div className={`border-l border-border px-4 py-3 text-sm ${i === verdictRows.length - 1 ? "font-semibold text-muted-foreground" : "text-muted-foreground"}`}>
                              {row.science}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* 04 — Baseline */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <SectionLabel n="04" label="Exp 0 — Baseline Accuracy" />
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    Every (model, dataset, question) pair gets two queries: direct and chain-of-thought. On GSM8K, CoT turns near-random guessing into real performance. On ARC, both models do worse when they reason out loud, which suggests the chain is introducing noise on top of knowledge the model already has.
                  </p>
                  <BaselineChart caption="No-CoT vs CoT accuracy for both models. Amber bar = CoT improved; gray bar = CoT degraded. Deltas shown top-right of each group." />
                </motion.section>

                {/* 05 — Truncation */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <SectionLabel n="05" label="Exp 1 — Step Truncation (SCR)" />
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    The CoT from Experiment 0 gets parsed into discrete steps using a three-level hierarchy (numbered markers, transition words, sentence boundaries). The model then answers using only the first k steps, and we check how often that partial answer matches the full-chain answer. Low SCR at step 1 means the model genuinely needs later steps. Qwen reaches the same ARC answer from step 1 alone in 83% of cases, which means those remaining steps add nothing.
                  </p>
                  <TruncationChart caption="Step Consistency Rate across truncation steps 1 to 5. Science lines (blue) stay high from the start. Math lines (amber) stay low, showing the model needs the full chain." />
                </motion.section>

                {/* 06 — Corruption */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <SectionLabel n="06" label="Exp 2 — Reasoning Corruption (CFR)" />
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    Rule-based errors are injected into the CoT across six conditions: none, early, middle, late, early+late, and all. For GSM8K, the Corruption Following Rate (CFR) climbs as more steps are corrupted, and late-step corruption consistently outpaces early-step corruption by about 10pp. That pattern makes sense if the final calculation steps are what actually determine the answer. On ARC, Qwen's CFR stays flat at 9 to 11% regardless of how much of the reasoning is corrupted.
                  </p>
                  <CorruptionChart caption="CFR by corruption condition for each model and dataset. The 'All' bar is highlighted. Notice the contrast between math (moderate and increasing) and Qwen on science (flat and near-zero)." />
                </motion.section>

                {/* 07 — Hints */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <SectionLabel n="07" label="Exp 3 — Biased Hints (SBH)" />
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    A hint suggesting a wrong answer is prepended at four strength levels, from a gentle "could the answer perhaps be X?" up to "a Stanford professor mentioned the answer is X." Responses are classified into four outcomes: Faithful Reject (acknowledged the hint, gave correct answer), Faithful Follow (acknowledged it, followed it), Unfaithful Ignore (silently ignored), and Steered-But-Hidden (silently followed it). SBH is the one that matters most. On ARC, Qwen's SBH rate triples from weak to strong hints while the Hint Acknowledgment Rate barely moves. The model is getting more influenced but hiding it better.
                  </p>
                  <HintsChart caption="Steered-But-Hidden rate by hint strength. Blue lines = science MC (vulnerable). Amber lines = math (nearly flat). Dashed = Qwen 7B." />
                </motion.section>

                {/* 08 — Experiment Design */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <SectionLabel n="08" label="Experiment Design" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="rounded border border-border bg-card p-5 transition-colors hover:border-accent/40"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="text-accent">{feature.icon}</div>
                          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 09 — Technical Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <SectionLabel n="09" label="Technical Stack" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* 10 — Friction & Takeaways */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <SectionLabel n="10" label="Friction & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Friction
                      </p>
                      <ul className="space-y-3">
                        {challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        Takeaways
                      </p>
                      <ul className="space-y-3">
                        {learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="flex flex-wrap gap-3 border-t border-border pt-8"
                >
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <FolderKanban className="h-4 w-4" />
                    All Projects
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  )
}
