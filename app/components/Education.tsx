import { Calendar, MapPin } from "lucide-react"
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
    achievements: [

    ],
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
    <section id="education" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="animate-in-view space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Education</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Structured learning, layered over curiosity.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {education.map((item, index) => (
            <div
              key={item.degree}
              className={`animate-in-view group rounded-3xl border bg-card/80 p-5 shadow-card transition hover:-translate-y-1${
                index > 0 ? ` animate-in-view-stagger-${index}` : ""
              } ${
                index === 0
                  ? "border-border ring-1 ring-primary/10 md:col-span-2 lg:col-span-1"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border bg-background">
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
                  <h3 className="font-display text-lg text-foreground">{item.degree}</h3>
                  <p className="text-sm text-muted-foreground">{item.institution}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {item.cgpa}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 text-primary" />
                  {item.year}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />
                    {item.location}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

              {item.achievements && item.achievements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.achievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              )}

              {item.courses && item.courses.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                    Coursework
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.courses.map((course) => (
                      <span
                        key={course}
                        className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
