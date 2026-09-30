"use client"

import { Fragment, useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft

type Config = "full" | "t1" | "dti" | "clinical"

// Balanced accuracy on the test set, same trained weights with the unchecked
// modalities masked at inference (Table 21a). Only the clinical-inclusive
// configurations have corrected values, so clinical cannot be switched off.
// The p values are the paired-bootstrap comparisons against clinical only.
const RESULTS: Record<Config, { dx3: number; dx2: number; note: string; supported?: boolean }> = {
  full: {
    dx3: 0.682,
    dx2: 0.913,
    note: "The full model. +0.016 over clinical only on 3-class, p = 0.498: not distinguishable from the baseline.",
  },
  t1: {
    dx3: 0.683,
    dx2: 0.906,
    note: "+0.016 over clinical only on 3-class, p = 0.488: not distinguishable from the baseline.",
  },
  dti: {
    dx3: 0.701,
    dx2: 0.91,
    note: "+0.034 over clinical only on 3-class, p = 0.012. The one gain over clinical that holds up.",
    supported: true,
  },
  clinical: {
    dx3: 0.666,
    dx2: 0.893,
    note: "Clinical scores alone: the baseline every other configuration is tested against.",
  },
}

/**
 * The modality ablation as something to try: switch the imaging inputs off
 * and on, and the diagram masks that branch while the readout shows what the
 * same trained model measured without it.
 */
export default function ModalityExplorer() {
  const [t1, setT1] = useState(true)
  const [dti, setDti] = useState(true)
  // The readout crossfades only once something has been toggled. Before that
  // it renders settled, so the server sends the numbers visible, not at the
  // start of a fade that waits on hydration.
  const [touched, setTouched] = useState(false)
  const config: Config = t1 && dti ? "full" : t1 ? "t1" : dti ? "dti" : "clinical"
  const result = RESULTS[config]

  const lanes = [
    { id: "t1", label: "T1 MRI", encoder: "3D ResNet-18", on: t1, toggle: () => (setTouched(true), setT1((v) => !v)) },
    { id: "dti", label: "DTI FA", encoder: "3D ResNet-18", on: dti, toggle: () => (setTouched(true), setDti((v) => !v)) },
    { id: "clinical", label: "Clinical", encoder: "MLP", on: true, toggle: null },
  ]

  return (
    <figure className="my-8 rounded border border-border bg-card/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Mask a modality</p>
        <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground">Same trained weights, masked at inference</p>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8">
        <div role="group" aria-label="Inputs fed to the model" className="grid grid-cols-[6.75rem_minmax(0,1fr)_auto] items-center gap-y-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto]">
          {lanes.map((lane, i) => (
            <Fragment key={lane.id}>
              {lane.toggle ? (
                <button
                  type="button"
                  aria-pressed={lane.on}
                  onClick={lane.toggle}
                  style={{ gridRow: i + 1 }}
                  className={`col-start-1 flex h-11 items-center justify-between gap-2 rounded border px-3 font-mono text-xs uppercase tracking-[0.12em] transition-[color,background-color,border-color,transform] duration-150 ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] ${
                    lane.on
                      ? "border-accent/60 bg-accent/10 text-foreground"
                      : "border-border bg-transparent text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/30"
                  }`}
                >
                  {lane.label}
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full border transition-colors duration-150 ${lane.on ? "border-accent bg-accent" : "border-muted-foreground bg-transparent"}`}
                  />
                </button>
              ) : (
                <span
                  style={{ gridRow: i + 1 }}
                  className="col-start-1 flex h-11 items-center justify-between gap-2 rounded border border-dashed border-border px-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground"
                >
                  {lane.label}
                  <Lock className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="sr-only">(always on)</span>
                </span>
              )}
              <Lane on={lane.on} encoder={lane.encoder} row={i + 1} delay={i * 0.45} />
            </Fragment>
          ))}
          <div
            aria-hidden
            className="col-start-3 row-span-3 row-start-1 flex items-center self-stretch rounded border border-border bg-card px-1.5"
          >
            <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground [writing-mode:vertical-rl]">
              Fusion
            </span>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-5">
            <Stat label="DX 3-class" sub="n = 474" value={result.dx3} strong={result.supported} fade={touched} />
            <Stat label="CN vs Dementia" sub="n = 311" value={result.dx2} fade={touched} />
          </dl>
        </div>
      </div>

      {/* Kept out of the live region's grid so its height, reserved for the
          longest note, never shifts the diagram as the text changes. */}
      <p aria-live="polite" className="mt-5 min-h-[3lh] border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground sm:min-h-[2lh]">
        <motion.span
          key={config}
          initial={touched ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className={`block ${result.supported ? "text-foreground" : ""}`}
        >
          {result.note}
        </motion.span>
      </p>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Balanced accuracy on the test set. On CN vs Dementia no configuration separates from clinical only.
      </figcaption>
    </figure>
  )
}

/** One input's path into fusion: solid and carrying signal when on, dashed and gated when masked. */
function Lane({ on, encoder, row, delay }: { on: boolean; encoder: string; row: number; delay: number }) {
  const fade = "transition-opacity duration-200 ease-[var(--ease-out-soft)]"
  return (
    <div aria-hidden style={{ gridRow: row }} className="relative col-start-2 mx-2 h-11 sm:mx-3">
      <span
        className={`absolute inset-x-0 -top-0.5 truncate text-center font-mono text-[10px] tracking-[0.08em] text-muted-foreground ${fade} ${on ? "" : "opacity-60"}`}
      >
        {on ? encoder : "masked"}
      </span>
      <span className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent ${fade} ${on ? "opacity-80" : "opacity-0"}`} />
      <span
        className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${fade} ${on ? "opacity-0" : "opacity-60"}`}
        style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--muted) 0 4px, transparent 4px 8px)" }}
      />
      {on ? (
        // The packet's box spans the lane, so translating it by 100% of its
        // own width carries the dot from one end to the other at any size.
        // Hidden in CSS under reduced motion, which keeps the markup the same
        // on the server and the client.
        <span className="lane-flow absolute inset-x-0 top-1/2" style={{ animationDelay: `${delay}s` }}>
          <span className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        </span>
      ) : null}
      <span
        className={`absolute left-1/2 top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[3px] border bg-card font-mono text-[11px] leading-none transition-colors duration-200 ${
          on ? "border-accent/60 text-accent" : "border-border text-muted-foreground"
        }`}
      >
        {on ? "" : "×"}
      </span>
    </div>
  )
}

function Stat({ label, sub, value, strong, fade }: { label: string; sub: string; value: number; strong?: boolean; fade: boolean }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        <span className="block normal-case tracking-[0.1em] md:inline">
          <span className="hidden md:inline"> · </span>
          {sub}
        </span>
      </dt>
      <dd className="mt-1">
        <motion.span
          key={value}
          initial={fade ? { opacity: 0, transform: "translateY(4px)" } : false}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className={`inline-block font-display text-4xl tabular-nums tracking-tight transition-colors duration-200 ${strong ? "text-accent" : "text-foreground"}`}
        >
          {value.toFixed(3)}
        </motion.span>
      </dd>
    </div>
  )
}
