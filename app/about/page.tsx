import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import Personal from "@/app/components/Personal"
import ThemeToggle from "@/app/components/ThemeToggle"
import portrait from "@/public/images/personal/SohailGidwani.png"

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
    <div className="min-h-screen bg-background text-foreground">
      <BreadcrumbStructuredData
        id="about-breadcrumb"
        items={[{ name: "About", item: "/about" }]}
      />

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 rounded border border-border bg-card/80 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Portfolio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content">
        <section className="border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                About
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                I like difficult systems and plain explanations.
              </h1>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  I&apos;m Sohail, an AI/ML engineer and M.S. Computer Science student at USC. I work on systems where model behavior has to meet real software constraints: autonomous code migration, multimodal medical-AI research, retrieval pipelines, and the interfaces that make those systems usable.
                </p>
                <p>
                  I started my career at IIFL building internal AI products for employees and support teams. That experience shaped how I think about applied AI: the model is only one part of the product. Reliability, permissions, observability, and a clear fallback matter just as much.
                </p>
                <p>
                  At Keck School of Medicine of USC, I now work across imaging, clinical data, multimodal learning, and retrieval-augmented VQA. Outside research, I keep building tools that let me test ideas end to end instead of stopping at a notebook.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-2 rounded bg-foreground px-5 py-3 text-sm font-semibold text-background"
                >
                  See my work
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href="/documents/Sohail_Gidwani_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                >
                  Resume
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            <figure className="mx-auto w-full max-w-[340px]">
              <div className="relative aspect-[3/4] overflow-hidden border border-foreground/20 bg-background">
                <Image
                  src={portrait}
                  alt="Sohail Gidwani"
                  fill
                  priority
                  sizes="(max-width: 1024px) 340px, 340px"
                  className="object-cover object-[50%_18%]"
                />
              </div>
            </figure>
          </div>
        </section>

        <section className="section-y border-b border-border">
          <div className="container mx-auto px-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              How I work
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              The principles behind the projects.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map((value, index) => (
                <article
                  key={value.title}
                  className="border-t-2 border-accent/50 bg-card/60 p-5"
                >
                  <p className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-foreground">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Personal />
      </main>
    </div>
  )
}
