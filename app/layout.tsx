import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/GradientBackground";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((mod) => ({ default: mod.CustomCursor })),
  { ssr: false }
);

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${pressStart.variable}`}>
      <body className="bg-heart-of-darkness text-white antialiased font-sans">
        <SmoothScroll>
          <CustomCursor />
          <NoiseOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
