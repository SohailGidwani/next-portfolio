"use client"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { triggerHaptic } from "./ui/haptics"
import SectionHeading from "./SectionHeading"
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"

interface Win {
  title: string
  issuer: string
  date: string
  year: string
  tag: string
  description: string
  image: StaticImageData
}

const featuredWin: Win = {
  title: "Certificate of Achievement · AskPandaAI",
  issuer: "CTO · IIFL Finance Ltd",
  date: "Jun 2024",
  year: "2024",
  tag: "Award",
  description:
    "Designed and built AskPandaAI, an NLP-powered chatbot that gave IIFL employees real-time access to internal financial data. Recognized with a Certificate of Achievement from the CTO after it cut internal support tickets across the org.",
  image: AskPandaAI,
}

const ledgerWins: Win[] = [
  {
    title: "0-100 Full Stack Web Development",
    issuer: "Harkirat Singh",
    date: "Apr 2024",
    year: "2024",
    tag: "Certification",
    description:
      "Mastered full-stack development, backend architecture, DevOps practices, and cloud deployment.",
    image: fullstack,
  },
  {
    title: "Tech-a-thon · 1st Prize",
    issuer: "IIFL",
    date: "Oct 2023",
    year: "2023",
    tag: "Hackathon",
    description: "Won 1st prize for an AI-powered customer support chatbot.",
    image: techathon,
  },
  {
    title: "Rubix Hackathon · Finalist",
    issuer: "CSI · TSEC",
    date: "Jan 2022",
    year: "2022",
    tag: "Hackathon",
    description:
      "Built a healthcare consultation web app with the MERN stack. Reached the finals out of 50+ competing teams.",
    image: rubix,
  },
]

export default function Triumphs() {
  const [selected, setSelected] = useState<Win | null>(null)

  const openModal = (win: Win) => {
    triggerHaptic()
    setSelected(win)
  }

  return (
    <section id="triumphs" className="section-y">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Wins">
          Certifications and wins that shaped my journey.
        </SectionHeading>

        {/* Featured win */}
        <motion.button
          type="button"
          onClick={() => openModal(featuredWin)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="group mt-10 w-full rounded border border-border border-l-2 border-l-accent bg-card/80 p-6 text-left transition hover:border-b-accent/50 hover:border-r-accent/50 hover:border-t-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Featured · {featuredWin.tag}
          </p>
          <h3 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
            {featuredWin.title}
          </h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {featuredWin.issuer} · {featuredWin.date}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{featuredWin.description}</p>
          <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.22em] text-accent/70 transition group-hover:text-accent">
            View certificate
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </motion.button>

        {/* Ledger */}
        <div className="mt-8 border-t border-border">
          {ledgerWins.map((win, index) => (
            <motion.button
              key={win.title}
              type="button"
              onClick={() => openModal(win)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="group grid w-full grid-cols-1 gap-1.5 border-b border-border px-1 py-4 text-left transition hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-[56px_1fr_auto] sm:items-center sm:gap-6 sm:py-5"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{win.year}</span>
              <span className="min-w-0">
                <span className="block font-display text-base text-foreground sm:text-lg">
                  {win.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {win.issuer}
                  <span className="font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
                    {" "}
                    · {win.tag}
                  </span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-accent">
                Cert
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded border-border bg-card top-auto bottom-4 translate-y-0 sm:bottom-auto sm:top-[50%] sm:translate-y-[-50%] sm:rounded">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">{selected.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selected.issuer} · {selected.date}
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded border border-border bg-background/50">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                placeholder="blur"
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
            </div>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}
