'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';

const GalagaGame = dynamic(
  () => import('./GalagaGame').then((mod) => ({ default: mod.GalagaGame })),
  { ssr: false }
);

export function GalagaGameTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <GalagaGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
