"use client"

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#090909] shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#090909]"
    >
      Skip to main content
    </a>
  )
}
