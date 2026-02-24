'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const BRAND_COLORS = ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2', '#d1d1c6'];
const CONFETTI_COUNT = 80;

interface ArcadeBossOverlayProps {
  game: string;
  score: number;
  initials: string;
  onClose: () => void;
}

export function ArcadeBossOverlay({ game, score, initials, onClose }: ArcadeBossOverlayProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef('');
  const submittedRef = useRef(false);

  emailRef.current = email;
  submittedRef.current = submitted;

  const [confetti] = useState(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: BRAND_COLORS[i % BRAND_COLORS.length],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  );

  const handleSubmit = async () => {
    const currentEmail = emailRef.current;
    if (!currentEmail || submittedRef.current) return;
    setSubmitting(true);
    try {
      await fetch('/api/arcade-boss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, game, score, initials }),
      });
    } catch { /* graceful degradation */ }
    setSubmitted(true);
    setSubmitting(false);
  };

  /* Block ALL keyboard events from reaching the game underneath */
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', block, { capture: true });
    return () => window.removeEventListener('keydown', block, { capture: true });
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 10, 10, 0.95)',
        fontFamily: 'monospace',
      }}
    >
      {/* Confetti */}
      <style>{`
        @keyframes arcadeBossConfetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {confetti.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 1.5,
            background: c.color,
            borderRadius: 2,
            animation: `arcadeBossConfetti ${c.duration}s ease-in ${c.delay}s infinite`,
            transform: `rotate(${c.rotation}deg)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 500, padding: '0 20px' }}>
        {!submitted ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>&#x1F3C6;</div>
            <h2
              style={{
                fontSize: 'clamp(24px, 5vw, 42px)',
                fontWeight: 'bold',
                color: '#E1FF00',
                textShadow: '0 0 30px rgba(225, 255, 0, 0.5)',
                marginBottom: 8,
                lineHeight: 1.1,
              }}
            >
              YOU&apos;RE THE NEW
              <br />
              BOSS OF THE ARCADE!
            </h2>
            <p style={{ color: '#d1d1c6', fontSize: 16, marginBottom: 24 }}>
              {initials} &mdash; {String(score).padStart(6, '0')}
            </p>
            <p style={{ color: '#FF5910', fontSize: 14, marginBottom: 16 }}>
              Enter your email to claim your prize
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') handleSubmit();
              }}
              placeholder="boss@arcade.com"
              style={{
                width: '100%',
                maxWidth: 320,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid #FF5910',
                borderRadius: 8,
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                fontFamily: 'monospace',
                marginBottom: 12,
              }}
              autoFocus
            />
            <br />
            <button
              onClick={handleSubmit}
              disabled={!email || submitting}
              style={{
                padding: '12px 32px',
                background: '#FF5910',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
                opacity: !email || submitting ? 0.5 : 1,
                fontFamily: 'monospace',
                marginBottom: 16,
              }}
            >
              {submitting ? 'SENDING...' : 'CLAIM PRIZE'}
            </button>
            <br />
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6D6D69',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              No thanks, I just wanted the glory
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>&#x1F451;</div>
            <h2
              style={{
                fontSize: 'clamp(20px, 4vw, 36px)',
                fontWeight: 'bold',
                color: '#E1FF00',
                textShadow: '0 0 30px rgba(225, 255, 0, 0.5)',
                marginBottom: 16,
              }}
            >
              You&apos;re in the system, boss.
            </h2>
            <p style={{ color: '#d1d1c6', fontSize: 14, marginBottom: 24 }}>
              We&apos;ll be in touch about your prize.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 32px',
                background: '#FF5910',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              BACK TO SCORES
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
