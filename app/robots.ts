import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://thestarrconspiracy.com';

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // AI crawlers — explicitly allow for AEO
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/llms.txt`],
  };
}
