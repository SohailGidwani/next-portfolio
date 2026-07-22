import Link from "next/link"
import { ExternalLink, FileText, Github, Play } from "lucide-react"

type ProjectActionsProps = {
  github: string
  deepDive?: string
  demo?: string
  proofHref?: string
  proofLabel?: string
  className?: string
}

const primary =
  "inline-flex min-h-10 items-center gap-2 rounded bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90 active:scale-[0.98]"
const secondary =
  "inline-flex min-h-10 items-center gap-2 rounded border border-border bg-background/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-accent/50 active:scale-[0.98]"

export default function ProjectActions({
  github,
  deepDive,
  demo,
  proofHref,
  proofLabel = "Watch proof",
  className = "",
}: ProjectActionsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className={primary}
      >
        <Github className="h-4 w-4" aria-hidden />
        Source code
      </a>
      {demo ? (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className={secondary}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Live demo
        </a>
      ) : null}
      {deepDive ? (
        <Link href={deepDive} className={secondary}>
          <FileText className="h-4 w-4" aria-hidden />
          Deep dive
        </Link>
      ) : null}
      {proofHref ? (
        <a href={proofHref} className={secondary}>
          <Play className="h-4 w-4" aria-hidden />
          {proofLabel}
        </a>
      ) : null}
    </div>
  )
}
