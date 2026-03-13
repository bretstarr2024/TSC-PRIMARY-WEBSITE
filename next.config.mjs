/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Internal — removed content types
      { source: '/insights/videos', destination: '/insights', permanent: false },
      { source: '/insights/infographics', destination: '/insights', permanent: false },

      // WordPress → Vercel (301 permanent)
      // Blog posts (WP root slugs → insights/blog index)
      { source: '/answer-engine-optimization-the-most-comprehensive-technically-accurate-and-practical-guidance-on-aeo-for-b2b-marketing-youve-ever-read/', destination: '/insights/blog', permanent: true },
      { source: '/answer-engine-optimization-the-most-comprehensive-technically-accurate-and-practical-guidance-on-aeo-for-b2b-marketing-youve-ever-read', destination: '/insights/blog', permanent: true },
      { source: '/the-canary-in-the-ai-coal-mine/', destination: '/insights/blog', permanent: true },
      { source: '/the-canary-in-the-ai-coal-mine', destination: '/insights/blog', permanent: true },
      { source: '/chatgpt-paid-advertising-what-b2b-leaders-need-to-know-and-do-right-now/', destination: '/insights/blog', permanent: true },
      { source: '/chatgpt-paid-advertising-what-b2b-leaders-need-to-know-and-do-right-now', destination: '/insights/blog', permanent: true },

      // Legal pages
      { source: '/privacy-policy/', destination: '/privacy', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service/', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/privacy', permanent: true },
      { source: '/cookie-settings/', destination: '/privacy', permanent: true },
      { source: '/cookie-settings', destination: '/privacy', permanent: true },

      // Main nav pages
      { source: '/services/', destination: '/services', permanent: true },
      { source: '/blog/', destination: '/insights/blog', permanent: true },
      { source: '/blog', destination: '/insights/blog', permanent: true },
      { source: '/work/', destination: '/examples', permanent: true },
      { source: '/work', destination: '/examples', permanent: true },
      { source: '/contact/', destination: '/contact', permanent: true },

      // Services subpages → /services
      { source: '/services/services-marketing-foundations/', destination: '/services', permanent: true },
      { source: '/services/services-marketing-foundations', destination: '/services', permanent: true },
      { source: '/services/services-ai-foundations/', destination: '/services', permanent: true },
      { source: '/services/services-ai-foundations', destination: '/services', permanent: true },
      { source: '/services/services-ai-native-strategy/', destination: '/services', permanent: true },
      { source: '/services/services-ai-native-strategy', destination: '/services', permanent: true },
      { source: '/services/services-ai-enablement/', destination: '/services', permanent: true },
      { source: '/services/services-ai-enablement', destination: '/services', permanent: true },
      { source: '/services/services-ai-managed-services/', destination: '/services', permanent: true },
      { source: '/services/services-ai-managed-services', destination: '/services', permanent: true },
      { source: '/services/services-ai-transformation-and-leadership/', destination: '/services', permanent: true },
      { source: '/services/services-ai-transformation-and-leadership', destination: '/services', permanent: true },
      { source: '/services/chatgpt-advertising/', destination: '/services', permanent: true },
      { source: '/services/chatgpt-advertising', destination: '/services', permanent: true },

      // Work/case study pages → /examples/:slug
      { source: '/work/work-mobile-health/', destination: '/examples/mobile-health', permanent: true },
      { source: '/work/work-mobile-health', destination: '/examples/mobile-health', permanent: true },
      { source: '/work/work-nudge/', destination: '/examples/nudge', permanent: true },
      { source: '/work/work-nudge', destination: '/examples/nudge', permanent: true },
      { source: '/work/work-searchlight/', destination: '/examples/searchlight', permanent: true },
      { source: '/work/work-searchlight', destination: '/examples/searchlight', permanent: true },
      { source: '/work/work-archetype/', destination: '/examples/archetype', permanent: true },
      { source: '/work/work-archetype', destination: '/examples/archetype', permanent: true },
      { source: '/work/work-axonify/', destination: '/examples/axonify', permanent: true },
      { source: '/work/work-axonify', destination: '/examples/axonify', permanent: true },
      { source: '/work/work-unmind/', destination: '/examples/unmind', permanent: true },
      { source: '/work/work-unmind', destination: '/examples/unmind', permanent: true },
      { source: '/work/work-docebo/', destination: '/examples/docebo', permanent: true },
      { source: '/work/work-docebo', destination: '/examples/docebo', permanent: true },
      { source: '/work/work-papaya-global/', destination: '/examples/papaya-global', permanent: true },
      { source: '/work/work-papaya-global', destination: '/examples/papaya-global', permanent: true },
      { source: '/work/work-talent-lms/', destination: '/examples/talent-lms', permanent: true },
      { source: '/work/work-talent-lms', destination: '/examples/talent-lms', permanent: true },
      { source: '/work/work-cornerstone/', destination: '/examples/cornerstone', permanent: true },
      { source: '/work/work-cornerstone', destination: '/examples/cornerstone', permanent: true },

      // Misc
      { source: '/unmind-business-case/', destination: '/', permanent: true },
      { source: '/unmind-business-case', destination: '/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} https://va.vercel-scripts.com https://cal.com https://www.googletagmanager.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cal.com https://www.google-analytics.com https://analytics.google.com",
              "frame-src https://cal.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
