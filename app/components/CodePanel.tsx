"use client"

import { motion } from "framer-motion"
import { Terminal } from "lucide-react"

const CODE_LINES: { tokens: { text: string; color: string }[] }[] = [
  { tokens: [
    { text: "const ", color: "text-purple-400 dark:text-purple-300" },
    { text: "engineer", color: "text-foreground" },
    { text: " = {", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  name", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"Sohail Gidwani\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  role", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"AI / CS Engineer\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  focus", color: "text-primary" },
    { text: ": [", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Applied AI\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Intelligent Systems\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Full-Stack Engineering\"", color: "text-amber-600 dark:text-amber-400" },
  ]},
  { tokens: [
    { text: "  ],", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  location", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"Los Angeles\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  status", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"MS CS @ USC\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  open to work", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "true", color: "text-emerald-500 dark:text-emerald-400" },
  ]},
  { tokens: [
    { text: "}", color: "text-muted-foreground" },
  ]},
]

export default function CodePanel() {
  return (
    <div className="relative rounded-2xl border border-border bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm overflow-hidden dark:bg-card/60">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80 dark:bg-red-400/60" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80 dark:bg-amber-400/60" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80 dark:bg-emerald-400/60" />
        </div>
        <div className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          <span className="font-mono">engineer.ts</span>
        </div>
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {CODE_LINES.map((line, lineIdx) => (
          <motion.div
            key={lineIdx}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + lineIdx * 0.06, ease: "easeOut" }}
            className="flex"
          >
            <span className="mr-4 w-5 shrink-0 select-none text-right text-[11px] text-muted-foreground/40">
              {lineIdx + 1}
            </span>
            <span>
              {line.tokens.map((token, tIdx) => (
                <span key={tIdx} className={token.color}>{token.text}</span>
              ))}
            </span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex"
        >
          <span className="mr-4 w-5 shrink-0 select-none text-right text-[11px] text-muted-foreground/40">
            13
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, times: [0, 1], ease: "linear" }}
            className="inline-block h-[1.1em] w-[2px] bg-primary"
          />
        </motion.div>
      </div>
    </div>
  )
}
