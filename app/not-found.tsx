import Link from "next/link"
import type { Metadata } from "next"
import PageNav from "@/app/components/PageNav"
import GuidingWind from "@/app/components/GuidingWind"

export const metadata: Metadata = {
  title: "Page Not Found | Sohail Gidwani",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    // isolate: the wind canvas sits at -z-10, above this background and
    // under the content.
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <GuidingWind />
      <PageNav items={[{ label: "Portfolio", icon: "home", href: "/" }]} />
      <main className="flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 py-16">
        {/* Decoration at 1.2:1 against the page: the h1 carries the message. */}
        <p aria-hidden="true" className="hero-enter font-mono text-[clamp(6rem,20vw,10rem)] font-medium leading-none text-border select-none">
          404
        </p>

        <h1 className="hero-enter mt-8 max-w-sm text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl" style={{ animationDelay: "0.16s" }}>
          This page doesn&apos;t exist.
        </h1>
        <p className="hero-enter mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground" style={{ animationDelay: "0.2s" }}>
          The URL you followed is either broken or the page has been removed.
        </p>

        <div className="hero-enter mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.24s" }}>
          <Link
            href="/"
            className="btn-primary"
            data-wind-target
          >
            Back to home
          </Link>
          <Link
            href="/projects"
            className="btn-secondary"
          >
            View projects
          </Link>
        </div>

        <div className="hero-enter mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground" style={{ animationDelay: "0.3s" }}>
          {[
            { href: "/#about", label: "About" },
            { href: "/#experience", label: "Experience" },
            { href: "/#skills", label: "Skills" },
            { href: "/#contact", label: "Contact" },
            { href: "/research/memoir-vlm-alzheimers-vqa", label: "Research" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="transition hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
