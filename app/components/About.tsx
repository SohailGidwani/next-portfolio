import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import AboutPortrait from "./AboutPortrait"
import SectionHeading from "./SectionHeading"

export default function About() {
  return (
    <section id="about" className="section-y">
      <div className="container mx-auto px-4">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div className="max-w-3xl space-y-6">
            <SectionHeading eyebrow="About">
              Building AI systems that work in production, not just in demos.
            </SectionHeading>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I&apos;m an <strong className="font-semibold text-foreground">AI/ML engineer</strong> who likes owning the whole path from an uncertain idea to a system people can inspect and use. My work spans agentic tooling, multimodal research, retrieval systems, and the product surfaces around them.
              </p>
              <p>
                I&apos;m currently pursuing an M.S. in Computer Science at USC while working on medical-AI research at Keck. Before that, I shipped internal AI products at IIFL and helped build an agent platform at Insaito.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded border border-border bg-card/80 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-accent/50"
            >
              Want to know more about me?
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <AboutPortrait />
        </div>
      </div>
    </section>
  )
}
