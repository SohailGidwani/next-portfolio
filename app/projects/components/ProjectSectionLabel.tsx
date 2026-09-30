/**
 * A section heading. `n` is still accepted because the table of contents
 * keys on it, but it is not rendered: the numbering was decoration.
 */
export default function ProjectSectionLabel({
  label,
  id,
}: {
  n?: string
  label: string
  id?: string
}) {
  return (
    <h2
      id={id}
      className="mb-6 scroll-mt-24 font-display text-xl tracking-tight text-foreground sm:text-2xl"
    >
      {label}
    </h2>
  )
}
