import Link from "next/link"
import { Home, ArrowLeft, Github, Shield, Zap, Terminal, Bot, Gauge, Database } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import ReadingProgress from "@/app/components/ReadingProgress"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"
import MobileSection from "@/app/components/MobileSection"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import DemoVideo from "@/app/components/DemoVideo"
import PortageArchitecture from "../components/PortageArchitecture"
import MigrationFlow from "../components/MigrationFlow"
import BlastRadius from "../components/BlastRadius"

const tocItems = [
  { id: "section-01", n: "01", label: "Architecture Overview" },
  { id: "section-02", n: "02", label: "Job Lifecycle & Graph Nodes" },
  { id: "section-03", n: "03", label: "Durability Model" },
  { id: "section-04", n: "04", label: "Sandbox & Verification" },
  { id: "section-05", n: "05", label: "Recovery Strategies" },
  { id: "section-06", n: "06", label: "Recipe System" },
  { id: "section-06b", n: "6B", label: "Artifact-Producing Plans" },
  { id: "section-07", n: "07", label: "Eval Methodology" },
  { id: "section-08", n: "08", label: "Failure Taxonomy" },
  { id: "section-09", n: "09", label: "Corpus & Admission" },
  { id: "section-10", n: "10", label: "CLI & MCP Contracts" },
  { id: "section-11", n: "11", label: "Auth & Demo Protection" },
  { id: "section-12", n: "12", label: "Stack & Data Model" },
  { id: "section-qr", n: "QR", label: "Quick Reference" },
]

function Stat({ value, label, primary }: { value: string; label: string; primary?: boolean }) {
  return (
    <div className={`border-l-2 ${primary ? "border-accent" : "border-border"} pl-4`}>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  )
}

function CodeRow({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="w-5 shrink-0 text-right font-mono text-xs text-accent/60">
        {String(n).padStart(2, "0")}
      </span>
      <span className="font-mono text-xs text-muted-foreground">{text}</span>
    </div>
  )
}

function CodeBlock({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
      </div>
      <div className="divide-y divide-border/50">
        {rows.map((r, i) => <CodeRow key={i} n={i + 1} text={r} />)}
      </div>
    </div>
  )
}

function SimpleTable({
  head,
  rows,
  monoCols = [0],
}: {
  head: string[]
  rows: string[][]
  monoCols?: number[]
}) {
  return (
    <div className="overflow-x-auto rounded border border-border bg-card/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/70 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className={
                    monoCols.includes(ci)
                      ? "px-4 py-3 font-mono text-xs text-foreground"
                      : "px-4 py-3 text-xs text-muted-foreground"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PortageDeepDivePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Portage: Technical Deep Dive",
    author: { "@type": "Person", name: "Sohail Gidwani", url: "https://sohailgidwani.app" },
    datePublished: "2026-07-09",
    description:
      "Full technical breakdown of Portage: LangGraph node lifecycle, Postgres checkpoint + lease durability, network-off sandbox verification with anti-gaming predicates, artifact-producing plans, coherent-cut preservation, recovery strategies, recipe system, eval methodology, the failure taxonomy, and a frozen held-out validation that scored 0/9 and is published beside the development gates.",
    keywords:
      "autonomous agent, code migration, LangGraph, Postgres checkpointing, Docker sandbox, LiteLLM, MCP, blast radius, eval harness, failure taxonomy, artifact-producing plans, oracle integrity",
    inLanguage: "en",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BreadcrumbStructuredData
        id="portage-deep-dive-breadcrumb"
        items={[
          { name: "Projects", item: "/projects" },
          { name: "Portage", item: "/projects/portage" },
          { name: "Technical Deep Dive", item: "/projects/portage/deep-dive" },
        ]}
      />

      <div className="min-h-screen overflow-x-clip bg-background text-foreground">

        {/* ─── Top nav ─── */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
          <ReadingProgress />
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/projects/portage"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Portage</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Portfolio</span>
              </Link>
            </div>
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
                  Project / Technical Deep Dive
                </span>
              </div>
              <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Portage: Technical Deep Dive
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Stat value="10/10" label="K=5 Dev Gates" primary />
                <Stat value="0/9" label="Frozen Held-Out" />
                <Stat value="8" label="Recovery Strategies" />
                <Stat value="10" label="Failure Categories" />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every moving part of Portage: the compose-stack architecture, the LangGraph node lifecycle,
                checkpoint + lease durability, network-off sandbox verification with anti-gaming predicates,
                artifact-producing plans, the recovery strategy table, the Flask → FastAPI recipe system,
                K-run eval methodology with explicit non-claims, and the failure taxonomy with evidence,
                including the frozen held-out set that scored 0/9 and is published beside the development
                gates rather than behind them. Every number comes from the{" "}
                <span className="font-mono text-foreground">runs</span>/
                <span className="font-mono text-foreground">metrics</span> tables or documented DoD scripts.
              </p>

              {/* The publishing date is not the measurement date. Stating both stops
                  a later review pass from reading as a fresh benchmark run. */}
              <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Evidence reviewed September 8, 2026. Development gate history is from July 2026; frozen R5 v1
                ran in July 2026; the three post-R5 development K1 greens are from August 2026. Current
                regression closure remains in progress. These stored runs were inspected again for this page;
                they were not rerun on the current tree.
              </p>

              <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {["FastAPI", "LangGraph", "Postgres 16", "pgvector", "LiteLLM", "Docker / gVisor", "Next.js", "FastMCP", "SQLAlchemy async", "Alembic", "pytest"].map((t) => (
                  <span key={t} className="rounded-[3px] border border-border bg-background/60 px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-20">

              {/* 01 · Architecture Overview */}
              {/* Never clamped: the architecture is the price of entry for
                  everything below it, so it reads in full at every width. */}
              <MobileSection
                n="01" label="Architecture Overview" id="section-01"
                alwaysOpen
                lead={
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Portage is one core engine exposed through two interfaces. The autonomous agent + eval
                    harness is the credibility engine; the MCP tools are the product wedge: build the moat
                    first, the wedge second. The frontend never owns schema, and the CLI and dashboard are both
                    thin REST clients: neither touches the queue or DB directly.
                  </p>
                }
                figure={
                  <DiagramLightbox title="System Architecture">
                    <PortageArchitecture />
                  </DiagramLightbox>
                }
              >
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: <Terminal className="h-4 w-4" />, label: "CLI: portage", sub: "Autonomous migrations · developer / CI" },
                    { icon: <Bot className="h-4 w-4" />, label: "MCP server", sub: "Verified primitives for Claude Code, Cursor" },
                    { icon: <Gauge className="h-4 w-4" />, label: "Dashboard", sub: "Observability + eval proof for humans" },
                  ].map((c) => (
                    <div key={c.label} className="rounded border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-accent">{c.icon}
                        <span className="font-mono text-xs uppercase tracking-[0.18em]">{c.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <CodeBlock
                    title="design_constraints.that_matter"
                    rows={[
                      "Async everywhere in the backend: handlers, sessions, graph nodes",
                      "Interfaces before adapters: Docker, LiteLLM, storage behind core/ Protocols; provider is env, not code",
                      "Two DB drivers, one Postgres: asyncpg (domain, Alembic) + psycopg3 (LangGraph checkpoints); never merge the DSNs",
                      "Job/Task status is VARCHAR + app-side StrEnum, which keeps Alembic simple as states are added",
                    ]}
                  />
                </div>
              </MobileSection>

              {/* 02 · Job Lifecycle */}
              <MobileSection
                n="02" label="Job Lifecycle & Graph Nodes" id="section-02"
                summary="How a queued job becomes a running graph, and what separates a real resume from an accidental restart at Ingest."
                lead={
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    A job submitted via <span className="font-mono text-foreground">POST /jobs</span> lands as{" "}
                    <span className="font-mono text-foreground">queued</span>; a worker claims it atomically and
                    runs this graph with state keyed by{" "}
                    <span className="font-mono text-foreground">thread_id = job_id</span>. The runner checks
                    checkpoint state first: no checkpoint → fresh start; pending nodes →{" "}
                    <span className="font-mono text-foreground">ainvoke(None)</span> without re-passing input;
                    the difference between “resume” and “accidentally restart from Ingest.”
                  </p>
                }
                figure={
                  <DiagramLightbox title="Job Lifecycle: LangGraph Nodes">
                    <MigrationFlow />
                  </DiagramLightbox>
                }
              >
                <div className="mt-6">
                  <SimpleTable
                    head={["Node", "What it does"]}
                    rows={[
                      ["Ingest", "Clone (optionally SHA-pinned, optional --subdir), snapshot as a git worktree, build the structural code graph. Runs exactly once on resume."],
                      ["Plan", "Everything is frozen here: tasks ordered by a cycle-safe SCC condensation of the real import graph (dependencies first); an interface manifest freezes every cross-file symbol's target shape; a bounded architect call proposes new artifacts and a deterministic contract compiler completes what the engine already knows; executable cuts define which files must be mutually coherent before tests can honestly run; the oracle census freezes what tests may change. Replan may append, never mutate."],
                      ["Execute", "LLM generation in dependency order, in bounded coordinated units. Every draft passes mechanical AST gates before the sandbox: contract shape, defined-vs-invented capability ownership, import direction, decorator/middleware shape, new-cycle rejection. Violations get one accounted repair call. Content-hash idempotent on resume; driver → escalation model ladder."],
                      ["Verify", "Per-cut tests in an ephemeral --network none sandbox, JUnit-parsed, stale report deleted before every run. All-skipped suites are failures (passed > 0 required); Recover sees stdout + stderr."],
                      ["Recover", "Uniquely attributable failures repair one artifact on a separate bounded ledger; otherwise replan / targeted rollback / widen-on-repeat / skip-and-continue. Failure fingerprints stop no-progress loops."],
                      ["Integrate", "Full suite as the final gate; always recomputes the migration diff from the worktree, never trusting a stale cached diff. An Integrate-only regression can route back through Recover once."],
                      ["Report", "Reloads task truth from Postgres; emits the artifact plan, oracle census, per-call cost ledger, recovery actions, diffs, and verdict."],
                    ]}
                  />
                </div>
                <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Honest green requires all five</p>
                  {/* Numbered conditions read as rows, not as one paragraph a
                      phone reader has to parse for the numerals. */}
                  <ol className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                    {[
                      "The full test suite passes, not just the per-cut subset used during iteration.",
                      "Every planned task completed with migration_outcome = success.",
                      "Zero tasks rolled back or skipped by recovery.",
                      "Oracle integrity 1.0: no test deleted, renamed, skipped, or weakened.",
                      "tree_state = migrated: original, restored, and hybrid trees score no green and no test-pass credit.",
                    ].map((condition, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="shrink-0 font-mono text-xs text-accent" aria-hidden>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    A run that recovery rolls back to original sources will pass the original suite, and is
                    scored red. That false-green class was caught live (“GREEN 24/24” with an empty diff) and
                    fixed structurally.
                  </p>
                </div>
              </MobileSection>

              {/* 03 · Durability */}
              <MobileSection
                n="03" label="Durability Model" id="section-03"
                summary="State is checkpointed after every node, so a worker that dies mid-run is replaced by one that resumes instead of starting over."
                // The recording is the claim, not decoration, so it sits
                // outside the clamp. figureAfter keeps desktop's original
                // mechanics-then-proof order.
                figureAfter
                figure={
                  <>
                    <div className="mt-6 overflow-hidden rounded border border-border bg-card">
                      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          kill-and-resume demo: scripts/demo_kill_resume.sh
                        </span>
                      </div>
                      <DemoVideo
                        src="/images/portage/kill-resume.mp4"
                        poster="/images/portage/kill-resume-poster.jpg"
                        label="Terminal recording: the Portage worker is killed mid-migration and a restarted worker resumes from the Postgres checkpoint to finish the job"
                      />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      The eval harness cannot SIGKILL the worker it depends on, so crash-resume is covered by{" "}
                      <span className="font-mono text-foreground">demo_kill_resume.sh</span> and the stricter{" "}
                      <span className="font-mono text-foreground">dod_check.sh</span>, separately from the K-run grid.
                    </p>
                  </>
                }
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Durability is the core product edge: not “the LLM is smart,” but “the run survives process
                  death and still tells the truth.” LangGraph&apos;s{" "}
                  <span className="font-mono text-foreground">AsyncPostgresSaver</span> persists state after
                  every node; a worker that dies mid-graph is replaced by another that resumes from the last
                  checkpoint, not from zero.
                </p>
                <div className="space-y-5">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Database className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">3.1: Queue + lease</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      The claim is a single atomic SQL pattern:{" "}
                      <span className="font-mono text-xs">UPDATE … WHERE id = (SELECT … FOR UPDATE SKIP LOCKED LIMIT 1)</span>.
                      A job is claimable if it is <span className="font-mono text-xs">queued</span>, or{" "}
                      <span className="font-mono text-xs">running</span> with a heartbeat older than{" "}
                      <span className="font-mono text-xs">JOB_LEASE_SECONDS</span> (worker crashed). The
                      heartbeat runs on its own asyncio task with its own DB connection, so a stuck graph node
                      cannot starve the lease.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Zap className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">3.2: Content-hash idempotency</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Each Execute step is keyed by job + task + sha256 of the written file. Resume after a
                      mid-Execute crash skips tasks already applied instead of re-calling the model. Ingest is
                      likewise written so resume does not re-clone or re-build the graph unnecessarily.
                    </p>
                  </div>
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Database className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.22em]">3.3: Durable evaluation rows</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Eval identity travels in the job config, so it outlives the harness process that
                      submitted it. Worker and harness share one idempotent{" "}
                      <span className="font-mono text-xs">runs</span> upsert keyed by job id, and worker
                      startup reconciles terminal eval jobs whose harness died before writing a row. Each run
                      persists a <span className="font-mono text-xs">tree_state</span> of migrated,
                      restored_coherent, or hybrid, and only migrated trees aggregate as green. The held-out
                      suite closed the loop: nine jobs, nine reports, zero missing rows.
                    </p>
                  </div>
                </div>
              </MobileSection>

              {/* 04 · Sandbox & Verification */}
              <MobileSection
                n="04" label="Sandbox & Verification" id="section-04"
                summary="Every verification runs in a throwaway Docker container with no network, so untrusted migrated code cannot reach the host."
                lead={
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    Verification must be isolated (untrusted migrated code must not touch the host network or
                    sibling jobs), reproducible (same image, same pins, same offline constraint as corpus
                    admission), and structured (JUnit parsed into totals plus failing test names). Every verify
                    run gets an ephemeral Docker container with{" "}
                    <span className="font-mono text-foreground">--network none</span>, so no pip install at test
                    time; hosted deployments can switch the runtime to gVisor with{" "}
                    <span className="font-mono text-foreground">SANDBOX_RUNTIME=runsc</span>.
                  </p>
                }
                figure={
                  <DiagramLightbox title="Blast Radius: Impact of a Change">
                    <BlastRadius />
                  </DiagramLightbox>
                }
              >
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  During iteration, Verify scopes to the tests implicated by changed files, the{" "}
                  <span className="font-mono text-foreground">blast_radius</span> query below. Scoped runs are
                  a speed lever, never a scoring lever: the honesty bar for green still requires the full suite.
                </p>
                <div className="mt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Anti-gaming predicates (learned the hard way)
                  </p>
                  <SimpleTable
                    head={["Failure mode", "What happened", "Fix"]}
                    rows={[
                      ["False green after skip-and-continue", "Recovery rolled the worktree to originals; suite passed; report showed stale task counts and an empty diff", "Report reloads tasks from Postgres; Integrate always recomputes the diff; green requires all tasks done and none skipped"],
                      ["Skip-out false pass", "Model decorated every test with @pytest.mark.skip; pytest reported total>0, failed=0; Verify treated it as PASS", "Require passed > 0; an all-skipped suite is a failure that must enter Recover"],
                      ["Stderr-only crashes", "Conftest-chain import errors appeared only on stderr; Recover saw empty errors", "Verify feeds Recover stdout + stderr"],
                    ]}
                  />
                </div>
                <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">MCP reuse</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    <span className="font-mono">verify_patch_in_sandbox</span> is the same sandbox contract,
                    exposed for co-pilot use: copy → apply diff → run → return structured result, never
                    modifying the caller&apos;s tree. That reuse is intentional: the eval proves the loop;
                    MCP sells the loop.
                  </p>
                </div>
              </MobileSection>

              {/* 05 · Recovery */}
              <MobileSection
                n="05" label="Recovery Strategies" id="section-05"
                summary="Who owns what when a run goes wrong: rollback, regeneration, and replanning, plus the budgets that stop runaway loops."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Recover classifies and rolls back; Execute owns regeneration; Plan owns replanning. Inputs:
                  the last verify output (stdout + stderr), the planned file set vs the worktree, per-task
                  attempt counts and prior blame targets, and the budgets:{" "}
                  <span className="font-mono text-foreground">max_task_attempts=3</span>,{" "}
                  <span className="font-mono text-foreground">max_recover_visits=4</span>,{" "}
                  <span className="font-mono text-foreground">escalate_after_attempts=2</span>.
                </p>
                <SimpleTable
                  head={["Strategy", "Trigger", "Action"]}
                  rows={[
                    ["Targeted contract repair", "Failure maps to exactly one frozen contract owner: missing module/export, an import-cycle edge, or a unique application traceback leaf", "Roll back and regenerate only that artifact against the failure + its rejected draft + its frozen contract; siblings are content-hash skipped; the whole enclosing cut is re-verified. Runs on its own bounded ledger. Measured: a stale .decode() repaired for $0.011 without regenerating its ten-file cut."],
                    ["Replan", "An unplanned source file still imports Flask (planner miss)", "Route to Plan; append the missing task(s). Fault scenario: drop_task."],
                    ["Targeted rollback + regenerate", "Crash traceback implicates specific planned files", "git checkout only those files; reset tasks to pending; Execute regenerates with the failing output as context. Fault: bad_patch."],
                    ["Widen-on-repeat", "The same lone file is implicated twice running", "Single-file blame isn't converging (crash site ≠ offender); widen to reset all active tasks. Rescued flaskr mid-run."],
                    ["Behavioral retry-all", "Assertions fail with no crash", "Roll back and regenerate every non-skipped file task, attaching the failing output."],
                    ["Model escalation", "Task attempts exceed escalate_after_attempts", "Execute switches to the escalation-tier model; every attempt records tier + model in attempts_log. Fault: bad_patch_until_escalation."],
                    ["Skip-and-continue", "A task hits max_task_attempts", "Roll the file back to original source; mark it skipped; keep the run alive."],
                    ["Give up → Integrate", "max_recover_visits exhausted or nothing left to retry", "Integrate + Report with an honest red."],
                  ]}
                />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-border bg-card p-5">
                    <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Self-review retries</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Rolled-back attempts keep their failing diff, so retries see it (“debug your own code”)
                      instead of regenerating blind. Measured on flaskr: the app factory went from
                      exhausted-and-skipped after 3 blind attempts to completing all 6 tasks.
                    </p>
                  </div>
                  <div className="rounded border border-accent/20 bg-card p-5">
                    <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">Integrity rule</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Skip-and-continue can make the suite green by restoring originals. That must never score
                      as a successful migration: green = suite green ∧ every planned task done ∧ none skipped
                      ∧ migration_outcome = success ∧ oracle integrity 1.0 ∧ tree_state = migrated.
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded border border-accent/30 bg-accent/5 p-5">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    Coherent-cut preservation: the highest-leverage fix in the project
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    Before this, a single bad file inside a multi-file verification cut triggered a full
                    rollback of every file in that cut, so one local mistake could sink an otherwise-correct
                    ten-file migration. Recover now checkpoints the last coherent state before attempting a
                    targeted repair and restores <em>that</em>, not the original sources, when the repair
                    fails. Alongside it, one shared generation gate (caller bindings, capability ownership,
                    import direction, cycle rejection, contract shape) runs identically across first-draft,
                    contract-repair, and targeted-repair paths, replacing four separately-maintained checks
                    that could silently drift apart. This is what turned watchlist and flaskr from occasional
                    greens into repeatable ones.
                  </p>
                </div>
                <div className="mt-4 rounded border border-border bg-card p-5">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Attribution beats budget (measured)
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Two autopsies reconstructed failing runs byte-exact from LangGraph checkpoints and peeled
                    them by hand. Both found the same thing: whole-file regeneration against an unattributed
                    bug is a paid no-op. One run spent 19 recover visits and never found a two-line
                    middleware-ordering fix, because every failure surfaced as one identical ExceptionGroup
                    rooted in framework internals. The engineering answer was better attribution (contract
                    ownership, import-cycle edges, unique traceback leaves), not more retries.
                  </p>
                </div>
                <div className="mt-4">
                  <CodeBlock
                    title="fault_injection.standing_scenarios"
                    rows={[
                      "bad_patch → corrupted first attempt → crash classify → targeted rollback → regenerate",
                      "bad_patch_until_escalation → driver tier keeps failing → escalation tier takes over (logged per attempt)",
                      "drop_task → planner miss → residue detection → replan appends the missing task",
                      "recovery quality = delta vs the same repo's baseline green rate; a single averaged rate flatters easy repos and slanders hard ones",
                    ]}
                  />
                </div>
              </MobileSection>

              {/* 06 · Recipe System */}
              <MobileSection
                n="06" label="Recipe System (Flask → FastAPI)" id="section-06"
                summary="What a recipe declares, and why a repo it does not recognize degrades to an honest red rather than a false green."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Flask → FastAPI spans exactly the things deterministic tools cannot do reliably: routing
                  decorators and HTTP methods, path/query/body parsing, blueprints → APIRouters, error
                  handlers, app factory + config semantics, and the test-client seam. A recipe declares four
                  things: detection (which files are in scope), task types and subtasks, a per-task{" "}
                  <span className="font-mono text-foreground">verify_spec</span>, and prompt guidance encoded
                  after observed failures. A recipe that doesn&apos;t recognize the repo yields an empty plan;
                  the run degrades safely to ingest → verify → report with an honest red.
                </p>
                <SimpleTable
                  head={["Subtask", "Intent"]}
                  rows={[
                    ["app_factory", "Flask()/create_app → FastAPI(); app.config as a plain dict on app.state.config; keep the factory name and shape"],
                    ["blueprint_to_router", "Blueprint → APIRouter; preserve the export name importers expect"],
                    ["route_to_endpoint", "@bp.route → @router.<method>; path converters → typed params; preserve status codes"],
                    ["request_parsing", "request.args / get_json → typed query and body params"],
                    ["error_handler", "@errorhandler → @exception_handler + JSONResponse with the same status and body"],
                    ["test_harness", "Rewrite plumbing only; never delete or weaken assertions"],
                    ["templates_render / sessions_flash / auth_login", "Jinja2Templates wiring · SessionMiddleware + flash equivalents · session-auth guidance (the v1 frontier)"],
                  ]}
                />
                <div className="mt-4">
                  <CodeBlock
                    title="rules_encoded_from_live_failures"
                    rows={[
                      "JSONResponse silently overriding status_code (201→200) → explicit status guidance",
                      "HTTPException bypassing app handlers ({detail} vs {error}) → prefer app-level handlers matching prior JSON shape",
                      "redirect() must become RedirectResponse(..., 302); the 307 default re-sends POST",
                      "@app.on_event deprecation warning-as-error under pytest → lifespan handlers (rule 11)",
                      "hallucinated fastapi_flash / fastapi_login → never invent packages; inline equivalents (rule 12)",
                      "dropped router export broke siblings → AST export-contract pass in Plan (was ~50% flake on a 3-file app)",
                    ]}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  What recipes do <em>not</em> solve alone: encoded rules are cheap and effective for known
                  idioms, but they cannot supply a target <em>architecture</em>, which is what
                  artifact-producing plans (next section) exist for, and they don&apos;t cover full fidelity
                  for every Flask extension without per-extension surface contracts.
                </p>
              </MobileSection>

              {/* 6B · Artifact-Producing Plans */}
              <MobileSection
                n="6B" label="Artifact-Producing Plans" id="section-06b"
                summary="The capability that moved the hard repos. Some migrations need entirely new modules, not rewrites of the files already there."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The capability that moved the hard repos. Three independent lines of evidence converged on
                  the same conclusion: some migrations are unreachable by rewriting existing files. The
                  canonical Flask tutorial app (flaskr) was migrated <em>by hand</em> under the identical
                  sandbox oracle: 24/24, but the winning solution required four new modules: a contextvars
                  request-context layer replacing <span className="font-mono text-foreground">g</span>/
                  <span className="font-mono text-foreground">session</span>, a Flask-shaped test surface, a
                  Jinja rendering layer, and a werkzeug-format password checker. On another repo, the model{" "}
                  <em>imported a compatibility module that did not exist</em>; it had identified the right
                  architecture and had no mechanism to own one, so it hallucinated the import. And correct
                  executable cuts alone left external green at 0/4: scheduling was necessary and demonstrably
                  not the binding constraint.
                </p>
                <SimpleTable
                  head={["Piece", "What it does"]}
                  rows={[
                    ["Bounded architect call", "One Plan-time call proposes 0–4 create artifacts: path, purpose, capabilities, exports, class members, consumers, dependencies. Strict JSON; deterministic validation; at most two repairs, each of which must strictly reduce the violation count."],
                    ["Closed-choice placement", "Paths are selected from a collision-free set derived from the repo's real application roots; path naming was a repeated convergence failure, so it became a selection, not free-form text."],
                    ["Deterministic contract compiler", "The recipe completes what the engine already derives: required consumers, typed module exports, uniquely-attributable class members (called ⇒ method, read ⇒ attribute). Wrong kinds are rejected, never overwritten; ambiguous ownership stays a model decision."],
                    ["Frozen contracts", "Created exports enter the same interface manifest, dependency ordering, cuts, prompts, diffs, checkpoints, rollback and reporting as rewrites. Retries, escalations, replans, and crash-resumes all converge on the same interfaces."],
                    ["Ownership-based capability checks", "A framework-shaped capability is valid only when a frozen contract owns it, the owner mechanically implements it, and the consumer is a declared one, checked receiver-aware, so a hallucination can't be laundered through a matching attribute name."],
                    ["Provider-first topology", "Consumer/dependency contradictions and proposal-level cycles are rejected at Plan; providers may not import their declared consumers; module-level providers are ordered before consumer imports."],
                    ["Action-aware rollback", "rewrite restores the worktree HEAD version; create removes the file. New files appear in git diff from the first write; the diff stays authoritative and rollback stays transactional."],
                  ]}
                />
                <div className="mt-4 rounded border border-accent/30 bg-accent/5 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Result</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    The frozen plan for a flaskr migration now contains an application-owned context module
                    exporting real <span className="font-mono">g</span>/<span className="font-mono">session</span>{" "}
                    proxies with the test file as a declared consumer: the same architecture the manual
                    migration used. First fully autonomous green: 12/12 tasks, 24/24 tests, zero recovery
                    visits, $0.154, five model calls, reproduced in two further independent samples.
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Measurement discipline it forced: full runs multiply two independent random variables:
                  architect acceptance and generation quality given an accepted plan. Measuring their product
                  makes every fix unattributable, so the harness gained a frozen-plan replay mode (~$0.2–0.5 a
                  probe). Replays are diagnostic-only and never aggregated into headline green rates.
                </p>
              </MobileSection>

              {/* 07 · Eval Methodology */}
              <MobileSection
                n="07" label="Eval Methodology" id="section-07"
                summary="The oracle behind every score: a behavioral suite that passes before migration has to pass after it too."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The oracle: every corpus repo ships a behavioral pytest suite that is green on the unmodified
                  repo, verified during admission in the same sandbox the eval uses. After migration, the same
                  assertions must pass against the migrated app. Every (repo × scenario) cell runs K times
                  through the real queue/worker path; per-run rows land in{" "}
                  <span className="font-mono text-foreground">runs</span>, mean±variance aggregates in{" "}
                  <span className="font-mono text-foreground">metrics</span>. Variance is reported, not
                  smoothed: minimal-flask-api&apos;s 2/3 baseline was a finding that motivated the
                  export-contract work, not noise.
                </p>
                <CodeBlock
                  title="reproducibility.pins"
                  rows={[
                    "remote repos pinned to a commit SHA; corpus.toml rejects unpinned remotes",
                    "sandbox image pins dependencies; no pip install at test time",
                    "model + config recorded per attempt in attempts_log",
                    "cost includes retries, escalations, and architect calls; microblog's cost is mostly recovery rounds",
                    "engine errors count against the score; a crashed run's paid planning calls are reconstructed into the ledger",
                  ]}
                />
                <div className="mt-6 rounded border border-accent/20 bg-card p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Oracle integrity, mechanically</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Test files are protected artifacts with a per-file strategy frozen at Plan. A census
                    records test names, normalized assertion expressions,{" "}
                    <span className="font-mono">raises</span>/<span className="font-mono">parametrize</span>,
                    skip/xfail sites, fixture names and lifecycles. Only an explicit normalization list may
                    differ (e.g. <span className="font-mono">get_json()</span>→<span className="font-mono">json()</span>,
                    or an audited import swap to a plan-owned context proxy, recorded line-by-line in the
                    report). Adversarial unit tests prove deletions, renames, added skips, and weakened
                    assertions are all caught at Execute time, before the sandbox.
                  </p>
                </div>
                <div className="mt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    What these numbers do NOT show
                  </p>
                  <SimpleTable
                    head={["Non-claim", "Why"]}
                    rows={[
                      ["Generality across migrations", "One recipe and one language. R5 v1 measured the remaining gap directly: 0/9 on three unseen Flask repositories. The architecture is recipe-agnostic; the evidence is recipe-specific."],
                      ["Stronger-model lift", "If driver and escalation resolve to the same deployment, escalation-rescue measures the retry-ladder machinery, not a stronger model. Swapping LLM_ESCALATION_MODEL measures real lift, env-only."],
                      ["Big-repo behaviour", "Corpus repos are small (≲ ~40 files). Thousand-file horizons are unproven."],
                      ["Immunity to prompt-tuning bias", "Several recipe rules were learned from the development corpus. R5 v1 exposed the consequence rather than disproving it: the known-corpus gates stayed strong while unseen performance was 0/9."],
                      ["Replay results as autonomous results", "Frozen-plan replays isolate generation quality from architect variance. They are diagnostic, tagged as such, and never aggregated into headline green rates."],
                      ["\"Recipe-neutral\" as proven", "The engine contains no corpus identity and the contract machinery is framework-agnostic by construction, but neutrality is only proven by a second recipe, which is deliberately deferred."],
                      ["Production readiness", "Development results are strong. Portage is not production-ready, generally solved, or held-out validated, and unseen-repository reliability remains unproven. Regression closure is still open: a later accepted-plan Microblog preservation replay is red on a source-defined initializer callback."],
                    ]}
                  />
                </div>
              </MobileSection>

              {/* 08 · Failure Taxonomy */}
              <MobileSection
                n="08" label="Failure Taxonomy" id="section-08"
                summary="Where the engine converged, where it did not, and the reliability-gate history shown in full so a passing gate cannot read as rerun-until-green."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The engine that scored 13/21 (61.9%) on the July grid is not the engine running today, so
                  that grid is kept as the baseline every later number is measured against rather than as a
                  current claim. What closed it was one mechanism, not five separate patches:{" "}
                  <span className="font-semibold text-foreground">coherent-cut preservation</span>. Every red
                  in that grid was root-caused off its own checkpoint, and all five classes (test-harness
                  semantic drift, two deterministic-renderer defects that died without a report,
                  extension-surface gaps, and one import-cycle collection failure that accounted for three
                  identical microblog runs and 77% of the grid&apos;s cost) are closed on the current engine,
                  every fix derived from AST facts rather than from a repository, path, or test name.
                </p>
                <div className="mb-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Reliability-gate history, disclosed in full
                  </p>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    Every generation the gate went through, not only the passing one. Shown specifically so a
                    5/5 cannot read as rerun-until-green.
                  </p>
                  <SimpleTable
                    head={["Gate generation", "Flaskr (K=5)", "Watchlist (K=5)"]}
                    rows={[
                      ["v1", "2/5", "5/5"],
                      ["v2", "3/5", "3/5"],
                      ["v3", "3/5", "5/5"],
                      ["v4 (current code)", "5/5", "5/5"],
                    ]}
                  />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Items, RESTX, Structural, and Minimal each independently hold their own 3/3 K=3 gate on the
                    same code. A fresh full-corpus sweep, one autonomous sample per repo in a single sitting,
                    came back <span className="font-semibold text-foreground">6/7 green</span>: flaskr 24/24
                    tests at 12/12 tasks, watchlist 15/15 at 13/13, and the four smaller repos green for $0.02
                    to $0.08 each. The sole red is a planning-stage variance rather than a capability gap.
                    Microblog&apos;s bounded architecture call occasionally proposes a malformed relationship
                    graph; strict validation rejects it, the run falls back to a rewrite-only plan, four files
                    then fail the exact contract gates that closed the import-cycle class, and the worktree is
                    restored coherently. Replaying microblog&apos;s own accepted architecture reaches 26/26
                    tasks and 4/4 tests with zero recovery, which separates the two variables cleanly.
                  </p>
                </div>
                <div className="mb-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    R5 held-out validation: the generalization check failed
                  </p>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    R5 v1 froze commit <span className="font-mono text-foreground">3b25ee9</span>,{" "}
                    <span className="font-mono text-foreground">corpus/heldout.toml</span>, one network-off
                    sandbox image, GPT-4o on both tiers, scenario baseline, K=3. The suite ran once; no red was
                    renamed, replaced, or rerun.
                  </p>
                  <SimpleTable
                    head={["Repo", "Baseline", "K=3", "Terminal shape", "Dominant failure"]}
                    rows={[
                      ["ws-example", "42/42", "0/3", "2 migrated, 1 restored", "generated test-client facade shadowed FastAPI route decorators; the two migrated samples stalled at 13/42"],
                      ["silicon", "34/34", "0/3", "3 restored", "invalid Python signatures; raw FastAPI constructed instead of the frozen facade"],
                      ["flask-email-login", "18/18", "0/3", "2 migrated, 1 restored", "architect missed the required context owner; the fallback left CSRF and mail providers as None"],
                    ]}
                  />
                  <div className="mt-4 rounded border border-accent/30 bg-accent/5 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      The scoring machinery held even though the recipe failed
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      Strict green 0/9, architect acceptance 6/9, trees 4 migrated / 5 restored-coherent / 0
                      hybrid, 119 LLM calls, 19 recovery visits, $3.8643, and 9/9 durable reports with zero
                      missing run rows. Rejected cuts restored the original suite, and those restored passes
                      contributed zero migration score. R5 rejects the claim that the recipe is generally
                      reliable today; it does not erase the development gates, it bounds them.
                    </p>
                  </div>
                  <div className="mt-4 rounded border border-border bg-card p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      The August 4 audit, and what it did not change
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      R5 originally reported <span className="font-mono text-foreground">ws-example</span>{" "}
                      oracle integrity at 0.75, which reads as a generation that deleted protected tests. A
                      forensic audit disproved it: every protected test file was byte-identical, and the score
                      was a false positive caused by a truncated read of a long protected test file. Both
                      readers now inspect full content, and a regression covers the bug. The result does not
                      move. All three samples were independently red:
                      two stalled at 13/42 behind the shadowed decorators, and one restored the original tree
                      with tasks still incomplete. Correcting a measurement is not the same as revising an
                      outcome, and the outcome is still 0/9.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Because these failures now drive production changes, all three repositories are
                      development inputs permanently, and all three have since reached one strict autonomous
                      development K1 green: <span className="font-mono text-foreground">ws-example</span> at
                      42/42 tests and 5/5 tasks, Silicon at 34/34 and 14/14, flask-email-login at 18/18 and
                      15/15, each with <span className="font-mono text-foreground">tree_state=migrated</span>{" "}
                      and oracle integrity 1.0. That is development evidence, not a revision of R5 v1, and
                      their later successful runs cannot supply held-out evidence.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Remediation is not fully closed. A new accepted-plan Microblog preservation replay
                      exposed a general callback-retention bug involving a source-defined initializer
                      callback: a replay diagnostic, not autonomous evidence. Any later held-out claim must
                      keep this 0/9 visible and use a genuinely fresh frozen corpus scouted after that
                      closure.
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Ten categories, ordered easy → hard, each with a status and evidence. Statuses below are
                  read against both corpora: several that were closed on development repos were reopened, or
                  bounded, by what the unseen set exposed. Standing fault scenarios (
                  <span className="font-mono text-foreground">bad_patch</span>,{" "}
                  <span className="font-mono text-foreground">bad_patch_until_escalation</span>,{" "}
                  <span className="font-mono text-foreground">drop_task</span>) recovered across the
                  development entries after the injectors themselves were fixed, and flaskr&apos;s frozen-plan
                  drop-task diagnostic passed 3/3; recovery quality is always reported as a delta against the
                  same repo&apos;s baseline, never as one flattering cross-repository average.
                </p>
                <SimpleTable
                  head={["#", "Category", "Status"]}
                  monoCols={[0]}
                  rows={[
                    ["1", "Routing / parsing / responses / error handlers: pitfalls like JSONResponse status override, HTTPException body shape, 302 vs 307 redirects", "SOLVED by recipe rules"],
                    ["2", "Cross-file name contracts: dropped router export caused ~50% flake on a 3-file app", "SOLVED structurally (export-contract AST pass)"],
                    ["3", "Deprecated / hallucinated APIs: @app.on_event and invented fastapi_flash / fastapi_login are closed, but the held-out set produced a subtler collision, a generated test-client .get helper shadowing FastAPI's route decorator", "PARTIAL: the class is open-ended even when each observed instance is cheap to encode"],
                    ["4", "Environment gaps: e.g. python-multipart for Form() took watchlist from collection-crash to all 15 tests executing", "SOLVED case-by-case in the sandbox image"],
                    ["5", "App factory & config: known app.config, instance-path, lifespan and canonical test-config shapes are covered, but held-out Silicon repeatedly failed to construct the frozen TestApp facade", "PARTIAL: ownership contracts need stronger realization across unseen factory shapes"],
                    ["6", "Templates / sessions / flash / auth: the app gets an owned request-context artifact, an owned rendering layer, and correctly-ordered session middleware; flaskr migrates autonomously at 24/24 with zero recovery", "SOLVED for the canonical case, architecturally rather than by prompts"],
                    ["7", "Cross-file call-shape drift: get_db() drifting between plain function / needs-request / context manager was the dominant residual (19/24 failures in one probe)", "SOLVED structurally: SCC ordering + frozen interface manifest + pre-sandbox enforcement of both DEFINES and CALLS"],
                    ["8", "Flask-coupled extensions: flask_restx holds 3/3 and watchlist's SQLAlchemy facade holds 5/5 with real pagination, but held-out flask-email-login retained CSRF and mail owners as None and then crashed at init_app", "SOLVED for development cases, OPEN generally: extension identity is not enough, every source-exercised provider must be materially realized"],
                    ["9", "Framework-inspecting tests: flaskr passes because the plan owns real session / g / app.testing surfaces with an audited import swap; the held-out ws-example harness broke instead on a generated client facade that shadowed route decorators, and the 0.75 integrity score first blamed on it was later shown to be a truncated-reader false positive", "SOLVED for flaskr; the oracle reader is fixed and regression-covered, but generation still does not preserve an unseen harness"],
                    ["10", "Provider initialization / import cycles in multi-package apps: cycles are rejected at generation and at Verify, and microblog's accepted plan replays to 26/26 tasks and 4/4 tests", "PARTIAL: gaps remain on both sides, microblog's autonomous proposal varies and held-out fallbacks never realized their providers"],
                  ]}
                />
              </MobileSection>

              {/* 09 · Corpus */}
              <MobileSection
                n="09" label="Corpus & Admission" id="section-09"
                summary="What a repo must prove before it enters the corpus, and the dependency-pin finding that cost four candidates."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Admission requires: a real Flask app, a real pytest suite green on the unmodified repo in the
                  offline sandbox, sandbox-runnable with no network, small (~≤25 Python files / ≤2k LOC for
                  v1: reliability, not context-window heroics), permissively licensed, and SHA-pinned for
                  remotes. The original ≥10-repo target was traded for a documented finding: a single shared
                  sandbox image cannot serve mutually incompatible dependency pins; four candidates dropped
                  for that shared cause; the unlock is per-repo sandbox images.
                </p>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Development corpus · 7 repos, 4 tiers
                </p>
                <SimpleTable
                  head={["Repo", "Tier", "Role"]}
                  rows={[
                    ["flask-items-fixture", "baseline", "Bundled offline-clean Phase-2 fixture"],
                    ["flask-structural-fixture", "baseline", "Bundled structural fixture: factory + g/current_app SQLite + Click + blueprint; makes structural regressions catchable for ~$0.04 instead of $0.30"],
                    ["minimal-flask-api", "baseline", "First real OSS repo migrated green"],
                    ["flask-restx-api", "framework", "Extension / marshalling wall, now 3/3"],
                    ["flaskr (Pallets tutorial)", "structural", "Templates + factory + auth + CLI; the acceptance benchmark; a hand migration under the same oracle defines the target"],
                    ["watchlist", "structural", "flask_sqlalchemy + sessions"],
                    ["microblog", "heavy", "Multi-extension / long recovery"],
                  ]}
                />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Ten repositories now, not seven. The three R5 repositories joined after the fact, because
                  they shaped the fixes that followed; they are listed with their frozen baselines below
                  rather than given a difficulty tier here, since they were admitted as held-out inputs and
                  never classified against this taxonomy.
                </p>
                <div className="mt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Frozen held-out corpus
                  </p>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    Eight new candidates were inspected statically and baseline-vetted{" "}
                    <em>without running Portage</em>. Three were admitted to{" "}
                    <span className="font-mono text-foreground">corpus/heldout.toml</span>, ClipBin was frozen
                    as reserve, and every temporary clone was deleted after admission. The one-shot result is
                    final evidence, not a tuning loop: any held-out repository used to change the recipe moves
                    permanently into the development corpus, and a later held-out set must be newly frozen.
                    That rule has now been paid rather than merely stated. All three R5 repositories shaped the
                    fixes that followed, so all three are development inputs and cannot produce held-out
                    evidence again. ClipBin stays untouched in reserve, and the next held-out set needs it plus
                    at least two newly scouted repositories, with this 0/9 still published beside whatever it
                    returns.
                  </p>
                  <SimpleTable
                    head={["Repo", "Pinned baseline", "R5 v1"]}
                    rows={[
                      ["ws-example", "42/42", "0/3 green"],
                      ["silicon", "34/34", "0/3 green"],
                      ["flask-email-login", "18/18", "0/3 green"],
                      ["ClipBin (reserve, still unseen)", "232/232", "not run"],
                    ]}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Sandbox accommodations stand in for each repo&apos;s own documented dev setup, never for test
                  logic: repo root on PYTHONPATH (≙ <span className="font-mono">pip install -e .</span>),{" "}
                  <span className="font-mono">test_args</span> scoping (≙ the repo&apos;s CI selection),
                  documented <span className="font-mono">test_env</span> vars, and a schema-provision hook.
                </p>
              </MobileSection>

              {/* 10 · CLI & MCP Contracts */}
              <MobileSection
                n="10" label="CLI & MCP Contracts" id="section-10"
                summary="The full command surface and its exit codes, held to the same honest-green bar as the eval harness."
              >
                <div className="space-y-6">
                  <SimpleTable
                    head={["Command", "Purpose"]}
                    rows={[
                      ["portage migrate <repo> [--ref SHA] [--subdir D] [--recipe R] [--watch]", "Submit + optional live attach"],
                      ["portage status <id>", "Task tree, attempts, verdict"],
                      ["portage jobs [--limit N]", "Recent jobs"],
                      ["portage report <id> [--diff]", "Report JSON; optional full migration diff"],
                    ]}
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-mono text-foreground">PORTAGE_API</span> or{" "}
                    <span className="font-mono text-foreground">--api</span> selects the control plane. Exit
                    codes: 0 honest green · 1 red · 2 usage/infra, the same bar as the eval harness.
                  </p>
                  <SimpleTable
                    head={["MCP tool", "Input (conceptual)", "Output"]}
                    rows={[
                      ["verify_patch_in_sandbox", "repo_path, optional diff, test_args, timeout_seconds", "{ok, applied, passed, tests, failing?, output_tail?, error?}"],
                      ["repo_graph", "repo_path (git root)", "{ok, build: full|incremental, files_parsed, total_nodes, total_edges}"],
                      ["blast_radius", "repo_path, changed_files[]", "Impacted files / callers / tests"],
                    ]}
                  />
                  <CodeBlock
                    title="intended_copilot_workflow"
                    rows={[
                      "repo_graph(R) once: full build first time, incremental after",
                      "blast_radius(R, files): what does my change touch?",
                      "draft the diff WITHOUT writing to disk",
                      "verify_patch_in_sandbox(R, diff, test_args=affected)",
                      "green → write to disk · red → iterate on failing + output_tail",
                    ]}
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Errors return readable dicts, never protocol crashes. An empty diff means “is the suite
                    green as-is?”; a malformed diff returns{" "}
                    <span className="font-mono text-foreground">{"{ok: false, error: \"diff does not apply\"}"}</span>.
                    The MCP server is standalone: Docker and the sandbox image are required on the host, but
                    the compose stack does not need to be up.
                  </p>
                </div>
              </MobileSection>

              {/* 11 · Auth */}
              <MobileSection
                n="11" label="Auth & Demo Protection" id="section-11"
                summary="How local scripts stay untouched while a hosted demo avoids unbounded model spend."
              >
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Designed so local DoD scripts stay unchanged while a hosted demo doesn&apos;t get burned by
                  unbounded LLM spend. <span className="font-mono text-foreground">AUTH_MODE=disabled</span>{" "}
                  locally (synthetic admin), <span className="font-mono text-foreground">github</span> hosted;
                  GitHub OAuth is the sole provider. Browsers get a 15-minute access JWT plus a rotating
                  refresh cookie with family reuse-detection; machines get revocable{" "}
                  <span className="font-mono text-foreground">pk_</span> API keys (sha256 at rest).
                  Authorization is ownership-or-admin on every <span className="font-mono text-foreground">/jobs*</span>{" "}
                  route: 404, never 403, so nothing leaks existence. Eval endpoints stay public and
                  aggregate-only.
                </p>
                <SimpleTable
                  head={["Limit", "Default", "Effect"]}
                  rows={[
                    ["Per-user concurrency", "1", "429 when exceeded"],
                    ["Per-user daily jobs", "5", "429 when exceeded"],
                    ["Per-job LLM cost ceiling", "$2.00", "Remaining tasks skipped → honest red"],
                    ["Global daily spend cap", "0 (off) / set in prod", "503 “at capacity”"],
                  ]}
                />
                <div className="mt-4 flex items-start gap-3 rounded border border-border bg-card p-4 text-sm text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p>
                    Secret redaction runs at every seam where repo content leaves the sandbox (prompt context,
                    retry errors, report diffs) via a path deny-list plus pattern scrub
                    (<span className="font-mono">agent/nodes/redaction.py</span>). The spend ledger is the same{" "}
                    <span className="font-mono">attempts_log</span> the eval numbers use.
                  </p>
                </div>
              </MobileSection>

              {/* 12 · Stack & Data Model */}
              <MobileSection
                n="12" label="Stack & Data Model" id="section-12"
                summary="Every technology choice and the tables behind them, from the queue claim down to where each run's evidence is stored."
              >
                <SimpleTable
                  head={["Concern", "Choice"]}
                  rows={[
                    ["Language / package", "Python 3.12 · import package portage_agent"],
                    ["API", "FastAPI, async throughout"],
                    ["Agent", "LangGraph + langgraph-checkpoint-postgres"],
                    ["ORM / migrations", "SQLAlchemy 2.0 async + asyncpg · Alembic (domain tables only)"],
                    ["Database", "Postgres 16 + pgvector; checkpoints via psycopg3 in the same DB"],
                    ["LLM", "LiteLLM ladder (driver / escalation / cheap); provider is env config"],
                    ["Sandbox", "Ephemeral Docker, --network none; gVisor (runsc) option for hosting"],
                    ["Retrieval", "code-review-graph behind a Protocol (graph + blast radius)"],
                    ["Frontend", "Next.js App Router, TypeScript, pnpm; REST only"],
                    ["Interfaces", "CLI (portage console script) + FastMCP stdio server"],
                  ]}
                />
                <div className="mt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Domain tables (Alembic)
                  </p>
                  <SimpleTable
                    head={["Table", "Purpose"]}
                    rows={[
                      ["jobs", "Queue row: recipe, status, config, lease (worker_id, heartbeat_at), report paths, summaries, user_id"],
                      ["tasks", "Plan DAG: file tasks + subtasks (parent_id), verify_spec, content_hash, diff, attempts_log"],
                      ["runs / metrics", "Eval harness output; the leaderboard contract"],
                      ["users + auth tables", "GitHub identity, role; refresh families, API keys (sha256)"],
                    ]}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  LangGraph checkpoint tables live in the same database but are created by the worker via{" "}
                  <span className="font-mono text-foreground">AsyncPostgresSaver.setup()</span>, never put in
                  Alembic. One <span className="font-mono text-foreground">POSTGRES_*</span> env derives both
                  DSNs: <span className="font-mono text-foreground">postgresql+asyncpg://</span> for domain,{" "}
                  <span className="font-mono text-foreground">postgresql://</span> for checkpoints. The{" "}
                  <span className="font-mono text-foreground">attempts_log</span> ledger (attempt, tier, model,
                  action, tokens, cost_usd, failing_diff) feeds recovery timelines in the UI,
                  escalation-rescue queries, per-job cost ceilings, global spend caps, and eval cost metrics.
                </p>
                <div className="mt-6 rounded border border-border bg-card p-5">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Current phase: recipe excellence, not deployment
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    After Phase 6, external review made the call that shapes everything since: the strongest
                    claim is depth, not breadth. Deployment was parked by decision (the repo is deploy-ready)
                    until the recipe meets a readiness bar set before the work: JSON-API tier ≥90% green,
                    template/session tier 70–80%, extension tier supported or honestly rejected, no
                    fault-scenario degradation, no false greens or weakened tests, and results reproduced on
                    held-out repositories never touched during development. The development side is largely
                    met. R5 v1 failed the required final clause at 0/9, so the bar is{" "}
                    <span className="font-semibold text-foreground">not met yet</span>, and that result is now
                    the governing constraint rather than something met by redefinition. The remediation
                    work generalizes from the held-out failure classes while preserving every development and
                    fault gate, before any fresh unseen set is frozen.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    All three former R5 repositories have since reached one strict autonomous development K1
                    green: <span className="font-mono text-foreground">ws-example</span> at 42/42 tests and
                    5/5 tasks, Silicon at 34/34 and 14/14, flask-email-login at 18/18 and 15/15, each with a
                    migrated tree and oracle integrity 1.0. None of that revises R5 v1, and none of it is
                    held-out evidence. The goal is not fully closed either: a new accepted-plan Microblog
                    preservation replay is red on a source-defined initializer callback that was not
                    retained, so regression closure is still in progress. Only after it closes does a newly
                    frozen held-out corpus become meaningful.
                  </p>
                </div>
              </MobileSection>

              {/* Quick Reference */}
              <MobileSection
                n="QR" label="Quick Reference" id="section-qr"
                summary="The honesty bar, the budgets, and the queue claim in one block, for when you already know what you are looking for."
              >
                <CodeBlock
                  title="cheat_sheet.md"
                  rows={[
                    "Honesty bar:   green ⇔ full_suite_pass ∧ all_tasks_done ∧ skipped == 0 ∧ passed > 0 ∧ outcome == success ∧ oracle_integrity == 1.0 ∧ tree_state == migrated",
                    "Budgets:       escalate_after_attempts=2 · max_task_attempts=3 · max_recover_visits=4 · max_targeted_contract_repairs=2 (own ledger) · architect: 1 call + ≤2 strictly-improving repairs · ≤4 created artifacts",
                    "Queue claim:   UPDATE … WHERE id = (SELECT … FOR UPDATE SKIP LOCKED LIMIT 1)",
                    "Resume:        aget_state(config) → pending nodes → ainvoke(None); never re-pass input",
                    "Faults:        bad_patch → rollback+regen · bad_patch_until_escalation → tier switch · drop_task → replan",
                    "Boundary:      converges strongly on the development corpus; R5 v1 scored 0/9 on unseen repos, so general capability realization is the frontier now",
                    "Development:   flaskr 5/5 · watchlist 5/5 at K=5 · items/restx/structural/minimal 3/3 at K=3 · fresh full-corpus sweep 6/7",
                    "Held-out:      R5 v1 0/9 strict green · architect 6/9 · trees 4 migrated / 5 restored / 0 hybrid · 119 calls · $3.8643 · 9/9 reports, 0 missing rows",
                    "Remediation:   all three R5 repos are development inputs now, each with one strict autonomous K1 green · ws-example 42/42 (5/5 tasks) · Silicon 34/34 (14/14) · flask-email-login 18/18 (15/15) · development evidence, not a revised R5",
                    "Open:          a later accepted-plan Microblog preservation replay is red on a source-defined initializer callback; regression closure in progress",
                    "Integrity:     the ws-example oracle alarm was a truncated read of a long protected test file; files byte-identical, readers fixed, 0/9 unchanged",
                  ]}
                />
              </MobileSection>

              {/* ─── Footer CTA ─── */}
              <section className="rounded border border-border bg-card/40 p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Source</p>
                <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                  Fully open-source · Docker Compose stack
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Everything described here is in the repo. <span className="font-mono text-foreground">docker compose up</span>{" "}
                  brings up the API, worker, Postgres, and dashboard together;{" "}
                  <span className="font-mono text-foreground">scripts/dod_check.sh</span> proves the
                  kill-and-resume claim on your machine.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/SohailGidwani/Portage"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects/portage"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Project
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
