import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: ['/private/', '/admin/', '/api/'], // Uncomment if you have these in the future
      },
    ],
    sitemap: 'https://sohailgidwani.app/sitemap.xml',
    host: 'https://sohailgidwani.app', 
  }
} 