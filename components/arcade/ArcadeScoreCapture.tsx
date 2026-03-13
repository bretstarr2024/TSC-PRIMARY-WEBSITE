'use client';

import { useEffect, useState, useRef } from 'react';

const EMAIL_KEY = 'tsc-arcade-email';

interface ScoreEvent {
  game: string;
  initials: string;
  score: number;
}

interface RankResult {
  rank: number;
  total: number;
  gameLabel: string;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 99998,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(10,10,10,0.88)',
  fontFamily: 'monospace',
};

const cardStyle: React.CSSProperties = {
  position: 'relative',
  background: '#141213',
  border: '1px solid rgba(225,255,0,0.25)',
  borderRadius: 12,
  padding: '32px 28px',
  maxWidth: 400,
  width: '90vw',
  textAlign: 'center',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.2)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'monospace',
  boxSizing: 'border-box',
  marginBottom: 10,
};

const btnPrimary: React.CSSProperties = {
  width: '100%',
  padding: '11px 0',
  background: '#E1FF00',
  border: 'none',
  borderRadius: 8,
  color: '#0a0a0a',
  fontWeight: 'bold',
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'monospace',
  letterSpacing: 1,
  marginBottom: 10,
};


export function ArcadeScoreCapture() {
  const [visible, setVisible] = useState(false);
  const [rankResult, setRankResult] = useState<RankResult | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const pendingRef = useRef<ScoreEvent | null>(null);

  useEffect(() => {
    const handleScore = async (e: Event) => {
      const detail = (e as CustomEvent<ScoreEvent>).detail;
      if (!detail?.game || !detail?.initials) return;
      pendingRef.current = detail;

      // Read stored email
      let storedEmail: string | undefined;
      try { storedEmail = localStorage.getItem(EMAIL_KEY) || undefined; } catch {}

      if (storedEmail) {
        // Email already stored — submit immediately and show rank toast
        try {
          const res = await fetch('/api/arcade/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              game: detail.game,
              initials: detail.initials,
              score: detail.score,
              email: storedEmail,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setRankResult({ rank: data.rank, total: data.total, gameLabel: data.gameLabel });
          }
        } catch { /* graceful degradation */ }
        setEmailDone(true);
        setVisible(true);
        setTimeout(() => setVisible(false), 4000);
      } else {
        // No email yet — show form; score held until email provided
        setEmailDone(false);
        setEmail('');
        setRankResult(null);
        setVisible(true);
      }
    };

    window.addEventListener('arcade-score', handleScore);
    return () => window.removeEventListener('arcade-score', handleScore);
  }, []);

  const handleSubmitEmail = async () => {
    if (!email || submitting) return;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return;
    setSubmitting(true);

    const cleanEmail = email.toLowerCase().trim();
    try { localStorage.setItem(EMAIL_KEY, cleanEmail); } catch {}

    // Submit score now that we have an email
    if (pendingRef.current) {
      try {
        const res = await fetch('/api/arcade/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: pendingRef.current.game,
            initials: pendingRef.current.initials,
            score: pendingRef.current.score,
            email: cleanEmail,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setRankResult({ rank: data.rank, total: data.total, gameLabel: data.gameLabel });
        }
      } catch {}
    }

    setSubmitting(false);
    setEmailDone(true);
  };

  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Close only available after email is submitted */}
        {emailDone && (
          <button
            onClick={() => setVisible(false)}
            style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: '#6D6D69', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
            aria-label="Close"
          >×</button>
        )}

        {/* Rank badge */}
        {rankResult && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#6D6D69', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
              {rankResult.gameLabel}
            </div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#E1FF00', lineHeight: 1 }}>
              #{rankResult.rank}
            </div>
            <div style={{ fontSize: 12, color: '#d1d1c6', marginTop: 4 }}>
              of {rankResult.total.toLocaleString()} {rankResult.total === 1 ? 'score' : 'scores'} posted
            </div>
          </div>
        )}

        {!emailDone ? (
          <>
            <p style={{ color: '#fff', fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>
              Enter your email to post your score and appear on the global leaderboard.
            </p>
            <p style={{ color: '#6D6D69', fontSize: 11, marginBottom: 18 }}>
              One time. All games. Never spammed.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') handleSubmitEmail(); }}
              placeholder="you@company.com"
              style={inputStyle}
              autoFocus
            />
            <button
              onClick={handleSubmitEmail}
              disabled={!email || submitting}
              style={{ ...btnPrimary, opacity: !email || submitting ? 0.5 : 1 }}
            >
              {submitting ? 'SAVING...' : 'POST MY SCORE'}
            </button>
          </>
        ) : (
          <>
            <p style={{ color: '#73F5FF', fontSize: 14, marginBottom: 4 }}>
              {email ? "You're on the board." : "Score recorded."}
            </p>
            <p style={{ color: '#6D6D69', fontSize: 12, marginBottom: 20 }}>
              {email ? 'All your game scores are now tracked together.' : 'Play more games to climb the leaderboard.'}
            </p>
            <a
              href="/arcade-leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', color: '#E1FF00', fontSize: 13, fontWeight: 'bold', textDecoration: 'none' }}
            >
              View full leaderboard →
            </a>
          </>
        )}
      </div>
    </div>
  );
}
