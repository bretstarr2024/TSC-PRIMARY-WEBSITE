'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';

const MissileCommandGame = dynamic(
  () => import('./MissileCommandGame').then((mod) => ({ default: mod.MissileCommandGame })),
  { ssr: false }
);

export function MissileCommandTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <MissileCommandGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
