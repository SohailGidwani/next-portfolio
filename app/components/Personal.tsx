"use client"

import { motion } from "framer-motion"
import { Coffee, Gamepad2, Film, Sun, Waves } from "lucide-react"
import SectionHeading from "./SectionHeading"
import GameShowcase, { type Game } from "./games/GameShowcase"
import MarvelShowcase, { type Hero } from "./games/MarvelShowcase"
import SimplePleasures, { type Pleasure } from "./SimplePleasures"

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

const marvelFavorites: Hero[] = [
  {
    id: "spiderman",
    title: "Spider-Man",
    image: "/images/personal/spider-man-amazing-suit.webp",
    theme: "comic",
    shape: "wide",
    description: "No matter how beaten, how outmatched, he gets back up. Every time. That kind of resilience is something I try to carry into my own life.",
  },
  {
    id: "ironman",
    title: "Iron Man",
    image: "/images/personal/ironman.jpg",
    theme: "hud",
    shape: "square",
    description: "Always has a backup plan. And a backup for the backup. If one thing goes south, there's already another plan ready. I try to think like that when I'm building systems.",
  },
]

const lifestyle: Pleasure[] = [
  {
    id: "swimming",
    scene: "swim",
    icon: <Waves className="h-5 w-5" />,
    label: "Swimming",
    detail: "Something about being in water just resets my brain. It's where I go to disconnect.",
  },
  {
    id: "coffee",
    scene: "steam",
    icon: <Coffee className="h-5 w-5" />,
    label: "Coffee",
    detail: "It's less about the caffeine and more about the five minutes of calm. The ritual of it.",
  },
  {
    id: "sunsets",
    scene: "sunset",
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
          <MarvelShowcase heroes={marvelFavorites} />
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
          <SimplePleasures items={lifestyle} />
        </motion.div>
      </div>

    </section>
  )
}
