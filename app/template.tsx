export default function Template({ children }: { children: React.ReactNode }) {
  // Remounts on every route change, giving each page a soft fade-in
  // instead of a hard cut. Opacity only: transforms here would turn this
  // div into the containing block for fixed-position children (navbar).
  return <div className="page-enter">{children}</div>
}
