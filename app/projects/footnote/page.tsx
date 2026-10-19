import Image from "next/image"
import { Barlow_Semi_Condensed } from "next/font/google"
import { Badge } from "@/app/components/ui/badge"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"
import ProjectImageLightbox, { ProjectImageTrigger } from "@/app/components/ProjectImageLightbox"
import ProjectActions from "@/app/projects/components/ProjectActions"
import ProjectSectionLabel from "@/app/projects/components/ProjectSectionLabel"
import SectionTOC from "@/app/components/SectionTOC"
import MobileChapterNav from "@/app/components/MobileChapterNav"
import GlassesFigure from "./components/GlassesFigure"
import phoneDraft from "@/public/images/footnote/phone-draft.png"
import agentPrep from "@/public/images/footnote/asi-meeting-prep.png"

// A narrow face close to the G2's own firmware font, used only inside the glasses figure.
const g2Font = Barlow_Semi_Condensed({
  weight: "300",
  subsets: ["latin"],
  preload: false,
})

const tocItems = [
  { id: "section-01", n: "01", label: "Why we built it" },
  { id: "section-02", n: "02", label: "On the glasses" },
  { id: "section-03", n: "03", label: "After the meeting" },
  { id: "section-04", n: "04", label: "How it works" },
  { id: "section-05", n: "05", label: "What I built" },
  { id: "section-06", n: "06", label: "Problems we hit" },
  { id: "section-07", n: "07", label: "What it doesn't do" },
]

const project = {
  title: "Footnote: Meeting Context on Smart Glasses",
  description:
    "An app for Even Realities G2 glasses that explains company jargon while the meeting is happening. You see what a word means and who to ask, save questions without interrupting, and send them afterwards once you've read them.",
  tags: ["TypeScript", "Even Hub SDK", "FastAPI", "SQLite", "ElevenLabs", "StepFun", "Fetch.ai", "React"],
  github: "https://github.com/SohailGidwani/Footnote",
  video: "https://youtu.be/yOo_5GBPvQ0",
  devpost: "https://devpost.com/software/footnote-dh1fi9",
  prepChat: "https://asi1.ai/shared-chat/886cf7a4-bd67-49f6-a14c-34ecbf9bcf07",
  sendChat: "https://asi1.ai/shared-chat/3e91ca9e-4730-4f89-bf64-0c24467f87e1",
}

const images = [
  { src: phoneDraft, alt: "Footnote phone app showing the email to Priya about Bluebird before it is sent", caption: "The phone app in demo mode: read the email before it goes out", position: "object-top" },
  { src: agentPrep, alt: "The Footnote agent in ASI:One preparing a telemetry review about Ridgeline and FCS", caption: "The agent prepping a telemetry review in ASI:One", position: "object-left-top" },
]

const flow = [
  { tag: "Glasses", text: "The G2 mic records the meeting" },
  { tag: "Phone", text: "Sends the audio in 4-second chunks" },
  { tag: "Backend", text: "ElevenLabs turns speech into text" },
  { tag: "Match", text: "Known words go straight back as cards" },
]

const built = [
  { lead: "The glasses and phone app.", rest: " Gestures, recording the mic in chunks, the phone screens and reviewing drafts." },
  { lead: "The digest page", rest: " that shows the words you heard and the people worth meeting." },
  { lead: "Speech matching fixes,", rest: " so “run book” matches runbook and “HAL nine” matches HAL-9." },
  { lead: "The agent's meeting prep", rest: " and the approval step for sending follow-ups from ASI:One." },
  { lead: "Deploying it", rest: " and testing everything on the real glasses." },
]

const problems = [
  {
    title: "The app wouldn't start on the glasses",
    text: "We were setting text brightness as high as 15, and the G2 only accepts 0 to 4. Fixing the values got it running, and a test now checks the real startup settings.",
  },
  {
    title: "A new project name never showed up",
    text: "The model needed 10 to 20 seconds to explain a name it didn't know, longer than our limit. We gave that background work up to 25 seconds while the phone still stops waiting after 6, so the card just shows up a little later.",
  },
  {
    title: "Three emails went missing",
    text: "Every email we tested arrived, but USC's mail filter held three of them in quarantine. Once I released them, they showed up in the inbox.",
  },
]

const limits = [
  "The company and its glossary are made up. Nobody used it at a real job.",
  "It's one shared demo account, not something a team could sign into.",
  "We never measured how long a card takes to show up on the glasses.",
  "The servers are off now. The demo video and the two agent chats show it working.",
]

export default function FootnotePage() {
  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="footnote"
        image="/images/footnote/glasses-light.png"
        keywords={project.tags}
        github={project.github}
        dateCreated="2026-10-17"
        projectType="app"
      />
      <ProjectImageLightbox images={images}>
        <div className="min-h-screen overflow-x-clip bg-background text-foreground">
          <ProjectNav />
          {/* Chapter wayfinding: the rail above 1200px, the pill below it. */}
          <SectionTOC items={tocItems} />
          <MobileChapterNav items={tocItems} />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <h1
                  data-vt-title-target
                  className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                  {project.title}
                </h1>

                <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-2xl font-medium text-foreground">Real G2</p>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">Tested on the actual glasses, not just the simulator</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-medium text-foreground">1 press</p>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">Saves a question for after the meeting</p>
                  </div>
                  <div className="border-l-2 border-border pl-4">
                    <p className="font-mono text-2xl font-medium text-foreground">0</p>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">Emails sent without you approving them</p>
                  </div>
                </div>
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.15em] text-accent">
                  LA Hacks 2026 · with Kartik Pradip Shelar
                </p>

                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <ProjectActions
                  github={project.github}
                  links={[
                    { href: project.video, label: "Watch the demo", icon: "play" },
                    { href: project.devpost, label: "Devpost" },
                  ]}
                  className="mb-8"
                />
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-xs uppercase tracking-[0.1em]">
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

                <section>
                  <ProjectSectionLabel n="01" label="Why we built it" id="section-01" />
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    <p>
                      Kartik and I both worked for about two years before our master&apos;s. We&apos;d talked a few
                      times about being new and sitting in meetings where people said DRI, RFC, SEV2 or cutover, and
                      we had no idea what they meant. You either interrupt, look it up on your phone, or lose the
                      thread.
                    </p>
                    <p>
                      When we saw the Even G2 glasses at LA Hacks, that moment felt like exactly what they could help
                      with. So we built it.
                    </p>
                  </div>
                </section>

                <section>
                  <ProjectSectionLabel n="02" label="On the glasses" id="section-02" />
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    The glasses listen during the meeting. When a word from the company glossary comes up, you get a
                    small card with what it means and who to ask.
                  </p>
                  <GlassesFigure fontClass={g2Font.className} />
                </section>

                <section>
                  <ProjectSectionLabel n="03" label="After the meeting" id="section-03" />
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    <p>
                      Every saved question goes into one email per person. You read each one on your phone, and
                      nothing sends until you approve it. For the demo, all emails go to our own inbox.
                    </p>
                    <p>
                      There&apos;s also a Fetch.ai agent you can talk to in ASI:One. It reads the same saved meeting
                      data, so you can ask it what a word means, what you learned today, or to prep you for your next
                      meeting. It can send your follow-ups too, but only after you approve each one.
                    </p>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {images.map((image, index) => (
                      <figure key={image.alt} className="overflow-hidden rounded border border-border bg-card">
                        <ProjectImageTrigger
                          index={index}
                          label={`Expand ${image.alt}`}
                          className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden text-left"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className={`object-cover ${image.position}`}
                            sizes="(max-width: 640px) 100vw, 384px"
                          />
                        </ProjectImageTrigger>
                        <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                          {image.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    <a href={project.prepChat} target="_blank" rel="noopener noreferrer" className="link-action">
                      Agent chat: meeting prep
                    </a>
                    <a href={project.sendChat} target="_blank" rel="noopener noreferrer" className="link-action">
                      Agent chat: sending follow-ups
                    </a>
                  </div>
                </section>

                <section>
                  <ProjectSectionLabel n="04" label="How it works" id="section-04" />
                  <ol className="grid gap-3 sm:grid-cols-4">
                    {flow.map((node) => (
                      <li key={node.tag} className="rounded border border-border bg-card p-4">
                        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{node.tag}</p>
                        <p className="text-sm leading-snug text-foreground">{node.text}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 rounded border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="text-foreground">Words it doesn&apos;t know</span>, like a new project name, go to
                    StepFun in the background. The card shows up a bit later, marked as a guess, so the known words
                    never wait on the model.
                  </p>
                </section>

                <section>
                  <ProjectSectionLabel n="05" label="What I built" id="section-05" />
                  <ul className="space-y-3">
                    {built.map((item) => (
                      <li key={item.lead} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" />
                        <span>
                          <span className="text-foreground">{item.lead}</span>
                          {item.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    Kartik built the backend, the company data, the first version of the agent and the final design.
                  </p>
                </section>

                <section>
                  <ProjectSectionLabel n="06" label="Problems we hit" id="section-06" />
                  <div className="space-y-3">
                    {problems.map((problem) => (
                      <div key={problem.title} className="rounded border border-border bg-card p-5">
                        <h3 className="mb-1.5 font-display text-base font-bold tracking-tight text-foreground">
                          {problem.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{problem.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <ProjectSectionLabel n="07" label="What it doesn't do" id="section-07" />
                  <ul className="space-y-3">
                    {limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-border" />
                        {limit}
                      </li>
                    ))}
                  </ul>
                </section>

              </div>
            </div>
          </div>
        </div>
      </ProjectImageLightbox>
    </>
  )
}
