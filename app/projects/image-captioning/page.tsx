import { Badge } from "@/app/components/ui/badge"
import { ExternalLink, Code, Brain, Zap } from "lucide-react"
import Image from "next/image"
import imagecaption from '@/public/images/BE-Project.jpg'
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectActions from "@/app/projects/components/ProjectActions"
import ProjectSectionLabel from "@/app/projects/components/ProjectSectionLabel"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"

const tocItems = [
  { id: "section-01", n: "01", label: "Preview" },
  { id: "section-02", n: "02", label: "Why I Built It" },
  { id: "section-03", n: "03", label: "How It Works" },
  { id: "section-04", n: "04", label: "Decoder Comparison" },
  { id: "section-05", n: "05", label: "Key Features" },
  { id: "section-06", n: "06", label: "Technical Stack" },
  { id: "section-07", n: "07", label: "Friction & Takeaways" },
]

export default function ImageCaptioningPage() {
  const project = {
    title: "Image Feature Detection & Captioning",
    description: "Trained a CNN-based image-captioning pipeline and compared LSTM and Transformer decoders. Built a Streamlit UI so you can try the resulting captions yourself.",
    why: `I wanted to build something that could look at an image and describe what's in it. The idea was straightforward, but getting it to actually work well took some effort.`,
    how: `I used VGG-16 as the image encoder to extract feature vectors, then fed those into two different decoders: an LSTM and a Transformer with attention.

I wrapped the whole thing in a Streamlit app so you can upload any image and get a caption back in a few seconds. It's a simple UI, but it makes the model feel real instead of just numbers in a notebook.

The hardest part was honestly the training pipeline. VGG-16 is memory-hungry, the Transformer needed careful hyperparameter tuning, and I spent more time on data preprocessing than I'd like to admit.`,
    results: `The LSTM provided a useful recurrent baseline, while the Transformer produced more coherent, context-aware captions in qualitative comparisons. Its attention mechanism also made it easier to inspect which image features influenced each generated token.`,
    resultRows: [
      { model: "LSTM decoder", comparison: "Useful recurrent baseline; simpler sequence modeling" },
      { model: "Transformer decoder (attention)", comparison: "More coherent captions and clearer feature-to-token attention" },
    ],
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
        title: "Decoder Comparison",
        description: "Compared a recurrent LSTM baseline with a Transformer whose attention produced more coherent captions"
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
      "Transformer decoder compared against the LSTM baseline",
      "Qualitative caption review across both decoder architectures",
      "Streamlit frontend for uploading images and viewing captions",
      "Image preprocessing and augmentation during training",
      "Model optimization to keep inference time reasonable"
    ],
    challenges: [
      "The Transformer gave better captions but was noticeably slower, had to find the right size/speed tradeoff",
      "The model struggled with unusual image compositions that weren't well represented in training data",
      "The LSTM needed extensive hyperparameter tuning before I moved to the Transformer architecture",
      "Making the Streamlit UI responsive enough that it didn't feel like you were waiting forever",
      "VGG-16 is memory-hungry, had to be strategic about batch sizes during training"
    ],
    learnings: [
      "Transformers really do outperform LSTMs on sequence tasks once you get the training right",
      "Connecting a vision encoder to a language decoder is tricky, the feature vector interface matters a lot",
      "Attention maps are useful for debugging, not just for boosting scores",
      "Even a simple Streamlit UI makes a model way more convincing in a demo",
      "Automatic caption metrics do not always match how natural or accurate a caption reads"
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
        projectType="app"
      />
      <div className="min-h-screen overflow-x-clip bg-background text-foreground">
          <ProjectNav />
          {/* Chapter wayfinding: the rail above 1200px, the pill below it. */}
          <SectionTOC items={tocItems} />
          <MobileChapterNav items={tocItems} />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    ML / Computer Vision
                  </span>
                </div>
                <h1
                  data-vt-title-target
                  className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                  {project.title}
                </h1>

                {/* Qualitative decoder comparison */}
                <div className="mb-6 flex items-center gap-6">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-sm font-bold uppercase text-foreground">Transformer</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">More coherent captions</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-sm font-bold uppercase text-foreground">LSTM</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Recurrent baseline</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-sm font-bold uppercase text-foreground">Attention</p>
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Inspectable focus</p>
                  </div>
                </div>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <ProjectActions github={project.github} className="mb-8" />
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-xs uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <section>
                  <ProjectSectionLabel n="01" label="Preview" id="section-01" />
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
                </section>

                {/* 02 — Why I Built It */}
                <section>
                  <ProjectSectionLabel n="02" label="Why I Built It" id="section-02" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.why}
                  </p>
                </section>

                {/* 03 — How It Works */}
                <section>
                  <ProjectSectionLabel n="03" label="How It Works" id="section-03" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.how}
                  </p>
                </section>

                {/* 04 — Results */}
                <section>
                  <ProjectSectionLabel n="04" label="Decoder Comparison" id="section-04" />
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">
                    {project.results}
                  </p>
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="grid grid-cols-2 border-b border-border bg-card/60">
                      <div className="px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Decoder</div>
                      <div className="border-l border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Qualitative comparison</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.resultRows.map((row) => (
                        <div key={row.model} className="grid grid-cols-2">
                          <div className="px-4 py-3 text-sm text-foreground">{row.model}</div>
                          <div className="border-l border-border px-4 py-3 text-sm text-muted-foreground">{row.comparison}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 05 — Key Features */}
                <section>
                  <ProjectSectionLabel n="05" label="Key Features" id="section-05" />
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
                </section>

                {/* 06 — Technical Stack */}
                <section>
                  <ProjectSectionLabel n="06" label="Technical Stack" id="section-06" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-xs text-accent/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 07 — Friction & Takeaways */}
                <section>
                  <ProjectSectionLabel n="07" label="Friction & Takeaways" id="section-07" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
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
                </section>

              </div>
            </div>
          </div>
      </div>
    </>
  )
}
