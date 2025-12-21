export default function LoadingBlogsList() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="border-b border-border bg-card/60 backdrop-blur py-20">
        <div className="container mx-auto px-4">
          <div className="h-6 w-40 mb-6 bg-muted rounded animate-pulse" />
          <div className="h-10 md:h-16 w-3/4 md:w-2/3 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card/80 p-6">
              <div className="h-48 rounded-2xl bg-muted shimmer" />
              <div className="mt-6 space-y-3">
                <div className="h-6 w-3/4 bg-muted rounded shimmer" />
                <div className="h-4 w-full bg-muted rounded shimmer" />
                <div className="h-4 w-5/6 bg-muted rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
