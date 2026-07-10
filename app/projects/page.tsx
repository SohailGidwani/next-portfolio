import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProjectNav from "@/app/components/ProjectNav"
import BreadcrumbStructuredData from "@/app/components/BreadcrumbStructuredData"
import InteractiveCard from "@/app/components/ui/InteractiveCard"
import { projects } from "@/app/data/projects"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BreadcrumbStructuredData
        id="projects-breadcrumb"
        items={[{ name: "Projects", item: "/projects" }]}
      />
      <ProjectNav />

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Projects</p>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">All projects</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Everything I've shipped, from AI pipelines to full-stack apps. Click into any of them for the full story.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group block h-full">
              {/* Lift lives on this wrapper: InteractiveCard's tilt owns the card's own
                  transform, so a hover translate there would be overridden. */}
              <div className="h-full transition-transform duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              <InteractiveCard
                tilt
                className="group flex h-full cursor-pointer flex-col rounded border border-foreground/10 bg-card2 p-5 shadow-card transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-card-hover"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="absolute inset-0 z-[1] rounded"
                  aria-label={`View ${project.title}`}
                >
                  <span className="sr-only">View {project.title}</span>
                </Link>
                <div className="relative h-40 w-full overflow-hidden rounded">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-4 flex-1 space-y-2">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {project.kind}
                  </p>
                  <h2 className="font-display text-xl text-foreground">{project.title}</h2>
                  <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {project.outcome}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-border/70 bg-background/60 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:border-accent/40 group-hover:text-foreground">
                    Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
                    aria-label={`Open ${project.title} on GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </InteractiveCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
