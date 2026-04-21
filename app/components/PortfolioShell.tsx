"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "react-hot-toast"
import Navbar from "./Navbar"

const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false })
const GuidedTour = dynamic(() => import("./GuidedTour"), { ssr: false })
const KeyboardShortcuts = dynamic(() => import("./KeyboardShortcuts"), { ssr: false })
const BackToTop = dynamic(() => import("./BackToTop"), { ssr: false })
const AmbientBackground = dynamic(() => import("./AmbientBackground"))

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground />
      <Navbar />
      {children}
      <Toaster position="bottom-right" />
      <BackToTop />
      <CommandPalette />
      <KeyboardShortcuts />
      <GuidedTour />
    </div>
  )
}
