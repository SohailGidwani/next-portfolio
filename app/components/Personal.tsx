"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Coffee, Gamepad2, Film, Sun, Waves, Heart } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog"

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
    description: "Kratos and Atreus. The father-son dynamic, the Norse mythology, the combat. This game just hits different every time I replay it.",
  },
  {
    id: "last-of-us",
    title: "The Last of Us",
    image: "/images/personal/last-of-us.jpg",
    description: "I don't think any game has wrecked me the way this one did. Joel and Ellie's story is less a game and more something that stays with you.",
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    image: "/images/personal/ghost-of-tsushima.jpg",
    description: "Every single frame of this game looks like a painting. And the haiku composing, the wind guiding you around the map. Pure poetry.",
  },
  {
    id: "spiderman-game",
    title: "Spider-Man",
    image: "/images/personal/spiderman-game.webp",
    description: "Swinging through NYC never gets old. Insomniac absolutely nailed what it feels like to be Spider-Man.",
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
    reason: "No matter how beaten, how outmatched, he gets back up. Every time. That kind of resilience is something I try to carry into my own life.",
  },
  {
    id: "ironman",
    name: "Iron Man",
    image: "/images/personal/ironman.jpg",
    reason: "Always has a backup plan. And a backup for the backup. If one thing goes south, there's already another plan ready. I try to think like that when I'm building systems.",
  },
]

const lifestyle = [
  {
    id: "swimming",
    icon: <Waves className="h-5 w-5" />,
    label: "Swimming",
    detail: "Something about being in water just resets my brain. It's where I go to disconnect.",
  },
  {
    id: "coffee",
    icon: <Coffee className="h-5 w-5" />,
    label: "Coffee",
    detail: "It's less about the caffeine and more about the five minutes of calm. The ritual of it.",
  },
  {
    id: "sunsets",
    icon: <Sun className="h-5 w-5" />,
    label: "Sunsets",
    detail: "End of Santa Monica Pier, watching the sun go down. Honestly one of my favorite things about living in LA.",
  },
]

type ModalContent = {
  type: "game" | "marvel" | "lifestyle"
  title: string
  image?: string
  icon?: React.ReactNode
  description: string
} | null

export default function Personal() {
  const [selected, setSelected] = useState<ModalContent>(null)

  const openGameModal = (game: Game) => {
    triggerHaptic()
    setSelected({
      type: "game",
      title: game.title,
      image: game.image,
      description: game.description,
    })
  }

  const openMarvelModal = (hero: (typeof marvelFavorites)[0]) => {
    triggerHaptic()
    setSelected({
      type: "marvel",
      title: hero.name,
      image: hero.image,
      description: hero.reason,
    })
  }

  const openLifestyleModal = (item: (typeof lifestyle)[0]) => {
    triggerHaptic()
    setSelected({
      type: "lifestyle",
      title: item.label,
      icon: item.icon,
      description: item.detail,
    })
  }

  return (
    <section id="personal" className="section-y">
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
            Stuff I care about when I&apos;m not coding.
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
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 text-left shadow-card transition hover:border-primary/30"
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

      {/* Radix Dialog — focus trap, Escape, aria-modal, overlay all handled */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl sm:max-w-md [&>button:last-child]:z-20 [&>button:last-child]:h-7 [&>button:last-child]:w-7 [&>button:last-child]:rounded-full [&>button:last-child]:border [&>button:last-child]:border-border [&>button:last-child]:bg-card [&>button:last-child]:opacity-100">
          {selected?.image && (
            <div className="relative h-48 w-full">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
          )}

          <div className="p-6">
            {!selected?.image && selected?.icon && (
              <div className="flex items-center gap-4 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {selected.icon}
                </span>
              </div>
            )}

            <DialogTitle className={`font-display text-xl text-foreground ${selected?.image ? "-mt-6 relative z-10" : ""}`}>
              {selected?.title}
            </DialogTitle>

            <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {selected?.description}
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
