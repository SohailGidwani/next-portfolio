import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Bytespider',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/private/', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://sohailgidwani.app/sitemap.xml',
    host: 'https://sohailgidwani.app',
  }
}