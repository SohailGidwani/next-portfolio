import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
  description:
    'A LangGraph agent that migrates Flask apps to FastAPI: it plans the new modules a migration needs, checks each change against the repo\'s own tests in a network-off Docker sandbox, and resumes after a crash. Tested on repos it had never seen, with the results and limits published.',
  keywords: ['Portage', 'autonomous agent', 'code migration', 'LangGraph', 'FastAPI', 'Flask', 'MCP', 'Docker sandbox', 'LLM evals', 'Sohail Gidwani', 'AI project'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/portage',
  },
  openGraph: {
    title: 'Portage: Autonomous Code-Migration Agent | Sohail Gidwani',
    description:
      'Autonomous Flask → FastAPI migration agent: plans the new modules a migration needs, verifies every change in a network-off sandbox, and resumes after a crash. Tested on repos it had never seen, limits published.',
    url: 'https://sohailgidwani.app/projects/portage',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Portage&description=Flask%20to%20FastAPI%20agent%20that%20plans%20new%20modules%2C%20verifies%20each%20change%20in%20a%20sandbox%20and%20resumes%20after%20a%20crash.%20Tested%20on%20repos%20it%20had%20never%20seen%2C%20limits%20published.&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
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
      'Autonomous Flask → FastAPI migration agent: plans the new modules a migration needs, verifies every change in a network-off sandbox, and resumes after a crash. Tested on repos it had never seen, limits published.',
    images: [
      '/api/og?title=Portage&description=Flask%20to%20FastAPI%20agent%20that%20plans%20new%20modules%2C%20verifies%20each%20change%20in%20a%20sandbox%20and%20resumes%20after%20a%20crash.%20Tested%20on%20repos%20it%20had%20never%20seen%2C%20limits%20published.&type=project&tags=LangGraph,FastAPI,Postgres,Docker,MCP',
    ],
    creator: '@sohailgidwani',
  },
}

export default function PortageLayout({ children }: { children: React.ReactNode }) {
  return children
}
