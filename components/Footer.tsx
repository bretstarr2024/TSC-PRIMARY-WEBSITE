'use client';

import Link from 'next/link';
import Image from 'next/image';

const serviceLinks = [
  { href: '/services/brand-strategy', label: 'Brand Strategy' },
  { href: '/services/demand-generation', label: 'Demand Generation' },
  { href: '/services/digital-performance', label: 'Digital Performance' },
  { href: '/services/content-marketing', label: 'Content & Creative' },
  { href: '/services/fractional-cmo', label: 'Fractional CMO' },
  { href: '/services/ai-marketing', label: 'AI Services' },
];

const companyLinks = [
  { href: '/insights', label: 'Insights' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="section-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 hover:no-underline">
              <Image
                src="/images/ocho-color.png"
                alt="TSC"
                width={28}
                height={28}
              />
              <span className="text-white font-bold text-base">The Starr Conspiracy</span>
            </Link>
            <p className="text-sm text-greige leading-relaxed">
              The B2B marketing agency where fundamentals meet AI transformation.
              See marketing in a whole new light.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-shroomy uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-greige hover:text-white transition-colors hover:no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-shroomy uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-greige hover:text-white transition-colors hover:no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold text-shroomy uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.linkedin.com/company/the-starr-conspiracy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-greige hover:text-white transition-colors hover:no-underline"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-sm text-atomic-tangerine hover:text-hot-sauce transition-colors hover:no-underline"
                >
                  Let&apos;s Talk! →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-greige">
            © {new Date().getFullYear()} The Starr Conspiracy. All rights reserved.
          </p>
          <p className="text-xs text-greige/50">
            Built by an AI content engine. Obviously.
          </p>
        </div>
      </div>
    </footer>
  );
}
