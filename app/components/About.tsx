import { Brain, Compass, Sparkles, Users } from "lucide-react"

const traits = [
  {
    title: "Systems Thinking",
    description: "I think about the whole picture, not just the model. Data in, guardrails, UX, all of it.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Collaborative",
    description: "I like working with designers, researchers, and other engineers. Better products come out of it.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Curious",
    description: "I'm always trying out new models, reading papers, and breaking things to see how they work.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Product-Led",
    description: "I'd rather ship something useful in a week than spend a month on something nobody asked for.",
    icon: <Compass className="h-5 w-5" />,
  },
]

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="animate-in-view space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">About</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              I like making AI things that people can actually use.
            </h2>
            <div className="space-y-4 text-base text-muted-foreground">
              <p>
                I'm an AI engineer and full-stack developer. I've worked on everything from RAG pipelines and LLM integrations to React frontends and Flask APIs. What I care about most is taking something complex and making it feel simple for the person using it.
              </p>
              <p>
                I tend to move fast, prototype a lot, and then clean things up once I know what works. Ambiguous problems don't scare me. If anything, those are the ones I find most interesting.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-6 text-sm text-muted-foreground">
              <p className="font-display text-lg text-foreground">Focus</p>
              <p className="mt-2">
                Applied AI, retrieval systems, and building products that don't break when real people use them.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {traits.map((trait, index) => (
              <div
                key={trait.title}
                className={`animate-in-view rounded-2xl border border-border bg-card/80 p-5 shadow-card${
                  index > 0 ? ` animate-in-view-stagger-${index}` : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {trait.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-foreground">{trait.title}</h3>
                    <p className="text-sm text-muted-foreground">{trait.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
