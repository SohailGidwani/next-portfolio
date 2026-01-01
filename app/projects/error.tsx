'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileQuestion, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Project error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to portfolio
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md space-y-6 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-card">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl text-foreground">Project Not Found</h1>
            <p className="text-base text-muted-foreground">
              The project you're looking for couldn't be loaded.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              View All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
