# Portfolio Design Overhaul — Spec

## Overview

Complete visual and interactive redesign of the portfolio at `next-portfolio`. Transform the current section-based site into a cinematic, scroll-driven experience inspired by Apple product pages. Monochrome palette with WebGL iridescent shaders as the only color. Hybrid scroll model with pinned cinematic sequences and smooth parallax breathers.

**Target audience:** Recruiters and engineers evaluating candidates for Summer 2026 internships and future full-time roles.

**Core message:** Projects, technical range, personal story, and the portfolio itself as proof of craft.

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Framework | Next.js 16 (App Router) | Existing — no change |
| UI | React 19 + TypeScript | Existing — no change |
| 3D / WebGL | `@react-three/fiber` + `@react-three/drei` | 3D scenes, custom shaders, post-processing |
| Scroll engine | `gsap` + `ScrollTrigger` | Scroll hijacking, section pinning, scrub animations |
| UI animations | `framer-motion` (existing) | Component entrances, micro-interactions, layout animations |
| Styling | Tailwind CSS 3 (existing) | Utility-first styling, design tokens via CSS vars |
| UI primitives | Radix UI (existing) | Accessible dialog, accordion, etc. |

### New dependencies to install

```
@react-three/fiber @react-three/drei three @types/three
gsap @gsap/react
```

### Dependencies to remove

```
(none — existing deps stay, unused ones can be pruned during implementation)
```

## Visual Design System

### Color Palette — Monochrome

No color in the UI. WebGL shaders are the only source of color on the entire site.

| Token | Hex | Usage |
|-------|-----|-------|
| `--void` | `#000000` | True black, shader backgrounds |
| `--bg` | `#090909` | Page background |
| `--surface` | `#141414` | Card backgrounds, glass base |
| `--elevated` | `#1F1F1F` | Elevated cards, hover states |
| `--border` | `#2A2A2A` | Card borders, dividers |
| `--muted` | `#555555` | De-emphasized text, metadata |
| `--text` | `#E8E8E8` | Body text |
| `--white` | `#FFFFFF` | Display text, headings, accent (links, hovers) |

**Accent strategy:** Pure White. Interactive elements (links, buttons, hover states) use `#FFFFFF` with underlines or weight changes. No color accent.

**Dark-only:** No light mode. The theme toggle is removed.

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display | Instrument Serif | 400 italic | Hero name, section titles, dramatic moments |
| Heading | Geist | 600 | Section headings, card titles |
| Body | Geist | 300 | Paragraphs, descriptions |
| Mono | Geist Mono | 400-500 | Code snippets, metadata, labels |
| Label | Geist | 400, tracking +5 | Section labels, nav items, uppercase micro-text |

**Hierarchy through contrast:** Italic serif display vs clean sans body creates strong visual distinction without relying on color.

### Surface Treatments

**Standard Glass:**
- `background: rgba(255, 255, 255, 0.03)`
- `border: 1px solid rgba(255, 255, 255, 0.06)`
- `backdrop-filter: blur(20px)`
- Used for: About card, education, skill badges, timeline entries

**Elevated Glass:**
- `background: rgba(255, 255, 255, 0.05)`
- `border: 1px solid rgba(255, 255, 255, 0.10)`
- `box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5)`
- Used for: Project showcases, contact form, hover states, nav overlay

## Scroll Architecture

### Model: Hybrid

Native browser scrolling as the baseline (no Lenis or smooth-scroll library — GSAP ScrollTrigger works best with native scroll). Specific sections "pin" the viewport and play through an animated sequence driven by scroll position (GSAP ScrollTrigger `pin: true` + `scrub`). Between pinned sections, content scrolls normally with parallax and entrance animations.

### Section Flow

```
┌─────────────────────────────────────────────┐
│ 1. HERO                    [PINNED ~3x vh]  │
│    Liquid glass shader, name decode effect   │
│    Scroll morphs shader → reveals section 2  │
├─────────── smooth scroll ───────────────────┤
│ 2. ABOUT                   [BREATHER 100vh] │
│    Photo + bio, glass card, fade-up entrance │
├─────────── smooth scroll ───────────────────┤
│ 3. EDUCATION               [BREATHER ~80vh] │
│    Display type, staggered reveal            │
├─────────── smooth scroll ───────────────────┤
│ 4. EXPERIENCE              [PINNED ~2x vh]  │
│    Timeline builds on scroll, entries slide  │
│    Gradient mesh shifts per entry            │
├─────────── smooth scroll ───────────────────┤
│ 5. SKILLS                  [FLOW ~120vh]    │
│    Floating glass badges, staggered float-in │
│    Grouped by category, parallax             │
├─────────── smooth scroll ───────────────────┤
│ 6. PROJECTS                [PINNED ~5x vh]  │
│    Fullscreen per-project slides             │
│    Morph/distortion shader transitions       │
│    Click → /projects/[slug] detail page      │
├─────────── smooth scroll ───────────────────┤
│ 7. TRIUMPHS                [BREATHER ~80vh] │
│    Animated counters, glass card grid        │
├─────────── smooth scroll ───────────────────┤
│ 8. PERSONAL                [BREATHER 100vh] │
│    Scattered layout, subtle float animations │
├─────────── smooth scroll ───────────────────┤
│ 9. CONTACT                 [PINNED ~1.5x vh]│
│    "Let's build something." dramatic text    │
│    Shader resolves to calm state             │
└─────────────────────────────────────────────┘
```

**Pinned sections (4):** Hero, Experience, Projects, Contact
**Breather frames (4):** About, Education, Triumphs, Personal
**Scroll flow (1):** Skills

### Section Details

#### 1. Hero (Pinned)
- Full viewport, no nav visible initially
- WebGL: Liquid glass distortion shader covering the entire background. Reacts to scroll velocity — faster scroll = more distortion
- Text: Name renders with a glitch/character-decode animation (randomized characters resolve to real letters)
- Title ("Software Engineer") fades up with a slight delay
- CTA: "Scroll to explore ↓" pulses gently at the bottom
- On scroll: shader morphs, text parallaxes away, next section revealed beneath
- Pin duration: ~3x viewport height

#### 2. About (Breather)
- Single viewport
- Layout: photo/avatar on one side, 2-3 sentence bio in a glass card on the other
- Entrance: elements fade up with stagger (photo first, then text)
- Photo has subtle parallax offset on scroll
- No pinning — scrolls naturally

#### 3. Education (Breather)
- Compact section, ~80vh
- University name in large Instrument Serif italic display
- Degree, dates, and details stagger in with slight delays
- Subtle geometric pattern or grid lines in background (CSS, not WebGL)
- Scrolls naturally

#### 4. Experience (Pinned)
- Section pins at top of viewport
- Timeline visualization: a vertical line draws as you scroll
- Each role/position slides in from the side when its scroll position is reached
- Company name, role, dates, key achievements in glass cards
- Background: subtle gradient mesh that shifts hue per entry (WebGL, very subtle — stays monochrome-adjacent with just a hint of warmth/cool)
- Pin duration: ~2x viewport height (scales with number of entries)

#### 5. Skills (Scroll Flow)
- Natural scroll, ~120vh tall
- Skill badges in glass pill/card treatment float in with stagger as they enter viewport
- Grouped by category: Frontend, Backend, Tools/DevOps, etc.
- Category labels in uppercase Geist tracking
- Slight parallax between layers — background badges move slower than foreground
- No pinning

#### 6. Projects (Pinned) — Centerpiece
- Section pins at viewport top
- Each project occupies a full "slide" — screenshot/mockup, title, description, tech stack
- Scroll advances between projects
- Transition: WebGL morph/distortion shader — current project dissolves through shader distortion, next project materializes
- Navigation dots on the side indicate current project and total count
- Each slide has a "View Project →" link to `/projects/[slug]`
- Pin duration: ~1.2x viewport per project (e.g., 4 projects = ~5x vh)

#### 7. Triumphs (Breather)
- ~80vh, fast-read section
- Large animated counter numbers that count up when section enters viewport (contributions, projects shipped, etc.)
- Glass card grid layout
- Numbers in Instrument Serif display, labels in Geist uppercase
- No pinning

#### 8. Personal (Breather)
- Single viewport
- Interests, hobbies, personal photos
- Scattered/asymmetric layout — not a grid, more organic placement
- Elements have subtle float/drift animations
- Warmer tone (can shift the glass card opacity slightly warmer here)
- Provides human contrast before the technical close

#### 9. Contact (Pinned)
- Big dramatic text: "Let's build something." in Instrument Serif italic
- Email, social links (GitHub, LinkedIn, etc.), minimal contact form materialize with stagger
- Contact form submission: retain existing behavior (or `mailto:` fallback if no backend handler exists)
- WebGL shader returns — same liquid glass from hero but morphing into a calmer, resolved state
- Feels like a landing, a resolution — not just a footer
- Pin duration: ~1.5x viewport height

## WebGL Shader Design

### Shader 1: Liquid Glass (Hero + Contact)
- Full-screen fragment shader
- Effect: Refraction/distortion that makes the background feel like looking through moving water or glass
- Inputs: scroll position (uniform), time (uniform), mouse position (optional, subtle)
- Hero state: active, turbulent — high distortion amplitude
- Contact state: calm, resolved — low distortion, slower movement
- Scroll drives the transition between states

### Shader 2: Morph Transition (Projects)
- Applied during project slide transitions
- Effect: Current content dissolves through noise/distortion, new content materializes
- Inputs: transition progress (0→1, driven by scroll), noise seed
- Visual: like a digital glitch/liquid morph between two states

### Shader 3: Gradient Mesh (Experience)
- Subtle background effect during the experience timeline
- Effect: Very soft, barely-visible color shift — warm to cool or vice versa
- Keeps the monochrome feel but adds the slightest atmospheric shift per timeline entry
- Nearly invisible — only noticeable if looking for it

### Color Philosophy
All shaders output iridescent/prismatic colors: think oil-on-water, aurora borealis, light through a prism. On the monochrome canvas, these become the only source of color — making them mesmerizing and precious.

### Reduced Motion / Fallback
- `prefers-reduced-motion: reduce` → all shaders replaced with static CSS gradients (subtle radial gradients approximating the shader look)
- No WebGL support → same CSS fallback
- Low-power devices (detected via `navigator.hardwareConcurrency` or frame rate monitoring) → simplified shader or CSS fallback
- All content remains fully accessible without shaders

## Navigation

### Desktop
- **Initially hidden** during hero sequence
- **Appears** after hero scroll completes (triggered by ScrollTrigger)
- **Layout:** thin fixed bar — name/logo left, section indicator center (current section label in uppercase tracking), hamburger right
- **Menu overlay:** full-screen elevated glass with staggered section links (Framer Motion `AnimatePresence`)
- **Section indicator** updates as user scrolls through sections (Intersection Observer or ScrollTrigger callbacks)

### Mobile
- Same structure but hamburger always visible after hero
- Section indicator simplified to a dot/progress bar

### No Theme Toggle
Site is dark-only. `next-themes` can remain installed but the toggle component is removed.

## Preloader

- Black screen with centered initials or a minimal loading indicator
- WebGL shaders compile during this phase
- Once ready, a reveal transition (wipe, fade, or scale) transitions into the hero
- If shaders compile fast (<500ms), skip the preloader entirely
- Loading state managed via React Suspense or a simple state flag

## Responsive Strategy

### Desktop (≥1024px)
- Full WebGL experience
- All scroll pinning active
- Full typography scale

### Tablet (768–1023px)
- WebGL shaders still run (simplified if performance drops)
- Pinned sections have shorter pin durations
- Typography scale reduced slightly
- Project slides may stack 2-up instead of full-bleed

### Mobile (<768px)
- **No scroll hijacking** — all sections scroll naturally
- WebGL: single simplified background shader (or CSS gradient fallback)
- Framer Motion entrance animations replace scroll-pinned sequences
- Project showcase becomes a swipeable carousel or stacked cards
- Touch-optimized: larger tap targets, swipe gestures
- Typography still carries: Instrument Serif display + Geist body works at all sizes

## Pages Beyond Homepage

### `/projects` (listing)
- Monochrome design system applied
- Grid of project cards with glass treatment
- Hover: elevated glass + subtle scale
- No scroll hijacking
- Entrance animations via Framer Motion

### `/projects/[slug]` (detail)
- Editorial layout — focused readability
- Large hero image/mockup at top
- Instrument Serif title, Geist body
- Glass cards for tech stack, links, metadata
- No WebGL on detail pages (keep them fast and focused)

### `/blogs` and `/blogs/[slug]`
- Same monochrome + glass system
- Clean reading experience
- No WebGL, no scroll hijacking
- Design system provides visual unity without the performance cost

### 404 Page
- Minimal, fun treatment
- Large "404" in Instrument Serif
- Brief message, link home
- Maybe the liquid glass shader running in a contained element for visual interest

## Component Architecture

### New Components
- `WebGLCanvas` — R3F canvas wrapper, handles mounting/unmounting, fallback detection
- `LiquidGlassShader` — hero/contact shader material
- `MorphTransitionShader` — project transition shader material
- `GradientMeshShader` — experience background shader material
- `ScrollEngine` — GSAP ScrollTrigger setup, section registration, scroll progress context
- `PinnedSection` — wrapper that registers a section with ScrollTrigger for pinning
- `Preloader` — loading screen with shader compilation detection
- `MinimalNav` — thin fixed nav with section indicator and menu overlay
- `TextDecode` — character-decode animation for the hero name
- `AnimatedTimeline` — experience timeline with scroll-driven progressive reveal
- `ProjectSlide` — individual project showcase within the pinned sequence
- `FloatingBadge` — glass pill for skills with parallax

### Modified Components
- `Hero` — complete rewrite with WebGL background and text decode
- `About` — simplified to single-viewport glass card layout
- `Education` — display typography treatment
- `Experience` — rewritten as scroll-pinned animated timeline
- `Skills` — floating glass badges replacing current layout
- `Projects` — rewritten as pinned slideshow with shader transitions
- `Triumphs` — glass card grid with animated counters (similar to current, restyled)
- `Personal` — scattered asymmetric layout
- `Contact` — dramatic typography + shader background
- `Navbar` — replaced with MinimalNav
- `AmbientBackground` — removed (replaced by WebGL canvas)
- `ShootingStars` — removed
- `ThemeToggle` — removed
- `GuidedTour` — removed (doesn't work with scroll hijacking)
- `CommandPalette` — kept, restyled to monochrome
- `BackToTop` — kept, restyled

### Removed Components
- `AmbientBackground` — WebGL replaces this
- `ShootingStars` — WebGL replaces this
- `ThemeToggle` — dark-only site
- `GuidedTour` — incompatible with scroll hijacking UX
- `SectionDivider` — replaced by natural scroll spacing

## Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Total Blocking Time | <200ms |
| Cumulative Layout Shift | <0.1 |
| JS bundle (gzip) | <350KB target (validate in early spike — Three.js is heavy) |
| WebGL shader compile | <1s (covered by preloader) |
| 60fps during scroll | Mandatory — drop shader quality before dropping frames |

### Optimization Strategies
- Three.js tree-shaking via `@react-three/fiber` (only import what's used)
- GSAP tree-shaking (only import ScrollTrigger)
- Lazy load R3F canvas (dynamic import, client-only)
- Shaders compiled on first paint, cached
- Images: existing Next.js Image optimization (WebP/AVIF, responsive sizes)
- Font subsetting via `next/font/google`
- Frame rate monitoring: if FPS drops below 30 for sustained period, auto-simplify shaders

## Implementation Order

Recommended rollout sequence so milestones are independently shippable:

1. **Foundation** — design tokens (CSS vars), typography, new fonts, Tailwind config, remove theme toggle
2. **Shell** — preloader, MinimalNav, scroll engine (GSAP setup), WebGL canvas wrapper
3. **Homepage sections** — implement each section top-to-bottom (Hero → About → ... → Contact)
4. **WebGL shaders** — liquid glass, morph transitions, gradient mesh (can develop in parallel with sections using CSS fallback placeholders)
5. **Sub-pages** — restyle `/projects`, `/projects/[slug]`, `/blogs`, `/blogs/[slug]`, 404
6. **Polish** — responsive QA, performance optimization, reduced-motion testing, accessibility audit

## Accessibility

- All content accessible without WebGL (progressive enhancement)
- `prefers-reduced-motion`: disable all pinning, use simple fade entrances, replace shaders with CSS
- Keyboard navigation: all interactive elements focusable, skip-link retained
- Screen readers: semantic HTML, ARIA labels where needed, content order matches visual order
- Color contrast: white text on dark backgrounds exceeds WCAG AAA for large text, AA for body
- Focus indicators: white outline ring on interactive elements
