'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileQuestion, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import ProjectNav from '@/app/components/ProjectNav'

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
      <ProjectNav />

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md space-y-6 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded border-2 border-border bg-card">
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
              className="btn-secondary"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Try again
            </button>
            <Link
              href="/projects"
              className="btn-primary"
            >
              View all projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
