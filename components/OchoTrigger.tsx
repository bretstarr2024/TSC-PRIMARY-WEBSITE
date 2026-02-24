'use client';

import { motion } from 'framer-motion';

interface OchoTriggerProps {
  onClick: () => void;
  delay?: number;
  className?: string;
}

export function OchoTrigger({ onClick, delay = 0, className = '' }: OchoTriggerProps) {
  return (
    <motion.button
      className={`flex flex-col items-center group cursor-pointer bg-transparent border-none outline-none ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.img
        src="/images/ocho-color.png"
        alt=""
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 10px #ED0AD2)' }}
        draggable={false}
      />
    </motion.button>
  );
}
