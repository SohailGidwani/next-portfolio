export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[320px] w-[320px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-20%] left-[-12%] h-[320px] w-[320px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 grain" />
      </div>

      {/* Navbar skeleton */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="h-8 w-24 rounded-md bg-muted shimmer" />
          <div className="hidden gap-6 md:flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 rounded-md bg-muted shimmer" />
            ))}
          </div>
          <div className="h-9 w-9 rounded-full bg-muted shimmer" />
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="w-full max-w-3xl space-y-8 text-center">
          {/* Signal stack skeleton */}
          <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-muted shimmer" />
            ))}
          </div>

          {/* Headline skeleton */}
          <div className="space-y-4">
            <div className="mx-auto h-12 w-3/4 rounded-lg bg-muted shimmer sm:h-16" />
            <div className="mx-auto h-12 w-1/2 rounded-lg bg-muted shimmer sm:h-16" />
          </div>

          {/* Subheadline skeleton */}
          <div className="mx-auto max-w-xl space-y-2">
            <div className="mx-auto h-5 w-full rounded-md bg-muted shimmer" />
            <div className="mx-auto h-5 w-4/5 rounded-md bg-muted shimmer" />
          </div>

          {/* CTA buttons skeleton */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="h-12 w-36 rounded-full bg-muted shimmer" />
            <div className="h-12 w-32 rounded-full bg-muted shimmer" />
          </div>

          {/* Social links skeleton */}
          <div className="flex justify-center gap-4 pt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-muted shimmer" />
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 shadow-lg backdrop-blur-sm">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          <span className="ml-2 text-xs text-muted-foreground">Loading</span>
        </div>
      </div>
    </div>
  )
}
