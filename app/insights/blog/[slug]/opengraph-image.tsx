import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedBlogPostBySlug, getAllBlogPostSlugs } from '@/lib/content-db';

export const runtime = 'nodejs';
export const alt = 'Blog | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPublishedBlogPostBySlug(slug);
    return renderOgImage({
      title: post?.title ?? 'Blog',
      badge: 'blog',
      subtitle: post?.author ? `By ${post.author}` : undefined,
    });
  } catch {
    return renderOgImage({ title: 'Blog', badge: 'blog' });
  }
}
