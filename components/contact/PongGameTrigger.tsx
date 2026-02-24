'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { OchoTrigger } from '@/components/OchoTrigger';

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
        {!playing && <OchoTrigger onClick={() => setPlaying(true)} delay={0.5} />}
      </div>
    </>
  );
}
