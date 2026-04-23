import AboutPortrait from "./AboutPortrait"

export default function About() {
  return (
    <section id="about" className="section-y">
      <div className="container mx-auto px-4">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div className="animate-in-view max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">About</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Building AI systems that work in production, not just in demos.
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I&apos;m an <strong className="font-semibold text-foreground">AI engineer</strong> and full-stack developer. I&apos;ve worked on everything from{" "}
                <strong className="font-semibold text-foreground">RAG pipelines</strong> and <strong className="font-semibold text-foreground">LLM integrations</strong> to React frontends and Flask APIs. What I care about most is taking something complex and making it feel simple for the person using it.
              </p>
              <p>
                I joined IIFL as a new grad and within months was building and deploying{" "}
                <strong className="font-semibold text-foreground">AI-powered apps</strong> used by real employees across the company: RAG chatbots, fraud detection, and automated support, all in{" "}
                <strong className="font-semibold text-foreground">production</strong>. Ambiguous problems don&apos;t scare me. If anything, those are the ones I find most interesting.
              </p>
              <p>
                <strong className="font-semibold text-foreground">End-to-end ownership</strong> is how I work best. I built a{" "}
                <strong className="font-semibold text-foreground">multi-modal Alzheimer&apos;s prediction pipeline</strong> from data preprocessing through model training to calibration analysis, all as a single contributor.{" "}
                <strong className="font-semibold text-foreground">Shipping under pressure</strong> is where I&apos;ve been tested, winning a hackathon at IIFL with an AI chatbot built in{" "}
                <strong className="font-semibold text-foreground">under 36 hours</strong>. <strong className="font-semibold text-foreground">Cross-stack fluency</strong> lets me move between{" "}
                <strong className="font-semibold text-foreground">PyTorch</strong> research code and production <strong className="font-semibold text-foreground">Next.js</strong> apps in the same sprint.
              </p>
            </div>
          </div>
          <AboutPortrait />
        </div>
      </div>
    </section>
  )
}
