"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coffee, Gamepad2, Film, Sun, Waves, X, Heart } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import Image from "next/image"

interface PersonalProps {
  setActiveSection: (section: string) => void
}

interface Game {
  id: string
  title: string
  image: string
  description: string
}

const games: Game[] = [
  {
    id: "god-of-war",
    title: "God of War",
    image: "/images/personal/god-of-war.webp",
    description: "Kratos's journey of redemption and fatherhood. The way it weaves Norse mythology with raw emotion - chef's kiss.",
  },
  {
    id: "last-of-us",
    title: "The Last of Us",
    image: "/images/personal/last-of-us.jpg",
    description: "Joel and Ellie's story broke me. The writing, the world, the choices - it's less a game and more an experience.",
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    image: "/images/personal/ghost-of-tsushima.jpg",
    description: "Feudal Japan brought to life. Every frame is a painting. The haiku composing, the wind guiding you - pure poetry.",
  },
  {
    id: "spiderman-game",
    title: "Spider-Man",
    image: "/images/personal/spiderman-game.webp",
    description: "Swinging through NYC never gets old. Insomniac nailed what it feels like to BE Spider-Man.",
  },
  {
    id: "fifa",
    title: "FIFA",
    image: "/images/personal/fifa.webp",
    description: "When debates with friends need settling. Nothing like a FIFA showdown to determine who's really right.",
  },
]

const marvelFavorites = [
  {
    id: "spiderman",
    name: "Spider-Man",
    image: "/images/personal/spiderman.jpg",
    reason: "There's something about the way he never gives up - no matter how beaten, how broken, he always stands back up. That resilience resonates with me deeply.",
  },
  {
    id: "ironman",
    name: "Iron Man",
    image: "/images/personal/ironman.jpg",
    reason: "Always ready with a backup plan. Backups of backups. If one thing goes south, no worries - there's another plan. That level of preparation and foresight is something I deeply admire.",
  },
]

const lifestyle = [
  {
    id: "swimming",
    icon: <Waves className="h-5 w-5" />,
    label: "Swimming",
    detail: "There's a meditative quality to being in water. It's where I disconnect and reset.",
  },
  {
    id: "coffee",
    icon: <Coffee className="h-5 w-5" />,
    label: "Coffee",
    detail: "The ritual of a good cup. Less about the caffeine, more about the pause it creates.",
  },
  {
    id: "sunsets",
    icon: <Sun className="h-5 w-5" />,
    label: "Sunsets",
    detail: "End of Santa Monica Pier, watching the sun dip below the horizon. Those quiet moments of stillness.",
  },
]

type ModalContent = {
  type: "game" | "marvel" | "lifestyle"
  title: string
  image?: string
  icon?: React.ReactNode
  description: string
} | null

export default function Personal({ setActiveSection }: PersonalProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<ModalContent>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("personal")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [setActiveSection])

  const openGameModal = (game: Game) => {
    triggerHaptic()
    setSelected({
      type: "game",
      title: game.title,
      image: game.image,
      description: game.description,
    })
  }

  const openMarvelModal = (hero: typeof marvelFavorites[0]) => {
    triggerHaptic()
    setSelected({
      type: "marvel",
      title: hero.name,
      image: hero.image,
      description: hero.reason,
    })
  }

  const openLifestyleModal = (item: typeof lifestyle[0]) => {
    triggerHaptic()
    setSelected({
      type: "lifestyle",
      title: item.label,
      icon: item.icon,
      description: item.detail,
    })
  }

  return (
    <section id="personal" ref={sectionRef} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Beyond the Code</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            What keeps me going outside of work.
          </h2>
        </motion.div>

        {/* Marvel Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Film className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Marvel Universe</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {marvelFavorites.map((hero) => (
              <motion.button
                key={hero.id}
                type="button"
                onClick={() => openMarvelModal(hero)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-lg transition-all hover:border-primary/40 hover:shadow-xl aspect-[16/9]"
              >
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Favorite</span>
                  </div>
                  <h4 className="mt-1 font-display text-xl text-foreground">{hero.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{hero.reason}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gaming Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Story-Driven Games</h3>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                type="button"
                onClick={() => openGameModal(game)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card text-left shadow-md transition-all hover:border-primary/40 hover:shadow-lg aspect-[3/4]"
              >
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h4 className="font-display text-sm text-foreground leading-tight">{game.title}</h4>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Lifestyle Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sun className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Simple Pleasures</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {lifestyle.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => openLifestyleModal(item)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 text-left shadow-[0_12px_40px_-20px_rgba(0,0,0,0.3)] transition hover:border-primary/30"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                  {item.icon}
                </span>
                <div>
                  <span className="font-medium text-foreground">{item.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.detail}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-sm text-muted-foreground"
        >
          Tap any to learn more
        </motion.p>
      </div>

      {/* Detail Modal - Fixed for mobile */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-4 bottom-4 top-auto z-50 max-h-[80vh] overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto"
            >
              {/* Image header for games/marvel */}
              {selected.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 448px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background/70 text-muted-foreground backdrop-blur transition hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="p-6">
                {/* Header for lifestyle items without image */}
                {!selected.image && (
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {selected.icon}
                      </span>
                      <h3 className="font-display text-xl text-foreground">{selected.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Title for image items */}
                {selected.image && (
                  <h3 className="font-display text-xl text-foreground -mt-6 relative z-10">{selected.title}</h3>
                )}

                <p className={`text-sm leading-relaxed text-muted-foreground ${selected.image ? 'mt-3' : ''}`}>
                  {selected.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
