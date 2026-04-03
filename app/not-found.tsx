"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <title>Page Not Found — Sohail Gidwani</title>
      <meta name="robots" content="noindex, nofollow" />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display italic text-[8rem] sm:text-[12rem] leading-none text-white/[0.06]">
            404
          </h1>
          <p className="mt-2 font-display italic text-2xl sm:text-3xl text-white">
            This page drifted off course.
          </p>
          <p className="mt-4 font-body text-sm text-white/30 max-w-md mx-auto">
            The page you&apos;re looking for isn&apos;t available. Let&apos;s get you back.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full border border-white/[0.12] bg-white/[0.05] px-6 py-2.5 font-body text-sm font-medium text-white transition hover:bg-white/[0.1]"
            >
              Back to home
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/[0.06] px-6 py-2.5 font-body text-sm text-white/40 transition hover:text-white/60 hover:border-white/[0.12]"
            >
              View projects
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
