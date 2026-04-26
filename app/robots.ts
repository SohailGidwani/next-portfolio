import { MetadataRoute } from 'next'

const JSON_ENDPOINTS = ['/resume.json', '/projects.json', '/skills.json', '/experience.json', '/research.json']
const AI_ALLOW = ['/', '/llms.txt', '/llms-full.txt', '/api/og', '/api/mcp', ...JSON_ENDPOINTS]
const DISALLOW = ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og', '/api/mcp', ...JSON_ENDPOINTS],
        disallow: DISALLOW,
      },
      { userAgent: 'GPTBot', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'ChatGPT-User', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'Google-Extended', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'anthropic-ai', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'ClaudeBot', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'PerplexityBot', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'Bytespider', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'cohere-ai', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'Meta-ExternalAgent', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'OAI-SearchBot', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'Applebot-Extended', allow: AI_ALLOW, disallow: DISALLOW },
      { userAgent: 'CCBot', allow: AI_ALLOW, disallow: DISALLOW },
    ],
    sitemap: 'https://sohailgidwani.app/sitemap.xml',
    host: 'https://sohailgidwani.app',
  }
}
