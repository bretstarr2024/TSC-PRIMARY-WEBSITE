/**
 * Breadcrumb schema generators for all /insights/ routes.
 */

// Base URL — will be updated when domain is configured
const BASE_URL = 'https://tsc-primary-website.vercel.app';

function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export const insightsBreadcrumb = () =>
  breadcrumb([{ name: 'Home', url: '/' }, { name: 'Insights', url: '/insights' }]);

export const blogBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Blog', url: '/insights/blog' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const faqBreadcrumb = (question?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'FAQ', url: '/insights/faq' },
    ...(question ? [{ name: question, url: '#' }] : []),
  ]);

export const glossaryBreadcrumb = (term?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Glossary', url: '/insights/glossary' },
    ...(term ? [{ name: term, url: '#' }] : []),
  ]);

export const comparisonBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Comparisons', url: '/insights/comparisons' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const expertQaBreadcrumb = (question?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Expert Q&A', url: '/insights/expert-qa' },
    ...(question ? [{ name: question, url: '#' }] : []),
  ]);

export const newsBreadcrumb = (headline?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'News', url: '/insights/news' },
    ...(headline ? [{ name: headline, url: '#' }] : []),
  ]);

export const caseStudyBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Case Studies', url: '/insights/case-studies' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const industryBriefBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Industry Briefs', url: '/insights/industry-briefs' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const videoBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Videos', url: '/insights/videos' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const toolBreadcrumb = (title?: string) =>
  breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: 'Tools', url: '/insights/tools' },
    ...(title ? [{ name: title, url: '#' }] : []),
  ]);

export const aboutBreadcrumb = () =>
  breadcrumb([{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]);
