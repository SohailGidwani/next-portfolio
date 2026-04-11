import Image from "next/image"
import portrait from "@/public/images/personal/SohailGidwani.png"

export default function AboutPortrait() {
  return (
    <figure className="hidden min-w-0 self-start lg:block lg:pt-1">
      <div className="relative isolate">
        <div
          className="about-portrait-ambient pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
          aria-hidden
        />
        <div className="about-portrait-frame rounded-3xl p-[2px] shadow-card">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[calc(1.5rem-2px)] border border-border/60 bg-background dark:border-border/50">
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
      </div>
    </figure>
  )
}
