"use client"

import { useState } from "react"
import { ExternalLink, Loader2, MonitorPlay } from "lucide-react"

/**
 * Embeds the hosted Portage dashboard (a Next.js app) inside the project page.
 *
 * ── HOW TO ENABLE (after Phase 8 hosting is live) ──────────────────────────
 * 1. Set PORTAGE_DEMO_URL below to the deployed origin
 *    (e.g. "https://portage.yourdomain.com").
 * 2. In next.config.mjs, the Content-Security-Policy currently sets
 *    `frame-src 'none'`, which blocks ALL iframes. Change it to allow the
 *    demo origin, e.g.:  "frame-src https://portage.yourdomain.com"
 *    (a ready-to-swap line is already commented there).
 * 3. The Portage deployment itself must allow being framed by this site:
 *    it must NOT send `X-Frame-Options: DENY`, and if it sets a CSP it needs
 *    `frame-ancestors https://sohailgidwani.app`.
 * 4. Uncomment the <LiveDemo /> usage in app/projects/portage/page.tsx
 *    (and optionally the `demo` field in app/data/projects.ts for the
 *    "Live" chips on the project cards).
 * ────────────────────────────────────────────────────────────────────────────
 */
export const PORTAGE_DEMO_URL = "https://PORTAGE_DEMO_URL_NOT_SET_YET"

export default function LiveDemo() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <MonitorPlay className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            live demo — portage dashboard
          </span>
        </div>
        <a
          href={PORTAGE_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition hover:text-foreground"
        >
          Open full screen
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="relative aspect-[16/10] w-full bg-background">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]">loading live dashboard…</p>
          </div>
        )}
        <iframe
          src={PORTAGE_DEMO_URL}
          title="Portage live dashboard"
          className="h-full w-full border-0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="border-t border-border px-4 py-2.5">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          Demo limits apply: GitHub sign-in, per-user concurrency + daily job quota, per-job LLM cost
          ceiling. Eval leaderboard is public.
        </p>
      </div>
    </div>
  )
}
