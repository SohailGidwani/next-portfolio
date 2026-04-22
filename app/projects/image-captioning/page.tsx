"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Github, FolderKanban, ExternalLink, Code, Brain, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import imagecaption from '@/public/images/BE-Project.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{n}</span>
        <div className="h-px w-5 bg-border" />
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
        {label}
      </h2>
    </div>
  )
}

export default function ImageCaptioningPage() {
  const project = {
    title: "Image Feature Detection & Captioning",
    description: "Trained a CNN + Transformer pipeline that generates captions for images. The Transformer model scored 0.80 BLEU. Built a Streamlit UI so you can try it yourself.",
    longDescription: `I wanted to build something that could look at an image and describe what's in it. The idea was straightforward, but getting it to actually work well took some effort.

I used VGG-16 as the image encoder to extract feature vectors, then fed those into two different decoders: an LSTM and a Transformer. The LSTM got a BLEU score of 0.65, which was decent, but the Transformer with attention hit 0.80 and generated noticeably better captions. The attention mechanism really helped the model focus on the right parts of the image.

I wrapped the whole thing in a Streamlit app so you can upload any image and get a caption back in a few seconds. It's a simple UI, but it makes the model feel real instead of just numbers in a notebook.

The hardest part was honestly the training pipeline. VGG-16 is memory-hungry, the Transformer needed careful hyperparameter tuning, and I spent more time on data preprocessing than I'd like to admit.`,
    image: imagecaption,
    tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit", "Computer Vision", "NLP"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    features: [
      {
        icon: <Brain className="w-5 h-5" />,
        title: "Advanced AI Models",
        description: "VGG-16 for image feature extraction, then LSTM and Transformer decoders for generating captions"
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "High Performance",
        description: "LSTM hit 0.65 BLEU, Transformer got 0.80. The attention mechanism made a real difference"
      },
      {
        icon: <Code className="w-5 h-5" />,
        title: "User-Friendly Interface",
        description: "Streamlit app where you upload an image and get a caption back in seconds"
      },
      {
        icon: <ExternalLink className="w-5 h-5" />,
        title: "Real-time Processing",
        description: "Tuned the pipeline so inference runs fast enough to feel instant"
      }
    ],
    technicalDetails: [
      "CNN and VGG-16 for pulling features out of images",
      "LSTM decoder with attention",
      "Transformer decoder that outperformed the LSTM by 15 BLEU points",
      "Evaluated with BLEU scores across both architectures",
      "Streamlit frontend for uploading images and viewing captions",
      "Image preprocessing and augmentation during training",
      "Model optimization to keep inference time reasonable"
    ],
    challenges: [
      "The Transformer gave better captions but was noticeably slower, had to find the right size/speed tradeoff",
      "The model struggled with unusual image compositions that weren't well represented in training data",
      "Getting BLEU above 0.70 on the LSTM took a lot of hyperparameter tuning before I switched to the Transformer",
      "Making the Streamlit UI responsive enough that it didn't feel like you were waiting forever",
      "VGG-16 is memory-hungry, had to be strategic about batch sizes during training"
    ],
    learnings: [
      "Transformers really do outperform LSTMs on sequence tasks once you get the training right",
      "Connecting a vision encoder to a language decoder is tricky, the feature vector interface matters a lot",
      "Attention maps are useful for debugging, not just for boosting scores",
      "Even a simple Streamlit UI makes a model way more convincing in a demo",
      "BLEU is a useful metric but doesn't always match how good a caption actually reads"
    ]
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="image-captioning"
        image="/images/BE-Project.jpg"
        keywords={project.tags}
        github={project.github}
      />
      <Suspense fallback={<ProjectSkeleton />}>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    ML / Computer Vision
                  </span>
                </div>
                <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>

                {/* Stat callout — BLEU score */}
                <div className="mb-6 flex items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">0.80</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">BLEU Score</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">0.65</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">LSTM Baseline</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-bold text-foreground">+23%</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Improvement</p>
                  </div>
                </div>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <SectionLabel n="01" label="Preview" />
                  <div className="relative aspect-video overflow-hidden rounded border border-border">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.section>

                {/* 02 — Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <SectionLabel n="02" label="Overview" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.longDescription}
                  </p>
                </motion.section>

                {/* 03 — Key Features */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <SectionLabel n="03" label="Key Features" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="rounded border border-border bg-card p-5 transition-colors hover:border-accent/40"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="text-accent">{feature.icon}</div>
                          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 04 — Technical Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <SectionLabel n="04" label="Technical Stack" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* 05 — Friction & Takeaways */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <SectionLabel n="05" label="Friction & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Friction
                      </p>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        Takeaways
                      </p>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="flex flex-wrap gap-3 border-t border-border pt-8"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <FolderKanban className="h-4 w-4" />
                    All Projects
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  )
}
