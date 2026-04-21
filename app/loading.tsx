export default function Loading() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        aria-hidden
        style={{
          backgroundColor: "var(--bg)",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain dark:hidden" aria-hidden />

      {/* Navbar skeleton — matches editorial nav height + container */}
      <div className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex h-full items-center justify-between px-[18px] sm:px-6 md:px-9">
          <div className="h-7 w-24 rounded-sm bg-muted/80 shimmer" />
          <div className="hidden min-[901px]:flex min-[901px]:items-center min-[901px]:gap-5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 w-14 rounded-sm bg-muted/80 shimmer" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-[4.5rem] rounded-pill border border-border/80 bg-muted/40 shimmer sm:block" />
            <div className="hidden h-8 w-[4.5rem] rounded-pill border border-border/80 bg-muted/40 shimmer min-[901px]:block" />
            <div className="h-9 w-9 rounded border border-border bg-muted/40 shimmer min-[901px]:hidden" />
          </div>
        </div>
      </div>

      {/* Hero skeleton — left-aligned on small screens like live hero */}
      <div className="relative flex min-h-screen flex-col px-[18px] pb-16 pt-[calc(var(--nav-h)+1.25rem)] sm:px-6 md:px-9">
        <div className="flex w-full max-w-none flex-1 flex-col justify-center">
          <div className="h-8 w-40 max-w-[85%] rounded-pill border border-border/60 bg-muted/50 shimmer sm:mx-auto md:mx-auto" />

          <div className="mt-6 w-full space-y-3 sm:mt-10 md:mx-auto md:max-w-3xl md:text-center">
            <div className="h-[clamp(2.5rem,12vw,4rem)] w-[92%] max-w-[20rem] rounded-sm bg-muted/80 shimmer sm:mx-auto md:max-w-none" />
            <div className="h-[clamp(2.5rem,12vw,4rem)] w-[88%] max-w-[18rem] rounded-sm bg-muted/80 shimmer sm:mx-auto md:max-w-none" />
          </div>

          <div className="mt-6 max-w-xl space-y-2 sm:mt-8 md:mx-auto md:text-center">
            <div className="h-4 w-full rounded-sm bg-muted/60 shimmer" />
            <div className="h-4 w-[94%] rounded-sm bg-muted/60 shimmer md:mx-auto" />
            <div className="h-4 w-[72%] rounded-sm bg-muted/60 shimmer md:mx-auto" />
          </div>

          <div className="mt-6 flex w-full max-w-3xl flex-wrap gap-2 sm:mt-10 sm:justify-center sm:gap-3 md:mx-auto">
            <div className="h-9 max-sm:basis-[calc((100%-1rem)/3)] flex-1 rounded border border-border/70 bg-muted/50 shimmer sm:h-11 sm:max-w-[11rem] sm:flex-none" />
            <div className="h-9 max-sm:basis-[calc((100%-1rem)/3)] flex-1 rounded border border-border/70 bg-muted/50 shimmer sm:h-11 sm:max-w-[7rem] sm:flex-none" />
            <div className="h-9 max-sm:basis-[calc((100%-1rem)/3)] flex-1 rounded border border-border/70 bg-muted/50 shimmer sm:h-11 sm:max-w-[7.5rem] sm:flex-none" />
            <div className="flex max-sm:basis-full max-sm:justify-center sm:contents">
              <div className="h-9 max-sm:w-[calc((100%-1rem)/3)] rounded border border-border/70 bg-muted/50 shimmer sm:h-11 sm:w-28" />
            </div>
          </div>

          <div className="mt-10 w-full border-t border-border pt-8 sm:mt-14 sm:pt-10 md:mx-auto md:max-w-5xl">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 w-12 rounded-sm bg-muted/80 shimmer" />
                  <div className="h-3 w-full max-w-[10rem] rounded-sm bg-muted/50 shimmer" />
                  {i === 3 ? <div className="h-3 w-24 rounded-sm bg-muted/40 shimmer" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto w-full border-y border-border/80 py-2.5">
          <div className="mx-auto flex max-w-full gap-8 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 w-24 shrink-0 rounded-sm bg-muted/40 shimmer" />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2" role="status" aria-live="polite">
        <div className="flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-2 shadow-lg">
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent" />
          <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Loading</span>
        </div>
      </div>
    </div>
  )
}
