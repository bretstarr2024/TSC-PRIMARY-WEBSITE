'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface ArcadeButtonProps {
  onClick: () => void;
  delay?: number;
  className?: string;
}

/* Classic arcade "1 Player" stick figure — matches the icon on real cabinet buttons */
function PlayerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="4" r="3.5" fill="white" />
      {/* Body */}
      <line x1="12" y1="8" x2="12" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <line x1="12" y1="12" x2="4" y2="17" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="17" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="12" y1="20" x2="5" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="20" x2="19" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ArcadeButton({
  onClick,
  delay = 0,
  className = '',
}: ArcadeButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      className={`flex flex-col items-center group cursor-pointer bg-transparent border-none outline-none ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      aria-label="Play game"
    >
      {/* Outer housing — dark bezel ring */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={
          reducedMotion
            ? {}
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: 'easeInOut',
        }}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 50%, #2a2a2a 100%)',
          boxShadow: [
            '0 4px 12px rgba(0,0,0,0.6)',
            '0 2px 4px rgba(0,0,0,0.4)',
            'inset 0 1px 0 rgba(255,255,255,0.1)',
            'inset 0 -1px 0 rgba(0,0,0,0.4)',
          ].join(', '),
          padding: 5,
        }}
      >
        {/* Button face — Atomic Tangerine with concave gradient */}
        <motion.div
          className="flex items-center justify-center transition-shadow duration-300"
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #FF7A40 0%, #FF5910 50%, #CC4400 100%)',
            boxShadow: [
              'inset 0 2px 4px rgba(255,255,255,0.25)',
              'inset 0 -2px 6px rgba(0,0,0,0.3)',
              '0 0 0 1.5px rgba(0,0,0,0.3)',
            ].join(', '),
          }}
          whileHover={{
            boxShadow: [
              'inset 0 2px 4px rgba(255,255,255,0.25)',
              'inset 0 -2px 6px rgba(0,0,0,0.3)',
              '0 0 0 1.5px rgba(0,0,0,0.3)',
              '0 0 20px rgba(255,89,16,0.5)',
              '0 0 40px rgba(255,89,16,0.25)',
            ].join(', '),
          }}
          whileTap={
            reducedMotion
              ? { opacity: 0.8 }
              : { scale: 0.92, y: 2 }
          }
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        >
          <PlayerIcon size={24} />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
