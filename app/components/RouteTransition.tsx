"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Replays a short fade on client-side navigations only. The first render
// (initial page load) never animates, so Web Vitals are untouched.
export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const firstRender = useRef(true)
  const [navCount, setNavCount] = useState(0)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setNavCount((count) => count + 1)
  }, [pathname])

  return (
    <div key={navCount} className={navCount === 0 ? undefined : "soft-nav-enter"}>
      {children}
    </div>
  )
}
