'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TSCFighterGame = dynamic(
  () => import('@/components/home/TSCFighterGame').then(m => ({ default: m.TSCFighterGame })),
  { ssr: false }
);

const FIGHTERS = [
  { id: 'bret',    name: 'Bret Starr',    title: 'Chief AI Officer',         color: '#FF5910', img: '/images/Bret.png'    },
  { id: 'jj',      name: 'JJ La Pata',    title: 'Chief Strategy Officer',  color: '#73F5FF', img: '/images/JJ.png'      },
  { id: 'racheal', name: 'Racheal Bates', title: 'Chief Experience Officer', color: '#ED0AD2', img: '/images/Racheal.png' },
  { id: 'dan',     name: 'Dan McCarron',  title: 'Chief Operating Officer', color: '#E1FF00', img: '/images/Dan.png'     },
];

const BOSSES = [
  { name: 'The Misaligned Strategy', domain: 'Domain I: Strategy',    color: '#7C3AED' },
  { name: 'The Broken Pipeline',     domain: 'Domain II: Demand',     color: '#DC2626' },
  { name: 'The AI Impostor',         domain: 'Domain III: Execution', color: '#059669' },
];

export default function TSCFighterPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <main style={{ minHeight: '100vh', background: '#050508', color: '#d1d1c6', fontFamily: "'Press Start 2P', monospace" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #1a1a2a' }}>
        <Link href="/" style={{ color: '#d1d1c6', textDecoration: 'none', fontSize: 11 }}>← BACK</Link>
        <span style={{ fontSize: 10, color: '#555' }}>THE STARR CONSPIRACY</span>
        <span style={{ fontSize: 10, color: '#222' }}>&nbsp;</span>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <p style={{ fontSize: 10, color: '#555', marginBottom: 16, letterSpacing: '0.15em' }}>THE STARR CONSPIRACY PRESENTS</p>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', color: '#E1FF00', lineHeight: 1.2, marginBottom: 12, textShadow: '0 0 40px #E1FF0066' }}>
          TSC FIGHTER
        </h1>
        <p style={{ fontSize: 9, color: '#73F5FF', letterSpacing: '0.1em', marginBottom: 40 }}>
          PICK YOUR CHAMPION. DEFEAT THE GTM PROBLEMS.
        </p>

        {/* Play button */}
        <button
          onClick={() => setPlaying(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '18px 40px',
            background: 'transparent',
            border: '3px solid #E1FF00',
            color: '#E1FF00',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 14, cursor: 'pointer',
            textShadow: '0 0 20px #E1FF00',
            boxShadow: '0 0 30px #E1FF0033, inset 0 0 30px #E1FF0011',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#E1FF0022')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          ▶ INSERT COIN
        </button>
      </section>

      {/* Fighters grid */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <p style={{ fontSize: 8, color: '#555', textAlign: 'center', marginBottom: 32, letterSpacing: '0.15em' }}>
          — SELECT YOUR FIGHTER —
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {FIGHTERS.map(f => (
            <div key={f.id} style={{
              border: `2px solid ${f.color}33`,
              background: f.color + '08',
              padding: 24,
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = f.color; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${f.color}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = f.color + '33'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              {/* Portrait placeholder — replaced when images exist */}
              <div style={{
                width: '100%', paddingBottom: '130%', position: 'relative',
                background: f.color + '11', border: `1px solid ${f.color}44`, marginBottom: 16,
                overflow: 'hidden',
              }}>
                <img
                  src={f.img}
                  alt={f.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, color: f.color + '44', fontFamily: 'monospace' }}>{f.name.slice(0, 2)}</span>
                </div>
              </div>
              <p style={{ fontSize: 9, color: f.color, marginBottom: 8 }}>{f.name}</p>
              <p style={{ fontSize: 7, color: '#888' }}>{f.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boss Rush section */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: 8, color: '#555', marginBottom: 32, letterSpacing: '0.15em' }}>— BOSS RUSH —</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {BOSSES.map((b, i) => (
            <div key={b.name} style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '16px 24px',
              border: `1px solid ${b.color}44`,
              background: b.color + '08',
            }}>
              <span style={{ fontSize: 20, color: b.color, minWidth: 32 }}>{i + 1}</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 9, color: b.color, marginBottom: 6 }}>{b.name}</p>
                <p style={{ fontSize: 7, color: '#666' }}>{b.domain}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 8, color: '#555', marginBottom: 24, letterSpacing: '0.15em' }}>— CONTROLS —</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 7, color: '#666' }}>
          {[
            ['← →', 'Move'],
            ['↑', 'Jump'],
            ['Z', 'Punch (fast)'],
            ['X', 'Kick (power)'],
            ['S', 'Special (when bar full)'],
            ['M', 'Mute / unmute'],
          ].map(([key, action]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#0f0f14', border: '1px solid #1a1a2a' }}>
              <span style={{ color: '#E1FF00' }}>{key}</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 7, color: '#444', marginTop: 20 }}>Touch controls available on mobile.</p>
      </section>

      {playing && <TSCFighterGame onClose={() => setPlaying(false)} />}
    </main>
  );
}
