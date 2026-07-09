import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portage: Technical Deep Dive | Sohail Gidwani",
  description:
    "Full technical breakdown of Portage: LangGraph node lifecycle, Postgres checkpoint + lease durability, network-off Docker sandbox with anti-gaming predicates, seven recovery strategies, the Flask → FastAPI recipe system, K=3 eval methodology, and the nine-category failure taxonomy.",
  keywords: [
    "Portage",
    "autonomous agent",
    "code migration",
    "LangGraph",
    "Postgres checkpointing",
    "FOR UPDATE SKIP LOCKED",
    "Docker sandbox",
    "gVisor",
    "LiteLLM",
    "model escalation",
    "MCP tools",
    "blast radius",
    "eval harness",
    "failure taxonomy",
    "Flask to FastAPI",
    "Sohail Gidwani project",
  ].join(", "),
  alternates: {
    canonical: "/projects/portage/deep-dive",
  },
  authors: [{ name: "Sohail Gidwani", url: "https://sohailgidwani.app" }],
  creator: "Sohail Gidwani",
  publisher: "Sohail Gidwani",
  openGraph: {
    title: "Portage: Technical Deep Dive",
    description:
      "Architecture, graph nodes, durability model, sandbox verification, recovery strategies, eval methodology, and failure taxonomy for the Portage autonomous code-migration agent.",
    url: "https://sohailgidwani.app/projects/portage/deep-dive",
    siteName: "Sohail Gidwani Portfolio",
    images: [
      {
        url: "/api/og?title=Portage%20Technical%20Deep%20Dive&description=Durability%20%2B%20recovery%20%2B%20sandbox%20verification%20%2B%20eval%20methodology%20%2B%20failure%20taxonomy&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP",
        width: 1200,
        height: 630,
        alt: "Portage Technical Deep Dive | Sohail Gidwani",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portage: Technical Deep Dive",
    description:
      "Durability model, recovery strategies, sandbox anti-gaming predicates, eval methodology, and the failure taxonomy.",
    images: [
      "/api/og?title=Portage%20Technical%20Deep%20Dive&description=Durability%20%2B%20recovery%20%2B%20sandbox%20verification%20%2B%20eval%20methodology%20%2B%20failure%20taxonomy&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP",
    ],
    creator: "@sohailgidwani",
  },
}

export default function PortageDeepDiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
