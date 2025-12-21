import React from "react"

export default function SectionDivider() {
  return (
    <div className="w-full my-10 md:my-14">
      <svg
        viewBox="0 0 100 4"
        width="100%"
        height="16"
        preserveAspectRatio="none"
        className="block"
        aria-hidden="true"
      >
        <path
          d="M0 2 L100 2"
          fill="none"
          stroke="url(#divider-gradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="divider-gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f766e" stopOpacity="0.12" />
            <stop offset="0.45" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="0.7" stopColor="#14b8a6" stopOpacity="0.18" />
            <stop offset="1" stopColor="#0f766e" stopOpacity="0.12" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
} 
