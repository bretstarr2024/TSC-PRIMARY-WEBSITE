'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CoinSlotCTAProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  ctaId?: string;
}

export function CoinSlotCTA({
  href = '/book',
  onClick,
  className = '',
  ctaId,
}: CoinSlotCTAProps) {
  const reducedMotion = useReducedMotion();

  const content = (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={reducedMotion ? { opacity: 0.8 } : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,89,16,0.35) 0%, rgba(255,89,16,0.12) 40%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Coin slot image */}
      <Image
        src="/images/coin_slot.png"
        alt="Insert coin to play"
        width={200}
        height={200}
        unoptimized
        className="relative z-10"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(255,89,16,0.5)) drop-shadow(0 0 20px rgba(255,89,16,0.25))',
        }}
      />

      {/* Screen reader text */}
      <span className="sr-only">Book a consultation</span>
    </motion.div>
  );

  if (href && !onClick) {
    return (
      <Link
        href={href}
        className="inline-block hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atomic-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-heart-of-darkness rounded-lg"
        data-track-cta={ctaId || 'coin-slot'}
        data-track-component="CoinSlotCTA"
        data-track-label="25¢ PUSH"
        data-track-destination={href}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atomic-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-heart-of-darkness rounded-lg"
    >
      {content}
    </button>
  );
}
