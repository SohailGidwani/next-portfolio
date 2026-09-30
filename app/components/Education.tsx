import Image, { StaticImageData } from "next/image"
import { Calendar, MapPin } from "lucide-react"
import SectionHeading from "./SectionHeading"
import uscLogo from "@/public/images/USC.jpg"
import tsecLogo from "@/public/images/TSEC.jpeg"

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
    degree: "M.S. in Computer Science",
    institution: "University of Southern California",
    year: "Aug 2025 - May 2027",
    cgpa: "GPA - 3.75 / 4.0",
    location: "Los Angeles, CA, USA",
    description: "Advanced studies in AI systems, retrieval, and large-scale software engineering.",
    achievements: [],
    courses: ["Analysis of Algorithms", "Information Retrieval and Web Search Engines", "ML for Data Science", "Applied NLP", "Deep Learning", "Database Systems"],
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
]

export default function Education() {
  return (
    <section id="education" className="section-y">
      <div className="container mx-auto px-4">
        <SectionHeading>Education</SectionHeading>

        {/* The same cards as the roles in Experience, side by side, so the
            section reads in the page's own language rather than as a ruled
            ledger. They open nothing, so they carry no hover state. */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <article key={item.degree} className="flex h-full flex-col rounded border border-border bg-card/80 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-background">
                  <Image src={item.logo} alt={`${item.institution} logo`} fill placeholder="blur" className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-snug text-foreground">{item.degree}</h3>
                  <p className="text-xs text-muted-foreground">{item.institution}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-accent" aria-hidden />
                  {item.year}
                </span>
                {item.location ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-accent" aria-hidden />
                    {item.location}
                  </span>
                ) : null}
                <span className="font-mono uppercase tracking-[0.15em] text-accent">{item.cgpa}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

              {item.courses && item.courses.length > 0 ? (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Coursework</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.courses.map((course) => (
                      <span
                        key={course}
                        /* No tracking on phones (and a size down on the
                           narrowest): inside the card the longest course name
                           is otherwise a few pixels wider than the card, so
                           it alone wraps to two lines and reads as a box next
                           to single-line chips. */
                        className="rounded-[3px] border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-normal text-muted-foreground max-[379px]:text-[10px] sm:text-xs sm:tracking-[0.1em]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
