import Link from "next/link"
import { Home, ArrowLeft, Github, Database, Brain, Search, FileText, Zap, Shield, Telescope } from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import SystemArchitecture from "./components/SystemArchitecture"
import IngestionPipeline from "./components/IngestionPipeline"
import HybridRanking from "./components/HybridRanking"

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

export default function KnowledgeHubDeepDivePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Knowledge Hub: Technical Deep Dive",
    author: { "@type": "Person", name: "Sohail Gidwani", url: "https://sohailgidwani.app" },
    datePublished: "2026-04-26",
    description:
      "Full technical breakdown of Knowledge Hub: architecture, OCR pipeline, pgvector semantic search, full-text search in Postgres, hybrid ranking, and RAG with a local Ollama LLM.",
    keywords: "RAG, pgvector, OCR, Tesseract, TrOCR, hybrid ranking, Flask, Postgres, Ollama",
    inLanguage: "en",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

        {/* ─── Top nav ─── */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/projects/knowledge-hub"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Knowledge Hub</span>
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
                Knowledge Hub: Technical Deep Dive
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Stat value="10" label="Sections" primary />
                <Stat value="3" label="Search Modes" />
                <Stat value="100%" label="Local / No Cloud" />
                <Stat value="RAG" label="With Citations" />
              </div>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every moving part of Knowledge Hub: the system architecture, OCR pipeline, full-text search stack, semantic search with pgvector, hybrid ranking math, and the RAG layer that powers cited answers, all with implementation notes.
              </p>

              <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {["Flask", "Postgres 16", "pgvector", "Tesseract", "TrOCR", "Sentence-Transformers", "IVFFlat", "Ollama", "Docker"].map((t) => (
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
                <SectionLabel n="01" label="Architecture Overview" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The system is a single-origin Flask API behind Gunicorn. All storage is local, Postgres 16 handles both keyword search and semantic vectors via pgvector, so there is one operational store and no separate vector database to run. File originals live in Storage (local filesystem or S3). Ollama runs the answer LLM entirely on-device.
                </p>
                <SystemArchitecture />
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: <Database className="h-4 w-4" />, label: "Postgres 16 + pgvector", sub: "GIN for FTS · IVFFlat for ANN" },
                    { icon: <Zap className="h-4 w-4" />, label: "Background Ingestion", sub: "202 Accepted · async chunking" },
                    { icon: <Brain className="h-4 w-4" />, label: "Ollama (local)", sub: "gemma3:1b · no API key needed" },
                  ].map((c) => (
                    <div key={c.label} className="rounded border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-accent">{c.icon}
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{c.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.sub}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 02 — Data Model */}
              <section>
                <SectionLabel n="02" label="Data Model & Storage" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The schema centres on four tables. <span className="font-mono text-foreground">documents</span> is the catalogue; <span className="font-mono text-foreground">chunks</span> is the retrieval unit; <span className="font-mono text-foreground">embeddings</span> holds the pgvector column; users and tags round out multi-user and organisational features.
                </p>
                <div className="overflow-x-auto rounded border border-border bg-card/40">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        <th className="px-4 py-3 text-left font-normal">Table</th>
                        <th className="px-4 py-3 text-left font-normal">Key Columns</th>
                        <th className="px-4 py-3 text-left font-normal">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {[
                        {
                          table: "documents",
                          cols: "id, user_id, title, source_path, mime_type, pages, bytes, hash_sha256, status",
                          note: "SHA-256 used for dedup and versioning",
                        },
                        {
                          table: "chunks",
                          cols: "id, document_id, version, page_no, chunk_index, text, tokens, modality, bbox, extra_json",
                          note: "extra_json stores { \"ocr_conf\": 72.5 }; chunk is the retrieval unit",
                        },
                        {
                          table: "embeddings",
                          cols: "id, chunk_id, model, dim, vector (pgvector)",
                          note: "Embedding dim must equal model output (384 for MiniLM-L6-v2)",
                        },
                        {
                          table: "users / tags",
                          cols: "id, email, password_hash / name, color",
                          note: "AuthZ per user_id; document_tags join table",
                        },
                      ].map((r) => (
                        <tr key={r.table}>
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{r.table}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{r.cols}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded border border-accent/20 bg-card p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Design decision</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Initially one chunk per page; later refined to 300–700 tokens with overlap once search quality testing showed that page-sized chunks hurt precision on long PDFs. Chunk size turned out to matter more than embedding model choice.
                  </p>
                </div>
              </section>

              {/* 03 — Ingestion Pipeline */}
              <section>
                <SectionLabel n="03" label="Ingestion Pipeline" />
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  Upload returns 202 immediately. A background thread does the heavy work: rendering, preprocessing, OCR, chunking, and embedding. Each stage records per-page errors and continues rather than aborting on a bad page.
                </p>
                <IngestionPipeline />

                <div className="mt-6 space-y-6">
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">3.1: Rendering & Preprocessing</p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      PyMuPDF rasterises each page at scale <span className="font-mono text-foreground">s=3</span> (typically 216 DPI) to improve OCR readability. Deskew estimates rotation via minimum-area rectangle on foreground pixels and applies an affine transform. Non-local-means denoising followed by an unsharp mask sharpens fine details. Binarization uses Otsu&apos;s global threshold or adaptive local thresholds for uneven illumination. A 2×2 closing operation connects broken handwriting strokes.
                    </p>
                    <div className="space-y-2">
                      {[
                        { eq: "M = [[cos θ,  sin θ,  tₓ], [−sin θ,  cos θ,  tᵧ]]", label: "affine deskew — θ from minAreaRect on foreground pixels" },
                        { eq: "I_sharp = a·I − b·G_σ(I)   (a=1.5, b=0.5)", label: "unsharp mask — G_σ is Gaussian blur at scale σ" },
                        { eq: "t* = arg max_t  σ²_B(t)", label: "Otsu threshold — maximises between-class variance" },
                        { eq: "T(x,y) = μ_{N(x,y)} − C", label: "adaptive threshold — local neighbourhood mean minus constant C" },
                      ].map(({ eq, label }) => (
                        <div key={label} className="overflow-x-auto rounded border border-border/60 bg-card/60 px-4 py-2.5">
                          <p className="font-mono text-sm text-foreground">{eq}</p>
                          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">3.2: Tesseract OCR (multi-pass + confidence)</p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      Three PSM configs run (<span className="font-mono text-foreground">--psm 6, 11, 4</span>) and the result with highest average word confidence is kept. Token confidences c_i ∈ [0, 100] are returned by <span className="font-mono text-foreground">image_to_data</span>; the pipeline computes the average and stores it alongside the text in <span className="font-mono text-foreground">chunks.extra_json</span>.
                    </p>
                    <div className="overflow-x-auto rounded border border-border/60 bg-card/60 px-4 py-2.5">
                      <p className="font-mono text-sm text-foreground">{"avg_conf = (1/n) ∑ᵢ cᵢ,   cᵢ ∈ [0, 100]"}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">average token confidence — stored in chunks.extra_json as ocr_conf; fallback if below threshold</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">3.3: Handwriting Fallback (TrOCR)</p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      When Tesseract confidence is low, TrOCR (VisionEncoderDecoder: ViT encoder + Transformer LM) handles the page. The decoder minimises cross-entropy loss over token sequences conditioned on the image, making it far more robust to cursive and irregular handwriting. This runs only as a fallback to keep inference time reasonable.
                    </p>
                    <div className="overflow-x-auto rounded border border-border/60 bg-card/60 px-4 py-2.5">
                      <p className="font-mono text-sm text-foreground">{"L = −∑ₜ log p(yₜ | y_{<t}, image)"}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">cross-entropy loss — Transformer decoder conditioned on ViT image features</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04 — Full-Text Search */}
              <section>
                <SectionLabel n="04" label="Full-Text Search in Postgres" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Postgres's native FTS is fast enough for sub-second search over tens of thousands of chunks with a GIN index, and it ships with the database — no Elasticsearch to operate.
                </p>

                <div className="space-y-5">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Search className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">4.1: Tokenisation → tsvector</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Postgres parses text, lowercases it, stems it, removes stopwords, and produces a multiset of <strong className="font-semibold text-foreground">lexemes</strong> with positional info. Example: <span className="font-mono text-xs">to_tsvector('english', text)</span> → <span className="font-mono text-xs">a:1 b:2,7 c:4</span>. We index on <span className="font-mono text-xs">to_tsvector('english', coalesce(text,''))</span> with a GIN index for sub-second search.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Search className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">4.2: Queries → tsquery</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-xs">plainto_tsquery('english', q)</span> handles plain queries robustly. <span className="font-mono text-xs">websearch_to_tsquery</span> supports Google-like syntax with <span className="font-mono text-xs">"phrase"</span>, <span className="font-mono text-xs">-exclude</span>, and <span className="font-mono text-xs">OR</span>.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Search className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">4.3: Ranking → ts_rank / ts_rank_cd</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-xs">ts_rank</span> ranks by term frequency with optional weights per lexeme class. <span className="font-mono text-xs">ts_rank_cd</span> (cover density) favours compact spans covering many query terms — it scores coverage windows and normalises by document length. We use <span className="font-mono text-xs">ts_rank_cd</span> because it penalises chunks that contain the terms scattered across many pages rather than clustered together.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <FileText className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">4.4: Snippets → ts_headline</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-xs">ts_headline</span> generates fragments with query terms emphasised. Parameters control fragment count, min/max word window, and surrounding HTML tags — we use <span className="font-mono text-xs">&lt;b&gt;…&lt;/b&gt;</span> to highlight hits in the search UI without XSS risk.
                    </p>
                  </div>
                </div>
              </section>

              {/* 05 — Semantic Search */}
              <section>
                <SectionLabel n="05" label="Semantic Search with Embeddings (pgvector)" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  Semantic search finds conceptually similar chunks even when the user's query shares no exact keywords with the document. Both the chunks and the query are encoded into the same vector space; nearest-neighbor search does the rest.
                </p>

                <div className="space-y-5">
                  <div className="rounded border border-border bg-card p-5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">5.1: Embedding Model & Normalisation</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-xs">sentence-transformers/all-MiniLM-L6-v2</span> encodes text into dense vectors x ∈ ℝ³⁸⁴. Vectors are L2-normalised so ‖x‖₂ = 1 — this makes cosine similarity equal to the inner product: cos(θ) = x · y. The embedding dimension must match the model output; the <span className="font-mono text-foreground">embeddings.dim</span> column enforces this at insert time.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">5.2: Distance Metrics in pgvector</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {[
                        { op: "<->", name: "L2 distance", note: "‖x − y‖₂" },
                        { op: "<#>", name: "Inner product", note: "−x · y (smaller = more similar when normalised)" },
                        { op: "<=>", name: "Cosine distance", note: "1 − cos(θ). With normalised vectors, equals 1 − x · y" },
                      ].map((m) => (
                        <div key={m.op} className="flex items-start gap-3">
                          <span className="mt-0.5 font-mono text-xs text-accent">{m.op}</span>
                          <span><strong className="text-foreground">{m.name}</strong> — {m.note}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Operator class chosen at index time must match the metric: <span className="font-mono">vector_l2_ops</span>, <span className="font-mono">vector_ip_ops</span>, or <span className="font-mono">vector_cosine_ops</span>.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">5.3: IVFFlat Index (Approximate Nearest Neighbour)</p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      Exact k-NN over all vectors is O(N). IVFFlat coarse-quantises the space into <span className="font-mono text-foreground">lists</span> buckets using k-means centroids. At query time only <span className="font-mono text-foreground">probes</span> nearest centroids are scanned, giving O(P · N/L) complexity — much faster with a controlled recall tradeoff.
                    </p>
                    <CodeBlock
                      title="ivfflat.tuning"
                      rows={[
                        "lists ≈ 4·√N  (rule of thumb; each list stores full vectors)",
                        "probes ≈ 5–10% of lists  (start here, tune by latency)",
                        "ANALYZE embeddings;  -- run after bulk inserts",
                        "SET ivfflat.probes = P;  -- per-session override",
                      ]}
                    />
                  </div>
                </div>
              </section>

              {/* 06 — Hybrid Ranking */}
              <section>
                <SectionLabel n="06" label="Hybrid Ranking (FTS ⊕ Semantic)" />
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  FTS gives precision (exact keyword hits); semantic search gives recall (conceptual matches). Combining both yields stable rankings across document types and query styles. The key challenge is that the two score scales are incomparable, so z-score normalisation brings them to the same range before blending.
                </p>
                <HybridRanking />

                <CodeBlock
                  title="hybrid_ranking.steps"
                  rows={[
                    "1. Retrieve top-K_sem via cosine distance; convert: s_v = 1 − d_cos",
                    "2. Retrieve top-K_fts via FTS; score: s_f = ts_rank_cd",
                    "3. Z-score each stream: z = (s − μ) / σ",
                    "4. Blend: score = α·z_v + β·z_f  (α=0.6, β=0.4)",
                    "5. Penalty: if chunk.ocr_conf < 50, score −= λ  (optional)",
                    "6. Return top-K by final score, deduplicated by (doc_id, page_no)",
                  ]}
                />

                <div className="mt-5 rounded border border-accent/20 bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Why z-score and not min-max?</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Min-max normalisation is sensitive to outliers, one unusually high FTS score on a dense keyword document would compress every other score into a tiny range. Z-score handles outliers better and produces stable, interpretable blending. The weights α and β can later be tuned from click-through data.
                  </p>
                </div>
              </section>

              {/* 07 — RAG */}
              <section>
                <SectionLabel n="07" label="RAG with Ollama LLM" />
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                  The goal is to compose an answer <em>only</em> from retrieved chunks, with citations, so the model cannot hallucinate facts that aren't in the user's own documents. Ollama runs <span className="font-mono text-foreground">gemma3:1b</span> entirely on-device.
                </p>

                <div className="space-y-5">
                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Brain className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">7.1: Prompt Structure</p>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {[
                        { role: "System", content: "\"Answer using only CONTEXT. If insufficient, say so. Add [CIT-#] after claims.\"" },
                        { role: "Context", content: "Top chunks, deduped by (doc, page), trimmed to ~500–800 chars, labelled [CIT-1]…" },
                        { role: "User", content: "Original question, unchanged." },
                      ].map((p) => (
                        <div key={p.role} className="flex items-start gap-3">
                          <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">{p.role}</span>
                          <span>{p.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <FileText className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">7.2: Context Packing & Map-Reduce</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Chunks are sorted by hybrid score so the highest-quality context appears early (models attend more to earlier tokens). Total context is capped at ~3k–4k tokens. When the top chunks overflow, the pipeline switches to map-reduce: each chunk is summarised independently (map), then the summaries are combined into a final answer (reduce), preserving citations throughout.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <FileText className="h-4 w-4" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em]">7.3: Citation Enforcement</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Post-processing extracts <span className="font-mono text-foreground">[CIT-#]</span> tags from the LLM output and maps each back to <span className="font-mono text-foreground">(document_id, page_no, title)</span>. If the output contains no citation tags, the pipeline optionally re-prompts with a stricter instruction before returning.
                    </p>
                  </div>
                </div>
              </section>

              {/* 08 — Performance & Ops */}
              <section>
                <SectionLabel n="08" label="Performance, Scalability & Ops" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: <Zap className="h-4 w-4" />,
                      title: "Ingestion",
                      body: "Processed in background threads; commits every N pages to avoid long transactions. Per-page errors are recorded and ingestion continues rather than aborting.",
                    },
                    {
                      icon: <Search className="h-4 w-4" />,
                      title: "FTS",
                      body: "GIN index on to_tsvector(...) keeps queries sub-second. vacuum/analyze runs periodically to keep index statistics fresh.",
                    },
                    {
                      icon: <Database className="h-4 w-4" />,
                      title: "Vectors",
                      body: "IVFFlat with cosine ops. Tune lists and probes as corpus grows. Embeddings are batched in groups of 64–256 rows to limit RAM.",
                    },
                    {
                      icon: <Telescope className="h-4 w-4" />,
                      title: "Monitoring",
                      body: "Log durations for render, OCR, chunk, embed, retrieval, and LLM. Track total end-to-end latency per query. Timeouts avoid request-handler blocking.",
                    },
                  ].map((c) => (
                    <div key={c.title} className="rounded border border-border bg-card p-5">
                      <div className="mb-3 flex items-center gap-2 text-accent">
                        {c.icon}
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">{c.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 09 — Security */}
              <section>
                <SectionLabel n="09" label="Security & Privacy" />
                <div className="space-y-3">
                  {[
                    { bullet: "Local-first by default — originals never leave the machine unless Storage is configured to S3." },
                    { bullet: "Files are hashed with SHA-256 on upload for deduplication and to detect tampering." },
                    { bullet: "AuthZ is per user_id — users can only access their own documents." },
                    { bullet: "HTML rendering in search snippets uses only <b> tags — no arbitrary HTML, preventing XSS." },
                    { bullet: "Optional encryption at rest when writing to Storage." },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-2 flex h-4 w-4 shrink-0 items-center justify-center">
                        <Shield className="h-3 w-3 text-accent" />
                      </div>
                      {b.bullet}
                    </div>
                  ))}
                </div>
              </section>

              {/* 10 — Future Work */}
              <section>
                <SectionLabel n="10" label="Future Upgrades & Research Notes" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Text-first extraction", body: "Prefer embedded text over OCR. Run OCR only when the PDF has no selectable text layer." },
                    { title: "Smarter chunking", body: "300–700 tokens with overlap and a heading_path field to preserve document outline for context." },
                    { title: "Tables & Figures", body: "Detect and store table_json + auto-summaries; caption figures for discoverability in semantic search." },
                    { title: "Hybrid tuning", body: "Learn α, β weights from click/relevance data. Consider BM25 for the lexical score instead of ts_rank_cd." },
                    { title: "ANN variants", body: "Evaluate HNSW or PQ-IVF at ultra-large scale for better recall/latency curves." },
                    { title: "Queue & retries", body: "Replace background threads with Redis/RQ or Celery for durable task queues with a /tasks/:id status API." },
                  ].map((f) => (
                    <div key={f.title} className="rounded border border-border bg-card p-5">
                      <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-foreground">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Reference */}
              <section>
                <SectionLabel n="QR" label="Quick Reference" />
                <CodeBlock
                  title="cheat_sheet.md"
                  rows={[
                    "Cosine similarity:  cos(θ) = x·y / (‖x‖·‖y‖)",
                    "Cosine distance:    <=> = 1 − cos(θ)",
                    "Z-score:            z = (x − μ) / σ",
                    "Otsu threshold:     t* = arg max_t σ²_B(t)  (between-class variance)",
                    "IVFFlat:            lists = coarse clusters; probes = centroids searched",
                    "IVFFlat complexity: O(P · N / L)  vs  O(N) exact",
                    "FTS cover density:  prefers compact spans covering many query terms",
                    "Embedding dim:      must match model output (384 for MiniLM-L6-v2)",
                    "Hybrid weights:     α=0.6 (semantic)  β=0.4 (FTS) — tune from data",
                  ]}
                />
              </section>

              {/* ─── Footer CTA ─── */}
              <section className="rounded border border-border bg-card/40 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Source</p>
                <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                  Fully open-source · Docker Compose setup
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Everything described here is in the repo. <span className="font-mono text-foreground">docker-compose up</span> brings up Flask, Postgres, and Ollama together. No external services required.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/SohailGidwani/knowledge_hub"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects/knowledge-hub"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Project
                  </Link>
                  <a
                    href="/documents/Knowledge Hub — Technical Deep Dive (design Doc).pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    PDF Version
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
