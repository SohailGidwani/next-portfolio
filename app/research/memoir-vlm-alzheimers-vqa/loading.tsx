export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header skeleton */}
      <div className="border-b border-border bg-card/40 py-16 sm:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent/30" />
              <div className="h-3 w-28 rounded-sm bg-muted/60 shimmer" />
            </div>
            <div className="space-y-3">
              <div className="h-9 w-4/5 rounded-sm bg-muted/80 shimmer" />
              <div className="h-9 w-3/5 rounded-sm bg-muted/70 shimmer" />
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1.5 border-l-2 border-border pl-4">
                  <div className="h-6 w-16 rounded-sm bg-muted/70 shimmer" />
                  <div className="h-3 w-24 rounded-sm bg-muted/40 shimmer" />
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-4 w-full rounded-sm bg-muted/50 shimmer" />
              <div className="h-4 w-11/12 rounded-sm bg-muted/50 shimmer" />
              <div className="h-4 w-4/6 rounded-sm bg-muted/40 shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl space-y-16">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                {/* Section label */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-6 rounded-sm bg-accent/30 shimmer" />
                    <div className="h-px w-5 bg-border" />
                  </div>
                  <div className="h-7 w-48 rounded-sm bg-muted/70 shimmer" />
                </div>
                {/* Body lines */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-sm bg-muted/50 shimmer" />
                  <div className="h-4 w-11/12 rounded-sm bg-muted/50 shimmer" />
                  <div className="h-4 w-5/6 rounded-sm bg-muted/40 shimmer" />
                  {i % 2 === 0 && (
                    <div className="h-4 w-3/4 rounded-sm bg-muted/40 shimmer" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
