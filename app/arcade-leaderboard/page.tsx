'use client';

import { useEffect, useState, useCallback } from 'react';

const EMAIL_KEY = 'tsc-arcade-email';

interface AggregateEntry {
  initials: string;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
  gameBreakdown: { game: string; score: number }[];
}

interface LeaderboardData {
  aggregate: AggregateEntry[];
  perGame: Record<string, { initials: string; score: number; rank: number }[]>;
  gameLabels: Record<string, string>;
  totalPlayers: number;
  generatedAt: string;
}

const GAME_ORDER = [
  'galaga', 'invaders', 'asteroids', 'breakout', 'pacman',
  'frogger', 'tron', 'pong', 'missile-command',
];

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{
        width: 32, height: 32,
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: '#E1FF00',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ArcadeLeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overall' | string>('overall');
  const [myEmail, setMyEmail] = useState('');

  useEffect(() => {
    try { setMyEmail(localStorage.getItem(EMAIL_KEY) || ''); } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/arcade/leaderboard');
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'monospace', padding: '48px 20px' } as React.CSSProperties,
    inner: { maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
    header: { textAlign: 'center' as const, marginBottom: 40 },
    title: { fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 'bold', color: '#E1FF00', margin: 0, letterSpacing: 2 } as React.CSSProperties,
    sub: { color: '#6D6D69', fontSize: 13, marginTop: 8 } as React.CSSProperties,
    tabs: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 },
    tab: (active: boolean): React.CSSProperties => ({
      padding: '7px 14px', background: active ? '#E1FF00' : 'transparent',
      border: active ? 'none' : '1px solid rgba(255,255,255,0.15)',
      borderRadius: 6, color: active ? '#0a0a0a' : '#d1d1c6',
      cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
      fontWeight: active ? 'bold' : 'normal', letterSpacing: 1,
      textTransform: 'uppercase' as const,
    }),
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, fontSize: 10, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase' as const, padding: '0 12px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    tr: (isMe: boolean, isTop: boolean): React.CSSProperties => ({
      background: isMe ? 'rgba(225,255,0,0.06)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }),
    td: { padding: '12px 12px 12px 0', fontSize: 13, verticalAlign: 'middle' as const },
    rank: (rank: number): React.CSSProperties => ({
      fontWeight: 'bold', fontSize: 14,
      color: rank === 1 ? '#E1FF00' : rank === 2 ? '#73F5FF' : rank === 3 ? '#FF5910' : '#6D6D69',
      minWidth: 32,
    }),
    initials: { fontWeight: 'bold', fontSize: 15, color: '#fff', letterSpacing: 2 } as React.CSSProperties,
    score: { fontWeight: 'bold', color: '#E1FF00', fontSize: 14 } as React.CSSProperties,
    empty: { textAlign: 'center' as const, padding: '60px 0', color: '#6D6D69', fontSize: 13 },
  };

  const gamesCount = data ? Object.keys(data.perGame).length : 0;

  return (
    <div style={s.page}>
      <div style={s.inner}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.title}>ARCADE LEADERBOARD</h1>
          <p style={s.sub}>
            {data ? `${data.totalPlayers.toLocaleString()} players across ${gamesCount} games` : 'Loading...'}
            {data && <> &middot; Updated {new Date(data.generatedAt).toLocaleTimeString()}</>}
          </p>
          {!myEmail && (
            <p style={{ ...s.sub, color: '#FF5910', marginTop: 12 }}>
              Play any game and add your email to see your row highlighted
            </p>
          )}
        </div>

        {/* Tabs */}
        {data && (
          <div style={s.tabs}>
            <button style={s.tab(tab === 'overall')} onClick={() => setTab('overall')}>
              Overall
            </button>
            {GAME_ORDER.map(g => (
              <button key={g} style={s.tab(tab === g)} onClick={() => setTab(g)}>
                {data.gameLabels[g] || g}
              </button>
            ))}
          </div>
        )}

        {loading && <Spinner />}

        {!loading && data && (
          <>
            {/* Overall aggregate */}
            {tab === 'overall' && (
              <>
                <p style={{ color: '#6D6D69', fontSize: 11, marginBottom: 20, letterSpacing: 1 }}>
                  RANKED BY COMBINED SCORE ACROSS ALL GAMES
                </p>
                {data.aggregate.length === 0 ? (
                  <div style={s.empty}>
                    No scores yet. Be the first to play.
                  </div>
                ) : (
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>#</th>
                        <th style={s.th}>Player</th>
                        <th style={s.th}>Total Score</th>
                        <th style={s.th}>Games</th>
                        <th style={{ ...s.th, display: 'none' }}>Breakdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.aggregate.map((entry) => {
                        const isMe = false; // can't match without email
                        return (
                          <tr key={entry.rank} style={s.tr(isMe, entry.rank <= 3)}>
                            <td style={{ ...s.td, ...s.rank(entry.rank) }}>
                              {entry.rank === 1 ? '🏆' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                            </td>
                            <td style={{ ...s.td, ...s.initials }}>{entry.initials}</td>
                            <td style={{ ...s.td, ...s.score }}>{entry.totalScore.toLocaleString()}</td>
                            <td style={{ ...s.td, color: '#6D6D69', fontSize: 12 }}>
                              {entry.gamesPlayed} game{entry.gamesPlayed !== 1 ? 's' : ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* Per-game view */}
            {tab !== 'overall' && (
              <>
                <p style={{ color: '#6D6D69', fontSize: 11, marginBottom: 20, letterSpacing: 1 }}>
                  TOP SCORES — {(data.gameLabels[tab] || tab).toUpperCase()}
                </p>
                {!data.perGame[tab] || data.perGame[tab].length === 0 ? (
                  <div style={s.empty}>No scores yet for this game.</div>
                ) : (
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>#</th>
                        <th style={s.th}>Player</th>
                        <th style={s.th}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.perGame[tab].map((entry) => (
                        <tr key={entry.rank} style={s.tr(false, entry.rank <= 3)}>
                          <td style={{ ...s.td, ...s.rank(entry.rank) }}>
                            {entry.rank === 1 ? '🏆' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                          </td>
                          <td style={{ ...s.td, ...s.initials }}>{entry.initials}</td>
                          <td style={{ ...s.td, ...s.score }}>{entry.score.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 60, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32 }}>
          <p style={{ color: '#6D6D69', fontSize: 11, letterSpacing: 1 }}>
            GAMES HIDDEN ACROSS THESTARRCONSPIRACY.COM &middot; FIND THEM ALL
          </p>
          <button
            onClick={load}
            style={{ marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#6D6D69', fontSize: 11, cursor: 'pointer', padding: '6px 14px', fontFamily: 'monospace', letterSpacing: 1 }}
          >
            ↺ REFRESH
          </button>
        </div>
      </div>
    </div>
  );
}
