'use client';

import { useEffect, useState } from 'react';

interface GameStat { game: string; label: string; count: number; }
interface RecentPlay { game: string; label: string; initials: string; score: number; hasEmail: boolean; createdAt: string; }

interface ArcadeStats {
  totalPlays: number;
  uniquePlayers: number;
  emailsCaptured: number;
  emailRate: number;
  playsByGame: GameStat[];
  recentPlays: RecentPlay[];
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
      <p style={{ fontSize: 10, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 'bold', color: '#E1FF00', margin: 0, fontFamily: 'monospace' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#6D6D69', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

export function ArcadeSection() {
  const [data, setData] = useState<ArcadeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/arcade/stats')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '24px 0', color: '#6D6D69', fontSize: 13, fontFamily: 'monospace' }}>
      Loading arcade stats...
    </div>
  );

  if (!data) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0 }}>Arcade Campaign</h2>
        <a
          href="/arcade-leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: '#73F5FF', textDecoration: 'none', fontFamily: 'monospace' }}
        >
          View public leaderboard →
        </a>
      </div>

      {/* Stat boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatBox label="Total Plays" value={data.totalPlays.toLocaleString()} />
        <StatBox label="Unique Players" value={data.uniquePlayers.toLocaleString()} sub="by email" />
        <StatBox label="Emails Captured" value={data.emailsCaptured.toLocaleString()} sub={`${data.emailRate}% capture rate`} />
      </div>

      {/* Games breakdown */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Plays by Game</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.playsByGame.map(g => {
            const pct = data.totalPlays > 0 ? Math.round((g.count / data.totalPlays) * 100) : 0;
            return (
              <div key={g.game} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#d1d1c6', width: 120, flexShrink: 0 }}>{g.label}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#E1FF00', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, color: '#6D6D69', width: 48, textAlign: 'right', fontFamily: 'monospace' }}>{g.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent plays */}
      {data.recentPlays.length > 0 && (
        <div>
          <p style={{ fontSize: 10, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Recent Plays</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.recentPlays.slice(0, 10).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', fontFamily: 'monospace', width: 32 }}>{p.initials}</span>
                <span style={{ fontSize: 11, color: '#6D6D69', flex: 1 }}>{p.label}</span>
                <span style={{ fontSize: 12, color: '#E1FF00', fontFamily: 'monospace' }}>{p.score.toLocaleString()}</span>
                <span style={{ fontSize: 10, color: p.hasEmail ? '#73F5FF' : '#3a3a3a' }} title={p.hasEmail ? 'Email captured' : 'No email'}>
                  {p.hasEmail ? '✉' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
