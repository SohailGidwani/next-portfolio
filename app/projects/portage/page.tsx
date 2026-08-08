import { Badge } from "@/app/components/ui/badge"
import {
  Github,
  FolderKanban,
  Zap,
  RefreshCcw,
  TrendingUp,
  ShieldCheck,
  Layers,
  Fingerprint,
  FileCheck,
  DollarSign,
  Terminal,
  Bot,
  Gauge,
  GitBranch,
  Lock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProjectNav from "@/app/components/ProjectNav"
import DemoVideo from "@/app/components/DemoVideo"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectImageLightbox, {
  ProjectImageTrigger,
} from "@/app/components/ProjectImageLightbox"
import InteractiveCard from "@/app/components/ui/InteractiveCard"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import ProjectActions from "@/app/projects/components/ProjectActions"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"
import MobileSection from "@/app/components/MobileSection"
import MigrationFlow from "./components/MigrationFlow"
import BlastRadius from "./components/BlastRadius"

import cli01 from "@/public/images/portage/cli-01-migrate-watch.png"
import cli02 from "@/public/images/portage/cli-02-jobs.png"
import cli03 from "@/public/images/portage/cli-03-status.png"
import cli04 from "@/public/images/portage/cli-04-diff.png"
import mcp01 from "@/public/images/portage/mcp-01-verify-catches-bug.png"
import mcp02 from "@/public/images/portage/mcp-02-repo-graph-blast-radius.png"
import portal01 from "@/public/images/portage/portal-01-dashboard.png"
import portal02 from "@/public/images/portage/portal-02-job-detail.png"
import portal03 from "@/public/images/portage/portal-03-eval-leaderboard.png"

// Live demo embed: fully built, waiting on the hosted deployment.
// See app/projects/portage/components/LiveDemo.tsx for the enable checklist
// (demo URL + CSP frame-src change in next.config.mjs).
// import LiveDemo from "./components/LiveDemo"

// Two evidence sets, deliberately shown together: the development corpus is where
// the engine converged, the frozen held-out set is where it did not.
const evidenceRows = [
  { set: "Flaskr + Watchlist · K=5 gates", result: "10/10", meaning: "the hard known structural and extension apps converge repeatably", strong: true },
  { set: "Items / RESTX / Structural / Minimal · K=3", result: "12/12", meaning: "the smaller development tiers hold on the same code", strong: true },
  { set: "Fresh seven-repo sweep · one sample each", result: "6/7", meaning: "Microblog red on architect variance; its accepted-plan replay is 26/26 tasks, 4/4 tests", strong: true },
  { set: "Frozen R5 v1 · three then-unseen repos × K=3", result: "0/9", meaning: "the recipe does not yet generalize to repositories it has never seen", strong: false },
  { set: "Post-R5 ws-example · K=1", result: "1/1", meaning: "first remediation gate is green, on a repo that is now a development input: not held-out evidence", strong: true },
]

const heldOutRows = [
  { repo: "ws-example", baseline: "42/42", result: "0/3", failure: "generated test-client facade shadowed FastAPI route decorators; two samples stalled at 13/42" },
  { repo: "silicon", baseline: "34/34", result: "0/3", failure: "invalid generated signatures; a raw FastAPI object constructed instead of the frozen facade" },
  { repo: "flask-email-login", baseline: "18/18", result: "0/3", failure: "architect missed the required context owner; the fallback left CSRF and mail providers as None" },
]

const allImages = [
  { src: cli01, alt: "Portage CLI: live task transitions during portage migrate --watch" },
  { src: cli02, alt: "Portage CLI: recent jobs list with id, status, recipe, and test counts" },
  { src: cli03, alt: "Portage CLI: task tree, attempts, and verdict for one job" },
  { src: cli04, alt: "Portage CLI: full migration diff via portage report --diff" },
  { src: mcp01, alt: "Portage MCP: a breaking diff applied in the sandbox and honestly failed with named tests" },
  { src: mcp02, alt: "Portage MCP: structural repo graph and blast-radius impact for a proposed change" },
  { src: portal01, alt: "Portage dashboard: jobs list and launch surface" },
  { src: portal02, alt: "Portage dashboard: job detail with task tree, diffs, and recovery timeline" },
  { src: portal03, alt: "Portage dashboard: aggregate eval leaderboard with fault-run proof" },
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

const tocItems = [
  { id: "recovery-proof", n: "01", label: "System Overview" },
  { id: "section-02", n: "02", label: "Why I Built It" },
  { id: "section-03", n: "03", label: "How It Works" },
  { id: "section-04", n: "04", label: "CLI: Autonomous Mode" },
  { id: "section-05", n: "05", label: "MCP: Co-pilot Mode" },
  { id: "section-06", n: "06", label: "Dashboard as Proof" },
  { id: "section-07", n: "07", label: "Key Features" },
  { id: "section-08", n: "08", label: "Eval Headline" },
  { id: "section-09", n: "09", label: "Technical Stack" },
  { id: "section-10", n: "10", label: "Friction & Takeaways" },
]

export default function PortagePage() {
  const project = {
    title: "Portage: Autonomous Code-Migration Agent",
    description:
      "Give it a Flask repo and a recipe; it plans the target architecture, rewrites existing files and creates the new modules the migration requires, verifies against the repo's own tests in a network-off Docker sandbox, recovers from failures under bounded budgets, and reports honestly, including when it fails.",
    why: `Most "AI migration" demos are single-shot prompts with no verification story. Portage is built around the opposite claim: a migration is only real if the repo's own tests still pass, every planned file was actually migrated, and recovery cannot game the score by giving up.

The governing principle is narrow + measured beats broad + unproven. One hard migration (Flask → FastAPI) instead of a catalogue of half-working recipes. An eval harness that runs the real queue/worker path, not a mocked agent loop. A failure taxonomy with SOLVED / PARTIAL / OPEN statuses and evidence, not an all-green sheet. The autonomous + eval core is the credibility engine for the MCP product: if the verify/recover loop is measured, another agent can trust verify_patch_in_sandbox over a raw sandbox.`,
    how: `v1 ships one recipe: Flask → FastAPI. That target is deliberate. Routing decorators, request/response handling, blueprints → routers, error handlers, app factories, and ambient request context (g, session) need understanding, not mechanical rewriting; deterministic codemods cannot do this reliably. The architecture is recipe-pluggable; the evidence is recipe-specific by design.

The capability that unlocked the hard repos: some migrations are unreachable by rewriting existing files. Flask's g/session have no FastAPI equivalent. A correct port needs a new request-context module, a test-compatibility surface, a rendering layer, and every consumer wired to them coherently. Portage plans those artifacts with a bounded architect call, freezes their contracts before generation, compiles the deterministic parts itself, and enforces that a framework-shaped capability is only valid when the plan owns and implements it, so a model can't reference a helper it wishes existed.

A second wave, coherent-cut preservation, closed the gap the first one left open. One bad file inside an otherwise-correct migration used to trigger a full rollback of every file in its verification cut, so a single local mistake could sink a ten-file run. Recover now checkpoints the last coherent state before a targeted repair and restores that on failure instead of the whole migration, and one shared gate (caller, capability, import-direction, cycle, and contract checks) runs identically across every generation path: first draft, contract repair, and targeted repair alike. That is what took watchlist, a Flask-SQLAlchemy app that had never gone green, to autonomous 15/15, and pushed flaskr to a 5-for-5 reliability gate.

Then the first frozen held-out evaluation supplied the correction. On three repositories that had never been migrated during development, Portage scored 0/9 strict green. The engine failed honestly: five trees restored coherently, four stayed migrated-but-red, zero were hybrid. But the recipe did not generalize. The project now has both halves of a credible result, strong development convergence and a measured unseen-repository gap, and publishes them together.

A later forensic audit then corrected one of its own measurements. R5 had reported ws-example's oracle integrity at 0.75, which reads as deleted tests; byte-level reconstruction showed the protected files were identical, and the 0.75 was an artifact of Execute and Report each reading only the first 8 KiB of a long test file. Both readers now inspect full content and a >8 KiB regression covers the bug. The score stays 0/9: every sample was independently red for migration reasons. Those three repositories are development inputs now, and the first remediation gate is green, with ws-example passing strict autonomous K=1 at 42/42 tests, 5/5 tasks, a migrated tree and oracle integrity 1.0. That is development evidence, not a revision of R5 v1.

One core engine, two interfaces. Autonomous mode: \`portage migrate <repo> --watch\` drives the full graph. Co-pilot mode: Claude Code / Cursor call verify_patch_in_sandbox, repo_graph, and blast_radius over MCP, the same verified primitives the eval numbers were measured on. The dashboard is the observability and proof surface, not the front door.`,
    tags: ["Python", "FastAPI", "LangGraph", "Postgres", "pgvector", "LiteLLM", "Docker", "Next.js", "MCP", "pytest"],
    github: "https://github.com/SohailGidwani/Portage",
    features: [
      {
        icon: <Layers className="w-5 h-5" />,
        title: "Artifact-Producing Plans",
        description: "A bounded architect call proposes new target-architecture modules; a deterministic contract compiler fills in what the engine already derives; contracts freeze before generation and bind every retry, escalation, replan, and resume. Created files get the same ordering, diffs, rollback, and cost accounting as rewrites.",
      },
      {
        icon: <Fingerprint className="w-5 h-5" />,
        title: "Defined-vs-Invented Capabilities",
        description: "A Flask-shaped capability (test_client, app_context, g, session) is accepted only when a frozen plan artifact owns and implements it, checked receiver-aware. \"The model referenced a module it wished existed\" becomes a pre-sandbox rejection, not a silent runtime failure.",
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Checkpoint Durability",
        description: "LangGraph Postgres checkpointer after every node; worker lease with heartbeat. Kill the worker mid-run and a restarted one resumes: Ingest runs once, Execute skips already-applied files via content hashes.",
      },
      {
        icon: <RefreshCcw className="w-5 h-5" />,
        title: "Bounded Recovery, Targeted First",
        description: "Uniquely attributable failures repair the single owning artifact (measured: a stray .decode() fixed for $0.011 without touching its ten-file cut). Otherwise: targeted rollback + regenerate, widen-on-repeat, replan, skip-and-continue as last resort, all budget-bounded.",
      },
      {
        icon: <GitBranch className="w-5 h-5" />,
        title: "Coherent-Cut Preservation",
        description: "A failed targeted repair restores the last known-coherent checkpoint, not the original sources, so one bad file can no longer roll back the nine correct ones beside it. The single highest-leverage fix in the project: it converted watchlist and flaskr from occasional greens into repeatable ones.",
      },
      {
        icon: <FileCheck className="w-5 h-5" />,
        title: "Oracle Integrity",
        description: "Test files are protected artifacts: names, assertions, raises/parametrize/skip structure and fixture lifecycles are frozen at Plan; only sanctioned plumbing may differ. The guard also had to survive an audit of itself. A held-out 0.75 integrity score looked like deleted tests, but the files were byte-identical and both readers had truncated them at 8 KiB. Fixed, regression-covered, and the run stayed red on its own merits.",
      },
      {
        icon: <ShieldCheck className="w-5 h-5" />,
        title: "Honest Scoring",
        description: "Green cannot be gamed by skip-and-continue, empty diffs, or all-skipped suites. Report reloads task truth from Postgres, Integrate recomputes the diff, Verify requires passed > 0, and engine errors count against the score.",
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Measured Escalation",
        description: "First N attempts use the driver model tier; later attempts escalate. Every attempt lands in attempts_log with tier, model, tokens, and USD, so \"how often does escalation rescue?\" is a SQL query.",
      },
      {
        icon: <DollarSign className="w-5 h-5" />,
        title: "Cost as a Metric",
        description: "Every LLM call's tokens and USD recorded per attempt, summed per job, averaged per eval cell, with retries, escalations, and architect calls included. Cost scales with recovery, and that relationship is part of the result.",
      },
      {
        icon: <Lock className="w-5 h-5" />,
        title: "Held-Out Validation",
        description: "Three repositories were frozen, baseline-vetted, and unseen at the time R5 v1 ran. It ran once from a pinned commit and scored 0/9. No failed sample was renamed, replaced, or rerun, and the result is published beside the development gates rather than behind them. All three are development inputs now, so the next held-out claim needs freshly scouted repositories.",
      },
    ],
    technicalDetails: [
      "Monorepo: apps/backend (Python 3.12, uv) + apps/frontend (Next.js App Router, pnpm)",
      "FastAPI control plane, async throughout; CLI and dashboard are thin REST clients",
      "LangGraph agent with langgraph-checkpoint-postgres; thread_id = job_id",
      "Postgres job queue claimed via FOR UPDATE SKIP LOCKED with heartbeat lease",
      "Two DB drivers, one Postgres: asyncpg for domain tables (Alembic), psycopg3 for checkpoints",
      "Plan freezes everything: SCC-condensation dependency ordering, a frozen interface manifest, executable cuts, the architect call + deterministic contract compiler, and the oracle census",
      "Pre-sandbox AST gates: contract shape, capability ownership, import direction, decorator/middleware shape, new-cycle rejection; each violation gets one accounted repair call",
      "Ephemeral Docker sandbox per verify run, --network none; gVisor (runsc) option for hosting",
      "LiteLLM provider ladder: driver / escalation / cheap; provider is env config, not code",
      "Pluggable recipes: detection + task types + per-task verify_spec; unknown recipes degrade safely to ingest → verify → report with an honest red",
      "code-review-graph behind a Protocol for the structural graph + blast radius",
      "FastMCP stdio server exposing verify_patch_in_sandbox, repo_graph, blast_radius",
      "GitHub OAuth (hosted mode), rotating refresh cookies, pk_ API keys, quota + spend caps",
    ],
    challenges: [
      "Development convergence did not predict held-out generalization. Flaskr and watchlist reached 10/10 at K=5 while the frozen unseen set went 0/9. The next work is capability coverage, not a larger victory-lap grid",
      "One bad file used to sink the whole cut: before coherent-cut checkpointing, a single local mistake inside a ten-file verification batch rolled back everything in it. Checkpointing the last coherent state and restoring that, not the original, is what made the hard repos repeatable",
      "Measurement instruments need the same scrutiny as output. A held-out 0.75 oracle score looked like deleted tests; byte-level reconstruction proved the file was unchanged and both readers had stopped at 8 KiB. The readers and the regression are fixed, and the run stayed red for reasons that had nothing to do with the bug",
      "Some migrations are unreachable by rewriting files, proven by migrating flaskr by hand under the same sandbox oracle: 24/24, but only after creating four new modules. That manual run became the acceptance spec, and the engine's missing capability had a name",
      "A model told us what was missing: on one repo GPT-4o imported a compatibility module that didn't exist. It wanted the right architecture; the engine had no way to let it own one. Artifact-producing plans exist because of that log line",
      "Whole-file regeneration is a near-no-op against an unattributed bug: two measured cases reproduced identical failures across paid regeneration rounds. Attribution, not retry budget, was the bottleneck",
      "Skip-and-continue produced false greens (original suite passes after full rollback); fixed by reloading task truth, recomputing diffs, and requiring full completion",
      "Models can \"pass\" by decorating every test with skip; Verify requires passed > 0, and the oracle census now catches the whole family mechanically",
      "A single shared sandbox image cannot serve mutually incompatible dependency pins; four corpus candidates dropped for that reason; the unlock is per-repo sandbox images",
      "LLM nondeterminism means single runs are anecdotes; K-run mean±variance is mandatory, and organic flake is a finding, not noise to hide",
    ],
    learnings: [
      "A held-out set is only evidence if you publish it when it loses; 0/9 sits beside 10/10 rather than behind it, and the repos that shape fixes become development inputs permanently",
      "The hard thing (autonomous migrate + eval) validates the easy thing (MCP verify tool)",
      "Honesty bars must be structural, not aspirational; every false-green class found in the wild became a hard predicate, and engine crashes count against the score",
      "Give the model judgment, take back the bookkeeping: it decides ownership, grouping, and design; the engine deterministically supplies facts it already derives, and rejects contradictions loudly",
      "Separate your random variables: architect acceptance and generation quality are independent; measuring them together makes every fix unattributable",
      "Recovery is a product feature only if it is measured: fault scenarios, attempts_log, cost deltas",
      "Recipe rules encode observed failures cheaply; structural gaps (interface contracts, target architecture, extension surfaces) need architecture, not more prompt text",
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
          {/* Chapter wayfinding for long project pages on phones and tablets. */}
          <SectionTOC items={tocItems} />
          <MobileChapterNav items={tocItems} />

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
                <h1
                  data-vt-title-target
                  className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                  {project.title}
                </h1>

                {/* Stat callout row */}
                <div className="mb-6 flex flex-wrap items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">10/10</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">K=5 Gates · Flaskr + Watchlist</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">6/7</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Fresh Full-Corpus Sweep</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">0/9</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Frozen Held-Out · Published As Is</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">0</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Humans in the Loop</p>
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

                {/* 01 · System Overview */}
                {/* Never clamped: this is what the project *is*, and the
                    durability recording is the single strongest proof on the
                    page. Neither should cost a tap. */}
                <MobileSection n="01" label="System Overview" id="recovery-proof" alwaysOpen>
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    One core engine, two interfaces: the CLI drives fully autonomous migrations, and an MCP
                    server hands the same verified primitives to co-pilot agents like Claude Code and Cursor.
                    The dashboard is the proof surface: live task trees, diffs, recovery timelines, and the
                    eval leaderboard. Below is the core durability claim, live: the worker is killed
                    mid-migration, and a restarted worker resumes from the Postgres checkpoint instead of
                    starting over.
                  </p>
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        durability proof: kill the worker, it resumes
                      </span>
                    </div>
                    <DemoVideo
                      src="/images/portage/kill-resume.mp4"
                      poster="/images/portage/kill-resume-poster.jpg"
                      label="Terminal recording: the Portage worker is killed mid-migration and a restarted worker resumes from the Postgres checkpoint to finish the job"
                    />
                    <div className="border-t border-border px-4 py-2">
                      <p className="font-mono text-xs text-muted-foreground">
                        reproduce: bash scripts/demo_kill_resume.sh · stricter: scripts/dod_check.sh
                      </p>
                    </div>
                  </div>
                </MobileSection>

                {/* 02 · Why I Built It */}
                <MobileSection n="02" label="Why I Built It" id="section-02">
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.why}
                  </p>
                </MobileSection>

                {/* 03 · How It Works */}
                  <MobileSection n="03" label="How It Works" id="section-03"
                  lead={
                    <p className="mb-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                      {project.how}
                    </p>
                  }
                  figure={
                    <DiagramLightbox title="Job Lifecycle: LangGraph Nodes">
                      <MigrationFlow />
                    </DiagramLightbox>
                  }
                >
                </MobileSection>

                {/* 04 · CLI */}
                <MobileSection n="04" label="CLI: Autonomous Mode" id="section-04">
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The <span className="font-mono text-foreground">portage</span> console script is a thin
                    httpx client over the REST API; it never touches the DB or queue directly, the same
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
                </MobileSection>

                {/* 05 · MCP */}
                  <MobileSection n="05" label="MCP: Co-pilot Mode" id="section-05"
                  lead={
                    <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                      The MCP server exposes the verified core so another AI agent can test its own work before
                      writing to the caller&apos;s tree:{" "}
                      <span className="font-mono text-foreground">verify_patch_in_sandbox</span> copies the repo,
                      applies a unified diff, runs the tests network-off, and returns structured pass/fail with
                      failing test names, never mutating the caller&apos;s files.{" "}
                      <span className="font-mono text-foreground">repo_graph</span> and{" "}
                      <span className="font-mono text-foreground">blast_radius</span> give it structural
                      awareness. Here is what a blast-radius query actually computes:
                    </p>
                  }
                  figure={
                    <DiagramLightbox title="Blast Radius: Impact of a Change">
                      <BlastRadius />
                    </DiagramLightbox>
                  }
                >
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Screenshot index={4} />
                    <Screenshot index={5} />
                  </div>
                </MobileSection>

                {/* 06 · Dashboard as Proof */}
                <MobileSection n="06" label="Dashboard as Proof" id="section-06">
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Next.js App Router, REST only; the frontend never owns schema. Jobs list with launch
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
                </MobileSection>

                {/*
                  ── 06.5 · Live Demo (enable after Phase 8 hosting) ──────────
                  The embed component is fully built. To turn this on:
                  1. Set PORTAGE_DEMO_URL in ./components/LiveDemo.tsx
                  2. Allow the origin in next.config.mjs CSP (frame-src)
                  3. Uncomment the import at the top of this file + this block.
                  4. Add { id: "section-06-5", n: "06.5", label: "Try It Live" }
                     to tocItems above, after section-06, so the chapter
                     navigator lists it.

                <MobileSection n="06.5" label="Try It Live" id="section-06-5">
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The hosted Portage dashboard, embedded. Sign in with GitHub, submit a migration against a
                    corpus repo, and watch the task tree, diffs, and recovery timeline update live, or browse
                    the public eval leaderboard without signing in.
                  </p>
                  <LiveDemo />
                </MobileSection>
                */}

                {/* 07 · Key Features */}
                <MobileSection n="07" label="Key Features" id="section-07">
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
                </MobileSection>

                {/* 08 · Eval Headline */}
                <MobileSection n="08" label="Eval Headline" id="section-08">
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Development gates are strong; unseen generalization is not. Both halves are published
                    together, because only one of them is a claim about the future. Green requires the full
                    suite passing, every planned task done, zero skips, oracle integrity 1.0, and a{" "}
                    <span className="font-mono text-foreground">tree_state</span> of{" "}
                    <span className="font-mono text-foreground">migrated</span>: a run that recovery rolls back
                    to original sources passes the original suite and still scores red.
                  </p>
                  <div className="overflow-x-auto rounded border border-border bg-card/40">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          <th className="px-4 py-3 text-left font-normal">Evidence set</th>
                          <th className="px-4 py-3 text-left font-normal">Green</th>
                          <th className="px-4 py-3 text-left font-normal">What it means</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {evidenceRows.map((r) => (
                          <tr key={r.set}>
                            <td className="px-4 py-3 font-mono text-xs text-foreground">{r.set}</td>
                            <td className={`px-4 py-3 font-mono text-xs font-bold ${r.strong ? "text-accent" : "text-muted-foreground"}`}>{r.result}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{r.meaning}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    The held-out set, in full
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    R5 v1 ran exactly once, from frozen commit{" "}
                    <span className="font-mono text-foreground">3b25ee9</span> against{" "}
                    <span className="font-mono text-foreground">corpus/heldout.toml</span>, one offline sandbox
                    image, GPT-4o on both tiers. No failed sample was renamed, replaced, or rerun.
                  </p>
                  <div className="overflow-x-auto rounded border border-border bg-card/40">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          <th className="px-4 py-3 text-left font-normal">Unseen repo</th>
                          <th className="px-4 py-3 text-left font-normal">Baseline</th>
                          <th className="px-4 py-3 text-left font-normal">K=3</th>
                          <th className="px-4 py-3 text-left font-normal">Dominant failure</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {heldOutRows.map((r) => (
                          <tr key={r.repo}>
                            <td className="px-4 py-3 font-mono text-xs text-foreground">{r.repo}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.baseline}</td>
                            <td className="px-4 py-3 font-mono text-xs font-bold text-muted-foreground">{r.result}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{r.failure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 rounded border border-accent/30 bg-accent/5 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      The scoring machinery held even though the recipe failed
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      This is the part worth reading. Rejected cuts restored the original suite, and those
                      restored passes contributed exactly zero migration score. Trees came back 4 migrated /
                      5 restored-coherent / 0 hybrid. All nine jobs produced durable reports with no missing
                      run rows: 119 LLM calls, 19 recovery visits, $3.8643, architect acceptance 6/9.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      The audit that followed cuts the other way, and belongs here too. R5 reported{" "}
                      <span className="font-mono">ws-example</span> oracle integrity at 0.75, which reads as
                      deleted tests. It was a false positive: the protected files were byte-identical, and
                      Execute and Report had each read only the first 8 KiB of a longer test file. Both now
                      read full content, with a &gt;8 KiB regression. The 0/9 is unchanged, because all three
                      samples were independently red: two stalled at 13/42 behind the shadowed route
                      decorators, one restored the original tree with tasks still incomplete.
                    </p>
                  </div>
                  <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      What convergence looks like when it works
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      flaskr, the canonical Flask tutorial app (templates + factory + auth + SQLite + Click
                      CLI), went from never green in any grid to 24/24 tests, 12/12 tasks, zero recovery, for
                      $0.15 to $0.23 a run, and now holds 5/5 at K=5. watchlist, a Flask-SQLAlchemy app that had
                      never gone green, holds 5/5 at 15/15 tests. Both needed new modules to exist; the engine
                      designed and wired them. What made them repeatable rather than occasional was
                      coherent-cut preservation.
                    </p>
                  </div>
                  <div className="mt-4 rounded border border-border bg-card/40 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Where it stands now
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      All three R5 repositories are development inputs from here, so they can no longer
                      produce held-out evidence. The first remediation gate is green:{" "}
                      <span className="font-mono text-foreground">ws-example</span> passed strict autonomous
                      K=1 at 42/42 tests, 5/5 tasks, a migrated tree and oracle integrity 1.0. Silicon and
                      flask-email-login are the next gates. Any future held-out claim has to keep R5 v1
                      visible, hold the untouched ClipBin reserve, and add at least two newly scouted
                      repositories. The current tree passes 331/331 backend tests, Ruff on{" "}
                      <span className="font-mono text-foreground">src tests</span>, and{" "}
                      <span className="font-mono text-foreground">git diff --check</span>. Evidence current
                      through 2026-08-04.
                    </p>
                  </div>
                </MobileSection>

                {/* 09 · Technical Stack */}
                <MobileSection n="09" label="Technical Stack" id="section-09" summary="Every implementation choice, numbered, from the queue claim to the sandbox runtime.">
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
                </MobileSection>

                {/* 10 · Friction & Takeaways */}
                <MobileSection n="10" label="Friction & Takeaways" id="section-10">
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
                </MobileSection>

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
                    and lease mechanics, sandbox anti-gaming predicates, artifact-producing plans, the eight
                    recovery strategies, K-run eval methodology with non-claims, and the ten-category failure
                    taxonomy with evidence.
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
