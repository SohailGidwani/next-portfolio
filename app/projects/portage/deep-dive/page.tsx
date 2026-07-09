import Link from "next/link"
import Image from "next/image"
import { Home, ArrowLeft, Github, Shield, Zap, Terminal, Bot, Gauge, Database } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import ReadingProgress from "@/app/components/ReadingProgress"
import SectionTOC from "@/app/components/SectionTOC"
import DiagramLightbox from "@/app/components/DiagramLightbox"
import PortageArchitecture from "../components/PortageArchitecture"
import MigrationFlow from "../components/MigrationFlow"
import BlastRadius from "../components/BlastRadius"
import killResume from "@/public/images/portage/kill-resume.gif"

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
  { id: "section-01", n: "01", label: "Architecture Overview" },
  { id: "section-02", n: "02", label: "Job Lifecycle & Graph Nodes" },
  { id: "section-03", n: "03", label: "Durability Model" },
  { id: "section-04", n: "04", label: "Sandbox & Verification" },
  { id: "section-05", n: "05", label: "Recovery Strategies" },
  { id: "section-06", n: "06", label: "Recipe System" },
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
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  )
}

function CodeRow({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
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
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
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
          <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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
      "Full technical breakdown of Portage: LangGraph node lifecycle, Postgres checkpoint + lease durability, network-off sandbox verification with anti-gaming predicates, recovery strategies, recipe system, eval methodology, and failure taxonomy.",
    keywords:
      "autonomous agent, code migration, LangGraph, Postgres checkpointing, Docker sandbox, LiteLLM, MCP, blast radius, eval harness, failure taxonomy",
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

        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Project / Technical Deep Dive
                </span>
              </div>
              <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Portage: Technical Deep Dive
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Stat value="12" label="Sections" primary />
                <Stat value="7" label="Recovery Strategies" />
                <Stat value="K=3 × 6" label="Eval Grid" />
                <Stat value="9" label="Failure Categories" />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every moving part of Portage: the compose-stack architecture, the LangGraph node lifecycle,
                checkpoint + lease durability, network-off sandbox verification with anti-gaming predicates,
                the recovery strategy table, the Flask → FastAPI recipe system, K-run eval methodology with
                explicit non-claims, and the failure taxonomy with evidence. Every number comes from the{" "}
                <span className="font-mono text-foreground">runs</span>/
                <span className="font-mono text-foreground">metrics</span> tables or documented DoD scripts.
              </p>

              <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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

              {/* 01 — Architecture Overview */}
              <section>
                <SectionLabel n="01" label="Architecture Overview" id="section-01" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Portage is one core engine exposed through two interfaces. The autonomous agent + eval
                  harness is the credibility engine; the MCP tools are the product wedge — build the moat
                  first, the wedge second. The frontend never owns schema, and the CLI and dashboard are both
                  thin REST clients: neither touches the queue or DB directly.
                </p>
                <DiagramLightbox title="System Architecture">
                  <PortageArchitecture />
                </DiagramLightbox>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: <Terminal className="h-4 w-4" />, label: "CLI — portage", sub: "Autonomous migrations · developer / CI" },
                    { icon: <Bot className="h-4 w-4" />, label: "MCP server", sub: "Verified primitives for Claude Code, Cursor" },
                    { icon: <Gauge className="h-4 w-4" />, label: "Dashboard", sub: "Observability + eval proof for humans" },
                  ].map((c) => (
                    <div key={c.label} className="rounded border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-accent">{c.icon}
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{c.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <CodeBlock
                    title="design_constraints.that_matter"
                    rows={[
                      "Async everywhere in the backend — handlers, sessions, graph nodes",
                      "Interfaces before adapters — Docker, LiteLLM, storage behind core/ Protocols; provider is env, not code",
                      "Two DB drivers, one Postgres — asyncpg (domain, Alembic) + psycopg3 (LangGraph checkpoints); never merge the DSNs",
                      "Job/Task status is VARCHAR + app-side StrEnum — keeps Alembic simple as states are added",
                    ]}
                  />
                </div>
              </section>

              {/* 02 — Job Lifecycle */}
              <section>
                <SectionLabel n="02" label="Job Lifecycle & Graph Nodes" id="section-02" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  A job submitted via <span className="font-mono text-foreground">POST /jobs</span> lands as{" "}
                  <span className="font-mono text-foreground">queued</span>; a worker claims it atomically and
                  runs this graph with state keyed by{" "}
                  <span className="font-mono text-foreground">thread_id = job_id</span>. The runner checks
                  checkpoint state first: no checkpoint → fresh start; pending nodes →{" "}
                  <span className="font-mono text-foreground">ainvoke(None)</span> without re-passing input —
                  the difference between “resume” and “accidentally restart from Ingest.”
                </p>
                <DiagramLightbox title="Job Lifecycle — LangGraph Nodes">
                  <MigrationFlow />
                </DiagramLightbox>
                <div className="mt-6">
                  <SimpleTable
                    head={["Node", "What it does"]}
                    rows={[
                      ["Ingest", "Clone (optionally SHA-pinned, optional --subdir), snapshot as a git worktree, build the structural code graph. Runs exactly once on resume."],
                      ["Plan", "Recipe detects framework usage, classifies each file, builds a task DAG with per-task verify_spec. An export-contract AST pass states what sibling files import."],
                      ["Execute", "Per-file LLM rewrite on the worktree. Content-hash idempotency: resume skips already-applied files. Driver → escalation model ladder after N failures."],
                      ["Verify", "Blast-radius-scoped tests in an ephemeral --network none sandbox, JUnit-parsed. All-skipped suites are failures (passed > 0 required)."],
                      ["Recover", "Classify failure → targeted rollback + regenerate / model escalation / replan / skip-and-continue. Budgets bound everything."],
                      ["Integrate", "Always recomputes the migration diff from the worktree — never trusts a stale cached diff."],
                      ["Report", "Reloads task truth from Postgres; emits report with recovery actions, LLM cost, and verdict."],
                    ]}
                  />
                </div>
                <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Honest green requires all three</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    (1) the full test suite passes — not just the blast-radius subset used during iteration;
                    (2) every planned task completed; (3) zero tasks rolled back or skipped by recovery. A run
                    that recovery rolls back to original sources will pass the original suite — and is scored
                    red. That false-green class was caught live (“GREEN 24/24” with an empty diff) and fixed
                    structurally.
                  </p>
                </div>
              </section>

              {/* 03 — Durability */}
              <section>
                <SectionLabel n="03" label="Durability Model" id="section-03" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Durability is the core product edge — not “the LLM is smart,” but “the run survives process
                  death and still tells the truth.” LangGraph&apos;s{" "}
                  <span className="font-mono text-foreground">AsyncPostgresSaver</span> persists state after
                  every node; a worker that dies mid-graph is replaced by another that resumes from the last
                  checkpoint, not from zero.
                </p>
                <div className="space-y-5">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Database className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">3.1: Queue + lease</p>
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">3.2: Content-hash idempotency</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Each Execute step is keyed by job + task + sha256 of the written file. Resume after a
                      mid-Execute crash skips tasks already applied instead of re-calling the model. Ingest is
                      likewise written so resume does not re-clone or re-build the graph unnecessarily.
                    </p>
                  </div>
                </div>
                <div className="mt-6 overflow-hidden rounded border border-border bg-card">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      kill-and-resume demo — scripts/demo_kill_resume.sh
                    </span>
                  </div>
                  <Image
                    src={killResume}
                    alt="Terminal recording: the Portage worker is killed mid-migration and a restarted worker resumes from the Postgres checkpoint to finish the job"
                    className="h-auto w-full"
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  The eval harness cannot SIGKILL the worker it depends on, so crash-resume is covered by{" "}
                  <span className="font-mono text-foreground">demo_kill_resume.sh</span> and the stricter{" "}
                  <span className="font-mono text-foreground">dod_check.sh</span>, separately from the K-run grid.
                </p>
              </section>

              {/* 04 — Sandbox & Verification */}
              <section>
                <SectionLabel n="04" label="Sandbox & Verification" id="section-04" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Verification must be isolated (untrusted migrated code must not touch the host network or
                  sibling jobs), reproducible (same image, same pins, same offline constraint as corpus
                  admission), and structured (JUnit parsed into totals plus failing test names). Every verify
                  run gets an ephemeral Docker container with{" "}
                  <span className="font-mono text-foreground">--network none</span> — no pip install at test
                  time; hosted deployments can switch the runtime to gVisor with{" "}
                  <span className="font-mono text-foreground">SANDBOX_RUNTIME=runsc</span>.
                </p>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  During iteration, Verify scopes to the tests implicated by changed files — the{" "}
                  <span className="font-mono text-foreground">blast_radius</span> query below. Scoped runs are
                  a speed lever, never a scoring lever: the honesty bar for green still requires the full suite.
                </p>
                <DiagramLightbox title="Blast Radius — Impact of a Change">
                  <BlastRadius />
                </DiagramLightbox>
                <div className="mt-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
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
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">MCP reuse</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    <span className="font-mono">verify_patch_in_sandbox</span> is the same sandbox contract,
                    exposed for co-pilot use: copy → apply diff → run → return structured result, never
                    modifying the caller&apos;s tree. That reuse is intentional — the eval proves the loop;
                    MCP sells the loop.
                  </p>
                </div>
              </section>

              {/* 05 — Recovery */}
              <section>
                <SectionLabel n="05" label="Recovery Strategies" id="section-05" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Recover classifies and rolls back; Execute owns regeneration; Plan owns replanning. Inputs:
                  the last verify output (stdout + stderr), the planned file set vs the worktree, per-task
                  attempt counts and prior blame targets, and the budgets —{" "}
                  <span className="font-mono text-foreground">max_task_attempts=3</span>,{" "}
                  <span className="font-mono text-foreground">max_recover_visits=4</span>,{" "}
                  <span className="font-mono text-foreground">escalate_after_attempts=2</span>.
                </p>
                <SimpleTable
                  head={["Strategy", "Trigger", "Action"]}
                  rows={[
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
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Self-review retries</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Rolled-back attempts keep their failing diff, so retries see it (“debug your own code”)
                      instead of regenerating blind. Measured on flaskr: the app factory went from
                      exhausted-and-skipped after 3 blind attempts to completing all 6 tasks.
                    </p>
                  </div>
                  <div className="rounded border border-accent/20 bg-card p-5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Integrity rule</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Skip-and-continue can make the suite green by restoring originals. That must never score
                      as a successful migration: green = suite green ∧ every planned task done ∧ none skipped.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <CodeBlock
                    title="fault_injection.standing_scenarios"
                    rows={[
                      "bad_patch → corrupted first attempt → crash classify → targeted rollback → regenerate",
                      "bad_patch_until_escalation → driver tier keeps failing → escalation tier takes over (logged per attempt)",
                      "drop_task → planner miss → residue detection → replan appends the missing task",
                      "recovery quality = delta vs the same repo's baseline green rate — a single averaged rate flatters easy repos and slanders hard ones",
                    ]}
                  />
                </div>
              </section>

              {/* 06 — Recipe System */}
              <section>
                <SectionLabel n="06" label="Recipe System (Flask → FastAPI)" id="section-06" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Flask → FastAPI spans exactly the things deterministic tools cannot do reliably: routing
                  decorators and HTTP methods, path/query/body parsing, blueprints → APIRouters, error
                  handlers, app factory + config semantics, and the test-client seam. A recipe declares four
                  things: detection (which files are in scope), task types and subtasks, a per-task{" "}
                  <span className="font-mono text-foreground">verify_spec</span>, and prompt guidance encoded
                  after observed failures. A recipe that doesn&apos;t recognize the repo yields an empty plan —
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
                      "redirect() must become RedirectResponse(..., 302) — the 307 default re-sends POST",
                      "@app.on_event deprecation warning-as-error under pytest → lifespan handlers (rule 11)",
                      "hallucinated fastapi_flash / fastapi_login → never invent packages; inline equivalents (rule 12)",
                      "dropped router export broke siblings → AST export-contract pass in Plan (was ~50% flake on a 3-file app)",
                    ]}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  What recipes do <em>not</em> solve alone: cross-file call-shape drift (contracts pin names,
                  not signatures), deep framework-inspecting tests (<span className="font-mono">flask.session</span>,{" "}
                  <span className="font-mono">g</span>, <span className="font-mono">app.testing</span>), and
                  full fidelity for every Flask extension without per-extension sub-strategies.
                </p>
              </section>

              {/* 07 — Eval Methodology */}
              <section>
                <SectionLabel n="07" label="Eval Methodology" id="section-07" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The oracle: every corpus repo ships a behavioral pytest suite that is green on the unmodified
                  repo, verified during admission in the same sandbox the eval uses. After migration, the same
                  assertions must pass against the migrated app. Every (repo × scenario) cell runs K times
                  through the real queue/worker path; per-run rows land in{" "}
                  <span className="font-mono text-foreground">runs</span>, mean±variance aggregates in{" "}
                  <span className="font-mono text-foreground">metrics</span>. Variance is reported, not
                  smoothed — minimal-flask-api&apos;s 2/3 baseline was a finding that motivated the
                  export-contract work, not noise.
                </p>
                <CodeBlock
                  title="reproducibility.pins"
                  rows={[
                    "remote repos pinned to a commit SHA — corpus.toml rejects unpinned remotes",
                    "sandbox image pins dependencies — no pip install at test time",
                    "model + config recorded per attempt in attempts_log",
                    "cost includes retries and escalations — microblog's ~$1.50/run is mostly recovery rounds",
                  ]}
                />
                <div className="mt-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    What these numbers do NOT show
                  </p>
                  <SimpleTable
                    head={["Non-claim", "Why"]}
                    rows={[
                      ["Generality across migrations", "One recipe, one language, six repos. The architecture is recipe-agnostic; the evidence is recipe-specific."],
                      ["Stronger-model lift", "If driver and escalation resolve to the same deployment, escalation-rescue measures the retry-ladder machinery, not a stronger model. Swapping LLM_ESCALATION_MODEL measures real lift — env-only."],
                      ["Big-repo behaviour", "Corpus repos are small (≲ ~40 files). Thousand-file horizons are unproven."],
                      ["Immunity to prompt-tuning bias", "Several recipe rules were added after corpus failures; the grid partly measures a recipe tuned to this corpus. Disclosed, not pretended away."],
                    ]}
                  />
                </div>
              </section>

              {/* 08 — Failure Taxonomy */}
              <section>
                <SectionLabel n="08" label="Failure Taxonomy" id="section-08" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Nine categories, ordered easy → hard, each with a status and a fix direction. The fault-recovery
                  grid on the stable tier: 100% green on the fixture (3/3 for both{" "}
                  <span className="font-mono text-foreground">bad_patch</span> and{" "}
                  <span className="font-mono text-foreground">bad_patch_until_escalation</span>), degrading on
                  the real repo where baseline already flakes 1-in-3 and injected faults consume the retry
                  budget the organic flake then needs.
                </p>
                <SimpleTable
                  head={["#", "Category", "Status"]}
                  monoCols={[0]}
                  rows={[
                    ["1", "Routing / parsing / responses / error handlers — pitfalls like JSONResponse status override, HTTPException body shape, 302 vs 307 redirects", "SOLVED by recipe rules"],
                    ["2", "Cross-file name contracts — dropped router export caused ~50% flake on a 3-file app", "SOLVED structurally (export-contract AST pass)"],
                    ["3", "Deprecated / hallucinated APIs — @app.on_event; invented fastapi_flash / fastapi_login", "SOLVED by rules 11/12; each new instance is cheap to encode"],
                    ["4", "Environment gaps — e.g. python-multipart for Form() took watchlist from collection-crash to all 15 tests executing", "SOLVED case-by-case in the sandbox image"],
                    ["5", "App factory & config — config-as-plain-dict, instance path, lifespan", "MOSTLY SOLVED; residual bugs in rarely-exercised branches"],
                    ["6", "Templates / sessions / flash / auth — template apps complete DAGs, most tests pass (0.67 avg), all-or-nothing green not met", "PARTIAL — the v1 frontier"],
                    ["7", "Cross-file call-shape drift — flaskr's get_db() drifts between plain function / needs-request / context manager (19/24 failures in a final probe)", "OPEN, dominant residual; fix direction: signature-level contracts or a shared interfaces step"],
                    ["8", "Flask-coupled extensions — flask_restx reached green 1/3 (was: never collected); flask_sqlalchemy completes but fails behaviorally", "OPEN / v1 boundary; needs per-extension sub-strategies"],
                    ["9", "Framework-inspecting tests — assertions on flask.session / g / app.testing internals cannot pass unchanged against FastAPI", "OPEN by design; harness rewrites plumbing, never assertion meaning"],
                  ]}
                />
              </section>

              {/* 09 — Corpus */}
              <section>
                <SectionLabel n="09" label="Corpus & Admission" id="section-09" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Admission requires: a real Flask app, a real pytest suite green on the unmodified repo in the
                  offline sandbox, sandbox-runnable with no network, small (~≤25 Python files / ≤2k LOC for
                  v1 — reliability, not context-window heroics), permissively licensed, and SHA-pinned for
                  remotes. The original ≥10-repo target was traded for a documented finding: a single shared
                  sandbox image cannot serve mutually incompatible dependency pins — four candidates dropped
                  for that shared cause; the unlock is per-repo sandbox images.
                </p>
                <SimpleTable
                  head={["Repo", "Tier", "Role"]}
                  rows={[
                    ["flask-items-fixture", "baseline", "Bundled offline-clean Phase-2 fixture"],
                    ["minimal-flask-api", "baseline", "First real OSS repo migrated green"],
                    ["flask-restx-api", "framework", "Extension / marshalling wall"],
                    ["flaskr (Pallets tutorial)", "structural", "Templates + factory + auth-shaped flows"],
                    ["watchlist", "structural", "flask_sqlalchemy + sessions"],
                    ["microblog", "heavy", "Multi-extension / long recovery"],
                  ]}
                />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Sandbox accommodations stand in for each repo&apos;s own documented dev setup, never for test
                  logic: repo root on PYTHONPATH (≙ <span className="font-mono">pip install -e .</span>),{" "}
                  <span className="font-mono">test_args</span> scoping (≙ the repo&apos;s CI selection),
                  documented <span className="font-mono">test_env</span> vars, and a schema-provision hook.
                </p>
              </section>

              {/* 10 — CLI & MCP Contracts */}
              <section>
                <SectionLabel n="10" label="CLI & MCP Contracts" id="section-10" />
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
                    codes: 0 honest green · 1 red · 2 usage/infra — the same bar as the eval harness.
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
                      "repo_graph(R) once — full build first time, incremental after",
                      "blast_radius(R, files) — what does my change touch?",
                      "draft the diff WITHOUT writing to disk",
                      "verify_patch_in_sandbox(R, diff, test_args=affected)",
                      "green → write to disk · red → iterate on failing + output_tail",
                    ]}
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Errors return readable dicts, never protocol crashes. An empty diff means “is the suite
                    green as-is?”; a malformed diff returns{" "}
                    <span className="font-mono text-foreground">{"{ok: false, error: \"diff does not apply\"}"}</span>.
                    The MCP server is standalone — Docker and the sandbox image are required on the host, but
                    the compose stack does not need to be up.
                  </p>
                </div>
              </section>

              {/* 11 — Auth */}
              <section>
                <SectionLabel n="11" label="Auth & Demo Protection" id="section-11" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Designed so local DoD scripts stay unchanged while a hosted demo doesn&apos;t get burned by
                  unbounded LLM spend. <span className="font-mono text-foreground">AUTH_MODE=disabled</span>{" "}
                  locally (synthetic admin), <span className="font-mono text-foreground">github</span> hosted —
                  GitHub OAuth is the sole provider. Browsers get a 15-minute access JWT plus a rotating
                  refresh cookie with family reuse-detection; machines get revocable{" "}
                  <span className="font-mono text-foreground">pk_</span> API keys (sha256 at rest).
                  Authorization is ownership-or-admin on every <span className="font-mono text-foreground">/jobs*</span>{" "}
                  route — 404, never 403, so nothing leaks existence. Eval endpoints stay public and
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
                    Secret redaction runs at every seam where repo content leaves the sandbox — prompt context,
                    retry errors, report diffs — via a path deny-list plus pattern scrub
                    (<span className="font-mono">agent/nodes/redaction.py</span>). The spend ledger is the same{" "}
                    <span className="font-mono">attempts_log</span> the eval numbers use.
                  </p>
                </div>
              </section>

              {/* 12 — Stack & Data Model */}
              <section>
                <SectionLabel n="12" label="Stack & Data Model" id="section-12" />
                <SimpleTable
                  head={["Concern", "Choice"]}
                  rows={[
                    ["Language / package", "Python 3.12 · import package portage_agent"],
                    ["API", "FastAPI, async throughout"],
                    ["Agent", "LangGraph + langgraph-checkpoint-postgres"],
                    ["ORM / migrations", "SQLAlchemy 2.0 async + asyncpg · Alembic (domain tables only)"],
                    ["Database", "Postgres 16 + pgvector — checkpoints via psycopg3 in the same DB"],
                    ["LLM", "LiteLLM ladder (driver / escalation / cheap) — provider is env config"],
                    ["Sandbox", "Ephemeral Docker, --network none; gVisor (runsc) option for hosting"],
                    ["Retrieval", "code-review-graph behind a Protocol (graph + blast radius)"],
                    ["Frontend", "Next.js App Router, TypeScript, pnpm — REST only"],
                    ["Interfaces", "CLI (portage console script) + FastMCP stdio server"],
                  ]}
                />
                <div className="mt-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
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
                  <span className="font-mono text-foreground">AsyncPostgresSaver.setup()</span> — never put in
                  Alembic. One <span className="font-mono text-foreground">POSTGRES_*</span> env derives both
                  DSNs: <span className="font-mono text-foreground">postgresql+asyncpg://</span> for domain,{" "}
                  <span className="font-mono text-foreground">postgresql://</span> for checkpoints. The{" "}
                  <span className="font-mono text-foreground">attempts_log</span> ledger (attempt, tier, model,
                  action, tokens, cost_usd, failing_diff) feeds recovery timelines in the UI,
                  escalation-rescue queries, per-job cost ceilings, global spend caps, and eval cost metrics.
                </p>
              </section>

              {/* Quick Reference */}
              <section>
                <SectionLabel n="QR" label="Quick Reference" id="section-qr" />
                <CodeBlock
                  title="cheat_sheet.md"
                  rows={[
                    "Honesty bar:   green ⇔ full_suite_pass ∧ all_tasks_done ∧ skipped == 0 ∧ passed > 0",
                    "Budgets:       escalate_after_attempts=2 · max_task_attempts=3 · max_recover_visits=4",
                    "Queue claim:   UPDATE … WHERE id = (SELECT … FOR UPDATE SKIP LOCKED LIMIT 1)",
                    "Resume:        aget_state(config) → pending nodes → ainvoke(None) — never re-pass input",
                    "Faults:        bad_patch → rollback+regen · bad_patch_until_escalation → tier switch · drop_task → replan",
                    "Boundary:      JSON APIs green at ~$0.01–0.02; template/extension apps are the honest frontier",
                    "Dominant residual: cross-file call-shape drift — names are pinned, call shapes are not",
                  ]}
                />
              </section>

              {/* ─── Footer CTA ─── */}
              <section className="rounded border border-border bg-card/40 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Source</p>
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
