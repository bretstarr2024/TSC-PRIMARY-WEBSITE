import { NextRequest, NextResponse } from 'next/server';
import { verifyDashboardSession } from '@/lib/dashboard-auth';
import { getBlogPrompts, getNewsPrompts } from '@/lib/pipeline/content-prompts';

async function fetchArticleText(url: string): Promise<{ text: string; title: string; domain: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TSC-Dashboard/1.0)' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Could not fetch URL (${res.status})`);
  const html = await res.text();

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : url;

  // Strip scripts, styles, nav, footer, header
  const stripped = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const domain = new URL(url).hostname.replace('www.', '');
  return { text: stripped.slice(0, 5000), title, domain };
}

export async function POST(request: NextRequest) {
  if (!await verifyDashboardSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, contentType } = await request.json();
  if (!url || !contentType) {
    return NextResponse.json({ error: 'url and contentType required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OpenAI not configured' }, { status: 500 });

  // Fetch the article
  let article: { text: string; title: string; domain: string };
  try {
    article = await fetchArticleText(url);
  } catch (e) {
    return NextResponse.json({ error: `Could not fetch URL: ${e instanceof Error ? e.message : String(e)}` }, { status: 400 });
  }

  // Build prompts
  const topic = article.title;
  const context = `Source article from ${article.domain}:\n\n${article.text}`;

  let prompts: { system: string; user: string };
  if (contentType === 'news') {
    prompts = getNewsPrompts(topic, context, {
      title: article.title,
      url,
      sourceName: article.domain,
      publishedAt: new Date().toISOString(),
      snippet: article.text.slice(0, 300),
      content: article.text,
    });
  } else {
    prompts = getBlogPrompts(topic, context);
  }

  // Call OpenAI
  const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompts.system },
        { role: 'user', content: prompts.user },
      ],
    }),
  });

  if (!oaiRes.ok) {
    const err = await oaiRes.text();
    return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: 500 });
  }

  const oaiData = await oaiRes.json();
  const raw = oaiData.choices?.[0]?.message?.content;
  if (!raw) return NextResponse.json({ error: 'No content generated' }, { status: 500 });

  let generated: Record<string, unknown>;
  try {
    generated = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Failed to parse generated JSON' }, { status: 500 });
  }

  return NextResponse.json({
    contentType,
    generated,
    sourceUrl: url,
    sourceName: article.domain,
    sourceTitle: article.title,
  });
}
