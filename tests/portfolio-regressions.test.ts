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

  it("the shared portrait is paired by route and waits for its destination", () => {
    const home = read("app/components/AboutPortrait.tsx")
    const about = read("app/about/page.tsx")
    const vt = read("app/components/ViewTransitions.tsx")
    const css = read("app/globals.css")

    // Both halves of the pair have to exist, and the source names the route it
    // pairs with so the name is only claimed when that is where the click goes.
    expect(home).toContain('data-vt-portrait="/about"')
    expect(about).toContain("data-vt-portrait-target")
    expect(css).toMatch(/\[data-vt-figure="portrait"\][\s\S]{0,80}\[data-vt-portrait-target\]/)

    // The name belongs to the whole print. Naming only the photo left the amber
    // board and caption in the root snapshot, where they scaled away with the
    // page while the photo held still, so the frame came apart from its own
    // picture mid-flight.
    expect(home).toMatch(/<figure\s+data-vt-portrait="\/about"/)
    expect(about).toMatch(/<figure\s+data-vt-portrait-target/)
    expect(css).toMatch(/\[data-vt-portrait-target\] \.portrait-photo\s*\{\s*animation:\s*none/)

    // Measured: the two prints sit 24px and 7% apart, so there is nowhere to
    // travel and the drama has to come from the page instead. It scales about
    // the portrait's own centre, so the move is about this photograph rather
    // than being a generic zoom; a 50% fallback means the origin never landed.
    expect(css).toContain("--vt-origin-x")
    expect(vt).toMatch(/setProperty\("--vt-origin-x"/)
    expect(css).toMatch(/view-transition-old\(root\)\s*\{[\s\S]{0,160}vt-portrait-recede/)
    expect(css).toMatch(/view-transition-new\(root\)\s*\{[\s\S]{0,160}vt-portrait-approach/)

    // The return retraces the way in. Leaving these unmirrored gave a zoom
    // anchored on the photograph going out and a sideways slide coming back.
    expect(css).toMatch(/\[data-vt-zoom="portrait"\]\[data-nav="back"\][\s\S]{0,200}animation-direction:\s*reverse/)

    // Morphing needs a print on both sides; the zoom only needs a point to
    // scale about, which both legs have. One flag for each, or the return leg
    // would claim a name its destination cannot answer and strand the old
    // snapshot unpaired.
    expect(vt).toMatch(/dataset\.vtFigure = "portrait"/)
    expect(vt).toMatch(/dataset\.vtZoom = "portrait"/)
    expect(about).toContain('data-vt-anchor="/"')

    // The print assembles once per page session, never again on traversal.
    // Module scope is the lifetime: it survives client navigation and resets on
    // a real load. Reading it during a server render would leak one visitor's
    // state into another's markup, so both accessors are browser-only.
    const assembly = read("app/utils/portraitAssembly.ts")
    expect(assembly).toMatch(/typeof window !== "undefined"/)
    expect(read("app/components/AboutPortrait.tsx")).toContain("onViewportEnter={markAssembled}")
    expect(read("app/about/PortraitAssemblyGate.tsx")).toContain("useLayoutEffect")
    for (const cls of ["portrait-photo", "portrait-mount", "portrait-mark", "portrait-rule", "portrait-caption"]) {
      expect(css).toContain(`:root[data-portrait-assembled] .${cls}`)
    }

    // Arrival is not the same as having rendered: a route that misses its
    // prefetch shows app/loading.tsx, and a snapshot taken against that
    // skeleton pairs nothing, leaving the old portrait to fade out alone.
    expect(vt).toContain("FIGURE_TARGET")
    expect(vt).toMatch(/querySelector\(FIGURE_TARGET\)/)

    // Left set on purpose after a morph, so it must be cleared before the next
    // capture: a duplicate view-transition-name makes Chrome skip everything.
    expect(vt).toMatch(/delete document\.documentElement\.dataset\.vtFigure/)
    // It must NOT be dropped in cleanup: that would only restart the entrance
    // it suppresses at the moment the transition finishes.
    const cleanup = vt.slice(vt.indexOf("const cleanup"), vt.indexOf("const onClick"))
    expect(cleanup).not.toMatch(/delete[^\n]*vtFigure/)
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

describe("MEMOIR-VLM reflects the accepted paper, not the pre-correction manuscript", () => {
  const dir = "app/research/memoir-vlm-alzheimers-vqa"

  it("reports the corrected model and keeps the leaky numbers out of the headline", () => {
    const page = read(`${dir}/page.tsx`)
    const header = page.slice(page.indexOf("{/* ─── Header ─── */}"), page.indexOf("{/* ─── Content ─── */}"))

    for (const figure of ["68.2%", "91.3%", "78.7%"]) expect(header).toContain(figure)
    // 0.707 / 0.933 had CDR-SB among the inputs; they may only appear in the
    // labeled original column, never as the page's result.
    for (const stale of ["0.707", "0.933", "~70M", "Model params"]) expect(header).not.toContain(stale)
    expect(page).not.toContain("0.865")
    expect(page).not.toContain("0.981")
    expect(page).not.toMatch(/ConfusionMatrix|TrainingChart/)
  })

  it("never lists CDR-SB as an input to the clinical encoder", () => {
    const page = read(`${dir}/page.tsx`)
    const arch = read(`${dir}/components/VLMArchitecture.tsx`)

    expect(page).not.toMatch(/\(CDR-SB, ADAS/)
    expect(page).toContain("4 continuous clinical scores (ADAS-11, ADAS-13, MMSE, MoCA)")
    expect(arch).not.toContain("5 scores")
    expect(arch.match(/4 scores \+ APOE/g)).toHaveLength(2)
  })

  it("labels 94.7% as label exposure and makes the encoder the diagnostic component", () => {
    const page = read(`${dir}/page.tsx`)

    expect(page).toMatch(/94\.7%[\s\S]{0,500}label-exposure artifact/)
    expect(page).toContain("The multimodal encoder performs diagnosis.")
    // Masked diagnosis: Gemma leads, measured against the k-NN tick.
    expect(page).toMatch(/metric: "Diagnosis · masked",[\s\S]{0,300}higher: "gemma",[\s\S]{0,40}reference: 0\.673/)
  })

  it("describes the rerank as top-50, then top-20, then top-5", () => {
    const vqa = read(`${dir}/components/VQAPipeline.tsx`)

    expect(vqa).not.toContain("top-50 → top-5")
    expect(vqa.match(/top-20 → top-5/g)).toHaveLength(2)
  })

  it("marks the paper accepted, not published, with the DOI as text until it resolves", () => {
    const data = read("app/data/research.ts")
    const page = read(`${dir}/page.tsx`)

    expect(data).toMatch(/status: "accepted"/)
    // The card values, not the comment above them that names what was retracted.
    expect(data).not.toMatch(/value: "(0\.933|93\.3%|0\.707|70\.7%|~70M)"/)
    expect(page).toContain('const DOI = "10.3389/fncom.2026.1902258"')
    expect(page).not.toMatch(/href=\{?[`"]https:\/\/doi\.org/)
    // The JSON-LD must not claim a publication date the journal has not set.
    // The property, not the comment explaining its absence.
    expect(page).not.toMatch(/datePublished\s*:/)
  })

  it("has no em dash anywhere in the research routes", () => {
    // Built from its code point so this file never carries the character.
    const emDash = String.fromCharCode(0x2014)
    const files = (fs.readdirSync(path.join(root, "app/research"), { recursive: true }) as string[])
      .filter((f) => /\.tsx?$/.test(f))
    expect(files.length).toBeGreaterThan(5)
    for (const f of files) expect(read(`app/research/${f}`), f).not.toContain(emDash)
    expect(read("app/data/research.ts")).not.toContain(emDash)
  })

  it("keeps every copy outside /research on the corrected numbers", () => {
    const hero = read("app/components/Hero.tsx")
    expect(hero).toContain('text: "91.3%"')
    expect(hero).not.toContain('text: "93.3%"')

    // Resume bullets, the MCP endpoint, and the LLM crawler files repeat the
    // research claims; they drifted once, so pin them with the page.
    for (const file of [
      "app/components/Experience.tsx",
      "app/api/mcp/route.ts",
      "public/llms.txt",
      "public/llms-full.txt",
      "public/resume.json",
    ]) {
      const text = read(file)
      expect(text, file).not.toMatch(/70\.7%|93\.3%|0\.707|0\.933|AUC 0\.981|~70M|[Mm]anuscript submitted|Mistral 7B win/)
      // 94.7% may appear only with the audit that retracted it.
      for (const m of text.matchAll(/94\.7%/g)) {
        expect(text.slice(m.index, m.index + 200), file).toMatch(/label/)
      }
    }
  })
})
