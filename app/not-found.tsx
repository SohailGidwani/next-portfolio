import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found | Sohail Gidwani",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
      <p className="font-mono text-[clamp(6rem,20vw,10rem)] font-bold leading-none text-border select-none">
        404
      </p>

      <div className="mt-8 flex items-center gap-3">
        {/* <div className="h-px w-8 bg-accent" /> */}
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          Page not found
        </span>
      </div>

      <h1 className="mt-4 max-w-sm text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        The URL you followed is either broken or the page has been removed.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
        >
          Back to home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
        >
          View projects
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {[
          { href: "/#about", label: "About" },
          { href: "/#experience", label: "Experience" },
          { href: "/#skills", label: "Skills" },
          { href: "/#contact", label: "Contact" },
          { href: "/research/multimodal-alzheimers-vqa", label: "Research" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className="transition hover:text-foreground">
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
