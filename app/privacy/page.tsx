import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { privacyBreadcrumb } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How The Starr Conspiracy collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const breadcrumbSchema = privacyBreadcrumb();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-3xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-greige text-sm mb-12">Last updated: February 27, 2026</p>

          <div className="space-y-10 text-shroomy leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Who we are</h2>
              <p>
                The Starr Conspiracy (&quot;TSC,&quot; &quot;we,&quot; &quot;us&quot;) is a B2B marketing agency. This policy
                explains how we handle data collected through this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">What we collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong className="text-white">Contact form submissions:</strong> Name, email address, and optional message
                  when you use our contact form. We store these in our database to respond to your inquiry.
                </li>
                <li>
                  <strong className="text-white">CTA interactions:</strong> Anonymous click data on buttons and links
                  (which button, which page, timestamp). We use session-scoped anonymous IDs that expire when you close
                  the tab — no cross-session tracking.
                </li>
                <li>
                  <strong className="text-white">Analytics:</strong> We use Vercel Analytics and Speed Insights to
                  understand page views and performance. These tools collect anonymized, aggregated data — no personal
                  identifiers.
                </li>
                <li>
                  <strong className="text-white">Arcade high scores:</strong> If you achieve the top score in one of
                  our hidden arcade games and choose to submit your email, we store your email, name, game, and score.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">What we don&apos;t collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>No third-party advertising cookies</li>
                <li>No cross-site tracking pixels</li>
                <li>No sale of personal data to third parties</li>
                <li>No fingerprinting or persistent device identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How we use your data</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To respond to your contact form submissions</li>
                <li>To send you a confirmation email when you reach out (via Resend)</li>
                <li>To improve the site experience based on anonymous interaction patterns</li>
                <li>To auto-delete interaction data after 180 days (TTL policy)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data retention</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Contact form leads:</strong> Retained indefinitely until you request deletion.</li>
                <li><strong className="text-white">CTA interactions:</strong> Auto-deleted after 180 days via MongoDB TTL index.</li>
                <li><strong className="text-white">Arcade boss entries:</strong> Retained indefinitely (it&apos;s a high score board).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Third-party services</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Vercel:</strong> Hosting, analytics, and speed insights</li>
                <li><strong className="text-white">MongoDB Atlas:</strong> Database storage</li>
                <li><strong className="text-white">Resend:</strong> Transactional email delivery</li>
                <li><strong className="text-white">Cal.com:</strong> Meeting scheduling (embedded on our booking page)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Your rights</h2>
              <p className="mb-3">You can:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Request a copy of any data we hold about you</li>
                <li>Request deletion of your data</li>
                <li>Opt out of analytics by declining cookies when prompted</li>
              </ul>
              <p className="mt-3">
                Email{' '}
                <a href="mailto:hello@thestarrconspiracy.com" className="text-tidal-wave hover:text-white transition-colors">
                  hello@thestarrconspiracy.com
                </a>{' '}
                for any data requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to this policy</h2>
              <p>
                We&apos;ll update this page when our practices change. The &quot;last updated&quot; date at the top
                reflects the most recent revision.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
