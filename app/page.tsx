"use client"

import { useState, useCallback } from "react"
import Preloader from "./components/Preloader"
import ScrollEngine from "./components/scroll/ScrollEngine"
import PortfolioContent from "./components/PortfolioContent"
import SkipLink from "./components/SkipLink"
import KeyboardShortcuts from "./components/KeyboardShortcuts"
import ProjectStructuredData from "./components/ProjectStructuredData"
import FAQStructuredData from "./components/FAQStructuredData"
import BreadcrumbStructuredData from "./components/BreadcrumbStructuredData"

export default function Portfolio() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  return (
    <>
      <SkipLink />
      <ProjectStructuredData />
      <FAQStructuredData />
      <BreadcrumbStructuredData />
      <KeyboardShortcuts />
      <Preloader onComplete={handlePreloaderComplete} />

      {preloaderDone && (
        <ScrollEngine>
          <PortfolioContent />
        </ScrollEngine>
      )}
    </>
  )
}
