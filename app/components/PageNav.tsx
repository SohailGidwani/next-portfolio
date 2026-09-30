import Link from "next/link"
import { ArrowLeft, FlaskConical, FolderKanban, Home } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import ReadingProgress from "./ReadingProgress"

const ICONS = {
  home: Home,
  back: ArrowLeft,
  projects: FolderKanban,
  research: FlaskConical,
} as const

export type PageNavItem = {
  label: string
  /** A key rather than a component, so server pages can pass it as a prop. */
  icon: keyof typeof ICONS
  /** Omit for the page the reader is already on. */
  href?: string
}

const base =
  "inline-flex min-h-11 items-center gap-1.5 rounded border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] sm:min-h-0"

/**
 * The top bar for every page except the homepage, which has the full navbar:
 * a trail back up the site (home first, then the parent section), the theme
 * toggle, and an optional reading-progress line for long pages. Before this,
 * each page drew its own bar and no two matched.
 */
export default function PageNav({
  items,
  progress = false,
}: {
  items: PageNavItem[]
  progress?: boolean
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      {progress ? <ReadingProgress /> : null}
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          {items.map((item) => {
            const Icon = ICONS[item.icon]
            // Phones show the icon alone; the label stays in the
            // accessibility tree (sr-only, not hidden) so every item is named.
            const content = (
              <>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only sm:not-sr-only">{item.label}</span>
              </>
            )
            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`${base} border-border bg-background/70 text-muted-foreground transition hover:border-accent/40 hover:text-foreground`}
              >
                {content}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-current="page"
                className={`${base} border-accent/30 bg-accent/5 text-accent`}
              >
                {content}
              </span>
            )
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
