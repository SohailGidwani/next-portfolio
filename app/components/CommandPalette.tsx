"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Briefcase,
  Command,
  FileText,
  FolderKanban,
  Github,
  GraduationCap,
  Home,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { triggerHaptic } from "./ui/haptics"

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  category: "navigation" | "actions" | "links"
}

interface CommandPaletteProps {
  onNavigate?: (sectionId: string) => void
}

export default function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { theme, setTheme } = useTheme()

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
        onNavigate?.(sectionId)
      }
      setIsOpen(false)
    },
    [onNavigate]
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
        icon: <User className="h-4 w-4" />,
        action: () => scrollToSection("about"),
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
        id: "contact",
        label: "Contact",
        description: "Get in touch",
        icon: <Mail className="h-4 w-4" />,
        action: () => scrollToSection("contact"),
        keywords: ["email", "hire", "connect"],
        category: "navigation",
      },
      // Actions
      {
        id: "toggle-theme",
        label: theme === "dark" ? "Light Mode" : "Dark Mode",
        description: "Toggle theme",
        icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark")
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
    [theme, setTheme, scrollToSection]
  )

  const filteredCommands = useMemo(() => {
    if (!search) return commands
    const lower = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower) ||
        cmd.keywords?.some((k) => k.includes(lower))
    )
  }, [search, commands])

  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: CommandItem[] } = {
      navigation: [],
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
      selected.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [selectedIndex, isOpen])

  const categoryLabels: { [key: string]: string } = {
    navigation: "Navigate",
    actions: "Actions",
    links: "Links",
  }

  return (
    <>
      {/* Trigger hint */}
      <button
        onClick={() => {
          triggerHaptic()
          setIsOpen(true)
        }}
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur transition hover:border-primary/40 hover:text-foreground md:inline-flex"
      >
        <Command className="h-3 w-3" />
        <span>K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
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
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                  selectedIndex === globalIndex
                                    ? "bg-primary/10 text-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    selectedIndex === globalIndex
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {cmd.icon}
                                </span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{cmd.label}</div>
                                  {cmd.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {cmd.description}
                                    </div>
                                  )}
                                </div>
                                {selectedIndex === globalIndex && (
                                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
