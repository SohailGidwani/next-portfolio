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
  Heart,
  Home,
  Linkedin,
  Mail,
  Search,
  Sparkles,
  Trophy,
  User,
  X,
} from "lucide-react"
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
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    const platform = (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ?? navigator.userAgent
    setIsMac(/mac/i.test(platform))
  }, [])

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
        id: "personal",
        label: "Personal",
        description: "Beyond the code",
        icon: <Heart className="h-4 w-4" />,
        action: () => scrollToSection("personal"),
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
    [scrollToSection]
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
      <button
        onClick={() => {
          triggerHaptic()
          setIsOpen(true)
        }}
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/30 backdrop-blur transition hover:text-white/50 hover:border-white/[0.15] md:inline-flex"
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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-[#090909]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl glass-elevated"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                <Search className="h-5 w-5 text-white/25" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent font-body text-sm text-white outline-none placeholder:text-white/20"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-white/25 transition hover:text-white/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center font-body text-sm text-white/20">
                    No commands found
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(
                    ([category, items]) =>
                      items.length > 0 && (
                        <div key={category} className="mb-2">
                          <div className="px-2 py-1.5 text-[9px] font-body font-medium uppercase tracking-[0.3em] text-white/20">
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
                                    ? "bg-white/[0.06] text-white"
                                    : "text-white/30 hover:bg-white/[0.03] hover:text-white/50"
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    selectedIndex === globalIndex
                                      ? "bg-white/[0.08] text-white/60"
                                      : "bg-white/[0.03] text-white/20"
                                  }`}
                                >
                                  {cmd.icon}
                                </span>
                                <div className="flex-1">
                                  <div className="font-body text-sm font-medium">{cmd.label}</div>
                                  {cmd.description && (
                                    <div className="font-body text-xs text-white/20">
                                      {cmd.description}
                                    </div>
                                  )}
                                </div>
                                {selectedIndex === globalIndex && (
                                  <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/25">
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

              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 font-mono text-[10px] text-white/20">
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5">Esc</kbd>
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
