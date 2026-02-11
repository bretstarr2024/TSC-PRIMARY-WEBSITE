import { NextResponse } from 'next/server';
import { getAllPublishedBlogPosts } from '@/lib/content-db';
import {
  getAllPublishedFaqs,
  getAllPublishedGlossaryTerms,
  getAllPublishedComparisons,
  getAllPublishedExpertQa,
  getAllPublishedNews,
  getAllPublishedCaseStudies,
  getAllPublishedIndustryBriefs,
  getAllPublishedVideos,
  getAllPublishedTools,
} from '@/lib/resources-db';

const BASE_URL = 'https://tsc-primary-website.vercel.app';

export async function GET() {
  const [blogs, faqs, glossary, comparisons, expertQa, news, caseStudies, briefs, videos, tools] = await Promise.all([
    getAllPublishedBlogPosts().catch(() => []),
    getAllPublishedFaqs().catch(() => []),
    getAllPublishedGlossaryTerms().catch(() => []),
    getAllPublishedComparisons().catch(() => []),
    getAllPublishedExpertQa().catch(() => []),
    getAllPublishedNews().catch(() => []),
    getAllPublishedCaseStudies().catch(() => []),
    getAllPublishedIndustryBriefs().catch(() => []),
    getAllPublishedVideos().catch(() => []),
    getAllPublishedTools().catch(() => []),
  ]);

  const lines: string[] = [
    `# The Starr Conspiracy — ${BASE_URL}`,
    '',
    '> The Starr Conspiracy is a B2B marketing agency helping tech companies grow through strategic marketing that combines 25+ years of fundamentals with AI transformation. We offer brand strategy, demand generation, digital performance, content, advisory, and AI-native marketing services.',
    '',
    '## Core Pages',
    `- [Home](${BASE_URL}/)`,
    `- [Services](${BASE_URL}/services)`,
    `- [Insights](${BASE_URL}/insights)`,
    '',
  ];

  if (blogs.length > 0) {
    lines.push('## Blog');
    for (const p of blogs.slice(0, 20)) {
      lines.push(`- [${p.title}](${BASE_URL}/insights/blog/${p.slug})`);
    }
    lines.push('');
  }

  if (faqs.length > 0) {
    lines.push('## FAQ');
    for (const f of faqs.slice(0, 30)) {
      lines.push(`- [${f.question}](${BASE_URL}/insights/faq/${f.faqId})`);
    }
    lines.push('');
  }

  if (glossary.length > 0) {
    lines.push('## Glossary');
    for (const g of glossary.slice(0, 30)) {
      lines.push(`- [${g.term}](${BASE_URL}/insights/glossary/${g.termId}): ${g.shortDefinition}`);
    }
    lines.push('');
  }

  if (comparisons.length > 0) {
    lines.push('## Comparisons');
    for (const c of comparisons) {
      lines.push(`- [${c.title}](${BASE_URL}/insights/comparisons/${c.comparisonId})`);
    }
    lines.push('');
  }

  if (expertQa.length > 0) {
    lines.push('## Expert Q&A');
    for (const q of expertQa) {
      lines.push(`- [${q.question}](${BASE_URL}/insights/expert-qa/${q.qaId}) — ${q.expert.name}`);
    }
    lines.push('');
  }

  if (news.length > 0) {
    lines.push('## News & Analysis');
    for (const n of news.slice(0, 20)) {
      lines.push(`- [${n.headline}](${BASE_URL}/insights/news/${n.newsId})`);
    }
    lines.push('');
  }

  if (caseStudies.length > 0) {
    lines.push('## Case Studies');
    for (const cs of caseStudies) {
      lines.push(`- [${cs.title}](${BASE_URL}/insights/case-studies/${cs.caseStudyId})`);
    }
    lines.push('');
  }

  if (briefs.length > 0) {
    lines.push('## Industry Briefs');
    for (const b of briefs) {
      lines.push(`- [${b.title}](${BASE_URL}/insights/industry-briefs/${b.briefId})`);
    }
    lines.push('');
  }

  if (videos.length > 0) {
    lines.push('## Videos');
    for (const v of videos) {
      lines.push(`- [${v.title}](${BASE_URL}/insights/videos/${v.videoId})${v.speaker ? ` — ${v.speaker}` : ''}`);
    }
    lines.push('');
  }

  if (tools.length > 0) {
    lines.push('## Tools');
    for (const t of tools) {
      lines.push(`- [${t.title}](${BASE_URL}/insights/tools/${t.toolId}): ${t.description.slice(0, 100)}`);
    }
    lines.push('');
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
