import { PortfolioProvider } from './components/PortfolioProvider'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
// Research spotlight is parked for now — MEMOIR-VLM is already linked from the
// Keck experience card. Re-enable here (between About and Triumphs) if needed.
// import ResearchSpotlight from './components/ResearchSpotlight'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import ProjectStructuredData from './components/ProjectStructuredData'
import BreadcrumbStructuredData from './components/BreadcrumbStructuredData'
import SkipLink from './components/SkipLink'
import PortfolioShell from './components/PortfolioShell'
import SectionDock from './components/SectionDock'

export default function Portfolio() {
  return (
    <>
      <ProjectStructuredData />
      <BreadcrumbStructuredData />

      <PortfolioProvider>
        <SkipLink />
        <PortfolioShell>
          <main id="main-content" className="relative" role="main">
            <Hero />
            <Experience />
            <Projects />
            <Education />
            <Skills />
            <About />
            {/* <ResearchSpotlight /> */}
            <Triumphs />
            <Contact />
          </main>
          <SectionDock />
        </PortfolioShell>
      </PortfolioProvider>
    </>
  )
}
