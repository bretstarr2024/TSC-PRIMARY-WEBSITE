'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';

const PongGame = dynamic(
  () => import('./PongGame').then((mod) => ({ default: mod.PongGame })),
  { ssr: false }
);

export function PongGameTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <PongGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
