import type { Metadata } from "next"
import { PortfolioProvider } from "../components/PortfolioProvider"
import { SkillHighlightProvider } from "../components/SkillHighlightProvider"
import HeroMasked from "../components/hero-lab/HeroMasked"
import Experience from "../components/Experience"
import Projects from "../components/Projects"
import Education from "../components/Education"
import Skills from "../components/Skills"
import About from "../components/About"
import Triumphs from "../components/Triumphs"
import Contact from "../components/Contact"
import SkipLink from "../components/SkipLink"
import PortfolioShell from "../components/PortfolioShell"

// A preview of a different hero on the same page, to judge beside the live
// one. Kept out of search and the sitemap; delete this route once decided.
export const metadata: Metadata = {
  title: "Hero preview | Sohail Gidwani",
  robots: { index: false, follow: false },
}

export default function HeroLab() {
  return (
    <PortfolioProvider>
      <SkillHighlightProvider>
        <SkipLink />
        <PortfolioShell>
          <main id="main-content" className="relative" role="main">
            <HeroMasked />
            <Experience />
            <Projects />
            <Education />
            <Skills />
            <About />
            <Triumphs />
            <Contact />
          </main>
        </PortfolioShell>
      </SkillHighlightProvider>
    </PortfolioProvider>
  )
}
