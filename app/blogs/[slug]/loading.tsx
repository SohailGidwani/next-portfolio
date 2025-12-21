export default function LoadingBlog() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div className="h-4 w-32 rounded bg-muted shimmer" />
          <div className="h-9 w-9 rounded-full border border-border bg-card/80 shimmer" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-4 w-24 rounded bg-muted shimmer" />
          <div className="h-10 w-4/5 rounded bg-muted shimmer" />
          <div className="h-6 w-2/3 rounded bg-muted shimmer" />
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="relative h-64 overflow-hidden rounded-3xl bg-muted shimmer md:h-96" />
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          <div className="h-5 w-full rounded bg-muted shimmer" />
          <div className="h-5 w-11/12 rounded bg-muted shimmer" />
          <div className="h-5 w-10/12 rounded bg-muted shimmer" />
          <div className="h-5 w-9/12 rounded bg-muted shimmer" />
          <div className="h-5 w-8/12 rounded bg-muted shimmer" />
        </div>
      </div>
    </div>
  )
}
