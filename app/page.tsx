import { PortfolioProvider } from './components/PortfolioProvider'
import { SkillHighlightProvider } from './components/SkillHighlightProvider'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import Personal from './components/Personal'
import ProjectStructuredData from './components/ProjectStructuredData'
import BreadcrumbStructuredData from './components/BreadcrumbStructuredData'
import SectionDivider from './components/SectionDivider'
import SkipLink from './components/SkipLink'
import PortfolioShell from './components/PortfolioShell'

export default function Portfolio() {
  return (
    <>
      <ProjectStructuredData />
      <BreadcrumbStructuredData />

      <PortfolioProvider>
        <SkillHighlightProvider>
        <SkipLink />
        <PortfolioShell>
          <main id="main-content" className="relative" role="main">
            <Hero />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Education />
            <SectionDivider />
            <Experience />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Triumphs />
            <SectionDivider />
            <Personal />
            <SectionDivider />
            <Contact />
          </main>
        </PortfolioShell>
        </SkillHighlightProvider>
      </PortfolioProvider>
    </>
  )
}
