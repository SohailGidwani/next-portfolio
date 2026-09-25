import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
  description:
    'LangGraph agent that migrates Flask apps to FastAPI end-to-end: it plans the target architecture (creating new modules, not just rewriting files), verifies in a network-off Docker sandbox, recovers under bounded budgets, and reports honestly. 10/10 on the K=5 development gate, 0/9 on the frozen held-out set of three then-unseen repositories, both published together. Development results are strong; unseen-repository reliability is not yet proven.',
  keywords: ['Portage', 'autonomous agent', 'code migration', 'LangGraph', 'FastAPI', 'Flask', 'MCP', 'Docker sandbox', 'LLM evals', 'Sohail Gidwani', 'AI project'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/portage',
  },
  openGraph: {
    title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
    description:
      'Autonomous Flask → FastAPI migration agent: checkpointed, sandbox-verified, 10/10 on its K=5 development gate and 0/9 on the frozen held-out set, published side by side.',
    url: 'https://sohailgidwani.app/projects/portage',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Portage&description=Checkpointed%2C%20sandbox-verified%20Flask%20to%20FastAPI%20migration%20agent.%20Development%20gate%2010%2F10%3B%20frozen%20held-out%20set%200%2F9.&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
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
      'Autonomous Flask → FastAPI migration agent: checkpointed, sandbox-verified, 10/10 on its K=5 development gate and 0/9 on the frozen held-out set, published side by side.',
    images: [
      '/api/og?title=Portage&description=Checkpointed%2C%20sandbox-verified%20Flask%20to%20FastAPI%20migration%20agent.%20Development%20gate%2010%2F10%3B%20frozen%20held-out%20set%200%2F9.&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
    ],
    creator: '@sohailgidwani',
  },
}

export default function PortageLayout({ children }: { children: React.ReactNode }) {
  return children
}
