import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContentRenderer } from '@/components/insights/ContentRenderer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { AuthorBio } from '@/components/insights/AuthorBio';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedBlogPostBySlug, getAllBlogPostSlugs, BlogPost } from '@/lib/content-db';
import { getArticleSchema } from '@/lib/schema/people';
import { blogBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPublishedBlogPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };
    return {
      title: `${post.title} | Blog`,
      description: post.description,
    };
  } catch {
    return { title: 'Blog Post' };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    post = await getPublishedBlogPostBySlug(slug);
  } catch {
    // empty
  }

  if (!post) notFound();

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.description,
    datePublished: post.date,
    author: post.author,
    tags: post.tags,
    wordCount: post.content.split(/\s+/).length,
  });

  const breadcrumbSchema = blogBreadcrumb(post.title);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <Link href="/insights/blog" className="hover:text-atomic-tangerine">Blog</Link>
            <span>/</span>
            <span className="text-shroomy">{post.title}</span>
          </nav>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-greige bg-white/5 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-greige mb-10">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-greige" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <ContentRenderer content={post.content} />

          <RelatedContent
            currentType="blog"
            currentId={post.slug}
            tags={post.tags}
            clusterName={post.clusterName}
          />

          <AuthorBio featuredAuthor={post.author} />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
