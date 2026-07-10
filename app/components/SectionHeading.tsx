import type { ReactNode } from "react"

// Primary headings remain visible in server HTML. Motion belongs on supporting
// details, never on text visitors need before hydration.
export default function SectionHeading({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 pb-[0.08em] -mb-[0.08em] font-display text-3xl text-foreground sm:text-4xl">
        {children}
      </h2>
    </div>
  )
}
