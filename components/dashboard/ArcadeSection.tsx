'use client';

import { useEffect, useState } from 'react';

interface GameStat { game: string; label: string; count: number; }
interface RecentPlay { game: string; label: string; initials: string; score: number; hasEmail: boolean; createdAt: string; }
interface EmailPlay { email: string; initials: string; game: string; score: number; createdAt: string; }

interface ArcadeStats {
  totalPlays: number;
  uniquePlayers: number;
  emailsCaptured: number;
  emailRate: number;
  playsByGame: GameStat[];
  recentPlays: RecentPlay[];
}

const GAME_LABELS: Record<string, string> = {
  asteroids: 'Asteroids', frogger: 'Frogger', breakout: 'Breakout',
  tron: 'Tron', pong: 'Pong', snake: 'Serpent Arena',
  invaders: 'Space Invaders', galaga: 'Galaga', pacman: 'Pac-Man',
  'missile-command': 'Missile Command',
};

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
  const [showEmails, setShowEmails] = useState(false);
  const [emails, setEmails] = useState<EmailPlay[] | null>(null);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState('');

  useEffect(() => {
    fetch('/api/arcade/stats')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  function toggleEmails() {
    if (!showEmails && emails === null) {
      setEmailsLoading(true);
      fetch('/api/arcade/emails')
        .then(r => r.json())
        .then(d => setEmails(d.plays ?? []))
        .finally(() => setEmailsLoading(false));
    }
    setShowEmails(v => !v);
  }

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

      {/* Captured Emails */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={toggleEmails}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <p style={{ fontSize: 10, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
            Captured Emails
          </p>
          <span style={{ fontSize: 10, color: '#73F5FF', fontFamily: 'monospace' }}>
            {showEmails ? '▲ hide' : '▼ show'}
          </span>
        </button>

        {showEmails && (
          <div style={{ marginTop: 12 }}>
            {emailsLoading && (
              <p style={{ fontSize: 12, color: '#6D6D69', fontFamily: 'monospace' }}>Loading...</p>
            )}

            {emails !== null && !emailsLoading && (
              <>
                <input
                  type="text"
                  placeholder="Filter by email or game..."
                  value={emailFilter}
                  onChange={e => setEmailFilter(e.target.value)}
                  style={{
                    width: '100%', marginBottom: 12, padding: '6px 10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, color: '#d1d1c6', fontSize: 12, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {emails.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#6D6D69', fontFamily: 'monospace' }}>No emails captured yet.</p>
                ) : (
                  <>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 60px 120px 80px 90px',
                      gap: '0 12px',
                      padding: '4px 0 8px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: 4,
                    }}>
                      {['Email', 'Init.', 'Game', 'Score', 'Date'].map(h => (
                        <span key={h} style={{ fontSize: 9, color: '#6D6D69', letterSpacing: 1.5, textTransform: 'uppercase' }}>{h}</span>
                      ))}
                    </div>

                    <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {emails
                        .filter(e => {
                          if (!emailFilter) return true;
                          const f = emailFilter.toLowerCase();
                          return e.email.toLowerCase().includes(f) ||
                            (GAME_LABELS[e.game] ?? e.game).toLowerCase().includes(f);
                        })
                        .map((e, i) => (
                          <div key={i} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 60px 120px 80px 90px',
                            gap: '0 12px',
                            padding: '5px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            alignItems: 'center',
                          }}>
                            <span style={{ fontSize: 11, color: '#73F5FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {e.email}
                            </span>
                            <span style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace' }}>{e.initials}</span>
                            <span style={{ fontSize: 11, color: '#d1d1c6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {GAME_LABELS[e.game] ?? e.game}
                            </span>
                            <span style={{ fontSize: 11, color: '#E1FF00', fontFamily: 'monospace' }}>{e.score.toLocaleString()}</span>
                            <span style={{ fontSize: 10, color: '#6D6D69' }}>
                              {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        ))}
                    </div>

                    <p style={{ fontSize: 10, color: '#6D6D69', marginTop: 8, fontFamily: 'monospace' }}>
                      {emails.filter(e => {
                        if (!emailFilter) return true;
                        const f = emailFilter.toLowerCase();
                        return e.email.toLowerCase().includes(f) || (GAME_LABELS[e.game] ?? e.game).toLowerCase().includes(f);
                      }).length} of {emails.length} plays with email
                      {' · '}{new Set(emails.map(e => e.email)).size} unique addresses
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
