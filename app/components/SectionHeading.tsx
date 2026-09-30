import type { ReactNode } from "react"

// One heading per section: the section's name, set in the display face.
// Primary headings remain visible in server HTML. Motion belongs on supporting
// details, never on text visitors need before hydration.
export default function SectionHeading({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <h2
      id={id}
      // The name the navbar shows while you are in this section (the home
      // page flies the heading up into it; see SectionDock).
      data-section-title={typeof children === "string" ? children : undefined}
      className={`font-display text-[2rem] leading-[1.05] tracking-[-0.02em] text-foreground text-balance sm:text-[2.75rem] ${className ?? ""}`}
    >
      {children}
    </h2>
  )
}
