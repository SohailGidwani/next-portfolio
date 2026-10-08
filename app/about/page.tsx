import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import Personal from "@/app/components/Personal"
import PageNav from "@/app/components/PageNav"
import PortraitAssemblyGate from "./PortraitAssemblyGate"
import portrait from "@/public/images/personal/SohailGidwani.jpg"

const values = [
  {
    title: "Evidence over theater",
    body: "A polished demo is useful, but I trust reproducible evaluations, failure cases, and clear limits more. That is why my project pages show the runs that failed as well as the ones that worked.",
  },
  {
    title: "Own the whole path",
    body: "I am happiest moving between model behavior, backend boundaries, data, and the interface. The seams between those layers are usually where the most important problems hide.",
  },
  {
    title: "Make complexity legible",
    body: "Good engineering should leave the next person with a system they can understand. I care about observable workflows, honest naming, and documentation that explains decisions rather than restating code.",
  },
]

export default function AboutPage() {
  return (
    // overflow-x-clip: the game posters scatter past the viewport edge when
    // one opens, and on phones that overflow made the browser zoom the layout
    // viewport out, which knocked the open stage off centre.
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <BreadcrumbStructuredData
        id="about-breadcrumb"
        items={[{ name: "About", item: "/about" }]}
      />

      <PageNav items={[{ label: "Portfolio", icon: "home", href: "/#about" }]} />

      <main id="main-content">
        <section className="border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
            <div className="max-w-3xl">
              <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                About
              </h1>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  I&apos;ve been into computers since I was a kid. I used to tag along to my dad&apos;s office just to play games on his PC, until he got me one at home. Then I watched Iron Man for the first time and couldn&apos;t stop thinking about JARVIS. Was there a person behind it? Was it just code? Or something else? That question is what got me into AI.
                </p>
                <p>
                  IIFL was my first time inside a company. I saw how work really gets done: no one person owns any part of a project, and even the parts I thought were small had a whole team behind them. It was also the first time real people used something I built and told me what they thought.
                </p>
                <p>
                  Now I&apos;m doing my master&apos;s in computer science at USC and medical-AI research at Keck School of Medicine, and I keep building my own projects on the side.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#projects"
                  className="btn-primary"
                >
                  See my work
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href="/documents/Sohail_Gidwani_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Resume
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            <figure
              data-vt-portrait-target
              data-vt-anchor="/"
              className="mx-auto w-full max-w-[340px]"
            >
              <PortraitAssemblyGate />
              <div className="group relative">
                {/* Accent mounting block: slides out from behind the print */}
                <div
                  aria-hidden
                  className="portrait-mount absolute inset-0 translate-x-2.5 translate-y-2.5 bg-accent"
                />
                {/* Registration marks stamp in; the block owns the fourth corner */}
                <span
                  aria-hidden
                  className="portrait-mark absolute -left-2 -top-2 h-3 w-3 origin-top-left border-l border-t border-foreground/40"
                  style={{ animationDelay: "0.5s" }}
                />
                <span
                  aria-hidden
                  className="portrait-mark absolute -right-2 -top-2 h-3 w-3 origin-top-right border-r border-t border-foreground/40"
                  style={{ animationDelay: "0.56s" }}
                />
                <span
                  aria-hidden
                  className="portrait-mark absolute -bottom-2 -left-2 h-3 w-3 origin-bottom-left border-b border-l border-foreground/40"
                  style={{ animationDelay: "0.62s" }}
                />
                <div className="portrait-photo relative aspect-[3/4] overflow-hidden border border-border bg-background">
                  <Image
                    src={portrait}
                    alt="Sohail Gidwani, professional portrait"
                    fill
                    priority
                    sizes="(max-width: 1024px) 340px, 340px"
                    className="object-cover object-[50%_18%] [filter:sepia(0.12)_saturate(1.06)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                  {/* The studio backdrop is a light grey gradient, which reads
                      as a sticker on a near-black page. A cutout is not an
                      option (the vignette runs 72,71,77 to 11,14,23, so keying
                      it would eat hair and shoulders), so the edges are graded
                      into the page instead and the frame does the rest. */}
                  <div aria-hidden className="portrait-vignette pointer-events-none absolute inset-0" />
                </div>
              </div>
              <figcaption className="mt-4">
                <span aria-hidden className="portrait-rule block h-px w-full origin-left bg-border" />
                <div className="portrait-caption flex items-baseline justify-between gap-3 pt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Sohail Gidwani</span>
                  <span className="text-accent">LA · 2026</span>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section-y border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-[2rem] leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[2.75rem]">
              How I work
            </h2>
            {/* Rows, not three equal cards: each principle's name sits beside
                its explanation, which reads as a list of beliefs rather than a
                feature grid. */}
            <div className="mt-10 max-w-4xl divide-y divide-border border-y border-border">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="grid gap-2 py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10 md:py-8"
                >
                  <h3 className="font-display text-xl text-foreground">{value.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{value.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Personal />

        {/* A quiet way out: the page used to stop dead on the last pleasure. */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
              That&apos;s me outside the code. If you want to talk about something you&apos;re building, a research idea, or which Spider-Man movie is best, I&apos;m always up for it.
            </p>
            <Link href="/#contact" className="link-action mt-5">
              Say hello
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
