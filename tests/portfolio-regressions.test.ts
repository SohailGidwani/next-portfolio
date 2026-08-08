import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8")

describe("portfolio trust and information architecture", () => {
  it("does not claim the in-progress USC masters as a completed credential", () => {
    const layout = read("app/layout.tsx")

    expect(layout).toContain("Expected May 2027")
    expect(layout).not.toMatch(/hasCredential[\s\S]{0,350}M\.S\. in Computer Science/)
  })

  it("does not publish invisible FAQ structured data", () => {
    const page = read("app/page.tsx")

    expect(page).not.toContain("FAQStructuredData")
  })

  it("orders home as Experience → Projects → Education and removes Personal", () => {
    const page = read("app/page.tsx")

    expect(page.indexOf("<Experience")).toBeGreaterThan(-1)
    expect(page.indexOf("<Projects")).toBeGreaterThan(-1)
    expect(page.indexOf("<Education")).toBeGreaterThan(-1)
    expect(page.indexOf("<Experience")).toBeLessThan(page.indexOf("<Projects"))
    expect(page.indexOf("<Projects")).toBeLessThan(page.indexOf("<Education"))
    expect(page).not.toContain("<Personal")
  })

  it("provides a dedicated About route", () => {
    expect(fs.existsSync(path.join(root, "app/about/page.tsx"))).toBe(true)
    expect(fs.existsSync(path.join(root, "app/about/layout.tsx"))).toBe(true)
  })
})

describe("passive interaction behavior", () => {
  it("does not trigger haptics from the scroll spy and supports tall sections", () => {
    const scrollSpy = read("app/hooks/useScrollSpy.ts")

    expect(scrollSpy).not.toContain("triggerHaptic")
    expect(scrollSpy).toMatch(/threshold:\s*0(?:[,}])/)
  })

  it("honors reduced-motion preferences during programmatic scrolling", () => {
    const smoothScroll = read("app/utils/smoothScroll.ts")

    expect(smoothScroll).toContain("prefers-reduced-motion: reduce")
    expect(smoothScroll).toContain("behavior: \"auto\"")
  })
})

describe("server-first project routes", () => {
  const pages = [
    "app/projects/page.tsx",
    "app/projects/portage/page.tsx",
    "app/projects/knowledge-hub/page.tsx",
    "app/projects/cot-faithfulness/page.tsx",
    "app/projects/image-captioning/page.tsx",
    "app/projects/scribeglobe/page.tsx",
    "app/projects/tech-updates/page.tsx",
  ]

  it.each(pages)("%s is not a top-level client component", (page) => {
    expect(read(page).trimStart().startsWith('"use client"')).toBe(false)
  })

  it("provides shared project actions and an accessible Radix image lightbox", () => {
    const actionsPath = path.join(root, "app/projects/components/ProjectActions.tsx")
    const lightboxPath = path.join(root, "app/components/ProjectImageLightbox.tsx")

    expect(fs.existsSync(actionsPath)).toBe(true)
    expect(fs.existsSync(lightboxPath)).toBe(true)

    const lightbox = fs.readFileSync(lightboxPath, "utf8")
    expect(lightbox).toContain("<Dialog")
    expect(lightbox).toContain("DialogTitle")
    expect(lightbox).toContain('aria-label="Close image viewer"')
  })
})

describe("motion system", () => {
  it("dialog overlay never animates backdrop blur", () => {
    const dialog = read("app/components/ui/dialog.tsx")
    expect(dialog).not.toContain("backdrop-blur")
  })

  it("defines the shared easing tokens", () => {
    const css = read("app/globals.css")
    expect(css).toContain("--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1)")
    expect(css).toContain("--ease-out-soft: cubic-bezier(0.25, 1, 0.5, 1)")
  })

  it("mobile nav is a thumb-reachable bottom sheet without backdrop blur", () => {
    const navbar = read("app/components/Navbar.tsx")
    expect(navbar).not.toContain("backdrop-blur min-[901px]:hidden")
    expect(navbar).toContain("mobile-sheet bottom-0")
    expect(navbar).toContain("safe-area-inset-bottom")
  })

  it("lightbox image transition is disabled while dragging", () => {
    const lightbox = read("app/components/ProjectImageLightbox.tsx")
    expect(lightbox).not.toMatch(/className="object-contain transition-transform/)
    expect(lightbox).toContain("dragging")
  })

  it("the theme switch animates one composited element, never the document", () => {
    // Two mechanisms have been tried and measured on the real page. A circular
    // clip-path reveal over a whole-page view transition snapshot, and then a
    // `:root.theme-fade *` colour crossfade which started 7,600 main-thread
    // transitions: 412ms of style recalc, and four rendered frames in 600ms at
    // 4x CPU throttle. Both stuttered. What matters is not which mechanism is
    // in use but that a switch cannot fan out across the element tree again.
    const css = read("app/globals.css")
    expect(css).not.toContain("data-theme-vt")
    expect(css).not.toMatch(/:root\.theme-fade\s*\*/)
    expect(css).not.toMatch(/\.theme-fade[\s\S]{0,400}transition-property/)

    const fade = read("app/utils/themeFade.ts")
    // Opacity only. Any colour property here would be non-composited and put
    // the work back on the main thread, which is the whole defect.
    expect(fade).not.toMatch(/animate\(\[[\s\S]{0,200}(background|color|filter):/)
    expect(fade).toContain("position:fixed")
    // The Web Animations API does not inherit the global reduced-motion block
    // in globals.css the way a CSS transition did, so the gate must be in JS.
    expect(fade).toContain("prefers-reduced-motion: reduce")

    // Every caller goes through the shared helper: a bare setTheme would swap
    // with no dissolve at all, which is the abruptness this replaced.
    for (const caller of ["app/components/ThemeToggle.tsx", "app/components/CommandPalette.tsx"]) {
      const src = read(caller)
      expect(src).not.toContain("startViewTransition")
      expect(src).toContain("switchTheme(resolvedTheme, setTheme)")
      // setTheme is handed over, never invoked here. A caller that computed
      // its own target would read a resolvedTheme next-themes has not yet
      // committed, so two quick taps would both ask for the same theme and
      // net one flip. switchTheme derives the target from the last request.
      expect(src).not.toMatch(/\bsetTheme\(/)
    }
  })

  it("route transitions can only be started by a click, never on load", () => {
    const vt = read("app/components/ViewTransitions.tsx")
    // The guarantee is structural: the only startViewTransition call lives
    // inside the click handler. React's <ViewTransition> boundary was rejected
    // precisely because it also fired on Suspense reveals during hydration.
    const calls = vt.match(/startViewTransition\(/g) ?? []
    expect(calls).toHaveLength(1)
    expect(vt).toMatch(/const onClick[\s\S]*startViewTransition\(/)
    expect(vt).toContain('addEventListener("click", onClick, true)')
  })

  it("route transition CSS is scoped so it cannot collide with the theme toggle", () => {
    const css = read("app/globals.css")
    expect(css).toContain(":root[data-nav]::view-transition-old(root)")
    expect(css).not.toMatch(/^::view-transition-old\(root\)/m)
  })

  it("the navigation snapshot resolves from a layout effect, not a passive one", () => {
    const vt = read("app/components/ViewTransitions.tsx")
    // Painting is suspended while the browser holds the snapshot, so React
    // never flushes passive effects: useEffect here would leave every
    // navigation waiting on the timeout instead of the route arriving.
    expect(vt).toContain("useIsomorphicLayoutEffect")
    expect(vt).toMatch(/useIsomorphicLayoutEffect\(\(\) => \{[\s\S]*?\}, \[pathname\]\)/)
  })
})
