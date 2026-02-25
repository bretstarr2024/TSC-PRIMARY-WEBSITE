'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';

const SnakeGame = dynamic(
  () => import('./SnakeGame').then((mod) => ({ default: mod.SnakeGame })),
  { ssr: false }
);

export function SnakeGameTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <SnakeGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
