"use client"

import { motion } from "framer-motion"
import { Coffee, Gamepad2, Film, Sun, Waves, Heart } from "lucide-react"
import SectionHeading from "./SectionHeading"
import Image from "next/image"
import GameShowcase, { type Game } from "./games/GameShowcase"

const games: Game[] = [
  {
    id: "god-of-war",
    title: "God of War",
    image: "/images/personal/god-of-war-ragnarok.webp",
    theme: "frost",
    description: "Kratos and Atreus. The father-son dynamic, the Norse mythology, the combat. This game just hits different every time I replay it.",
  },
  {
    id: "last-of-us",
    title: "The Last of Us",
    image: "/images/personal/last-of-us.webp",
    theme: "fireflies",
    description: "I don't think any game has wrecked me the way this one did. Joel and Ellie's story is less a game and more something that stays with you.",
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    image: "/images/personal/ghost-of-tsushima.webp",
    theme: "wind",
    description: "Every single frame of this game looks like a painting. And the haiku composing, the wind guiding you around the map. Pure poetry.",
  },
  {
    id: "spiderman-game",
    title: "Spider-Man",
    image: "/images/personal/spider-man-remastered.webp",
    theme: "webs",
    description: "Swinging through NYC never gets old. Insomniac absolutely nailed what it feels like to be Spider-Man.",
  },
  {
    id: "fifa",
    title: "FIFA",
    image: "/images/personal/fc-26.webp",
    theme: "pitch",
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

export default function Personal() {
  return (
    <section id="personal" className="section-y">
      <div className="container mx-auto px-4">
        <SectionHeading>Beyond the code</SectionHeading>

        {/* Marvel Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center gap-2">
            <Film className="h-3.5 w-3.5 text-accent" />
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Marvel Universe</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {marvelFavorites.map((hero, index) => (
              <motion.figure
                key={hero.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="grid grid-cols-[120px_1fr] gap-4 rounded border border-border bg-card/60 p-4 sm:grid-cols-[160px_1fr] sm:p-5"
              >
                <div className="relative aspect-square self-center overflow-hidden rounded border border-border bg-background">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 120px, 160px"
                  />
                </div>
                <figcaption className="flex min-w-0 flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3 w-3 text-accent" />
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Favorite</span>
                  </div>
                  <h4 className="mt-1.5 font-display text-xl text-foreground">{hero.name}</h4>
                  <blockquote className="mt-2 border-l-2 border-accent/60 pl-3 text-[14px] italic leading-relaxed text-muted-foreground sm:text-[15px]">
                    {hero.reason}
                  </blockquote>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>

        {/* Gaming Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center gap-2">
            <Gamepad2 className="h-3.5 w-3.5 text-accent" />
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Story-Driven Games</h3>
          </div>
          <GameShowcase games={games} />
        </motion.div>

        {/* Lifestyle Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sun className="h-3.5 w-3.5 text-accent" />
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Simple Pleasures</h3>
          </div>
          {/* Each line is short enough to show whole, so there is nothing to
              open: the full sentence sits beside its name. Before, a card
              clipped it to one line and a "Tap any to learn more" hint sent
              the reader into a dialog to finish it. */}
          <ul className="max-w-4xl divide-y divide-border border-y border-border">
            {lifestyle.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-1 py-4 sm:grid-cols-[auto_8rem_minmax(0,1fr)] sm:items-baseline"
              >
                <span aria-hidden className="text-accent sm:self-center">{item.icon}</span>
                <span className="font-medium text-foreground">{item.label}</span>
                <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">{item.detail}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

    </section>
  )
}
