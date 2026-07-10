export default function ProjectSectionLabel({
  n,
  label,
  id,
}: {
  n: string
  label: string
  id?: string
}) {
  return (
    <div className="mb-6 scroll-mt-24" id={id}>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {n}
        </span>
        <div className="h-px w-5 bg-border" />
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
        {label}
      </h2>
    </div>
  )
}
