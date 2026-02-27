'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface ArcadeButtonProps {
  onClick: () => void;
  delay?: number;
  className?: string;
}

export function ArcadeButton({
  onClick,
  delay = 0,
  className = '',
}: ArcadeButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`flex flex-col items-center cursor-pointer select-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-atomic-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-heart-of-darkness rounded-lg ${className}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      aria-label="Play game"
    >
      <motion.div
        className="relative"
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
      >
        <motion.div
          whileHover={{
            filter: 'drop-shadow(0 0 12px rgba(255,89,16,0.5)) drop-shadow(0 0 24px rgba(255,89,16,0.25))',
          }}
          whileTap={
            reducedMotion
              ? { opacity: 0.8 }
              : { scale: 0.92, y: 2 }
          }
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        >
          <Image
            src="/images/1_player.png"
            alt=""
            width={64}
            height={64}
            unoptimized
            aria-hidden="true"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
