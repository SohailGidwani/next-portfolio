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

  it("theme view-transition overrides are scoped, not global", () => {
    const css = read("app/globals.css")
    expect(css).not.toMatch(/^::view-transition-old\(root\),/m)
    expect(css).toContain(":root[data-theme-vt]::view-transition-old(root)")
  })

  it("route transition never animates the initial load", () => {
    const rt = read("app/components/RouteTransition.tsx")
    expect(rt).toContain("firstRender")
  })
})
