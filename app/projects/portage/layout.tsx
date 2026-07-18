import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
  description:
    'LangGraph agent that migrates Flask apps to FastAPI end-to-end: it plans the target architecture (creating new modules, not just rewriting files), verifies in a network-off Docker sandbox, recovers under bounded budgets, and scores 61.9% strict green across 21 autonomous runs on seven pinned repositories at K=3.',
  keywords: ['Portage', 'autonomous agent', 'code migration', 'LangGraph', 'FastAPI', 'Flask', 'MCP', 'Docker sandbox', 'LLM evals', 'Sohail Gidwani', 'AI project'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/portage',
  },
  openGraph: {
    title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
    description:
      'Autonomous Flask → FastAPI migration agent with checkpoint-resume durability, network-off sandbox verification, bounded recovery, and an honest K=3 eval grid. One engine, two interfaces: CLI + MCP.',
    url: 'https://sohailgidwani.app/projects/portage',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Portage&description=Autonomous%20Flask%20%E2%86%92%20FastAPI%20migration%20agent%20%E2%80%94%20checkpointed%2C%20sandbox-verified%2C%20evaluated%20at%20K%3D3&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
        width: 1200,
        height: 630,
        alt: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
    description:
      'Autonomous Flask → FastAPI migration agent: checkpointed, sandbox-verified, 61.9% strict green across 21 autonomous runs on seven pinned repositories at K=3.',
    images: [
      '/api/og?title=Portage&description=Autonomous%20Flask%20%E2%86%92%20FastAPI%20migration%20agent%20%E2%80%94%20checkpointed%2C%20sandbox-verified%2C%20evaluated%20at%20K%3D3&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
    ],
    creator: '@sohailgidwani',
  },
}

export default function PortageLayout({ children }: { children: React.ReactNode }) {
  return children
}
