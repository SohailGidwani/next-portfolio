# Portfolio Cinematic Design Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a cinematic, scroll-driven experience with monochrome design, WebGL iridescent shaders, and Apple-style scroll hijacking.

**Architecture:** Next.js 16 App Router stays as-is. Add React Three Fiber for WebGL, GSAP ScrollTrigger for scroll pinning/scrubbing. Keep Framer Motion for UI micro-animations. Replace the warm light/dark theme with a dark-only monochrome system. All color comes exclusively from WebGL iridescent shaders.

**Tech Stack:** Next.js 16, React 19, TypeScript, @react-three/fiber, @react-three/drei, Three.js, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS 3

**Spec:** `docs/superpowers/specs/2026-04-03-portfolio-design-overhaul.md`

---

## File Structure

### New Files

```
app/components/webgl/
├── WebGLCanvas.tsx          — R3F Canvas wrapper with fallback detection, client-only
├── LiquidGlassShader.tsx    — Hero + Contact background shader material
├── MorphTransition.tsx      — Project slide transition shader
├── GradientMesh.tsx         — Experience section subtle background shader
├── shaders/
│   ├── fullscreen.vert      — Shared fullscreen quad vertex shader (used by all shaders)
│   ├── liquidGlass.frag     — GLSL fragment shader for liquid glass
│   ├── morphTransition.frag — GLSL fragment shader for morph effect
│   └── gradientMesh.frag    — GLSL fragment shader for gradient mesh

app/components/scroll/
├── ScrollEngine.tsx         — GSAP ScrollTrigger initialization + context provider
├── PinnedSection.tsx        — Wrapper that registers a section for pinning

app/components/
├── MinimalNav.tsx           — Thin fixed nav with section indicator + overlay menu
├── Preloader.tsx            — Loading screen while shaders compile
├── TextDecode.tsx           — Character-decode animation for hero name
├── ProjectSlide.tsx         — Individual project in pinned showcase
├── FloatingBadge.tsx        — Glass pill badge for skills section
├── AnimatedTimeline.tsx     — Scroll-driven experience timeline (replaces current approach)
├── PortfolioContent.tsx     — Inner composition that consumes ScrollEngine context
```

### Modified Files

```
app/layout.tsx               — New fonts (Instrument Serif, Geist, Geist Mono), remove ThemeProvider, dark-only, update theme-color
app/page.tsx                 — Complete rewrite: new composition with ScrollEngine, WebGL, pinned sections
app/globals.css              — Monochrome design tokens, remove light/dark theme, new glass utilities
tailwind.config.ts           — New font families, monochrome colors, updated tokens
package.json                 — New dependencies
app/components/Hero.tsx      — Full rewrite: WebGL background, TextDecode, GSAP pin
app/components/About.tsx     — Rewrite: single-viewport glass card layout
app/components/Education.tsx — Rewrite: display typography, staggered reveal
app/components/Experience.tsx— Rewrite: pinned animated timeline
app/components/Skills.tsx    — Rewrite: floating glass badges
app/components/Projects.tsx  — Rewrite: pinned slideshow with shader transitions
app/components/Triumphs.tsx  — Restyle: glass card grid with animated counters
app/components/Personal.tsx  — Rewrite: scattered asymmetric layout
app/components/Contact.tsx   — Rewrite: dramatic typography, shader background
app/components/CommandPalette.tsx — Restyle to monochrome
app/components/BackToTop.tsx — Restyle to monochrome
app/components/SkipLink.tsx  — Update colors
app/not-found.tsx            — Restyle to monochrome
app/projects/page.tsx        — Restyle to monochrome system
app/blogs/page.tsx           — Restyle to monochrome system
app/blogs/layout.tsx         — Restyle to monochrome system
```

### Files to Delete

```
app/components/ThemeToggle.tsx
app/components/ThemeProvider.tsx
app/components/AmbientBackground.tsx
app/components/ShootingStars.tsx
app/components/GuidedTour.tsx
app/components/SectionDivider.tsx
app/components/ScrollAnimation.tsx  — Replaced by GSAP-driven scroll animations
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install R3F, Three.js, GSAP**

```bash
npm install @react-three/fiber @react-three/drei three gsap @gsap/react
npm install -D @types/three
```

- [ ] **Step 2: Verify installation**

```bash
npm ls @react-three/fiber three gsap
```

Expected: all three packages listed without errors

- [ ] **Step 3: Verify the app still builds**

```bash
npm run build
```

Expected: build succeeds (new packages are installed but not yet used)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-three-fiber, drei, three, gsap for design overhaul"
```

---

## Task 2: Foundation — Design Tokens, Typography, Tailwind Config

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace CSS design tokens in `app/globals.css`**

Replace the entire `@layer base` block. Remove the `:root` and `.dark` theme variables. Replace with a single monochrome set:

```css
@layer base {
  :root {
    --void: 0 0% 0%;
    --background: 0 0% 3.5%;
    --surface: 0 0% 7.8%;
    --elevated: 0 0% 12%;
    --border: 0 0% 16.5%;
    --muted: 0 0% 33%;
    --foreground: 0 0% 91%;
    --white: 0 0% 100%;

    --radius: 1rem;

    /* Compatibility aliases for existing Tailwind config */
    --card: 0 0% 7.8%;
    --card-foreground: 0 0% 91%;
    --popover: 0 0% 7.8%;
    --popover-foreground: 0 0% 91%;
    --primary: 0 0% 100%;
    --primary-foreground: 0 0% 3.5%;
    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 91%;
    --muted-foreground: 0 0% 33%;
    --accent: 0 0% 100%;
    --accent-foreground: 0 0% 3.5%;
    --destructive: 0 72% 44%;
    --destructive-foreground: 0 0% 100%;
    --input: 0 0% 16.5%;
    --ring: 0 0% 100%;
  }

  * {
    @apply border-border;
  }

  html {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overscroll-behavior-y: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
}
```

Remove the `.dark` block entirely, remove `.grain`, remove `.tour-highlight`, remove `tour-pulse` and `tour-dialog-glow` keyframes. Keep `@media (prefers-reduced-motion)`, print styles, focus styles, skip link styles, and shimmer animation.

Add new utility classes after the `@layer base` block:

```css
@layer components {
  .glass {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .glass-elevated {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .text-gradient-iridescent {
    background: linear-gradient(90deg, #ff6b6b, #6b6bff, #6bffb8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

- [ ] **Step 2: Update `tailwind.config.ts`**

Update the font families to match new typography. Remove `darkMode: ["class"]` since we're dark-only. Add new token colors:

```ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        void: "hsl(var(--void))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        elevated: "hsl(var(--elevated))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        card: "0 20px 60px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 28px 80px rgba(0, 0, 0, 0.6)",
        glow: "0 0 40px rgba(255, 255, 255, 0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

- [ ] **Step 3: Update `app/layout.tsx` fonts and remove ThemeProvider**

Replace font imports:

```tsx
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google'
```

Note: `Geist` and `Geist_Mono` may need to come from `next/font/local` if not available on Google Fonts. Check availability first — if not on Google Fonts, use `@fontsource/geist` or `next/font/local` pointing to files downloaded from https://vercel.com/font. As a fallback, use `Inter` for body and `JetBrains_Mono` for mono.

Configure:
```tsx
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-display',
})

// If Geist is available via next/font/google:
const body = Geist({
  subsets: ['latin'],
  variable: '--font-body',
})

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
```

Remove `ThemeProvider` import and wrapper. Update the `<body>` class and remove `suppressHydrationWarning` from `<html>`. Change `theme-color` meta to `#090909`. The body becomes:

```tsx
<body className={`${body.variable} ${display.variable} ${mono.variable} font-body`}>
  {children}
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build may have some errors from components referencing removed dark theme — that's okay, we're about to rewrite them. As long as the font/config changes don't break, proceed.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tailwind.config.ts app/layout.tsx
git commit -m "foundation: monochrome design tokens, new typography, remove theme toggle"
```

---

## Task 3: Delete Deprecated Components

**Files:**
- Delete: `app/components/ThemeToggle.tsx`
- Delete: `app/components/ThemeProvider.tsx`
- Delete: `app/components/AmbientBackground.tsx`
- Delete: `app/components/ShootingStars.tsx`
- Delete: `app/components/GuidedTour.tsx`
- Delete: `app/components/SectionDivider.tsx`
- Delete: `app/components/ScrollAnimation.tsx`
- Modify: `app/page.tsx` (remove imports/usages)

- [ ] **Step 1: Delete the component files**

```bash
rm app/components/ThemeToggle.tsx
rm app/components/ThemeProvider.tsx
rm app/components/AmbientBackground.tsx
rm app/components/ShootingStars.tsx
rm app/components/GuidedTour.tsx
rm app/components/SectionDivider.tsx
rm app/components/ScrollAnimation.tsx
```

- [ ] **Step 2: Strip `app/page.tsx` to a minimal working state**

Replace with a temporary slim version that just mounts all sections without the deleted components. Remove all tour logic, AmbientBackground, SectionDivider, GuidedTour imports and usages. Keep the section components for now (they'll be rewritten individually in later tasks):

```tsx
"use client"

import { useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import Personal from './components/Personal'
import ProjectStructuredData from './components/ProjectStructuredData'
import FAQStructuredData from './components/FAQStructuredData'
import BreadcrumbStructuredData from './components/BreadcrumbStructuredData'
import { Toaster } from 'react-hot-toast'
import CommandPalette from './components/CommandPalette'
import SkipLink from './components/SkipLink'
import BackToTop from './components/BackToTop'
import KeyboardShortcuts from './components/KeyboardShortcuts'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <>
      <SkipLink />
      <ProjectStructuredData />
      <FAQStructuredData />
      <BreadcrumbStructuredData />
      <CommandPalette onNavigate={setActiveSection} />
      <KeyboardShortcuts />

      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <main id="main-content" className="relative" role="main">
          <Hero setActiveSection={setActiveSection} />
          <About setActiveSection={setActiveSection} />
          <Education setActiveSection={setActiveSection} />
          <Experience setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <Skills setActiveSection={setActiveSection} onSkillHover={setActiveSkill} />
          <Projects setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <Triumphs setActiveSection={setActiveSection} />
          <Personal setActiveSection={setActiveSection} />
          <Contact setActiveSection={setActiveSection} />
        </main>
        <Toaster position="bottom-right" />
        <BackToTop />
      </div>
    </>
  )
}
```

- [ ] **Step 3: Remove any imports of `ScrollAnimation` in section components**

Search all components for `ScrollAnimation` imports and replace the `<ScrollAnimation>` wrappers with plain `<div>` or `<motion.div>` tags, keeping the inner content. Check each section component: `About.tsx`, `Education.tsx`, `Experience.tsx`, `Skills.tsx`, `Projects.tsx`, `Triumphs.tsx`, `Personal.tsx`, `Contact.tsx`.

```bash
rg "ScrollAnimation" app/components/ --files-with-matches
```

For each file found, remove the import and replace `<ScrollAnimation variant="...">` wrappers with `<div>`.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build succeeds. The site will look broken visually (no theme provider, missing ambient background) but should compile.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "cleanup: remove deprecated components (theme toggle, ambient bg, guided tour, etc)"
```

---

## Task 4: Scroll Engine — GSAP ScrollTrigger Setup

**Files:**
- Create: `app/components/scroll/ScrollEngine.tsx`
- Create: `app/components/scroll/PinnedSection.tsx`

- [ ] **Step 1: Create `app/components/scroll/ScrollEngine.tsx`**

This component initializes GSAP + ScrollTrigger and provides scroll context:

```tsx
"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollContextType {
  isReady: boolean
  activeSection: string
  setActiveSection: (id: string) => void
  registerSection: (id: string, element: HTMLElement) => void
}

const ScrollContext = createContext<ScrollContextType>({
  isReady: false,
  activeSection: 'hero',
  setActiveSection: () => {},
  registerSection: () => {},
})

export function useScrollEngine() {
  return useContext(ScrollContext)
}

export default function ScrollEngine({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('hero')
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())

  const [registrationVersion, setRegistrationVersion] = useState(0)
  const spyTriggersRef = useRef<ScrollTrigger[]>([])

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element)
    setRegistrationVersion(v => v + 1)
  }, [])

  // Initialize GSAP defaults once
  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    })
  }, [])

  // Rebuild section-spy triggers whenever registrations change
  useEffect(() => {
    // Kill only our spy triggers, not other triggers (pinning etc.)
    spyTriggersRef.current.forEach(t => t.kill())
    spyTriggersRef.current = []

    sectionsRef.current.forEach((element, id) => {
      spyTriggersRef.current.push(
        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
      )
    })

    return () => {
      spyTriggersRef.current.forEach(t => t.kill())
      spyTriggersRef.current = []
    }
  }, [registrationVersion])

  return (
    <ScrollContext.Provider value={{ isReady: true, activeSection, setActiveSection, registerSection }}>
      {children}
    </ScrollContext.Provider>
  )
}
```

Each section component should call `registerSection(id, ref)` inside a `useEffect` to register itself. The `MinimalNav` and `CommandPalette` consume `activeSection` from this context. The `setActiveSection` is also exposed for programmatic navigation (CommandPalette's `onNavigate`).

- [ ] **Step 2: Create `app/components/scroll/PinnedSection.tsx`**

A wrapper component that pins its children during scroll:

```tsx
"use client"

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface PinnedSectionProps {
  children: ReactNode
  id: string
  pinSpacerClassName?: string
  scrubDuration?: number // multiplier for viewport height (e.g., 3 = 3x vh of scroll)
  onProgress?: (progress: number, velocity: number) => void
}

export default function PinnedSection({
  children,
  id,
  scrubDuration = 2,
  onProgress,
}: PinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    triggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * scrubDuration}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const velocity = Math.min(Math.abs(self.getVelocity()) / 1000, 1)
        onProgress?.(self.progress, velocity)
      },
    })

    return () => {
      triggerRef.current?.kill()
    }
  }, [scrubDuration, onProgress])

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: builds fine — new components exist but aren't mounted yet.

- [ ] **Step 4: Commit**

```bash
git add app/components/scroll/
git commit -m "feat: add ScrollEngine and PinnedSection for GSAP scroll hijacking"
```

---

## Task 5: WebGL Canvas Wrapper

**Files:**
- Create: `app/components/webgl/WebGLCanvas.tsx`

- [ ] **Step 1: Create `app/components/webgl/WebGLCanvas.tsx`**

Client-only R3F canvas with WebGL detection and fallback:

```tsx
"use client"

import { Suspense, useEffect, useState, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'

interface WebGLCanvasProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    )
  } catch {
    return false
  }
}

export default function WebGLCanvas({ children, className, fallback }: WebGLCanvasProps) {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setSupported(detectWebGL())
  }, [])

  // No WebGL — signal preloader so it doesn't stall
  useEffect(() => {
    if (supported === false) {
      window.dispatchEvent(new Event('webgl-ready'))
    }
  }, [supported])

  if (supported === null) return null
  if (!supported) return fallback ?? null

  return (
    <Canvas
      className={className}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={() => {
        window.dispatchEvent(new Event('webgl-ready'))
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/components/webgl/
git commit -m "feat: add WebGLCanvas wrapper with fallback detection"
```

---

## Task 6: Liquid Glass Shader (Hero + Contact)

**Files:**
- Create: `app/components/webgl/shaders/fullscreen.vert` (shared vertex shader)
- Create: `app/components/webgl/shaders/liquidGlass.frag`
- Create: `app/components/webgl/LiquidGlassShader.tsx`

- [ ] **Step 1: Create shared vertex shader `app/components/webgl/shaders/fullscreen.vert`**

Shared by all fullscreen quad shaders:

```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Create fragment shader `app/components/webgl/shaders/liquidGlass.frag`**

Iridescent liquid glass distortion — reacts to scroll progress and time:

```glsl
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uScrollProgress;
uniform float uVelocity;
uniform vec2 uResolution;

#define PI 3.14159265359

// Simplex-style noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 iridescence(float angle) {
  float r = sin(angle) * 0.5 + 0.5;
  float g = sin(angle + PI * 2.0 / 3.0) * 0.5 + 0.5;
  float b = sin(angle + PI * 4.0 / 3.0) * 0.5 + 0.5;
  return vec3(r, g, b);
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 0.3;
  float scroll = uScrollProgress;

  // Distortion strength: decreases with scroll progress, increases with velocity
  float baseStrength = mix(0.08, 0.02, scroll);
  float velocityBoost = uVelocity * 0.1;
  float distortionStrength = baseStrength + velocityBoost;

  // Noise-based distortion
  float n1 = snoise(uv * 3.0 + time * 0.5);
  float n2 = snoise(uv * 5.0 - time * 0.3);
  vec2 distortion = vec2(n1, n2) * distortionStrength;

  vec2 distortedUv = uv + distortion;

  // Iridescent color based on distortion angle
  float angle = atan(distortion.y, distortion.x) + time * 0.5;
  vec3 iriColor = iridescence(angle * 3.0);

  // Brightness from noise
  float brightness = snoise(distortedUv * 2.0 + time * 0.2) * 0.5 + 0.5;
  brightness = pow(brightness, 2.0);

  // Very subtle — iridescent glow on near-black
  float alpha = brightness * mix(0.15, 0.06, scroll);
  vec3 color = iriColor * brightness;

  gl_FragColor = vec4(color, alpha);
}
```

- [ ] **Step 3: Create `app/components/webgl/LiquidGlassShader.tsx`**

R3F component that renders the shader on a fullscreen plane:

```tsx
"use client"

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import vertexShader from './shaders/fullscreen.vert'
import fragmentShader from './shaders/liquidGlass.frag'

interface LiquidGlassShaderProps {
  scrollProgress?: number
  velocity?: number // normalized 0-1, from ScrollTrigger.getVelocity()
}

export default function LiquidGlassShader({ scrollProgress = 0, velocity = 0 }: LiquidGlassShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uVelocity: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uVelocity.value = velocity
    material.uniforms.uResolution.value.set(viewport.width, viewport.height)
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
```

**Note:** Importing `.vert` and `.frag` files requires webpack/turbopack configuration. If raw imports don't work, inline the shader strings directly in the component file. Add to `next.config.mjs` if needed:

```js
webpack: (config) => {
  config.module.rules.push({
    test: /\.(vert|frag|glsl)$/,
    type: 'asset/source',
  })
  return config
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: builds. If shader imports fail, inline the GLSL as template strings in the TSX file and delete the `.vert`/`.frag` files.

- [ ] **Step 5: Commit**

```bash
git add app/components/webgl/
git commit -m "feat: add liquid glass iridescent shader for hero and contact"
```

---

## Task 7: Preloader Component

**Files:**
- Create: `app/components/Preloader.tsx`

- [ ] **Step 1: Create `app/components/Preloader.tsx`**

Minimal loading screen that shows while R3F/shaders initialize, then reveals content:

```tsx
"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const minDisplayTime = 800
    const skipThreshold = 500
    const start = Date.now()

    const finish = () => {
      const elapsed = Date.now() - start
      // If everything loaded in <500ms, skip preloader entirely (per spec)
      if (elapsed < skipThreshold) {
        setIsLoading(false)
        onComplete()
        return
      }
      const remaining = Math.max(0, minDisplayTime - elapsed)
      setTimeout(() => {
        setIsLoading(false)
        setTimeout(onComplete, 500) // wait for exit animation
      }, remaining)
    }

    // Wait for fonts + WebGL readiness signal
    // The WebGL canvas dispatches a custom 'webgl-ready' event when shaders compile
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const webglReady = new Promise<void>((resolve) => {
      const handler = () => { resolve(); window.removeEventListener('webgl-ready', handler) }
      window.addEventListener('webgl-ready', handler)
      // Fallback: if no WebGL event fires in 3s, proceed anyway
      setTimeout(resolve, 3000)
    })

    Promise.all([fontsReady, webglReady]).then(finish)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090909]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className="font-display italic text-2xl text-white tracking-wide">
              SG
            </div>
            <div className="mt-4 h-px w-12 mx-auto overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-white/40"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/Preloader.tsx
git commit -m "feat: add preloader component with loading animation"
```

---

## Task 8: MinimalNav Component

**Files:**
- Create: `app/components/MinimalNav.tsx`
- Delete (later): `app/components/Navbar.tsx` (keep for reference until MinimalNav is proven)

- [ ] **Step 1: Create `app/components/MinimalNav.tsx`**

Thin fixed nav bar — name left, current section center, hamburger right. Full-screen overlay menu. Hidden during hero:

```tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'triumphs', label: 'Triumphs' },
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
]

interface MinimalNavProps {
  activeSection: string
  visible: boolean
}

export default function MinimalNav({ activeSection, visible }: MinimalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const currentLabel = SECTIONS.find(s => s.id === activeSection)?.label ?? ''

  return (
    <>
      {/* Nav Bar */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          >
            {/* Name */}
            <button
              onClick={() => scrollTo('hero')}
              className="font-display italic text-sm text-white/60 hover:text-white transition-colors"
            >
              Sohail Gidwani
            </button>

            {/* Section Indicator */}
            <span className="text-[10px] font-body font-medium tracking-[4px] uppercase text-white/25">
              {currentLabel}
            </span>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col gap-1.5 p-2 group"
              aria-label="Open menu"
            >
              <span className="block w-5 h-px bg-white/50 group-hover:bg-white transition-colors" />
              <span className="block w-3.5 h-px bg-white/50 group-hover:bg-white transition-colors ml-auto" />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Full-screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] glass-elevated flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-sm tracking-[3px] uppercase"
              aria-label="Close menu"
            >
              Close
            </button>

            <nav className="flex flex-col items-center gap-6">
              {SECTIONS.filter(s => s.id !== 'hero').map((section, i) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => scrollTo(section.id)}
                  className={`font-display italic text-3xl md:text-5xl transition-colors ${
                    activeSection === section.id ? 'text-white' : 'text-white/20 hover:text-white/60'
                  }`}
                >
                  {section.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/MinimalNav.tsx
git commit -m "feat: add MinimalNav with section indicator and overlay menu"
```

---

## Task 9: TextDecode Animation Component

**Files:**
- Create: `app/components/TextDecode.tsx`

- [ ] **Step 1: Create `app/components/TextDecode.tsx`**

Character-by-character decode animation — randomized characters resolve to the real text:

```tsx
"use client"

import { useEffect, useState, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface TextDecodeProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  onComplete?: () => void
}

export default function TextDecode({
  text,
  className = '',
  delay = 0,
  speed = 50,
  onComplete,
}: TextDecodeProps) {
  const [display, setDisplay] = useState('')
  const [started, setStarted] = useState(false)

  const decode = useCallback(() => {
    let iteration = 0
    const maxIterations = text.length

    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      iteration += 1 / 3

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplay(text)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  useEffect(() => {
    let cleanupDecode: (() => void) | undefined
    const timer = setTimeout(() => {
      setStarted(true)
      cleanupDecode = decode()
    }, delay)

    return () => {
      clearTimeout(timer)
      cleanupDecode?.()
    }
  }, [delay, decode])

  return (
    <span className={className}>
      {started ? display : '\u00A0'.repeat(text.length)}
    </span>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/TextDecode.tsx
git commit -m "feat: add TextDecode character-decode animation component"
```

---

## Task 10: Rewrite Hero Section

**Files:**
- Modify: `app/components/Hero.tsx`

- [ ] **Step 1: Rewrite `app/components/Hero.tsx`**

Full viewport hero with WebGL background, TextDecode name, and GSAP pinning. Read the current `Hero.tsx` to understand the data/content it displays, then rewrite with the new design. The hero should:

- Be a PinnedSection with `scrubDuration={3}`
- Have a WebGLCanvas with LiquidGlassShader as background
- Display the name using TextDecode
- Show title ("Software Engineer") with a fade-up
- Include "Scroll to explore ↓" pulse at bottom
- Pass scroll progress to the shader

Wire up the `onProgress` from PinnedSection to update the shader's `scrollProgress`. Also pass **scroll velocity** to the shader (spec requires "faster scroll = more distortion"). In the PinnedSection `onUpdate` callback, use `ScrollTrigger.getVelocity()` to get velocity, normalize it, and pass as a second uniform `uVelocity` to the LiquidGlassShader. The shader should use `uVelocity` to modulate `distortionStrength`.

- [ ] **Step 2: Verify dev server renders the hero**

```bash
npm run dev
```

Open http://localhost:3000 — hero should show with animated name, WebGL background (if supported), and pin on scroll.

- [ ] **Step 3: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "feat: rewrite hero with WebGL liquid glass shader and text decode"
```

---

## Task 11: Rewrite About Section

**Files:**
- Modify: `app/components/About.tsx`

- [ ] **Step 1: Read current About.tsx for content/data**

Read the file to extract the bio text, image path, and any data that needs to be preserved.

- [ ] **Step 2: Rewrite `app/components/About.tsx`**

Single viewport breather. Glass card with photo on one side, bio text on the other. Framer Motion fade-up entrance on scroll into view using `useInView`. Use the `glass` utility class.

- [ ] **Step 3: Verify visually**

Check http://localhost:3000 — about section should be a clean glass card layout.

- [ ] **Step 4: Commit**

```bash
git add app/components/About.tsx
git commit -m "feat: rewrite about section with glass card layout"
```

---

## Task 12: Rewrite Education Section

**Files:**
- Modify: `app/components/Education.tsx`

- [ ] **Step 1: Read current Education.tsx for content/data**

- [ ] **Step 2: Rewrite with display typography treatment**

Large Instrument Serif italic for university name, staggered Framer Motion reveals for degree/dates. Geometric grid pattern in background (CSS only). ~80vh section, no pinning.

- [ ] **Step 3: Verify visually and commit**

```bash
git add app/components/Education.tsx
git commit -m "feat: rewrite education section with display typography"
```

---

## Task 13: Rewrite Experience Section (Pinned Timeline)

**Files:**
- Modify: `app/components/Experience.tsx`
- Create: `app/components/AnimatedTimeline.tsx`

- [ ] **Step 1: Read current Experience.tsx for content/data**

Extract the roles, companies, dates, and descriptions.

- [ ] **Step 2: Create `app/components/AnimatedTimeline.tsx`**

A scroll-driven timeline component that takes an array of entries and reveals them progressively. Each entry is a glass card that slides in from the side. A vertical line draws between them as scroll progresses. Uses GSAP ScrollTrigger internally for the drawing/reveal animations.

- [ ] **Step 3: Rewrite `app/components/Experience.tsx`**

Wrap in a PinnedSection with `scrubDuration` derived from the number of experience entries (e.g. `Math.max(2, entries.length * 0.6)`). Use AnimatedTimeline with the experience data. Optionally include the GradientMesh shader as a subtle background (can be added in a later task; use a CSS gradient placeholder for now).

- [ ] **Step 4: Verify pinning works**

Scroll through the experience section — it should pin, entries should reveal progressively, then unpin.

- [ ] **Step 5: Commit**

```bash
git add app/components/Experience.tsx app/components/AnimatedTimeline.tsx
git commit -m "feat: rewrite experience as pinned scroll-driven timeline"
```

---

## Task 14: Rewrite Skills Section

**Files:**
- Modify: `app/components/Skills.tsx`
- Create: `app/components/FloatingBadge.tsx`

- [ ] **Step 1: Read current Skills.tsx for content/data**

Extract skill categories and individual skills.

- [ ] **Step 2: Create `app/components/FloatingBadge.tsx`**

Glass pill badge with icon and label. Has subtle float animation and parallax offset prop.

- [ ] **Step 3: Rewrite `app/components/Skills.tsx`**

~120vh section with natural scroll. Skills grouped by category (Frontend, Backend, Tools, etc). Category labels in uppercase tracking. FloatingBadges stagger in using Framer Motion `useInView`. Slight parallax between layers using `useScroll` + `useTransform`.

- [ ] **Step 4: Verify visually and commit**

```bash
git add app/components/Skills.tsx app/components/FloatingBadge.tsx
git commit -m "feat: rewrite skills with floating glass badges and parallax"
```

---

## Task 15: Rewrite Projects Section (Pinned Slideshow)

**Files:**
- Modify: `app/components/Projects.tsx`
- Create: `app/components/ProjectSlide.tsx`

This is the centerpiece — each project gets a fullscreen "slide" with scroll-driven transitions.

- [ ] **Step 1: Read current Projects.tsx for content/data**

Extract project data: titles, descriptions, tech stacks, images, links.

- [ ] **Step 2: Create `app/components/ProjectSlide.tsx`**

Individual project slide: screenshot/mockup area, title in Instrument Serif italic, description, tech stack pills, "View Project →" link. Full viewport layout.

- [ ] **Step 3: Rewrite `app/components/Projects.tsx`**

PinnedSection with `scrubDuration` = ~1.2 per project. Use GSAP to transition between slides — on scroll progress change, calculate which slide is active, animate opacity/transform. Navigation dots on the side showing current/total. For now, use a CSS crossfade transition; the WebGL morph shader will be added in a later task.

- [ ] **Step 4: Verify pinning and slide transitions**

Scroll through — projects should pin, slides should transition, dots should update.

- [ ] **Step 5: Commit**

```bash
git add app/components/Projects.tsx app/components/ProjectSlide.tsx
git commit -m "feat: rewrite projects as pinned slideshow with scroll transitions"
```

---

## Task 16: Rewrite Triumphs Section

**Files:**
- Modify: `app/components/Triumphs.tsx`

- [ ] **Step 1: Read current Triumphs.tsx for content/data**

- [ ] **Step 2: Rewrite as glass card grid with animated counters**

~80vh breather. Big numbers in Instrument Serif that count up when section enters view (reuse/adapt existing `AnimatedCounter.tsx`). Labels in uppercase Geist. Glass card treatment.

- [ ] **Step 3: Verify and commit**

```bash
git add app/components/Triumphs.tsx
git commit -m "feat: restyle triumphs with glass cards and animated counters"
```

---

## Task 17: Rewrite Personal Section

**Files:**
- Modify: `app/components/Personal.tsx`

- [ ] **Step 1: Read current Personal.tsx for content/data**

- [ ] **Step 2: Rewrite with scattered asymmetric layout**

Single viewport. Interests, hobbies, photos placed organically (not a grid). Subtle float/drift animations on items. Glass card treatments where appropriate. Aim for a warm, human feel.

- [ ] **Step 3: Verify and commit**

```bash
git add app/components/Personal.tsx
git commit -m "feat: rewrite personal section with scattered organic layout"
```

---

## Task 18: Rewrite Contact Section (Pinned)

**Files:**
- Modify: `app/components/Contact.tsx`

- [ ] **Step 1: Read current Contact.tsx for content/data**

Extract email, social links, form behavior.

- [ ] **Step 2: Rewrite as pinned dramatic closer**

PinnedSection with `scrubDuration={1.5}`. Large "Let's build something." in Instrument Serif italic. Email and social links stagger in. Minimal contact form in a glass-elevated card. WebGLCanvas with LiquidGlassShader in "calm" mode (pass `scrollProgress={1}` for the calmer state). Keep existing form submission logic.

- [ ] **Step 3: Verify pinning and layout**

- [ ] **Step 4: Commit**

```bash
git add app/components/Contact.tsx
git commit -m "feat: rewrite contact as pinned dramatic closer with shader background"
```

---

## Task 19: Wire Up Page Composition

**Files:**
- Modify: `app/page.tsx`
- Delete: `app/components/Navbar.tsx` (replaced by MinimalNav)

- [ ] **Step 1: Rewrite `app/page.tsx` with full composition**

Bring everything together: Preloader → ScrollEngine → WebGL background → MinimalNav → all sections in order. Wire up `activeSection` tracking via Intersection Observer or GSAP ScrollTrigger callbacks. Control MinimalNav visibility (hidden during hero).

```tsx
"use client"

import { useState, useCallback } from 'react'
import ScrollEngine from './components/scroll/ScrollEngine'
import Preloader from './components/Preloader'
import PortfolioContent from './components/PortfolioContent'
import ProjectStructuredData from './components/ProjectStructuredData'
import FAQStructuredData from './components/FAQStructuredData'
import BreadcrumbStructuredData from './components/BreadcrumbStructuredData'
import SkipLink from './components/SkipLink'
import KeyboardShortcuts from './components/KeyboardShortcuts'

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <SkipLink />
      <ProjectStructuredData />
      <FAQStructuredData />
      <BreadcrumbStructuredData />
      <KeyboardShortcuts />

      <ScrollEngine>
        <PortfolioContent />
      </ScrollEngine>
    </>
  )
}
```

Create a new file `app/components/PortfolioContent.tsx` that lives **inside** the `ScrollEngine` provider so it can consume context:

```tsx
"use client"

import { useState, useCallback } from 'react'
import { useScrollEngine } from './scroll/ScrollEngine'
import MinimalNav from './MinimalNav'
import Hero from './Hero'
import About from './About'
import Education from './Education'
import Experience from './Experience'
import Skills from './Skills'
import Projects from './Projects'
import Triumphs from './Triumphs'
import Personal from './Personal'
import Contact from './Contact'
import CommandPalette from './CommandPalette'
import BackToTop from './BackToTop'
import { Toaster } from 'react-hot-toast'

export default function PortfolioContent() {
  const { activeSection, setActiveSection } = useScrollEngine()
  const [navVisible, setNavVisible] = useState(false)

  const handleHeroProgress = useCallback((progress: number) => {
    setNavVisible(progress > 0.3)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <MinimalNav activeSection={activeSection} visible={navVisible} />
      <CommandPalette onNavigate={setActiveSection} />

      <main id="main-content" className="relative" role="main">
        <Hero onProgress={handleHeroProgress} />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Triumphs />
        <Personal />
        <Contact />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#e8e8e8',
            border: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      />
      <BackToTop />
    </div>
  )
}
```

This ensures `activeSection` has a **single source of truth** in `ScrollEngine` context. `CommandPalette.onNavigate` calls `setActiveSection` from context. `MinimalNav` reads `activeSection` from context. Each section calls `registerSection(id, ref)` from context to enable scroll-based tracking.

Note: Each section component should call `const { registerSection } = useScrollEngine()` and register itself via `useEffect(() => { if (ref.current) registerSection(id, ref.current) }, [])`. Remove old `setActiveSection` / `activeSkill` props from section component interfaces.

- [ ] **Step 2: Delete old Navbar**

```bash
rm app/components/Navbar.tsx
```

- [ ] **Step 3: Verify full page works**

```bash
npm run dev
```

Navigate through the entire page. All sections should render, pinned sections should pin, nav should appear after hero.

- [ ] **Step 4: Fix any TypeScript/lint errors**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire up full page composition with scroll engine and nav"
```

---

## Task 20: WebGL Morph Transition Shader (Projects)

**Files:**
- Create: `app/components/webgl/shaders/morphTransition.frag`
- Create: `app/components/webgl/MorphTransition.tsx`
- Modify: `app/components/Projects.tsx`

- [ ] **Step 1: Create morph transition shader**

Noise-based dissolve/materialize effect for transitioning between project slides. Inputs: `uProgress` (0→1), `uDirection` (1 or -1). Outputs iridescent color during transition, transparent when settled.

- [ ] **Step 2: Create `app/components/webgl/MorphTransition.tsx`**

R3F component that renders the morph shader, controlled by a `progress` prop.

- [ ] **Step 3: Integrate into Projects section**

Add a WebGLCanvas layer behind the project slides. Drive the morph transition progress from the GSAP scroll scrub.

- [ ] **Step 4: Verify transitions look good**

- [ ] **Step 5: Commit**

```bash
git add app/components/webgl/ app/components/Projects.tsx
git commit -m "feat: add WebGL morph transition shader for project slides"
```

---

## Task 21: WebGL Gradient Mesh Shader (Experience)

**Files:**
- Create: `app/components/webgl/shaders/gradientMesh.frag`
- Create: `app/components/webgl/GradientMesh.tsx`
- Modify: `app/components/Experience.tsx`

- [ ] **Step 1: Create gradient mesh shader**

Very subtle background effect — near-invisible color shifts. Warm→cool tones that shift per timeline entry.

- [ ] **Step 2: Create `app/components/webgl/GradientMesh.tsx`**

R3F component with `entryIndex` prop to shift the color.

- [ ] **Step 3: Integrate into Experience section**

Add WebGLCanvas behind the timeline. Wire entry index to the shader.

- [ ] **Step 4: Verify and commit**

```bash
git add app/components/webgl/ app/components/Experience.tsx
git commit -m "feat: add subtle gradient mesh shader for experience timeline"
```

---

## Task 22: Restyle Sub-Pages

**Files:**
- Modify: `app/projects/page.tsx`
- Modify: `app/blogs/page.tsx`
- Modify: `app/blogs/layout.tsx`
- Modify: `app/blogs/[slug]/page.tsx`
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Read each sub-page to understand current layout**

- [ ] **Step 2: Restyle `/projects` listing**

Apply monochrome system: dark background, glass cards for project items, white text, Instrument Serif for headings. No WebGL on this page.

- [ ] **Step 3: Restyle `/blogs` listing and `/blogs/[slug]`**

Same monochrome system. Clean reading experience with Geist body text, generous line height. Glass card treatment for blog cards.

- [ ] **Step 4: Restyle `not-found.tsx`**

Large "404" in Instrument Serif italic. Brief message, link home. Dark background.

- [ ] **Step 5: Restyle project detail pages**

Check `app/projects/*/page.tsx` files. Apply monochrome + glass system, editorial layout.

- [ ] **Step 6: Verify all routes**

```bash
npm run build
```

Visit `/projects`, `/blogs`, `/not-found-test` to verify visuals.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: restyle sub-pages (projects, blogs, 404) with monochrome system"
```

---

## Task 23: Restyle Utility Components

**Files:**
- Modify: `app/components/CommandPalette.tsx`
- Modify: `app/components/BackToTop.tsx`
- Modify: `app/components/SkipLink.tsx`

- [ ] **Step 1: Restyle CommandPalette**

Update to monochrome: dark glass background, white text, remove any color accents. Use `glass-elevated` for the dialog container.

- [ ] **Step 2: Restyle BackToTop**

Simple white outline button on dark background. Appears after scrolling past first viewport.

- [ ] **Step 3: Update SkipLink colors**

White background, dark text (for visibility when focused).

- [ ] **Step 4: Commit**

```bash
git add app/components/CommandPalette.tsx app/components/BackToTop.tsx app/components/SkipLink.tsx
git commit -m "feat: restyle utility components (command palette, back-to-top, skip link)"
```

---

## Task 24: Responsive & Mobile Scroll

**Files:**
- Modify: `app/components/scroll/PinnedSection.tsx`
- Modify: various section components

- [ ] **Step 1: Update PinnedSection for mobile**

Add a `disableOnMobile` behavior: if viewport width < 768px, don't create the ScrollTrigger pin. Just render as a normal section. Use a `useMediaQuery` hook or check `window.innerWidth` in the effect.

- [ ] **Step 2: Update Hero for mobile**

On mobile: skip TextDecode delay (show text immediately or with a simple fade), use CSS gradient fallback instead of WebGL, no pinning.

- [ ] **Step 3: Update Projects for mobile**

Replace pinned slideshow with a vertical stack of ProjectSlide cards, or a swipeable carousel using Framer Motion drag.

- [ ] **Step 4: Test on various viewport sizes**

Check at 375px, 768px, 1024px, 1440px widths.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: responsive design — mobile scroll fallback, touch-friendly layouts"
```

---

## Task 25: Reduced Motion & Accessibility

**Files:**
- Modify: `app/components/webgl/WebGLCanvas.tsx`
- Modify: `app/components/scroll/PinnedSection.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Respect `prefers-reduced-motion` in WebGLCanvas**

If reduced motion is preferred, don't render the R3F canvas. Show CSS gradient fallback instead.

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

- [ ] **Step 2: Disable pinning when reduced motion is preferred**

In PinnedSection, skip ScrollTrigger creation if reduced motion.

- [ ] **Step 3: Add CSS fallback gradients**

In `globals.css`, add:

```css
@media (prefers-reduced-motion: reduce) {
  .webgl-fallback {
    background: radial-gradient(ellipse at 30% 40%, rgba(120, 80, 255, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 60%, rgba(100, 200, 180, 0.04) 0%, transparent 50%);
  }
}
```

- [ ] **Step 4: Keyboard navigation audit**

Tab through the entire page. Ensure all interactive elements are reachable and have visible focus indicators (white outline ring).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: reduced motion support, CSS fallbacks, keyboard nav audit"
```

---

## Task 26: Performance Optimization

**Files:**
- Modify: `app/components/webgl/WebGLCanvas.tsx`
- Modify: `next.config.mjs`

- [ ] **Step 1: Dynamic import for R3F**

Ensure the R3F Canvas is loaded via `next/dynamic` with `ssr: false` to avoid server-side rendering issues:

```tsx
import dynamic from 'next/dynamic'
const WebGLCanvas = dynamic(() => import('./components/webgl/WebGLCanvas'), { ssr: false })
```

Apply this pattern in every component that imports WebGLCanvas.

- [ ] **Step 2: Add optimizePackageImports for Three.js**

In `next.config.mjs`:

```js
experimental: {
  optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
}
```

- [ ] **Step 3: Frame rate monitoring**

In WebGLCanvas, add a simple FPS counter. If average FPS drops below 30 for 2 seconds, set a state flag to simplify/disable shaders.

- [ ] **Step 4: Build and measure**

```bash
npm run build
```

Check the build output for bundle sizes. Note the JS chunks. Compare against the ~350KB target.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf: dynamic imports, package optimization, frame rate monitoring"
```

---

## Task 27: Final Integration Test & Polish

- [ ] **Step 1: Full scroll-through test**

```bash
npm run dev
```

Scroll through the entire page top to bottom. Verify:
- Preloader shows and transitions out
- Hero pins and WebGL shader works
- Nav appears after hero
- Each section renders correctly
- Pinned sections pin/unpin properly
- Project slideshow transitions work
- Contact pins and shader is calm
- No layout jumps or scroll glitches

- [ ] **Step 2: Check all routes**

Visit `/projects`, `/projects/knowledge-hub` (and other project slugs), `/blogs`, `/not-found-anything`.

- [ ] **Step 3: Run full build**

```bash
npm run build && npm run start
```

Test production build at http://localhost:3000.

- [ ] **Step 4: Lint check**

```bash
npm run lint
```

Fix any issues.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "polish: final integration, lint fixes, production build verified"
```
