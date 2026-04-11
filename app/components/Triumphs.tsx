"use client"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import { motion } from "framer-motion"
import { Award, Medal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { triggerHaptic } from "./ui/haptics"
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"

interface Certificate {
  title: string
  issuer: string
  date: string
  description: string
  image: StaticImageData
  isAward: boolean
}

const certificates: Certificate[] = [
  {
    title: "Certificate Of Achievement - AskPandaAI",
    issuer: "CTO - IIFL Finance Ltd",
    date: "Jun 13th, 2024",
    description:
      "Designed and implemented NLP-powered chatbot for real-time internal employee access to financial data.",
    image: AskPandaAI,
    isAward: true,
  },
  {
    title: "Tech-a-thon (Hackathon)",
    issuer: "IIFL",
    date: "Oct 6th & 7th, 2023",
    description: "Won 1st prize for an AI-powered customer support chatbot.",
    image: techathon,
    isAward: true,
  },
  {
    title: "0-100 Full Stack Web Development Course",
    issuer: "Harkirat Singh",
    date: "Apr 2024",
    description:
      "Mastered full-stack development, backend architecture, DevOps practices, and cloud deployment.",
    image: fullstack,
    isAward: false,
  },
  {
    title: "Rubix-Hackathon",
    issuer: "CSI - TSEC",
    date: "Jan 18th - 20th, 2022",
    description: "Built a healthcare consultation web app with the MERN stack. Reached the finals out of 50+ competing teams.",
    image: rubix,
    isAward: true,
  },
]

export default function Triumphs() {
  const [selected, setSelected] = useState<Certificate | null>(null)

  const openModal = (certificate: Certificate) => {
    triggerHaptic()
    setSelected(certificate)
  }

  return (
    <section id="triumphs" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Triumphs</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Certifications and wins that shaped my journey.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate, index) => (
            <motion.button
              key={certificate.title}
              type="button"
              onClick={() => openModal(certificate)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group flex flex-col rounded-3xl border border-border bg-card/80 p-4 text-left shadow-card transition hover:-translate-y-1"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={certificate.image}
                  alt={certificate.title}
                  fill
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {certificate.isAward ? (
                    <Medal className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Award className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span className="uppercase tracking-[0.2em]">
                    {certificate.isAward ? "Award" : "Certificate"}
                  </span>
                </div>
                <h3 className="font-display text-lg text-foreground">{certificate.title}</h3>
                <p className="text-xs text-muted-foreground">{certificate.issuer}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl border-border bg-card/95 top-auto bottom-4 translate-y-0 sm:bottom-auto sm:top-[50%] sm:translate-y-[-50%] sm:rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">{selected.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selected.issuer} · {selected.date}
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-background/50">
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
