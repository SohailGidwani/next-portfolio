'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[320px] w-[320px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.16),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-20%] left-[-12%] h-[320px] w-[320px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 grain" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          {/* Error Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              Something went wrong
            </h1>
            <p className="text-base text-muted-foreground">
              Don't worry, it's not you. An unexpected error occurred while loading this page.
            </p>
          </div>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card/80 p-4 text-left">
              <p className="text-xs font-mono text-red-500">
                {error.message || 'Unknown error'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground">
            If this problem persists, please{' '}
            <a
              href="mailto:sohailgidwani15@gmail.com"
              className="text-primary underline-offset-4 hover:underline"
            >
              contact me
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  )
}
