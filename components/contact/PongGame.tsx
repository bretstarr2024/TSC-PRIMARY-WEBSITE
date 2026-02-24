'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  player: '#FF5910',
  ai: '#73F5FF',
  ball: '#E1FF00',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
};

/* ── Tuning knobs ── */
const PADDLE_W = 14;
const PADDLE_H = 80;
const MIN_PADDLE_H = 40;
const PADDLE_SHRINK = 4;
const PADDLE_MARGIN = 40;
const BALL_SIZE = 12;
const BASE_BALL_SPEED = 5;
const SPEED_INC = 0.3;
const WIN_SCORE = 11;

/* High scores */
const HS_KEY = 'tsc-pong-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ══════════════════════════════════════════════════════
   Sound Engine — Web Audio API retro synth sounds
   ══════════════════════════════════════════════════════ */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
      catch { return null; }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get muted() { return this._muted; }
  toggle(): boolean { this._muted = !this._muted; return this._muted; }

  paddleHit() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.08);
  }

  wallBounce() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, c.currentTime);
    g.gain.setValueAtTime(0.06, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.04);
  }

  score() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(220, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.15);
  }

  aiScore() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const dur = 0.3;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(300, c.currentTime);
    src.connect(f).connect(g).connect(c.destination);
    src.start(); src.stop(c.currentTime + dur);
  }

  levelUp() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [440, 554, 659, 880].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.1);
      g.gain.setValueAtTime(0.1, c.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.15);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.1);
      o.stop(c.currentTime + i * 0.1 + 0.15);
    });
  }

  gameOver() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [440, 370, 311, 220].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.2);
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.2 + 0.25);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.2);
      o.stop(c.currentTime + i * 0.2 + 0.25);
    });
  }

  dispose() {
    try { this.ctx?.close(); } catch { /* */ }
    this.ctx = null;
  }
}

/* ── Types ── */
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  color: string;
}

interface HighScore { initials: string; score: number }

interface Game {
  playerY: number;
  aiY: number;
  paddleH: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  ballSpeed: number;
  ballTrail: { x: number; y: number }[];
  playerScore: number;
  aiScore: number;
  totalScore: number;
  level: number;
  aiSpeed: number;
  aiReaction: number;
  rally: number;
  sparks: Spark[];
  serving: boolean;
  serveTimer: number;
  serveDir: 1 | -1;
  over: boolean;
  overTimer: number;
  shake: number;
  frame: number;
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
}

/* ── Helpers ── */
function boom(x: number, y: number, n: number, color: string): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 1 + Math.random() * 3;
    const life = 15 + Math.floor(Math.random() * 20);
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, color };
  });
}

function loadHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(HS_KEY);
    return raw ? JSON.parse(raw) as HighScore[] : [];
  } catch { return []; }
}

function saveHighScores(scores: HighScore[]): void {
  try { localStorage.setItem(HS_KEY, JSON.stringify(scores.slice(0, HS_MAX))); }
  catch { /* */ }
}

function qualifiesForHighScore(score: number, scores: HighScore[]): boolean {
  if (score <= 0) return false;
  if (scores.length < HS_MAX) return true;
  return score > scores[scores.length - 1].score;
}

/* ── Touch buttons ── */
interface TBtn { id: string; x: number; y: number; r: number; label: string }

function calcButtons(w: number, h: number, g: Game): TBtn[] {
  const r = Math.max(28, Math.min(38, Math.min(w, h) * 0.065));
  const btns: TBtn[] = [];
  btns.push({ id: 'close', x: 28, y: 28, r: 18, label: '\u2715' });
  btns.push({ id: 'mute', x: w - 28, y: 28, r: 18, label: '\u266B' });

  if (g.over && g.overTimer >= 40) {
    if (g.enteringInitials) {
      const cy = h * 0.68;
      const sp = r * 2.5;
      btns.push({ id: 'left', x: w / 2 - sp * 2, y: cy, r, label: '\u25C0' });
      btns.push({ id: 'up', x: w / 2 - sp, y: cy, r, label: '\u25B2' });
      btns.push({ id: 'confirm', x: w / 2, y: cy, r: r * 1.15, label: '\u2713' });
      btns.push({ id: 'down', x: w / 2 + sp, y: cy, r, label: '\u25BC' });
      btns.push({ id: 'right', x: w / 2 + sp * 2, y: cy, r, label: '\u25B6' });
    } else {
      btns.push({ id: 'restart', x: w / 2, y: h * 0.82, r: r * 1.4, label: '\u25B6' });
    }
  }
  return btns;
}

function drawBtn(ctx: CanvasRenderingContext2D, b: TBtn, active: boolean, sfxMuted: boolean) {
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = active ? 'rgba(255,89,16,0.25)' : 'rgba(20,18,19,0.55)';
  ctx.fill();
  ctx.strokeStyle = active ? 'rgba(255,89,16,0.9)' : 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = active ? '#FF5910' : 'rgba(255,255,255,0.65)';
  ctx.font = `bold ${Math.round(b.r * 0.65)}px monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(b.label, b.x, b.y + 1);
  if (b.id === 'mute' && sfxMuted) {
    ctx.strokeStyle = '#FF5910'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b.x - b.r * 0.55, b.y - b.r * 0.55);
    ctx.lineTo(b.x + b.r * 0.55, b.y + b.r * 0.55);
    ctx.stroke();
  }
  ctx.restore();
}

/* ── Rounded rect helper ── */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
export function PongGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);
  const sfxRef = useRef<SFX | null>(null);
  const mouseY = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const touchActive = useRef<Record<string, boolean>>({});
  const prevTouch = useRef<Record<string, boolean>>({});
  const showTouch = useRef(false);
  const btnsRef = useRef<TBtn[]>([]);
  const bossActive = useRef(false);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((w: number, h: number): Game => ({
    playerY: h / 2,
    aiY: h / 2,
    paddleH: PADDLE_H,
    ballX: w / 2,
    ballY: h / 2,
    ballVX: 0,
    ballVY: 0,
    ballSpeed: BASE_BALL_SPEED,
    ballTrail: [],
    playerScore: 0,
    aiScore: 0,
    totalScore: 0,
    level: 1,
    aiSpeed: 3,
    aiReaction: 0.4,
    rally: 0,
    sparks: [],
    serving: true,
    serveTimer: 60,
    serveDir: 1,
    over: false,
    overTimer: 0,
    shake: 0,
    frame: 0,
    enteringInitials: false,
    initialsChars: [0, 0, 0],
    initialsPos: 0,
    highScores: [],
    scoreSubmitted: false,
    scoreIndex: -1,
  }), []);

  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sfx = new SFX();
    sfxRef.current = sfx;

    game.current = init(el.width, el.height);

    /* ── Mouse handlers ── */
    const onMouseMove = (e: MouseEvent) => { mouseY.current = e.clientY; };
    el.addEventListener('mousemove', onMouseMove);

    /* ── Touch helpers ── */
    function updateTouchState(e: TouchEvent) {
      const state: Record<string, boolean> = {};
      const btns = btnsRef.current;
      for (let t = 0; t < e.touches.length; t++) {
        const tx = e.touches[t].clientX;
        const ty = e.touches[t].clientY;
        for (const btn of btns) {
          if (Math.hypot(tx - btn.x, ty - btn.y) < btn.r * 1.5) {
            state[btn.id] = true;
          }
        }
      }
      touchActive.current = state;
    }

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      updateTouchState(e);
      if (e.touches.length > 0) touchY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      updateTouchState(e);
      if (e.touches.length > 0) touchY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      updateTouchState(e);
      if (e.touches.length === 0) touchY.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    /* ── Keyboard handlers ── */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) e.preventDefault();

      const g = game.current;
      if (!g) return;

      /* Game over input */
      if (g.over) {
        if (g.overTimer < 40) return;

        if (g.enteringInitials) {
          const key = e.key;
          if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
            g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
            g.initialsPos = Math.max(0, g.initialsPos - 1);
          } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
            g.initialsPos = Math.min(2, g.initialsPos + 1);
          } else if (key === 'Enter') {
            const initials = g.initialsChars.map(i => ABC[i]).join('');
            const entry: HighScore = { initials, score: g.totalScore };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) {
              bossActive.current = true;
              setBossData({ game: 'pong', score: g.totalScore, initials });
            }
          } else if (/^[a-zA-Z]$/.test(key)) {
            g.initialsChars[g.initialsPos] = key.toUpperCase().charCodeAt(0) - 65;
            if (g.initialsPos < 2) g.initialsPos++;
          }
          return;
        }

        if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
        if (e.key === 'Enter') {
          keys.current.clear();
          game.current = init(el.width, el.height);
          setIsOver(false);
        }
        return;
      }

      if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let wasOver = false;

    /* ═══════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════ */
    const loop = () => {
      const g = game.current;
      if (!g) return;
      const w = el.width;
      const h = el.height;
      const k = keys.current;
      const ta = touchActive.current;
      g.frame++;

      const justTouched = (id: string): boolean => !!ta[id] && !prevTouch.current[id];

      if (showTouch.current) {
        btnsRef.current = calcButtons(w, h, g);
      }

      /* ── Game-over touch input ── */
      if (g.over && g.overTimer >= 40 && showTouch.current) {
        if (g.enteringInitials) {
          if (justTouched('up')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          if (justTouched('down')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          if (justTouched('left')) g.initialsPos = Math.max(0, g.initialsPos - 1);
          if (justTouched('right')) g.initialsPos = Math.min(2, g.initialsPos + 1);
          if (justTouched('confirm')) {
            const initials = g.initialsChars.map(i => ABC[i]).join('');
            const entry: HighScore = { initials, score: g.totalScore };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) {
              bossActive.current = true;
              setBossData({ game: 'pong', score: g.totalScore, initials });
            }
          }
        } else if (justTouched('restart')) {
          game.current = init(el.width, el.height);
          setIsOver(false);
          prevTouch.current = { ...ta };
          raf.current = requestAnimationFrame(loop);
          return;
        }
      }

      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      /* ═══ GAME LOGIC ═══ */
      if (!g.over) {
        /* ── Move player paddle ── */
        const trackY = touchY.current ?? mouseY.current;
        if (trackY !== null) {
          g.playerY = Math.max(g.paddleH / 2, Math.min(h - g.paddleH / 2, trackY));
        }
        if (k.has('arrowup') || k.has('w')) {
          g.playerY = Math.max(g.paddleH / 2, g.playerY - 8);
        }
        if (k.has('arrowdown') || k.has('s')) {
          g.playerY = Math.min(h - g.paddleH / 2, g.playerY + 8);
        }

        /* ── AI paddle ── */
        if (g.ballVX > 0) {
          // Ball moving toward AI — track ball
          const targetY = g.ballY;
          const dist = Math.abs(targetY - g.aiY);
          if (dist > 1) {
            const factor = (1 - g.aiReaction) * Math.min(1, g.aiSpeed / dist);
            const move = (targetY - g.aiY) * factor;
            const clamped = Math.sign(move) * Math.min(Math.abs(move), g.aiSpeed);
            g.aiY += clamped;
          }
        } else {
          // Ball moving away — drift toward center
          const centerY = h / 2;
          const dist = Math.abs(centerY - g.aiY);
          if (dist > 2) {
            const move = Math.sign(centerY - g.aiY) * Math.min(2, dist * 0.03);
            g.aiY += move;
          }
        }
        g.aiY = Math.max(g.paddleH / 2, Math.min(h - g.paddleH / 2, g.aiY));

        /* ── Serve countdown ── */
        if (g.serving) {
          g.serveTimer--;
          g.ballX = w / 2;
          g.ballY = h / 2;
          g.ballVX = 0;
          g.ballVY = 0;
          if (g.serveTimer <= 0) {
            g.serving = false;
            const angle = (Math.random() - 0.5) * (Math.PI / 3); // max ±30deg from horizontal
            g.ballVX = Math.cos(angle) * g.ballSpeed * g.serveDir;
            g.ballVY = Math.sin(angle) * g.ballSpeed;
            g.rally = 0;
          }
        } else {
          /* ── Update ball trail ── */
          g.ballTrail.push({ x: g.ballX, y: g.ballY });
          if (g.ballTrail.length > 5) g.ballTrail.shift();

          /* ── Move ball ── */
          g.ballX += g.ballVX;
          g.ballY += g.ballVY;

          /* ── Top/bottom wall collisions ── */
          if (g.ballY - BALL_SIZE / 2 <= 0) {
            g.ballY = BALL_SIZE / 2;
            g.ballVY = Math.abs(g.ballVY);
            sfx.wallBounce();
          }
          if (g.ballY + BALL_SIZE / 2 >= h) {
            g.ballY = h - BALL_SIZE / 2;
            g.ballVY = -Math.abs(g.ballVY);
            sfx.wallBounce();
          }

          /* ── Player paddle collision (left side) ── */
          const playerPaddleX = PADDLE_MARGIN;
          const playerTop = g.playerY - g.paddleH / 2;
          const playerBottom = g.playerY + g.paddleH / 2;

          if (
            g.ballVX < 0 &&
            g.ballX - BALL_SIZE / 2 <= playerPaddleX + PADDLE_W &&
            g.ballX - BALL_SIZE / 2 >= playerPaddleX - g.ballSpeed &&
            g.ballY >= playerTop &&
            g.ballY <= playerBottom
          ) {
            const hitPos = (g.ballY - g.playerY) / (g.paddleH / 2); // -1 to 1
            const angle = hitPos * (Math.PI / 3); // max ±60deg
            g.ballVX = Math.cos(angle) * g.ballSpeed;
            g.ballVY = Math.sin(angle) * g.ballSpeed;
            g.ballX = playerPaddleX + PADDLE_W + BALL_SIZE / 2;
            g.rally++;
            sfx.paddleHit();
          }

          /* ── AI paddle collision (right side) ── */
          const aiPaddleX = w - PADDLE_MARGIN - PADDLE_W;
          const aiTop = g.aiY - g.paddleH / 2;
          const aiBottom = g.aiY + g.paddleH / 2;

          if (
            g.ballVX > 0 &&
            g.ballX + BALL_SIZE / 2 >= aiPaddleX &&
            g.ballX + BALL_SIZE / 2 <= aiPaddleX + PADDLE_W + g.ballSpeed &&
            g.ballY >= aiTop &&
            g.ballY <= aiBottom
          ) {
            const hitPos = (g.ballY - g.aiY) / (g.paddleH / 2); // -1 to 1
            const angle = Math.PI - hitPos * (Math.PI / 3); // reflect back left with angle
            g.ballVX = Math.cos(angle) * g.ballSpeed;
            g.ballVY = Math.sin(angle) * g.ballSpeed;
            g.ballX = aiPaddleX - BALL_SIZE / 2;
            g.rally++;
            sfx.paddleHit();
          }

          /* ── Ball passes right edge → player scores ── */
          if (g.ballX + BALL_SIZE / 2 > w + 20) {
            g.playerScore++;
            g.totalScore += g.rally * 5 + 10;
            g.sparks.push(...boom(w, g.ballY, 15, C.player));
            g.shake = 8;
            sfx.score();
            g.ballTrail = [];

            if (g.playerScore >= WIN_SCORE) {
              // Player wins the set
              g.totalScore += 100 * g.level;
              g.level++;
              g.paddleH = Math.max(MIN_PADDLE_H, PADDLE_H - PADDLE_SHRINK * (g.level - 1));
              g.ballSpeed = BASE_BALL_SPEED + SPEED_INC * (g.level - 1);
              g.aiSpeed = 3 + 0.5 * (g.level - 1);
              g.aiReaction = Math.max(0.05, 0.4 - 0.04 * (g.level - 1));
              g.playerScore = 0;
              g.aiScore = 0;
              sfx.levelUp();
            }

            g.serving = true;
            g.serveTimer = 60;
            g.serveDir = -1; // serve toward player (scored on AI)
            g.rally = 0;
          }

          /* ── Ball passes left edge → AI scores ── */
          if (g.ballX - BALL_SIZE / 2 < -20) {
            g.aiScore++;
            g.sparks.push(...boom(0, g.ballY, 15, C.ai));
            g.shake = 8;
            sfx.aiScore();
            g.ballTrail = [];

            if (g.aiScore >= WIN_SCORE) {
              // AI wins → game over
              g.over = true;
              setIsOver(true);
              const hs = loadHighScores();
              g.highScores = hs;
              g.enteringInitials = qualifiesForHighScore(g.totalScore, hs);
            } else {
              g.serving = true;
              g.serveTimer = 60;
              g.serveDir = 1; // serve toward AI (scored on player)
              g.rally = 0;
            }
          }
        }
      }

      /* ── Sparks ── */
      g.sparks = g.sparks.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97;
        return --p.life > 0;
      });

      /* ── Sound management ── */
      if (g.over && !wasOver) { sfx.gameOver(); wasOver = true; }
      if (!g.over) wasOver = false;

      /* ── Shake decay ── */
      if (g.shake > 0) {
        g.shake *= 0.85;
        if (g.shake < 0.5) g.shake = 0;
      }

      if (g.over) g.overTimer++;

      /* ═══════════════════════════════════
         RENDER
         ═══════════════════════════════════ */
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);

      /* ── Background ── */
      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* ── CRT scanline effect ── */
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      /* ── Center dashed line ── */
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      const segH = 15;
      const gapH = 10;
      for (let y = 0; y < h; y += segH + gapH) {
        ctx.beginPath();
        ctx.moveTo(w / 2, y);
        ctx.lineTo(w / 2, Math.min(y + segH, h));
        ctx.stroke();
      }

      /* ── Sparks ── */
      for (const p of g.sparks) {
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Player paddle (left) ── */
      {
        const px = PADDLE_MARGIN;
        const py = g.playerY - g.paddleH / 2;
        ctx.save();
        ctx.fillStyle = C.player;
        ctx.shadowColor = C.player;
        ctx.shadowBlur = 12;
        drawRoundedRect(ctx, px, py, PADDLE_W, g.paddleH, 4);
        ctx.fill();
        ctx.restore();
      }

      /* ── AI paddle (right) ── */
      {
        const ax = w - PADDLE_MARGIN - PADDLE_W;
        const ay = g.aiY - g.paddleH / 2;
        ctx.save();
        ctx.fillStyle = C.ai;
        ctx.shadowColor = C.ai;
        ctx.shadowBlur = 12;
        drawRoundedRect(ctx, ax, ay, PADDLE_W, g.paddleH, 4);
        ctx.fill();
        ctx.restore();
      }

      /* ── Ball trail ── */
      const trailAlphas = [0.05, 0.1, 0.2, 0.3, 0.4];
      for (let i = 0; i < g.ballTrail.length; i++) {
        const t = g.ballTrail[i];
        const alpha = trailAlphas[Math.max(0, i - (g.ballTrail.length - 5))] ?? 0.05;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = C.ball;
        ctx.shadowColor = C.ball;
        ctx.shadowBlur = 6;
        ctx.fillRect(t.x - BALL_SIZE / 2, t.y - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
        ctx.restore();
      }

      /* ── Ball ── */
      if (!g.serving || g.serveTimer < 60) {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = C.ball;
        ctx.shadowBlur = 10;
        ctx.fillRect(g.ballX - BALL_SIZE / 2, g.ballY - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
        ctx.restore();
      }

      /* ── Score display ── */
      ctx.save();
      ctx.font = 'bold 64px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Player score (left)
      ctx.fillStyle = C.player;
      ctx.globalAlpha = 0.7;
      ctx.fillText(String(g.playerScore), w * 0.35, 30);
      // AI score (right)
      ctx.fillStyle = C.ai;
      ctx.fillText(String(g.aiScore), w * 0.65, 30);
      ctx.globalAlpha = 1;
      ctx.restore();

      /* ── Set/Level display ── */
      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`SET ${g.level}`, w / 2, 20);

      /* ── Total score (small) ── */
      ctx.fillStyle = C.score; ctx.font = '12px monospace'; ctx.textAlign = 'center';
      ctx.globalAlpha = 0.6;
      ctx.fillText(`TOTAL: ${g.totalScore}`, w / 2, 38);
      ctx.globalAlpha = 1;

      /* ── Rally display ── */
      if (!g.over && !g.serving && g.rally > 3) {
        ctx.fillStyle = C.score;
        ctx.globalAlpha = 0.5 + 0.2 * Math.sin(g.frame * 0.1);
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`RALLY x${g.rally}`, w / 2, h / 2 + 50);
        ctx.globalAlpha = 1;
      }

      /* ── Serve countdown ── */
      if (g.serving && !g.over) {
        const seconds = Math.ceil(g.serveTimer / 20);
        const countdownText = seconds > 0 ? String(seconds) : '';
        if (countdownText) {
          ctx.fillStyle = C.ui;
          ctx.globalAlpha = 0.6 + 0.3 * Math.sin(g.frame * 0.15);
          ctx.font = 'bold 72px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(countdownText, w / 2, h / 2);
          ctx.globalAlpha = 1;
        }
      }

      /* Controls hint */
      if (!showTouch.current && !g.over) {
        ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('MOUSE / \u2191\u2193 / W S \u00B7 M MUTE \u00B7 ESC EXIT', w / 2, h - 20);
        ctx.globalAlpha = 1;
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.player; ctx.font = 'bold 48px monospace';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 120);

        ctx.fillStyle = C.score; ctx.font = '24px monospace';
        ctx.fillText(`SET ${g.level} \u00B7 TOTAL: ${g.totalScore}`, w / 2, h / 2 - 80);

        if (g.overTimer >= 40) {
          if (g.enteringInitials) {
            ctx.fillStyle = C.score; ctx.font = 'bold 22px monospace';
            ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, h / 2 - 40);

            ctx.fillStyle = C.ui; ctx.font = '13px monospace';
            ctx.fillText(
              showTouch.current
                ? 'USE BUTTONS BELOW TO ENTER INITIALS'
                : 'TYPE INITIALS  \u00B7  \u2190\u2192 MOVE  \u00B7  ENTER TO CONFIRM',
              w / 2, h / 2 - 10,
            );

            ctx.font = 'bold 40px monospace';
            const blink = Math.floor(g.frame / 18) % 2 === 0;
            for (let i = 0; i < 3; i++) {
              const cx = w / 2 + (i - 1) * 55;
              const cy = h / 2 + 40;
              const char = ABC[g.initialsChars[i]];
              if (i === g.initialsPos) {
                ctx.fillStyle = C.score;
                if (blink) ctx.fillRect(cx - 16, cy + 8, 32, 4);
              } else {
                ctx.fillStyle = C.ui;
              }
              ctx.fillText(char, cx, cy);
            }
          } else {
            const scores = g.highScores;
            if (scores.length > 0) {
              ctx.fillStyle = C.score; ctx.font = 'bold 20px monospace';
              ctx.fillText('\u2550\u2550\u2550 HIGH SCORES \u2550\u2550\u2550', w / 2, h / 2 - 40);

              ctx.font = '17px monospace';
              const startY = h / 2 - 10;
              for (let i = 0; i < Math.min(scores.length, HS_MAX); i++) {
                const hs = scores[i];
                const y = startY + i * 26;
                const isPlayer = g.scoreSubmitted && i === g.scoreIndex;
                ctx.fillStyle = isPlayer ? C.score : C.ui;
                ctx.textAlign = 'right';
                ctx.fillText(`${i + 1}.`, w / 2 - 85, y);
                ctx.textAlign = 'left';
                ctx.fillText(hs.initials, w / 2 - 65, y);
                ctx.textAlign = 'right';
                ctx.fillText(String(hs.score).padStart(6, '0'), w / 2 + 110, y);
              }
              if (!showTouch.current) {
                const bottomY = startY + Math.min(scores.length, HS_MAX) * 26 + 25;
                ctx.fillStyle = C.ui; ctx.font = '16px monospace'; ctx.textAlign = 'center';
                ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, bottomY);
              }
            } else if (!showTouch.current) {
              ctx.fillStyle = C.ui; ctx.font = '16px monospace'; ctx.textAlign = 'center';
              ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, h / 2 + 20);
            }
          }
        }
      }

      /* ── Touch buttons ── */
      if (showTouch.current) {
        const btns = btnsRef.current;
        for (const b of btns) {
          drawBtn(ctx, b, !!ta[b.id], sfx.muted);
        }
      }

      ctx.restore();
      prevTouch.current = { ...ta };
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      sfx.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      document.body.style.overflow = prevOverflow;
    };
  }, [init, onClose]);

  return (
    <>
      {createPortal(
        <div data-pong-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-pong-game], [data-pong-game] * { cursor: default !important; }`}</style>}
          <canvas ref={cvs} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
        </div>,
        document.body,
      )}
      {bossData && (
        <ArcadeBossOverlay
          game={bossData.game}
          score={bossData.score}
          initials={bossData.initials}
          onClose={() => { bossActive.current = false; setBossData(null); }}
        />
      )}
    </>
  );
}
