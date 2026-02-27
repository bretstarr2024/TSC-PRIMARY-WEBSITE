import { Feed } from 'feed';
import { getAllPublishedBlogPosts } from '@/lib/content-db';
import { getAllPublishedExpertQa, getAllPublishedNews } from '@/lib/resources-db';

export const dynamic = 'force-dynamic'; // DB-backed, generate at request time

const SITE_URL = 'https://tsc-primary-website.vercel.app';

export async function GET() {
  const feed = new Feed({
    title: 'The Starr Conspiracy — Grist',
    description: 'B2B marketing intelligence for AI-era GTM leaders. Strategy, demand gen, AI transformation, and brand — from the agency that does both.',
    id: SITE_URL,
    link: `${SITE_URL}/insights`,
    language: 'en',
    image: `${SITE_URL}/icon-512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} The Starr Conspiracy`,
    updated: new Date(),
    author: {
      name: 'The Starr Conspiracy',
      email: 'hello@thestarrconspiracy.com',
      link: SITE_URL,
    },
    feedLinks: {
      rss2: `${SITE_URL}/feed.xml`,
    },
  });

  // Fetch content in parallel — graceful failures
  const [blogPosts, expertQa, newsItems] = await Promise.all([
    getAllPublishedBlogPosts(50).catch(() => []),
    getAllPublishedExpertQa(30).catch(() => []),
    getAllPublishedNews(30).catch(() => []),
  ]);

  // Add blog posts
  for (const post of blogPosts) {
    feed.addItem({
      title: post.title || 'Untitled',
      id: `${SITE_URL}/insights/blog/${post.slug}`,
      link: `${SITE_URL}/insights/blog/${post.slug}`,
      description: post.description || '',
      content: (post.content || '').slice(0, 2000),
      author: [{ name: post.author || 'The Starr Conspiracy' }],
      date: new Date(post.date || Date.now()),
      category: (post.tags || []).map((tag) => ({ name: tag })),
    });
  }

  // Add expert Q&A
  for (const qa of expertQa) {
    feed.addItem({
      title: qa.question || 'Q&A',
      id: `${SITE_URL}/insights/expert-qa/${qa.qaId}`,
      link: `${SITE_URL}/insights/expert-qa/${qa.qaId}`,
      description: (qa.answer || '').slice(0, 300),
      content: (qa.answer || '').slice(0, 2000),
      author: [{ name: qa.expert?.name || 'The Starr Conspiracy' }],
      date: new Date(qa.publishedAt || qa.createdAt || Date.now()),
      category: (qa.tags || []).map((tag) => ({ name: tag })),
    });
  }

  // Add news items
  for (const item of newsItems) {
    feed.addItem({
      title: item.headline || 'News',
      id: `${SITE_URL}/insights/news/${item.newsId}`,
      link: `${SITE_URL}/insights/news/${item.newsId}`,
      description: (item.summary || '').slice(0, 300),
      content: (item.commentary || item.summary || '').slice(0, 2000),
      date: new Date(item.source?.publishedAt || item.createdAt || Date.now()),
      category: (item.tags || []).map((tag) => ({ name: tag })),
    });
  }

  // Sort all items by date descending
  feed.items.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  // Keep only the 100 most recent
  feed.items = feed.items.slice(0, 100);

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
