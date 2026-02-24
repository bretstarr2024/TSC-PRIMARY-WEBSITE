'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { OchoTrigger } from '@/components/OchoTrigger';

const SpaceInvadersGame = dynamic(
  () => import('./SpaceInvadersGame').then((mod) => ({ default: mod.SpaceInvadersGame })),
  { ssr: false }
);

export function SpaceInvadersGameTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <SpaceInvadersGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <OchoTrigger onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
