'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function AnimatedText({
  children,
  className = '',
  delay = 0,
  as: Component = 'p',
}: AnimatedTextProps) {
  const words = children.split(' ');

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

interface ScrambleTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function ScrambleText({
  children,
  className = '',
  delay = 0,
}: ScrambleTextProps) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delay: delay + index * 0.03,
                duration: 0.1,
              },
            },
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface TypewriterTextProps {
  children: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypewriterText({
  children,
  className = '',
  delay = 0,
  speed = 0.05,
}: TypewriterTextProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span className={className}>
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.01,
            delay: delay + index * speed,
          }}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          delay: delay + children.length * speed,
          repeat: reducedMotion ? 0 : Infinity,
        }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
      />
    </motion.span>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}

export function GradientText({
  children,
  className = '',
  from = 'from-atomic-tangerine',
  via = 'via-neon-cactus',
  to = 'to-tidal-wave',
}: GradientTextProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      animate={reducedMotion ? {} : {
        backgroundPosition: ['0% center', '100% center', '0% center'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}
