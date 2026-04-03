"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useScrollEngine } from "./scroll/ScrollEngine"

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
    description:
      "Kratos and Atreus. The father-son dynamic, the Norse mythology, the combat. This game just hits different every time I replay it.",
  },
  {
    id: "last-of-us",
    title: "The Last of Us",
    image: "/images/personal/last-of-us.jpg",
    description:
      "I don't think any game has wrecked me the way this one did. Joel and Ellie's story is less a game and more something that stays with you.",
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    image: "/images/personal/ghost-of-tsushima.jpg",
    description:
      "Every single frame of this game looks like a painting. And the haiku composing, the wind guiding you around the map. Pure poetry.",
  },
  {
    id: "spiderman-game",
    title: "Spider-Man",
    image: "/images/personal/spiderman-game.webp",
    description:
      "Swinging through NYC never gets old. Insomniac absolutely nailed what it feels like to be Spider-Man.",
  },
  {
    id: "fifa",
    title: "FIFA",
    image: "/images/personal/fifa.webp",
    description:
      "When debates with friends need settling. Nothing like a FIFA showdown to determine who's really right.",
  },
]

const marvelFavorites = [
  {
    id: "spiderman",
    name: "Spider-Man",
    image: "/images/personal/spiderman.jpg",
    reason:
      "No matter how beaten, how outmatched, he gets back up. Every time. That kind of resilience is something I try to carry into my own life.",
  },
  {
    id: "ironman",
    name: "Iron Man",
    image: "/images/personal/ironman.jpg",
    reason:
      "Always has a backup plan. And a backup for the backup. I try to think like that when I'm building systems.",
  },
]

const lifestyle = [
  {
    id: "swimming",
    label: "Swimming",
    detail:
      "Something about being in water just resets my brain. It's where I go to disconnect.",
  },
  {
    id: "coffee",
    label: "Coffee",
    detail:
      "It's less about the caffeine and more about the five minutes of calm. The ritual of it.",
  },
  {
    id: "sunsets",
    label: "Sunsets",
    detail:
      "End of Santa Monica Pier, watching the sun go down. Honestly one of my favorite things about living in LA.",
  },
]

type SelectedItem = {
  title: string
  image?: string
  description: string
} | null

export default function Personal() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-80px" })
  const [selected, setSelected] = useState<SelectedItem>(null)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("personal", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section
      id="personal"
      ref={sectionRef}
      className="relative min-h-screen py-32"
    >
      <div className="container mx-auto px-6" ref={contentRef}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
        >
          Beyond the Code
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display italic text-4xl sm:text-5xl text-white leading-[1.1] max-w-xl"
        >
          Stuff I care about when I&apos;m not coding.
        </motion.h2>

        {/* Scattered asymmetric layout */}
        <div className="mt-20 relative">
          {/* Marvel heroes — offset left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <p className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 mb-4">
              Marvel Universe
            </p>
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              {marvelFavorites.map((hero, i) => (
                <motion.button
                  key={hero.id}
                  type="button"
                  onClick={() =>
                    setSelected({ title: hero.name, image: hero.image, description: hero.reason })
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl glass text-left aspect-[16/9]"
                >
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/40 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h4 className="font-display italic text-xl text-white">{hero.name}</h4>
                    <p className="mt-1 font-body text-xs text-white/30 line-clamp-1">{hero.reason}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Games — offset right with drift */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mb-16 ml-auto max-w-4xl"
          >
            <p className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 mb-4 text-right">
              Story-Driven Games
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {games.map((game, i) => (
                <motion.button
                  key={game.id}
                  type="button"
                  onClick={() =>
                    setSelected({ title: game.title, image: game.image, description: game.description })
                  }
                  initial={{ opacity: 0, y: 20, rotate: (i % 2 === 0 ? -1 : 1) * 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl glass text-left aspect-[3/4]"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/20 to-transparent" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <h4 className="font-display italic text-sm text-white leading-tight">
                      {game.title}
                    </h4>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Lifestyle — scattered pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="max-w-lg"
          >
            <p className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-white/20 mb-4">
              Simple Pleasures
            </p>
            <div className="flex flex-col gap-3">
              {lifestyle.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelected({ title: item.label, description: item.detail })
                  }
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-5 text-left hover:bg-white/[0.04] transition-colors w-fit"
                  style={{ marginLeft: `${i * 24}px` }}
                >
                  <span className="font-display italic text-lg text-white">{item.label}</span>
                  <p className="mt-1 font-body text-xs text-white/25 max-w-xs">{item.detail}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-[#090909]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-4 bottom-4 top-auto z-50 max-h-[80vh] overflow-hidden rounded-2xl glass-elevated sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2"
            >
              {selected.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 448px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display italic text-xl text-white">
                  {selected.title}
                </h3>
                <p className="mt-3 font-body text-sm text-white/40 leading-relaxed">
                  {selected.description}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-4 font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
