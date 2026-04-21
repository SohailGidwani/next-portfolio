"use client"

export default function ProjectSkeleton() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <div className="border-b border-border bg-card/40 py-16 sm:py-20">
        <div className="container mx-auto px-[18px] sm:px-6 md:px-9">
          <div className="max-w-3xl space-y-4">
            <div className="h-4 w-20 rounded-sm bg-muted/70 shimmer" />
            <div className="h-12 w-full max-w-2xl rounded-sm bg-muted/80 sm:h-14 shimmer" />
            <div className="h-5 w-full max-w-xl rounded-sm bg-muted/60 shimmer" />
            <div className="h-5 w-4/5 max-w-lg rounded-sm bg-muted/50 shimmer" />
          </div>
        </div>
      </div>

      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-[18px] sm:px-6 md:px-9">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 aspect-[21/9] w-full max-w-4xl rounded-md border border-border bg-muted/40 shimmer sm:aspect-[2/1]" />

            <div className="mb-8 space-y-4">
              <div className="h-10 w-full max-w-2xl rounded-sm bg-muted/80 shimmer" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-7 w-[4.5rem] rounded-pill border border-border/80 bg-muted/50 shimmer" />
                ))}
              </div>
            </div>

            <div className="mb-12 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-4 rounded-sm bg-muted/55 shimmer ${i === 4 ? "max-w-xl" : "w-full"}`}
                />
              ))}
            </div>

            <div className="mb-12">
              <div className="mb-5 h-6 w-40 rounded-sm bg-muted/70 shimmer" />
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-md border border-border bg-card p-5"
                  >
                    <div className="h-5 w-3/4 rounded-sm bg-muted/70 shimmer" />
                    <div className="h-3 w-full rounded-sm bg-muted/45 shimmer" />
                    <div className="h-3 w-5/6 rounded-sm bg-muted/45 shimmer" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="h-10 w-32 rounded border border-border bg-muted/50 shimmer" />
              <div className="h-10 w-32 rounded border border-border bg-muted/50 shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
