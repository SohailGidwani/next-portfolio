import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'Bytespider',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/og'],
        disallow: ['/private/', '/admin/', '/api/blogs', '/api/uploads', '/api/images'],
      },
    ],
    sitemap: 'https://sohailgidwani.app/sitemap.xml',
    host: 'https://sohailgidwani.app',
  }
}
