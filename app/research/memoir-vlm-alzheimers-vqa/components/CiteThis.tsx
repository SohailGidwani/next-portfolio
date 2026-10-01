"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { triggerHaptic } from "@/app/components/ui/haptics"

// Everything here is taken from the published PDF (Front. Comput. Neurosci.
// 20:1902258, 1 October 2026): its printed citation block, its byline for the
// full author names, and its header for volume, article number and DOI. The
// title's dash is written as a colon, as everywhere on the site.
const DOI = "10.3389/fncom.2026.1902258"
const TITLE = "MEMOIR-VLM: a multimodal vision-language model for Alzheimer's disease classification and question answering"

const CITATION_TEXT = `Gidwani SH, Chattopadhyay T, Thomopoulos SI and Thompson PM (2026) ${TITLE}. Front. Comput. Neurosci. 20:1902258. doi: ${DOI}`

const BIBTEX = `@article{gidwani2026memoirvlm,
  author  = {Gidwani, Sohail Haresh and Chattopadhyay, Tamoghna and
             Thomopoulos, Sophia I. and Thompson, Paul M.},
  title   = {{MEMOIR-VLM}: a multimodal vision-language model for
             {Alzheimer's} disease classification and question answering},
  journal = {Frontiers in Computational Neuroscience},
  volume  = {20},
  pages   = {1902258},
  year    = {2026},
  month   = oct,
  doi     = {${DOI}},
  url     = {https://doi.org/${DOI}}
}`

type Format = "citation" | "bibtex"

const FORMATS: { id: Format; label: string; copy: string; view: ReactNode }[] = [
  {
    id: "citation",
    label: "Citation",
    copy: CITATION_TEXT,
    view: (
      <p className="text-sm leading-relaxed text-muted-foreground">
        Gidwani SH, Chattopadhyay T, Thomopoulos SI and Thompson PM (2026) {TITLE}.{" "}
        <em>Front. Comput. Neurosci.</em> 20:1902258.{" "}
        <a
          href={`https://doi.org/${DOI}`}
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap font-mono text-xs underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-accent"
        >
          doi: {DOI}
        </a>
      </p>
    ),
  },
  {
    id: "bibtex",
    label: "BibTeX",
    copy: BIBTEX,
    view: (
      // Scrolls sideways inside its own box on phones rather than wrapping
      // field values, which would make the entry harder to read and copy.
      <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
        {BIBTEX}
      </pre>
    ),
  },
]

/**
 * The paper's citation in the two forms people actually paste: the journal's
 * own reference and a BibTeX entry, with one copy button that confirms in
 * place. Same markup on the server and in the browser; only what happens on
 * a click depends on the browser.
 */
export default function CiteThis() {
  const [format, setFormat] = useState<Format>("citation")
  const [status, setStatus] = useState<"idle" | "copied" | "selected">("idle")
  const viewRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const active = FORMATS.find((f) => f.id === format) ?? FORMATS[0]

  const settle = (next: "copied" | "selected") => {
    setStatus(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus("idle"), 2200)
  }

  const copy = async () => {
    triggerHaptic(10)
    try {
      await navigator.clipboard.writeText(active.copy)
      settle("copied")
    } catch {
      // No clipboard access (an embedded view, an old browser): select the
      // text instead, so a keyboard copy takes it.
      const node = viewRef.current
      const selection = window.getSelection()
      if (node && selection) {
        const range = document.createRange()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
        settle("selected")
      }
    }
  }

  return (
    <div id="cite" className="mt-6 scroll-mt-24 rounded border border-border bg-background/60">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 sm:px-4">
        <div role="group" aria-label="Citation format" className="flex items-center gap-1">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={format === f.id}
              onClick={() => {
                setFormat(f.id)
                setStatus("idle")
              }}
              className={`rounded-[3px] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                format === f.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-9 items-center gap-1.5 rounded border border-border px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-[border-color,transform] hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-[0.97]"
        >
          {/* Both icons are always there; the state only swaps which shows,
              so the button never changes width under the pointer. */}
          <span className="relative inline-flex h-3.5 w-3.5">
            <Copy
              aria-hidden
              className={`absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-150 ${status === "idle" ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            />
            <Check
              aria-hidden
              className={`absolute inset-0 h-3.5 w-3.5 text-accent transition-[opacity,transform] duration-150 ${status === "idle" ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
            />
          </span>
          <span className="grid">
            <span className={`[grid-area:1/1] ${status === "idle" ? "" : "invisible"}`}>Copy</span>
            <span aria-hidden className={`[grid-area:1/1] ${status === "copied" ? "" : "invisible"}`}>Copied</span>
            <span aria-hidden className={`[grid-area:1/1] ${status === "selected" ? "" : "invisible"}`}>Selected</span>
          </span>
        </button>
      </div>
      <div ref={viewRef} className="px-3 py-3 sm:px-4">
        {active.view}
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? `${active.label} copied` : status === "selected" ? `${active.label} selected; use your copy shortcut` : ""}
      </p>
    </div>
  )
}
