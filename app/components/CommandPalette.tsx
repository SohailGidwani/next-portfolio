"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Bot,
  Briefcase,
  Command,
  Database,
  Eye,
  FileText,
  FlaskConical,
  FolderKanban,
  Github,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Linkedin,
  Mail,
  Moon,
  Newspaper,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio } from "./PortfolioProvider"
import { smoothScrollToId, smoothScrollToTop } from "@/app/utils/smoothScroll"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface CommandItem {
  id: string
  label: string
  description?: string
  route?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  category: "navigation" | "projects" | "research" | "experience" | "actions" | "links"
}

function scoreCommand(cmd: CommandItem, q: string): number {
  if (!q) return 1
  const query = q.toLowerCase().trim()
  if (!query) return 1
  const label = cmd.label.toLowerCase()
  const desc = (cmd.description ?? "").toLowerCase()
  const keys = (cmd.keywords ?? []).map((k) => k.toLowerCase())

  if (label.startsWith(query)) return 100
  if (label.includes(` ${query}`)) return 90
  if (label.includes(query)) return 80
  if (keys.some((k) => k.startsWith(query))) return 60
  if (keys.some((k) => k.includes(query))) return 40
  if (desc.includes(query)) return 20

  // subsequence: "img cap" matches "image captioning"
  let i = 0
  for (const ch of label) {
    if (ch === query[i]) i++
    if (i === query.length) return 10
  }
  return 0
}

export default function CommandPalette() {
  const { setActiveSection, startTour } = usePortfolio()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isMac, setIsMac] = useState(true)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const platform = (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ?? navigator.userAgent
    setIsMac(/mac/i.test(platform))
  }, [])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === "hero") {
        smoothScrollToTop()
      } else {
        smoothScrollToId(sectionId)
      }
      setActiveSection(sectionId)
      setIsOpen(false)
    },
    [setActiveSection]
  )

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "home",
        label: "Home",
        description: "Go to top",
        icon: <Home className="h-4 w-4" />,
        action: () => scrollToSection("hero"),
        keywords: ["hero", "top", "start"],
        category: "navigation",
      },
      {
        id: "about",
        label: "About",
        description: "Learn about me",
        route: "/about",
        icon: <User className="h-4 w-4" />,
        action: () => {
          window.location.href = "/about"
        },
        keywords: ["bio", "introduction", "who"],
        category: "navigation",
      },
      {
        id: "education",
        label: "Education",
        description: "Academic background",
        icon: <GraduationCap className="h-4 w-4" />,
        action: () => scrollToSection("education"),
        keywords: ["school", "university", "degree"],
        category: "navigation",
      },
      {
        id: "experience",
        label: "Experience",
        description: "Work history",
        icon: <Briefcase className="h-4 w-4" />,
        action: () => scrollToSection("experience"),
        keywords: ["work", "jobs", "career"],
        category: "navigation",
      },
      {
        id: "skills",
        label: "Skills",
        description: "Technologies I use",
        icon: <Sparkles className="h-4 w-4" />,
        action: () => scrollToSection("skills"),
        keywords: ["tech", "stack", "tools"],
        category: "navigation",
      },
      {
        id: "projects",
        label: "Projects",
        description: "Featured work",
        icon: <FolderKanban className="h-4 w-4" />,
        action: () => scrollToSection("projects"),
        keywords: ["work", "portfolio", "builds"],
        category: "navigation",
      },
      {
        id: "triumphs",
        label: "Triumphs",
        description: "Achievements",
        icon: <Trophy className="h-4 w-4" />,
        action: () => scrollToSection("triumphs"),
        keywords: ["achievements", "awards", "certificates"],
        category: "navigation",
      },
      {
        id: "personal",
        label: "Personal",
        description: "Beyond the code",
        route: "/about#personal",
        icon: <Heart className="h-4 w-4" />,
        action: () => {
          window.location.href = "/about#personal"
        },
        keywords: ["hobbies", "interests", "games", "marvel"],
        category: "navigation",
      },
      {
        id: "contact",
        label: "Contact",
        description: "Get in touch",
        icon: <Mail className="h-4 w-4" />,
        action: () => scrollToSection("contact"),
        keywords: ["email", "hire", "connect"],
        category: "navigation",
      },
      // Projects
      {
        id: "project-portage",
        label: "Portage",
        description: "Autonomous code-migration agent",
        route: "/projects/portage",
        icon: <Bot className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/portage"
        },
        keywords: [
          "agent",
          "autonomous",
          "migration",
          "langgraph",
          "fastapi",
          "flask",
          "mcp",
          "sandbox",
          "docker",
          "eval",
          "checkpoint",
          "blast radius",
        ],
        category: "projects",
      },
      {
        id: "project-knowledge-hub",
        label: "Knowledge Hub",
        description: "AI-powered document manager",
        route: "/projects/knowledge-hub",
        icon: <Database className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/knowledge-hub"
        },
        keywords: [
          "rag",
          "ocr",
          "pgvector",
          "postgres",
          "search",
          "semantic",
          "ollama",
          "llm",
          "documents",
          "pdf",
          "flask",
          "docker",
        ],
        category: "projects",
      },
      {
        id: "project-image-captioning",
        label: "Image Feature Detection & Captioning",
        description: "CNN features with LSTM and Transformer decoders",
        route: "/projects/image-captioning",
        icon: <Eye className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/image-captioning"
        },
        keywords: [
          "image",
          "caption",
          "vision",
          "cnn",
          "transformer",
          "lstm",
          "vgg",
          "tensorflow",
          "computer vision",
          "nlp",
          "streamlit",
          "be project",
        ],
        category: "projects",
      },
      {
        id: "project-tech-updates",
        label: "Tech Updates",
        description: "AI-categorized tech news aggregator",
        route: "/projects/tech-updates",
        icon: <Newspaper className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/tech-updates"
        },
        keywords: [
          "news",
          "scraper",
          "qdrant",
          "vector",
          "azure openai",
          "gpt",
          "medium",
          "hacker news",
          "crunchbase",
          "flask",
          "react",
        ],
        category: "projects",
      },
      {
        id: "project-scribeglobe",
        label: "ScribeGlobe",
        description: "Medium-style blogging platform",
        route: "/projects/scribeglobe",
        icon: <Globe className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/scribeglobe"
        },
        keywords: [
          "blog",
          "blogging",
          "medium",
          "hono",
          "cloudflare",
          "workers",
          "serverless",
          "edge",
          "vite",
          "react",
          "postgres",
          "fullstack",
        ],
        category: "projects",
      },
      {
        id: "project-cot-faithfulness",
        label: "CoT Faithfulness Analysis",
        description: "CSCI-544 @ USC: probing whether LLM chain-of-thought is causal or decorative",
        route: "/projects/cot-faithfulness",
        icon: <FlaskConical className="h-4 w-4" />,
        action: () => {
          window.location.href = "/projects/cot-faithfulness"
        },
        keywords: [
          "cot",
          "chain of thought",
          "faithfulness",
          "llm",
          "reasoning",
          "nlp",
          "interpretability",
          "llama",
          "qwen",
          "ollama",
          "gsm8k",
          "arc",
          "benchmark",
          "usc",
          "csci-544",
          "course project",
          "research",
          "python",
        ],
        category: "projects",
      },
      // Experience
      {
        id: "experience-keck-usc",
        label: "Keck School of Medicine of USC",
        description: "Research Assistant · Oct 2025–Present",
        icon: <Briefcase className="h-4 w-4" />,
        action: () => {
          scrollToSection("experience")
          requestAnimationFrame(() => {
            window.dispatchEvent(
              new CustomEvent("portfolio:open-experience", { detail: { id: "keck-usc" } })
            )
          })
        },
        keywords: [
          "keck",
          "usc",
          "research",
          "research assistant",
          "alzheimer",
          "alzheimers",
          "vlm",
          "vqa",
          "rag",
          "neuroimaging",
          "mri",
          "pytorch",
          "clip",
          "deep learning",
          "medical",
        ],
        category: "experience",
      },
      {
        id: "experience-insaito",
        label: "Insaito, Inc.",
        description: "Senior Software Engineer I · May–Jul 2025",
        icon: <Briefcase className="h-4 w-4" />,
        action: () => {
          scrollToSection("experience")
          requestAnimationFrame(() => {
            window.dispatchEvent(
              new CustomEvent("portfolio:open-experience", { detail: { id: "insaito" } })
            )
          })
        },
        keywords: [
          "insaito",
          "ai agent",
          "agent builder",
          "llm",
          "qwen",
          "mistral",
          "oauth",
          "mcp",
          "model context protocol",
          "typescript",
          "next.js",
          "node",
          "mongodb",
          "startup",
        ],
        category: "experience",
      },
      {
        id: "experience-iifl",
        label: "IIFL Finance Ltd",
        description: "Full Stack Software Developer · Jun 2023–May 2025",
        icon: <Briefcase className="h-4 w-4" />,
        action: () => {
          scrollToSection("experience")
          requestAnimationFrame(() => {
            window.dispatchEvent(
              new CustomEvent("portfolio:open-experience", { detail: { id: "iifl" } })
            )
          })
        },
        keywords: [
          "iifl",
          "finance",
          "fintech",
          "chatbot",
          "rag",
          "fraud",
          "groundingdino",
          "swin",
          "transformer",
          "azure",
          "openai",
          "gpt",
          "qdrant",
          "flask",
          "python",
          "compliance",
          "capitalgenie",
        ],
        category: "experience",
      },
      // Research
      {
        id: "research-alzheimers-vqa",
        label: "Multimodal Alzheimer's VQA",
        description: "VLM + RAG for clinical visual question answering",
        route: "/research/memoir-vlm-alzheimers-vqa",
        icon: <FlaskConical className="h-4 w-4" />,
        action: () => {
          window.location.href = "/research/memoir-vlm-alzheimers-vqa"
        },
        keywords: [
          "research",
          "paper",
          "alzheimer",
          "alzheimers",
          "dementia",
          "vqa",
          "vlm",
          "vision language model",
          "rag",
          "mri",
          "dti",
          "image",
          "imaging",
          "clinical",
          "medical",
          "keck",
          "usc",
          "mistral",
          "gemma",
          "medgemma",
          "faiss",
        ],
        category: "research",
      },
      // Actions
      {
        id: "guided-tour",
        label: "Guided Tour",
        description: "Walk through the portfolio",
        icon: <Sparkles className="h-4 w-4" />,
        action: () => {
          setIsOpen(false)
          requestAnimationFrame(startTour)
        },
        keywords: ["tour", "guide", "walkthrough"],
        category: "actions",
      },
      {
        id: "toggle-theme",
        label: resolvedTheme === "dark" ? "Light Mode" : "Dark Mode",
        description: "Toggle theme",
        icon: resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        action: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
          setIsOpen(false)
        },
        keywords: ["theme", "dark", "light", "mode"],
        category: "actions",
      },
      // Links
      // {
      //   id: "blogs",
      //   label: "Blogs",
      //   description: "Read articles",
      //   icon: <FileText className="h-4 w-4" />,
      //   action: () => {
      //     window.location.href = "/blogs"
      //   },
      //   keywords: ["articles", "posts", "writing"],
      //   category: "links",
      // },
      {
        id: "resume",
        label: "Resume",
        description: "Download CV",
        icon: <FileText className="h-4 w-4" />,
        action: () => {
          window.open("/documents/Sohail_Gidwani_Resume.pdf", "_blank")
          setIsOpen(false)
        },
        keywords: ["cv", "pdf", "download"],
        category: "links",
      },
      {
        id: "github",
        label: "GitHub",
        description: "View repositories",
        icon: <Github className="h-4 w-4" />,
        action: () => {
          window.open("https://github.com/SohailGidwani", "_blank")
          setIsOpen(false)
        },
        keywords: ["code", "repos"],
        category: "links",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        description: "Connect with me",
        icon: <Linkedin className="h-4 w-4" />,
        action: () => {
          window.open("https://linkedin.com/in/sohail-gidwani", "_blank")
          setIsOpen(false)
        },
        keywords: ["social", "network", "connect"],
        category: "links",
      },
    ],
    [resolvedTheme, setTheme, scrollToSection, startTour]
  )

  const filteredCommands = useMemo(() => {
    const scored = commands.flatMap((cmd) => {
      const score = scoreCommand(cmd, search)
      return score > 0 ? [{ cmd, score }] : []
    })
    const order: CommandItem["category"][] = [
      "navigation",
      "experience",
      "projects",
      "research",
      "actions",
      "links",
    ]
    return order.flatMap((cat) =>
      scored
        .filter((x) => x.cmd.category === cat)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.cmd)
    )
  }, [search, commands])

  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: CommandItem[] } = {
      navigation: [],
      experience: [],
      projects: [],
      research: [],
      actions: [],
      links: [],
    }
    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        triggerHaptic()
        setIsOpen((prev) => !prev)
        setSearch("")
        setSelectedIndex(0)
      }

      if (!isOpen) return

      if (e.key === "Escape") {
        setIsOpen(false)
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      }

      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault()
        triggerHaptic()
        filteredCommands[selectedIndex].action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Scroll selected item into view
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const selected = listRef.current.querySelector('[data-selected="true"]')
    if (selected) {
      selected.scrollIntoView({ block: "nearest", behavior: "auto" })
    }
  }, [selectedIndex, isOpen])

  const categoryLabels: { [key: string]: string } = {
    navigation: "Navigate",
    experience: "Experience",
    projects: "Projects",
    research: "Research",
    actions: "Actions",
    links: "Links",
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => triggerHaptic()}
          aria-label="Open command palette"
          aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-1.5 rounded border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur transition hover:border-accent/40 hover:text-foreground md:inline-flex"
        >
          {isMac ? (
            <>
              <Command className="h-3 w-3" />
              <span>K</span>
            </>
          ) : (
            <>
              <span className="font-medium">Ctrl</span>
              <span>+</span>
              <span>K</span>
            </>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        showClose={false}
        className="top-[20%] max-w-lg translate-y-0 gap-0 overflow-hidden rounded p-0"
      >
              <DialogTitle className="sr-only">Command palette</DialogTitle>
              <DialogDescription className="sr-only">
                Search portfolio pages, projects, experience, and actions.
              </DialogDescription>
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  aria-label="Search commands"
                  className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close command palette"
                    className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No commands found
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(
                    ([category, items]) =>
                      items.length > 0 && (
                        <div key={category} className="mb-2">
                          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {categoryLabels[category]}
                          </div>
                          {items.map((cmd) => {
                            const globalIndex = filteredCommands.indexOf(cmd)
                            return (
                              <button
                                key={cmd.id}
                                data-selected={selectedIndex === globalIndex}
                                onClick={() => {
                                  triggerHaptic()
                                  cmd.action()
                                }}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition ${
                                  selectedIndex === globalIndex
                                    ? "bg-accent/10 text-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded ${
                                    selectedIndex === globalIndex
                                      ? "bg-accent/20 text-accent"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {cmd.icon}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">{cmd.label}</div>
                                  {cmd.description && (
                                    <div className="truncate text-xs text-muted-foreground">
                                      {cmd.description}
                                    </div>
                                  )}
                                  {cmd.route && (
                                    <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground/70">
                                      {cmd.route}
                                    </div>
                                  )}
                                </div>
                                {selectedIndex === globalIndex && (
                                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                    Enter
                                  </kbd>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                  )
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
      </DialogContent>
    </Dialog>
  )
}
