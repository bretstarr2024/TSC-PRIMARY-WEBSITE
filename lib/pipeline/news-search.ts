/**
 * News article search + fetch for the content pipeline.
 * Finds a real, recent article matching a topic, fetches its content,
 * and returns structured data for news commentary generation.
 *
 * Uses Brave Search API (requires BRAVE_SEARCH_API_KEY env var).
 * Falls back gracefully: if search fails, news_item generation is skipped.
 */

import { logPipelineEvent } from './logger';

// ============================================
// Types
// ============================================

export interface NewsArticle {
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  snippet: string;
  content: string; // Fetched article body (truncated)
}

// ============================================
// Brave Search
// ============================================

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  page_age?: string;
  meta_url?: {
    hostname: string;
  };
}

/**
 * Search for a recent news article matching the given topic.
 * Returns null if search fails or no relevant results found.
 */
export async function searchForNewsArticle(topic: string): Promise<NewsArticle | null> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn('[NewsSearch] BRAVE_SEARCH_API_KEY not configured, skipping news search');
    return null;
  }

  try {
    // Search Brave for recent news on this topic
    const searchQuery = `${topic} B2B marketing 2026`;
    const params = new URLSearchParams({
      q: searchQuery,
      count: '5',
      freshness: 'pm', // Past month
      text_decorations: 'false',
    });

    const searchResponse = await fetch(
      `https://api.search.brave.com/res/v1/web/search?${params}`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!searchResponse.ok) {
      console.error(`[NewsSearch] Brave API error: ${searchResponse.status}`);
      return null;
    }

    const searchData = await searchResponse.json();
    const results: BraveSearchResult[] = searchData.web?.results || [];

    if (results.length === 0) {
      console.log(`[NewsSearch] No results for: ${topic}`);
      return null;
    }

    // Filter out non-article results (homepages, product pages, etc.)
    const articleResult = results.find((r) => {
      const url = r.url.toLowerCase();
      // Skip homepages, social media, and non-article pages
      if (url.endsWith('.com') || url.endsWith('.com/') || url.endsWith('.org/')) return false;
      if (url.includes('twitter.com') || url.includes('linkedin.com/posts')) return false;
      // Prefer URLs with path segments (likely articles)
      const pathSegments = new URL(r.url).pathname.split('/').filter(Boolean);
      return pathSegments.length >= 2;
    });

    if (!articleResult) {
      console.log(`[NewsSearch] No article-like results for: ${topic}`);
      return null;
    }

    // Fetch the article content
    const articleContent = await fetchArticleContent(articleResult.url);

    const sourceName = articleResult.meta_url?.hostname
      ?.replace('www.', '')
      ?.replace('.com', '')
      ?.replace('.org', '')
      ?.split('.')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ') || 'Unknown';

    const article: NewsArticle = {
      title: articleResult.title,
      url: articleResult.url,
      sourceName,
      publishedAt: new Date().toISOString(), // Brave doesn't always return exact dates
      snippet: articleResult.description,
      content: articleContent,
    };

    await logPipelineEvent({
      contentId: null,
      phase: 'news_search',
      action: 'article_found',
      success: true,
      durationMs: 0,
      metadata: { topic, articleUrl: article.url, articleTitle: article.title },
    });

    return article;
  } catch (error) {
    console.error('[NewsSearch] Search failed:', error);
    await logPipelineEvent({
      contentId: null,
      phase: 'news_search',
      action: 'search_failed',
      success: false,
      durationMs: 0,
      metadata: { topic, error: String(error) },
    });
    return null;
  }
}

/**
 * Search for multiple source articles for an industry brief.
 * Returns up to 3 articles to ground the brief in real data.
 * Falls back to empty array if search fails — brief generates as opinion-only.
 */
export async function searchForBriefSources(topic: string): Promise<NewsArticle[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn('[NewsSearch] BRAVE_SEARCH_API_KEY not configured, brief will be opinion-only');
    return [];
  }

  try {
    const searchQuery = `${topic} B2B marketing research data 2025 2026`;
    const params = new URLSearchParams({
      q: searchQuery,
      count: '10',
      freshness: 'py', // Past year for briefs — broader than news
      text_decorations: 'false',
    });

    const searchResponse = await fetch(
      `https://api.search.brave.com/res/v1/web/search?${params}`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!searchResponse.ok) {
      console.error(`[NewsSearch] Brave API error for brief sources: ${searchResponse.status}`);
      return [];
    }

    const searchData = await searchResponse.json();
    const results: BraveSearchResult[] = searchData.web?.results || [];

    // Filter to article-like results only, take top 3
    const articleResults = results.filter((r) => {
      const url = r.url.toLowerCase();
      if (url.endsWith('.com') || url.endsWith('.com/') || url.endsWith('.org/')) return false;
      if (url.includes('twitter.com') || url.includes('linkedin.com/posts')) return false;
      const pathSegments = new URL(r.url).pathname.split('/').filter(Boolean);
      return pathSegments.length >= 2;
    }).slice(0, 3);

    if (articleResults.length === 0) return [];

    // Fetch content for each article in parallel
    const articles = await Promise.all(
      articleResults.map(async (result) => {
        const content = await fetchArticleContent(result.url);
        const sourceName = result.meta_url?.hostname
          ?.replace('www.', '')
          ?.replace('.com', '')
          ?.replace('.org', '')
          ?.split('.')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ') || 'Unknown';
        return {
          title: result.title,
          url: result.url,
          sourceName,
          publishedAt: new Date().toISOString(),
          snippet: result.description,
          content,
        };
      })
    );

    await logPipelineEvent({
      contentId: null,
      phase: 'news_search',
      action: 'brief_sources_found',
      success: true,
      durationMs: 0,
      metadata: { topic, sourceCount: articles.length, urls: articles.map((a) => a.url) },
    });

    return articles;
  } catch (error) {
    console.error('[NewsSearch] Brief source search failed:', error);
    return [];
  }
}

// ============================================
// Article Content Fetcher
// ============================================

/**
 * Fetch and extract readable text from an article URL.
 * Returns a truncated plain-text version of the article body.
 */
async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TSCBot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) return '';

    const html = await response.text();

    // Basic HTML → text extraction (no external deps)
    const text = html
      // Remove script/style blocks
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode common entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate to ~2000 chars to keep prompt size reasonable
    return text.slice(0, 2000);
  } catch {
    console.warn(`[NewsSearch] Failed to fetch article content from: ${url}`);
    return '';
  }
}
