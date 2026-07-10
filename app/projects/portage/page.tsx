import { Badge } from "@/app/components/ui/badge"
import {
  Github,
  FolderKanban,
  Zap,
  RefreshCcw,
  TrendingUp,
  ShieldCheck,
  Puzzle,
  DollarSign,
  Terminal,
  Bot,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectImageLightbox, {
  ProjectImageTrigger,
} from "@/app/components/ProjectImageLightbox"
import InteractiveCard from "@/app/components/ui/InteractiveCard"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import ProjectActions from "@/app/projects/components/ProjectActions"
import ProjectSectionLabel from "@/app/projects/components/ProjectSectionLabel"
import MigrationFlow from "./components/MigrationFlow"
import BlastRadius from "./components/BlastRadius"

import killResume from "@/public/images/portage/kill-resume.gif"
import cli01 from "@/public/images/portage/cli-01-migrate-watch.png"
import cli02 from "@/public/images/portage/cli-02-jobs.png"
import cli03 from "@/public/images/portage/cli-03-status.png"
import cli04 from "@/public/images/portage/cli-04-diff.png"
import mcp01 from "@/public/images/portage/mcp-01-verify-catches-bug.png"
import mcp02 from "@/public/images/portage/mcp-02-repo-graph-blast-radius.png"
import portal01 from "@/public/images/portage/portal-01-dashboard.png"
import portal02 from "@/public/images/portage/portal-02-job-detail.png"
import portal03 from "@/public/images/portage/portal-03-eval-leaderboard.png"

// Live demo embed — fully built, waiting on the hosted deployment.
// See app/projects/portage/components/LiveDemo.tsx for the enable checklist
// (demo URL + CSP frame-src change in next.config.mjs).
// import LiveDemo from "./components/LiveDemo"

const evalRows = [
  { repo: "flask-items-fixture", tier: "baseline", green: "3/3", pass: "1.00", recover: "0.0", cost: "$0.022", wall: "10s", strong: true },
  { repo: "minimal-flask-api", tier: "baseline", green: "2/3", pass: "0.67", recover: "0.3", cost: "$0.013", wall: "10s", strong: true },
  { repo: "flask-restx-api", tier: "framework", green: "1/3", pass: "0.67", recover: "3.3", cost: "$0.044", wall: "17s", strong: false },
  { repo: "flaskr", tier: "structural", green: "0/3", pass: "0.67", recover: "3.7", cost: "$0.250", wall: "55s", strong: false },
  { repo: "watchlist", tier: "structural", green: "0/3", pass: "0.67", recover: "4.0", cost: "$0.261", wall: "61s", strong: false },
  { repo: "microblog", tier: "heavy", green: "0/3", pass: "0.00", recover: "4.3", cost: "$1.503", wall: "165s", strong: false },
]

const allImages = [
  { src: cli01, alt: "Portage CLI — live task transitions during portage migrate --watch" },
  { src: cli02, alt: "Portage CLI — recent jobs list with id, status, recipe, and test counts" },
  { src: cli03, alt: "Portage CLI — task tree, attempts, and verdict for one job" },
  { src: cli04, alt: "Portage CLI — full migration diff via portage report --diff" },
  { src: mcp01, alt: "Portage MCP — a breaking diff applied in the sandbox and honestly failed with named tests" },
  { src: mcp02, alt: "Portage MCP — structural repo graph and blast-radius impact for a proposed change" },
  { src: portal01, alt: "Portage dashboard — jobs list and launch surface" },
  { src: portal02, alt: "Portage dashboard — job detail with task tree, diffs, and recovery timeline" },
  { src: portal03, alt: "Portage dashboard — aggregate eval leaderboard with fault-run proof" },
]

function Screenshot({
  index,
  aspect = "aspect-video",
}: {
  index: number
  aspect?: string
}) {
  const image = allImages[index]

  return (
    <ProjectImageTrigger
      index={index}
      label={`Open image viewer: ${image.alt}`}
      className={`relative block w-full ${aspect} cursor-zoom-in overflow-hidden rounded border border-border text-left transition-colors hover:border-accent/40`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
        placeholder="blur"
      />
    </ProjectImageTrigger>
  )
}

export default function PortagePage() {
  const project = {
    title: "Portage - Autonomous Code-Migration Agent",
    description:
      "Give it a Flask repo and a recipe; it plans a per-file task DAG, rewrites each file with an LLM on a git worktree, verifies against the repo's own tests in a network-off Docker sandbox, recovers from failures under bounded budgets, and reports honestly — including when it fails.",
    why: `Most "AI migration" demos are single-shot prompts with no verification story. Portage is built around the opposite claim: a migration is only real if the repo's own tests still pass, every planned file was actually migrated, and recovery cannot game the score by giving up.

The governing principle is narrow + measured beats broad + unproven. One hard migration (Flask → FastAPI) instead of a catalogue of half-working recipes. An eval harness that runs the real queue/worker path, not a mocked agent loop. A failure taxonomy with SOLVED / PARTIAL / OPEN statuses and evidence, not an all-green sheet. The autonomous + eval core is the credibility engine for the MCP product: if the verify/recover loop is measured, another agent can trust verify_patch_in_sandbox over a raw sandbox.`,
    how: `v1 ships one recipe: Flask → FastAPI. That target is deliberate — routing decorators, request/response handling, blueprints → routers, error handlers, and app factories need understanding, not mechanical rewriting; deterministic codemods cannot do this reliably. The architecture is recipe-pluggable; the evidence is recipe-specific by design.

One core engine, two interfaces. Autonomous mode: \`portage migrate <repo> --watch\` drives the full graph. Co-pilot mode: Claude Code / Cursor call verify_patch_in_sandbox, repo_graph, and blast_radius over MCP — the same verified primitives the eval numbers were measured on. The dashboard is the observability and proof surface, not the front door.`,
    tags: ["Python", "FastAPI", "LangGraph", "Postgres", "pgvector", "LiteLLM", "Docker", "Next.js", "MCP", "pytest"],
    github: "https://github.com/SohailGidwani/Portage",
    features: [
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Checkpoint Durability",
        description: "LangGraph Postgres checkpointer after every node; worker lease with heartbeat. Kill the worker mid-run and a restarted one resumes — Ingest runs once, Execute skips already-applied files via content hashes.",
      },
      {
        icon: <RefreshCcw className="w-5 h-5" />,
        title: "Bounded Recovery",
        description: "Failures are classified, blamed, and rolled back surgically: targeted git checkout + regenerate, widen-on-repeat, replan on planner misses, skip-and-continue as last resort. Budgets bound everything.",
      },
      {
        icon: <ShieldCheck className="w-5 h-5" />,
        title: "Honest Scoring",
        description: "Green cannot be gamed by skip-and-continue, empty diffs, or all-skipped suites. Report reloads task truth from Postgres, Integrate recomputes the diff, Verify requires passed > 0.",
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Measured Escalation",
        description: "First N attempts use the driver model tier; later attempts escalate. Every attempt lands in attempts_log with tier, model, tokens, and USD — \"how often does escalation rescue?\" is a SQL query.",
      },
      {
        icon: <Puzzle className="w-5 h-5" />,
        title: "Pluggable Recipes",
        description: "A recipe declares detection, task types, and per-task verify specs. Unknown recipes degrade safely to ingest → verify → report: tests run, nothing changed, verdict honest red.",
      },
      {
        icon: <DollarSign className="w-5 h-5" />,
        title: "Cost as a Metric",
        description: "Every LLM call's tokens and USD recorded per attempt, summed per job, averaged per eval cell — retries and escalations included. Cost scales with recovery, and that relationship is part of the result.",
      },
    ],
    technicalDetails: [
      "Monorepo: apps/backend (Python 3.12, uv) + apps/frontend (Next.js App Router, pnpm)",
      "FastAPI control plane, async throughout — CLI and dashboard are thin REST clients",
      "LangGraph agent with langgraph-checkpoint-postgres; thread_id = job_id",
      "Postgres job queue claimed via FOR UPDATE SKIP LOCKED with heartbeat lease",
      "Two DB drivers, one Postgres: asyncpg for domain tables (Alembic), psycopg3 for checkpoints",
      "Ephemeral Docker sandbox per verify run, --network none; gVisor (runsc) option for hosting",
      "LiteLLM provider ladder: driver / escalation / cheap — provider is env config, not code",
      "code-review-graph behind a Protocol for the structural graph + blast radius",
      "FastMCP stdio server exposing verify_patch_in_sandbox, repo_graph, blast_radius",
      "GitHub OAuth (hosted mode), rotating refresh cookies, pk_ API keys, quota + spend caps",
    ],
    challenges: [
      "A single shared sandbox image cannot serve mutually incompatible dependency pins — four corpus candidates dropped for that reason; the unlock is per-repo sandbox images",
      "Skip-and-continue produced false greens (original suite passes after full rollback) — fixed by reloading task truth, recomputing diffs, and requiring full completion",
      "Models can \"pass\" by decorating every test with skip — Verify now requires passed > 0",
      "Export contracts pin names, not call shapes — get_db() drifting between plain function / needs-request / context manager across files is the dominant residual failure",
      "Flask-coupled extensions (flask_sqlalchemy, flask_restx) need per-extension sub-strategies; partially cracked, not reliable",
      "LLM nondeterminism means single runs are anecdotes — K-run mean±variance is mandatory, and organic flake is a finding, not noise to hide",
    ],
    learnings: [
      "The hard thing (autonomous migrate + eval) validates the easy thing (MCP verify tool)",
      "Honesty bars must be structural, not aspirational — every false-green class found in the wild became a hard predicate",
      "Recovery is a product feature only if it is measured: fault scenarios, attempts_log, cost deltas",
      "Recipe rules encode observed failures cheaply; structural gaps need architecture, not more prompt text",
      "Cost that includes retries is the only honest cost; cheap first-pass numbers lie",
      "Compose + network-off sandboxes make multi-service agent systems operable without cloud lock-in",
    ],
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="portage"
        image="/images/portage/portal-01-dashboard.png"
        keywords={project.tags}
        github={project.github}
        projectType="app"
      />
      <ProjectImageLightbox images={allImages}>
        <div className="min-h-screen overflow-x-clip bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    Agentic AI / Autonomous Migration
                  </span>
                </div>
                <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>

                {/* Stat callout row */}
                <div className="mb-6 flex flex-wrap items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">0</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Humans in the Loop</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">K=3 × 6</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Eval Grid · Pinned Repos</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">100%</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Fault Recovery (Fixture)</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">2</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Interfaces · CLI + MCP</p>
                  </div>
                </div>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <ProjectActions
                  github={project.github}
                  deepDive="/projects/portage/deep-dive"
                  proofHref="#recovery-proof"
                  proofLabel="Watch recovery proof"
                  className="mb-8"
                />
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-xs uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl space-y-16">

                {/* 01 — System Overview */}
                <section id="recovery-proof" className="scroll-mt-24">
                  <ProjectSectionLabel n="01" label="System Overview" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    One core engine, two interfaces: the CLI drives fully autonomous migrations, and an MCP
                    server hands the same verified primitives to co-pilot agents like Claude Code and Cursor.
                    The dashboard is the proof surface — live task trees, diffs, recovery timelines, and the
                    eval leaderboard. Below is the core durability claim, live: the worker is killed
                    mid-migration, and a restarted worker resumes from the Postgres checkpoint instead of
                    starting over.
                  </p>
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        durability proof — kill the worker, it resumes
                      </span>
                    </div>
                    <Image
                      src={killResume}
                      alt="Terminal recording: the Portage worker is killed mid-migration and a restarted worker resumes from the Postgres checkpoint to finish the job"
                      className="h-auto w-full"
                      unoptimized
                    />
                    <div className="border-t border-border px-4 py-2">
                      <p className="font-mono text-xs text-muted-foreground">
                        reproduce: bash scripts/demo_kill_resume.sh · stricter: scripts/dod_check.sh
                      </p>
                    </div>
                  </div>
                </section>

                {/* 02 — Why I Built It */}
                <section>
                  <ProjectSectionLabel n="02" label="Why I Built It" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.why}
                  </p>
                </section>

                {/* 03 — How It Works */}
                <section>
                  <ProjectSectionLabel n="03" label="How It Works" />
                  <p className="mb-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.how}
                  </p>
                  <DiagramLightbox title="Job Lifecycle — LangGraph Nodes">
                    <MigrationFlow />
                  </DiagramLightbox>
                </section>

                {/* 04 — CLI */}
                <section>
                  <ProjectSectionLabel n="04" label="CLI — Autonomous Mode" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The <span className="font-mono text-foreground">portage</span> console script is a thin
                    httpx client over the REST API — it never touches the DB or queue directly, the same
                    boundary the dashboard respects. <span className="font-mono text-foreground">migrate --watch</span>{" "}
                    streams live task transitions; <span className="font-mono text-foreground">status</span>,{" "}
                    <span className="font-mono text-foreground">jobs</span>, and{" "}
                    <span className="font-mono text-foreground">report --diff</span> cover inspection. Exit
                    codes are the eval bar: 0 means honestly green, 1 means finished but not
                    complete-and-green, 2 means usage or infra.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Screenshot index={0} />
                    <Screenshot index={1} />
                    <Screenshot index={2} />
                    <Screenshot index={3} />
                  </div>
                </section>

                {/* 05 — MCP */}
                <section>
                  <ProjectSectionLabel n="05" label="MCP — Co-pilot Mode" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The MCP server exposes the verified core so another AI agent can test its own work before
                    writing to the caller&apos;s tree:{" "}
                    <span className="font-mono text-foreground">verify_patch_in_sandbox</span> copies the repo,
                    applies a unified diff, runs the tests network-off, and returns structured pass/fail with
                    failing test names — never mutating the caller&apos;s files.{" "}
                    <span className="font-mono text-foreground">repo_graph</span> and{" "}
                    <span className="font-mono text-foreground">blast_radius</span> give it structural
                    awareness. Here is what a blast-radius query actually computes:
                  </p>
                  <DiagramLightbox title="Blast Radius — Impact of a Change">
                    <BlastRadius />
                  </DiagramLightbox>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Screenshot index={4} />
                    <Screenshot index={5} />
                  </div>
                </section>

                {/* 06 — Dashboard as Proof */}
                <section>
                  <ProjectSectionLabel n="06" label="Dashboard as Proof" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Next.js App Router, REST only — the frontend never owns schema. Jobs list with launch
                    form, job detail with live pipeline route, per-file diffs, and attempt tier/model
                    timelines, and a public <span className="font-mono text-foreground">/eval</span>{" "}
                    leaderboard rendering per repo×scenario green rates, mean±variance, cost, and recovery
                    straight from the <span className="font-mono text-foreground">runs</span>/
                    <span className="font-mono text-foreground">metrics</span> tables.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Screenshot index={6} />
                    <Screenshot index={7} />
                  </div>
                  <div className="mt-4">
                    <Screenshot index={8} aspect="aspect-[21/9]" />
                  </div>
                </section>

                {/*
                  ── 06.5 — Live Demo (enable after Phase 8 hosting) ──────────
                  The embed component is fully built. To turn this on:
                  1. Set PORTAGE_DEMO_URL in ./components/LiveDemo.tsx
                  2. Allow the origin in next.config.mjs CSP (frame-src)
                  3. Uncomment the import at the top of this file + this block.

                <section>
                  <ProjectSectionLabel n="06.5" label="Try It Live" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The hosted Portage dashboard, embedded. Sign in with GitHub, submit a migration against a
                    corpus repo, and watch the task tree, diffs, and recovery timeline update live — or browse
                    the public eval leaderboard without signing in.
                  </p>
                  <LiveDemo />
                </section>
                */}

                {/* 07 — Key Features */}
                <section>
                  <ProjectSectionLabel n="07" label="Key Features" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <InteractiveCard
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
                      </InteractiveCard>
                    ))}
                  </div>
                </section>

                {/* 08 — Eval Headline */}
                <section>
                  <ProjectSectionLabel n="08" label="Eval Headline" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Suite <span className="font-mono text-foreground">k3-baseline</span>: every repo×scenario
                    cell runs K=3 times through the real queue/worker path, and green requires the full suite
                    passing, every task done, and zero skips. Straight from the{" "}
                    <span className="font-mono text-foreground">runs</span>/
                    <span className="font-mono text-foreground">metrics</span> tables:
                  </p>
                  <div className="overflow-x-auto rounded border border-border bg-card/40">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          <th className="px-4 py-3 text-left font-normal">Repo</th>
                          <th className="px-4 py-3 text-left font-normal">Tier</th>
                          <th className="px-4 py-3 text-left font-normal">Green</th>
                          <th className="px-4 py-3 text-left font-normal">Test-pass</th>
                          <th className="px-4 py-3 text-left font-normal">Recover</th>
                          <th className="px-4 py-3 text-left font-normal">Cost</th>
                          <th className="px-4 py-3 text-left font-normal">Wall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {evalRows.map((r) => (
                          <tr key={r.repo}>
                            <td className="px-4 py-3 font-mono text-xs text-foreground">{r.repo}</td>
                            <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{r.tier}</td>
                            <td className={`px-4 py-3 font-mono text-xs font-bold ${r.strong ? "text-accent" : "text-muted-foreground"}`}>{r.green}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.pass}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.recover}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.cost}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.wall}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Finding</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      The reliability boundary is idiom, not size. JSON APIs migrate green at ~$0.01–0.02 with
                      zero recovery; server-rendered apps complete their task DAGs but fail behaviorally — the
                      named frontier is cross-file call-shape drift. Fault injection on the stable tier
                      (bad_patch, bad_patch_until_escalation) recovers 100% green on the fixture, 3/3 each.
                    </p>
                  </div>
                </section>

                {/* 09 — Technical Stack */}
                <section>
                  <ProjectSectionLabel n="09" label="Technical Stack" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-xs text-accent/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 10 — Friction & Takeaways */}
                <section>
                  <ProjectSectionLabel n="10" label="Friction & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Friction
                      </p>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        Takeaways
                      </p>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Interfaces recap strip */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: <Terminal className="h-4 w-4" />, label: "CLI", sub: "portage migrate --watch · exit 0 = honest green" },
                    { icon: <Bot className="h-4 w-4" />, label: "MCP", sub: "verify_patch_in_sandbox · repo_graph · blast_radius" },
                    { icon: <Gauge className="h-4 w-4" />, label: "Dashboard", sub: "jobs · recovery timelines · public /eval" },
                  ].map((c) => (
                    <div key={c.label} className="rounded border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-accent">
                        {c.icon}
                        <span className="font-mono text-xs uppercase tracking-[0.18em]">{c.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Technical Deep Dive CTA */}
                <div className="rounded border border-accent/30 bg-accent/5 p-6">
                  <div className="mb-1 font-mono text-xs uppercase tracking-[0.22em] text-accent">Technical Deep Dive</div>
                  <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                    Durability, Recovery, Eval Methodology & the Failure Taxonomy
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    Every moving part explained: the animated architecture, graph-node lifecycle, checkpoint
                    and lease mechanics, sandbox anti-gaming predicates, the seven recovery strategies, K-run
                    eval methodology with non-claims, and the nine-category failure taxonomy with evidence.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/projects/portage/deep-dive"
                      className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                    >
                      <FolderKanban className="h-4 w-4" />
                      Read Deep Dive
                    </Link>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3 border-t border-border pt-8">
                  <a
                    href={project.github}
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
                </div>

              </div>
            </div>
          </div>

        </div>
      </ProjectImageLightbox>
    </>
  )
}
