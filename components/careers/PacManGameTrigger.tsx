'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { OchoTrigger } from '@/components/OchoTrigger';

const PacManGame = dynamic(
  () => import('./PacManGame').then((mod) => ({ default: mod.PacManGame })),
  { ssr: false }
);

export function PacManGameTrigger() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {playing && <PacManGame onClose={() => setPlaying(false)} />}
      <div className="flex justify-center my-8">
        {!playing && <OchoTrigger onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
