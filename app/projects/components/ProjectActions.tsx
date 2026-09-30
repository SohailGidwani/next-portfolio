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

// The site-wide button classes (globals.css), same as every other page.
const primary = "btn-primary"
const secondary = "btn-secondary"

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
