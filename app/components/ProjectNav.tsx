"use client"

import Link from "next/link"
import { Home, FolderKanban } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function ProjectNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* The labels are hidden below sm, so without aria-label these read
              as unnamed links to a screen reader on every project page. */}
          <Link
            href="/#projects"
            aria-label="Portfolio"
            className="inline-flex min-h-11 items-center gap-1.5 rounded border border-border bg-background/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:min-h-0"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>
          <Link
            href="/projects"
            aria-label="All projects"
            className="inline-flex min-h-11 items-center gap-1.5 rounded border border-border bg-background/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:min-h-0"
          >
            <FolderKanban className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">All Projects</span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
