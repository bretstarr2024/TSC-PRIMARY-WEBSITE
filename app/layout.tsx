import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/GradientBackground";
import { TrackingProvider } from "@/components/TrackingProvider";
import { ConsoleGreeting } from "@/components/ConsoleGreeting";
import { KonamiCode } from "@/components/KonamiCode";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-arcade",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tsc-primary-website.vercel.app'),
  title: {
    default: "The Starr Conspiracy | B2B Marketing Agency",
    template: "%s | The Starr Conspiracy",
  },
  description:
    "The B2B marketing agency where fundamentals meet AI transformation. 25+ years of brand, message, and strategy — now supercharged with AI execution no one else can match.",
  keywords: [
    "B2B marketing agency",
    "AI marketing",
    "brand strategy",
    "demand generation",
    "go-to-market strategy",
    "answer engine optimization",
    "marketing transformation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Starr Conspiracy",
    title: "The Starr Conspiracy | Game Over for Traditional B2B Marketing",
    description:
      "The B2B marketing agency where fundamentals meet AI transformation. We deliver the best of both worlds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Starr Conspiracy",
    description:
      "B2B marketing agency. Fundamentals + AI. Proven results.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'msapplication-TileColor': '#FF5910',
    'color-scheme': 'dark',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${pressStart.variable}`}>
      <head>
        <meta name="theme-color" content="#141213" />
      </head>
      <body className="bg-heart-of-darkness text-white antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-atomic-tangerine focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <NoiseOverlay />
          <TrackingProvider />
          <ConsoleGreeting />
          <KonamiCode />
          <CustomCursor />
          <PageTransition>
            <div id="main-content" tabIndex={-1}>{children}</div>
          </PageTransition>
          <CookieConsent />
          <Analytics />
          <SpeedInsights />
        </SmoothScroll>
      </body>
    </html>
  );
}
