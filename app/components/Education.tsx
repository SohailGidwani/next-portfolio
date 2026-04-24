import Image, { StaticImageData } from "next/image"
import uscLogo from "@/public/images/USC.jpg"
import tsecLogo from "@/public/images/TSEC.jpeg"
import jaiHindLogo from "@/public/images/JaiHind.jpg"

interface EducationItem {
  degree: string
  institution: string
  year: string
  cgpa: string
  description: string
  location?: string
  achievements?: string[]
  courses?: string[]
  logo: StaticImageData
}

const education: EducationItem[] = [
  {
    degree: "M.S in Computer Science",
    institution: "University of Southern California",
    year: "August 2025 - May 2027",
    cgpa: "GPA - 3.5 / 4.0",
    location: "Los Angeles, CA, USA",
    description: "Advanced studies in AI systems, retrieval, and large-scale software engineering.",
    achievements: [],
    courses: ["Analysis of Algorithms", "Information Retrieval and Web Search Engines", "ML for Data Science", "Applied NLP"],
    logo: uscLogo,
  },
  {
    degree: "B.E in Computer Engineering",
    institution: "University of Mumbai - TSEC",
    year: "Aug 2019 - May 2023",
    cgpa: "CGPA - 9.05 / 10",
    location: "Mumbai, India",
    description:
      "Focus on AI/ML, cloud computing, and full-stack development with strong academic performance.",
    achievements: [],
    courses: ["Artificial Intelligence", "Machine Learning", "Advanced DBMS", "Cloud Computing", "Data Structures & Algorithms", "Operating Systems", "Software Engineering", "Object-Oriented Programming", "Big Data Analytics", "Computer Networks", "Cryptography & System Security", "Blockchain"],
    logo: tsecLogo,
  },
  {
    degree: "Science - HSC",
    institution: "Jai Hind College, Mumbai",
    year: "2017 - 2019",
    cgpa: "Percentage - 71.38%",
    location: "Mumbai, India",
    description: "Foundation in science and mathematics with early exposure to computer science.",
    achievements: [],
    courses: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
    logo: jaiHindLogo,
  },
]

export default function Education() {
  return (
    <section id="education" className="section-y">
      <div className="container mx-auto px-4">
        <div className="animate-in-view space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Education</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Structured learning, layered over curiosity.
          </h2>
        </div>

        <div className="mt-12">
          {education.map((item, index) => {
            const n = String(index + 1).padStart(2, "0")

            return (
              <div
                key={item.degree}
                className="group/section grid grid-cols-1 gap-5 border-t border-border py-8 sm:py-10 lg:grid-cols-[220px_1fr] lg:gap-10 xl:grid-cols-[260px_1fr]"
              >
                {/* Left column — number + year + location + cgpa */}
                <div className="flex flex-col justify-start lg:pt-0.5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {n}
                    </span>
                    <div className="h-px w-4 bg-accent/50 transition-all duration-500 group-hover/section:w-8" />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {item.year}
                  </p>
                  {item.location && (
                    <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground/60">
                      {item.location}
                    </p>
                  )}
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-accent/80">
                    {item.cgpa}
                  </p>
                </div>

                {/* Right column — institution, description, courses */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-border bg-background">
                      <Image
                        src={item.logo}
                        alt={`${item.institution} logo`}
                        fill
                        placeholder="blur"
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-display text-2xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
                        {item.degree}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.institution}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {item.courses && item.courses.length > 0 && (
                    <div className="mt-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                        Coursework
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.courses.map((course) => (
                          <span
                            key={course}
                            className="rounded-[3px] border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  )
}
