import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Sohail Gidwani",
  description:
    "More about Sohail Gidwani: how he approaches AI engineering, the values behind his work, and the interests that shape him outside software.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sohail Gidwani",
    description:
      "AI/ML engineer, USC graduate student, and builder of agentic systems, retrieval products, and multimodal research.",
    url: "https://sohailgidwani.app/about",
    type: "profile",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
