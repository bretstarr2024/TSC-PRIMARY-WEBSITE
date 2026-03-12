import { NextRequest, NextResponse } from 'next/server';
import { verifyDashboardSession } from '@/lib/dashboard-auth';
import { createBlogPost } from '@/lib/content-db';
import { createNewsItem } from '@/lib/resources-db';

export async function POST(request: NextRequest) {
  if (!await verifyDashboardSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { contentType, generated, sourceUrl, sourceName } = await request.json();

  try {
    if (contentType === 'news') {
      const id = await createNewsItem({
        newsId: generated.newsId,
        headline: generated.headline,
        summary: generated.summary,
        commentary: generated.commentary,
        source: {
          name: sourceName,
          url: sourceUrl,
          publishedAt: new Date(),
        },
        category: generated.category ?? 'marketing',
        sentiment: generated.sentiment ?? 'neutral',
        impact: generated.impact ?? 'medium',
        tags: generated.tags ?? [],
        status: 'published',
        origin: 'manual',
        autoPublished: false,
        publishedAt: new Date(),
      });
      return NextResponse.json({ id, url: `/insights/news/${generated.newsId}` });
    }

    // blog post
    const id = await createBlogPost({
      slug: generated.slug,
      title: generated.title,
      description: generated.description,
      content: generated.content,
      date: new Date().toISOString().slice(0, 10),
      author: generated.author ?? 'Bret Starr',
      tags: generated.tags ?? [],
      origin: 'manual',
      status: 'published',
      publishedAt: new Date(),
    });
    return NextResponse.json({ id, url: `/insights/blog/${generated.slug}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
