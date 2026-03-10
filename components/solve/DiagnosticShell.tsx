'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Full-page wrapper for The Diagnostic.
 * Adds a scroll-linked gradient journey (cool → warm)
 * and a subtle noise texture for depth and differentiation from the homepage.
 */
export function DiagnosticShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref });

  // Scroll-linked hue rotation on the gradient overlay
  const hueRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 60, -30]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.2, 0.28, 0.35]);

  return (
    <div ref={ref} className="relative">
      {/* Scroll-linked nebula gradient — sits behind all content */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(115,245,255,0.14) 0%, transparent 50%), ' +
            'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(8,139,160,0.1) 0%, transparent 50%), ' +
            'radial-gradient(ellipse 70% 60% at 40% 80%, rgba(255,89,16,0.08) 0%, transparent 50%)',
          opacity: reducedMotion ? 0.12 : overlayOpacity,
          filter: reducedMotion ? undefined : `hue-rotate(${hueRotate}deg)`,
        }}
      />

      {/* Noise texture overlay — adds grain/depth distinct from homepage */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Content */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  );
}
