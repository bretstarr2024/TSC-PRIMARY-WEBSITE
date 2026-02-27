'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function KonamiCode() {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (active) return;
    const key = e.key;
    if (key === KONAMI[index]) {
      const next = index + 1;
      if (next === KONAMI.length) {
        setActive(true);
        setIndex(0);
      } else {
        setIndex(next);
      }
    } else {
      setIndex(key === KONAMI[0] ? 1 : 0);
    }
  }, [index, active]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!active) return;
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [active, mouseX, mouseY]);

  if (!active) return null;

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[99998]"
        style={{ x: springX, y: springY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ocho-color.png"
          alt=""
          width={48}
          height={48}
          className="-translate-x-1/2 -translate-y-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>
      <button
        onClick={() => setActive(false)}
        className="fixed bottom-4 right-4 z-[99998] px-3 py-1.5 bg-atomic-tangerine text-white text-xs font-arcade rounded-lg hover:bg-hot-sauce transition-colors"
      >
        BOSS MODE OFF
      </button>
    </>
  );
}
