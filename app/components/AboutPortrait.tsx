"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import portrait from "@/public/images/personal/SohailGidwani.png"

export default function AboutPortrait() {
  const reduceMotion = useReducedMotion()

  return (
    <figure className="hidden min-w-0 self-start lg:block lg:pl-4 lg:pt-1">
      <div className="relative isolate">
        <motion.div
          aria-hidden
          initial={
            reduceMotion ? { opacity: 1, x: -14, y: 14 } : { opacity: 0, x: -2, y: 2 }
          }
          whileInView={{ opacity: 1, x: -14, y: 14 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.55 }}
          className="absolute inset-0 -z-10 bg-accent"
        />

        <div className="relative aspect-[3/4] w-full overflow-hidden border border-foreground/20 bg-background">
          <Image
            src={portrait}
            alt="Sohail Gidwani — professional portrait"
            fill
            sizes="(min-width: 1280px) 380px, 320px"
            className="object-cover object-[50%_18%]"
            priority={false}
          />
        </div>
      </div>
    </figure>
  )
}
