'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface CoinSlotCTAProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

function Screw({ className }: { className: string }) {
  return (
    <div
      className={`absolute w-2.5 h-2.5 rounded-full ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 35%, #444, #1a1a1a)',
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5)',
      }}
    />
  );
}

const ledGlow = {
  color: '#FF7A40',
  textShadow: [
    '0 0 4px #FF5910',
    '0 0 8px #FF5910',
    '0 0 20px #FF5910',
    '0 0 40px rgba(255,89,16,0.4)',
    '0 0 60px rgba(255,89,16,0.2)',
  ].join(', '),
};

const dividerGlow = {
  background: '#FF5910',
  boxShadow: '0 0 4px #FF5910, 0 0 8px #FF5910, 0 0 16px rgba(255,89,16,0.4)',
};

export function CoinSlotCTA({
  href = '/book',
  onClick,
  className = '',
}: CoinSlotCTAProps) {
  const reducedMotion = useReducedMotion();

  const content = (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Metallic outer frame */}
      <div
        className="relative p-3 rounded-lg"
        style={{
          background:
            'linear-gradient(180deg, #2e2e2e 0%, #1c1c1c 40%, #252525 100%)',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.08)',
            'inset 0 -1px 0 rgba(0,0,0,0.4)',
            '0 4px 12px rgba(0,0,0,0.6)',
            '0 1px 3px rgba(0,0,0,0.4)',
          ].join(', '),
          border: '1px solid #333',
        }}
      >
        {/* Corner screws */}
        <Screw className="top-1.5 left-1.5" />
        <Screw className="top-1.5 right-1.5" />
        <Screw className="bottom-1.5 left-1.5" />
        <Screw className="bottom-1.5 right-1.5" />

        {/* Recessed inner display */}
        <motion.div
          className="flex flex-col items-center justify-center px-8 py-5 rounded"
          style={{
            background: '#0a0a0a',
            boxShadow: [
              'inset 0 2px 6px rgba(0,0,0,0.8)',
              'inset 0 0 12px rgba(0,0,0,0.5)',
              'inset 0 1px 0 rgba(0,0,0,0.9)',
            ].join(', '),
            border: '1px solid #111',
            minWidth: 180,
          }}
          whileTap={
            reducedMotion
              ? { opacity: 0.8 }
              : { y: 3, scale: 0.98 }
          }
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        >
          {/* 25 cents */}
          <motion.span
            className="font-arcade text-3xl tracking-wider"
            style={ledGlow}
            animate={
              reducedMotion
                ? {}
                : { opacity: [1, 0.88, 1, 1, 0.75, 1] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.08, 0.14, 0.7, 0.73, 0.8],
            }}
          >
            25&cent;
          </motion.span>

          {/* Divider */}
          <motion.div
            className="w-full h-px my-3 rounded-full"
            style={dividerGlow}
            animate={
              reducedMotion
                ? {}
                : { opacity: [1, 0.88, 1, 1, 0.75, 1] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.08, 0.14, 0.7, 0.73, 0.8],
            }}
          />

          {/* PUSH */}
          <motion.span
            className="font-arcade text-[9px] tracking-widest"
            style={ledGlow}
            animate={
              reducedMotion
                ? {}
                : { opacity: [1, 0.88, 1, 1, 0.75, 1] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.08, 0.14, 0.7, 0.73, 0.8],
            }}
          >
            PUSH
          </motion.span>
        </motion.div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Book a consultation</span>
    </motion.div>
  );

  if (href && !onClick) {
    return (
      <Link
        href={href}
        className="inline-block hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atomic-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-heart-of-darkness rounded-lg"
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
