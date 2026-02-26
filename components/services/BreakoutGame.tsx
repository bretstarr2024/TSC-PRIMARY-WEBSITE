'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  paddle: '#FF5910',
  ball: '#FF5910',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
  fx: ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2'],
  rows: ['#ED0AD2', '#FF5910', '#E1FF00', '#73F5FF', '#088BA0', '#d1d1c6'],
  rowPoints: [60, 50, 40, 30, 20, 10],
};

/* ── Tuning knobs ── */
const PADDLE_H = 14;
const PADDLE_SPEED = 8;
const PADDLE_BOTTOM = 50;
const BALL_R = 8;
const BASE_SPEED = 4.5;
const SPEED_INC = 0.4;
const DEPTH_SPEED_BONUS = 0.6;
const BRICK_ROWS = 6;
const BRICK_H = 22;
const BRICK_GAP = 3;
const BRICK_TOP = 80;
const START_PADDLE_W = 150;
const MIN_PADDLE_W = 60;
const PADDLE_SHRINK = 6;

/* High scores */
const HS_KEY = 'tsc-breakout-scores';
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

  paddleBounce() {
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

  brickBreak(row: number) {
    const c = this.ensure();
    if (!c || this._muted) return;
    const baseFreq = 800 + (BRICK_ROWS - row) * 100;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(baseFreq, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.12);
  }

  launch() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(200, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.15);
  }

  loseLife() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const dur = 0.4;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(400, c.currentTime);
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
interface Brick {
  x: number; y: number;
  w: number; h: number;
  color: string;
  points: number;
  row: number;
  alive: boolean;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  color: string;
}

interface HighScore { initials: string; score: number }

interface Game {
  paddleX: number;
  paddleW: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  launched: boolean;
  bricks: Brick[];
  sparks: Spark[];
  score: number;
  lives: number;
  level: number;
  speed: number;
  over: boolean;
  overTimer: number;
  shake: number;
  frame: number;
  levelFlash: number;
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
  deepestRowHit: number;
}

/* ── Helpers ── */
function makeBricks(w: number, level: number): Brick[] {
  const bricks: Brick[] = [];
  const rows = Math.min(BRICK_ROWS + Math.floor((level - 1) / 2), 10);
  const margin = 20;
  const usableW = w - margin * 2;
  const cols = Math.max(5, Math.floor((usableW + BRICK_GAP) / (60 + BRICK_GAP)));
  const brickW = (usableW - (cols - 1) * BRICK_GAP) / cols;

  for (let r = 0; r < rows; r++) {
    const colorIdx = r % C.rows.length;
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: margin + col * (brickW + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        w: brickW,
        h: BRICK_H,
        color: C.rows[colorIdx],
        points: C.rowPoints[colorIdx],
        row: r,
        alive: true,
      });
    }
  }
  return bricks;
}

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

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
export function BreakoutGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);
  const sfxRef = useRef<SFX | null>(null);
  const mouseX = useRef<number | null>(null);
  const touchX = useRef<number | null>(null);
  const touchActive = useRef<Record<string, boolean>>({});
  const prevTouch = useRef<Record<string, boolean>>({});
  const showTouch = useRef(false);
  const btnsRef = useRef<TBtn[]>([]);
  const bossActive = useRef(false);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((w: number, h: number): Game => ({
    paddleX: w / 2,
    paddleW: START_PADDLE_W,
    ballX: w / 2,
    ballY: h - PADDLE_BOTTOM - BALL_R - PADDLE_H / 2,
    ballVX: 0,
    ballVY: 0,
    launched: false,
    bricks: makeBricks(w, 1),
    sparks: [],
    score: 0,
    lives: 3,
    level: 1,
    speed: BASE_SPEED,
    over: false,
    overTimer: 0,
    shake: 0,
    frame: 0,
    levelFlash: 0,
    enteringInitials: false,
    initialsChars: [0, 0, 0],
    initialsPos: 0,
    highScores: [],
    scoreSubmitted: false,
    scoreIndex: -1,
    deepestRowHit: BRICK_ROWS,
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

    /* ── Launch helper ── */
    const tryLaunch = () => {
      const g = game.current;
      if (!g || g.launched || g.over || g.levelFlash > 0) return;
      g.launched = true;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      g.ballVX = Math.cos(angle) * g.speed;
      g.ballVY = Math.sin(angle) * g.speed;
      sfx.launch();
    };

    /* ── Mouse handlers ── */
    const onMouseMove = (e: MouseEvent) => { mouseX.current = e.clientX; };
    const onMouseClick = () => { tryLaunch(); };
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('click', onMouseClick);

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
      if (e.touches.length > 0) touchX.current = e.touches[0].clientX;
      tryLaunch();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      updateTouchState(e);
      if (e.touches.length > 0) touchX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      updateTouchState(e);
      if (e.touches.length === 0) touchX.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    /* ── Keyboard handlers ── */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

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
            const entry: HighScore = { initials, score: g.score };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) {
              bossActive.current = true;
              setBossData({ game: 'breakout', score: g.score, initials });
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
      if (e.key === ' ') tryLaunch();
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
      const paddleY = h - PADDLE_BOTTOM;
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
            const entry: HighScore = { initials, score: g.score };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) {
              bossActive.current = true;
              setBossData({ game: 'breakout', score: g.score, initials });
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
      if (!g.over && g.levelFlash <= 0) {
        /* ── Move paddle ── */
        const trackX = touchX.current ?? mouseX.current;
        if (trackX !== null) {
          g.paddleX = Math.max(g.paddleW / 2, Math.min(w - g.paddleW / 2, trackX));
        }
        if (k.has('arrowleft') || k.has('a')) {
          g.paddleX = Math.max(g.paddleW / 2, g.paddleX - PADDLE_SPEED);
        }
        if (k.has('arrowright') || k.has('d')) {
          g.paddleX = Math.min(w - g.paddleW / 2, g.paddleX + PADDLE_SPEED);
        }

        /* ── Ball on paddle (not launched) ── */
        if (!g.launched) {
          g.ballX = g.paddleX;
          g.ballY = paddleY - BALL_R - PADDLE_H / 2;
        } else {
          /* ── Move ball ── */
          g.ballX += g.ballVX;
          g.ballY += g.ballVY;
          /* ── Wall collisions ── */
          if (g.ballX - BALL_R <= 0) {
            g.ballX = BALL_R;
            g.ballVX = Math.abs(g.ballVX);
            sfx.wallBounce();
          }
          if (g.ballX + BALL_R >= w) {
            g.ballX = w - BALL_R;
            g.ballVX = -Math.abs(g.ballVX);
            sfx.wallBounce();
          }
          if (g.ballY - BALL_R <= 0) {
            g.ballY = BALL_R;
            g.ballVY = Math.abs(g.ballVY);
            sfx.wallBounce();
          }

          /* ── Paddle collision ── */
          const pLeft = g.paddleX - g.paddleW / 2;
          const pRight = g.paddleX + g.paddleW / 2;
          const pTop = paddleY - PADDLE_H / 2;

          if (
            g.ballVY > 0 &&
            g.ballY + BALL_R >= pTop &&
            g.ballY + BALL_R <= pTop + PADDLE_H + g.speed &&
            g.ballX >= pLeft - BALL_R &&
            g.ballX <= pRight + BALL_R
          ) {
            const hitPos = Math.max(-1, Math.min(1, (g.ballX - g.paddleX) / (g.paddleW / 2)));
            const angle = hitPos * (Math.PI / 3) - Math.PI / 2;
            g.ballVX = Math.cos(angle) * g.speed;
            g.ballVY = Math.sin(angle) * g.speed;
            g.ballY = pTop - BALL_R;
            sfx.paddleBounce();
          }

          /* ── Ball falls below paddle → lose life ── */
          if (g.ballY - BALL_R > h) {
            g.lives--;
            g.shake = 10;
            sfx.loseLife();
            if (g.lives <= 0) {
              g.over = true;
              setIsOver(true);
              const hs = loadHighScores();
              g.highScores = hs;
              g.enteringInitials = qualifiesForHighScore(g.score, hs);
            } else {
              g.launched = false;
              g.ballX = g.paddleX;
              g.ballY = paddleY - BALL_R - PADDLE_H / 2;
              g.ballVX = 0;
              g.ballVY = 0;
            }
          }

          /* ── Brick collisions ── */
          for (const brick of g.bricks) {
            if (!brick.alive) continue;
            const closestX = Math.max(brick.x, Math.min(g.ballX, brick.x + brick.w));
            const closestY = Math.max(brick.y, Math.min(g.ballY, brick.y + brick.h));
            const dx = g.ballX - closestX;
            const dy = g.ballY - closestY;

            if (dx * dx + dy * dy < BALL_R * BALL_R) {
              brick.alive = false;
              g.score += brick.points;
              g.sparks.push(...boom(brick.x + brick.w / 2, brick.y + brick.h / 2, 8, brick.color));
              sfx.brickBreak(brick.row);

              /* Speed up when hitting deeper rows */
              if (brick.row < g.deepestRowHit) {
                g.deepestRowHit = brick.row;
                const depthBonus = (BRICK_ROWS - brick.row) * DEPTH_SPEED_BONUS;
                const newSpeed = BASE_SPEED + SPEED_INC * (g.level - 1) + depthBonus;
                const currentSpeed = Math.hypot(g.ballVX, g.ballVY);
                if (currentSpeed > 0) {
                  const scale = newSpeed / currentSpeed;
                  g.ballVX *= scale;
                  g.ballVY *= scale;
                }
                g.speed = newSpeed;
              }

              if (Math.abs(dx) > Math.abs(dy)) {
                g.ballVX = -g.ballVX;
              } else {
                g.ballVY = -g.ballVY;
              }
              break;
            }
          }

          /* ── All bricks cleared → next level ── */
          if (g.bricks.every(b => !b.alive)) {
            g.level++;
            g.levelFlash = 90;
            sfx.levelUp();
          }
        }
      }

      /* ── Level transition ── */
      if (g.levelFlash > 0) {
        g.levelFlash--;
        if (g.levelFlash <= 0) {
          g.paddleW = Math.max(MIN_PADDLE_W, START_PADDLE_W - PADDLE_SHRINK * (g.level - 1));
          g.speed = BASE_SPEED + SPEED_INC * (g.level - 1);
          g.deepestRowHit = BRICK_ROWS;
          g.bricks = makeBricks(w, g.level);
          g.launched = false;
          g.ballX = g.paddleX;
          g.ballY = paddleY - BALL_R - PADDLE_H / 2;
          g.ballVX = 0;
          g.ballVY = 0;
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

      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* ── Bricks ── */
      for (const brick of g.bricks) {
        if (!brick.alive) continue;
        ctx.save();
        ctx.fillStyle = brick.color;
        ctx.globalAlpha = 0.85;

        /* Rounded rect */
        const br = 3;
        ctx.beginPath();
        ctx.moveTo(brick.x + br, brick.y);
        ctx.lineTo(brick.x + brick.w - br, brick.y);
        ctx.quadraticCurveTo(brick.x + brick.w, brick.y, brick.x + brick.w, brick.y + br);
        ctx.lineTo(brick.x + brick.w, brick.y + brick.h - br);
        ctx.quadraticCurveTo(brick.x + brick.w, brick.y + brick.h, brick.x + brick.w - br, brick.y + brick.h);
        ctx.lineTo(brick.x + br, brick.y + brick.h);
        ctx.quadraticCurveTo(brick.x, brick.y + brick.h, brick.x, brick.y + brick.h - br);
        ctx.lineTo(brick.x, brick.y + br);
        ctx.quadraticCurveTo(brick.x, brick.y, brick.x + br, brick.y);
        ctx.closePath();

        if (brick.row < 3) {
          ctx.shadowColor = brick.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      }

      /* ── Sparks ── */
      for (const p of g.sparks) {
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Paddle ── */
      {
        const pL = g.paddleX - g.paddleW / 2;
        const pT = paddleY - PADDLE_H / 2;
        const grad = ctx.createLinearGradient(pL, 0, pL + g.paddleW, 0);
        grad.addColorStop(0, '#FF5910');
        grad.addColorStop(0.5, '#ED0AD2');
        grad.addColorStop(1, '#FF5910');
        ctx.save();
        ctx.fillStyle = grad;
        ctx.shadowColor = '#ED0AD2';
        ctx.shadowBlur = 12;
        const pr = PADDLE_H / 2;
        ctx.beginPath();
        ctx.moveTo(pL + pr, pT);
        ctx.lineTo(pL + g.paddleW - pr, pT);
        ctx.quadraticCurveTo(pL + g.paddleW, pT, pL + g.paddleW, pT + pr);
        ctx.lineTo(pL + g.paddleW, pT + PADDLE_H - pr);
        ctx.quadraticCurveTo(pL + g.paddleW, pT + PADDLE_H, pL + g.paddleW - pr, pT + PADDLE_H);
        ctx.lineTo(pL + pr, pT + PADDLE_H);
        ctx.quadraticCurveTo(pL, pT + PADDLE_H, pL, pT + PADDLE_H - pr);
        ctx.lineTo(pL, pT + pr);
        ctx.quadraticCurveTo(pL, pT, pL + pr, pT);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      /* ── Ball ── */
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = C.ball;
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* ── HUD ── */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);

      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${g.level}`, w / 2, 30);

      /* Lives as dots */
      for (let i = 0; i < g.lives; i++) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(28 + i * 22, 60, 5, 0, Math.PI * 2); ctx.fill();
      }

      /* ── Launch prompt ── */
      if (!g.launched && !g.over && g.levelFlash <= 0) {
        ctx.fillStyle = C.ui;
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(g.frame * 0.06);
        ctx.font = '16px monospace'; ctx.textAlign = 'center';
        ctx.fillText(
          showTouch.current ? 'TAP TO LAUNCH' : 'SPACE OR CLICK TO LAUNCH',
          w / 2, paddleY - 60,
        );
        ctx.globalAlpha = 1;
      }

      /* ── Level flash ── */
      if (g.levelFlash > 0) {
        const alpha = Math.min(1, g.levelFlash / 30);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = C.score; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
        ctx.globalAlpha = alpha;
        ctx.fillText(`LEVEL ${g.level}`, w / 2, h / 2);
        ctx.globalAlpha = 1;
      }

      /* Controls hint */
      if (!showTouch.current && !g.over) {
        ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('MOUSE / ARROWS \u00B7 SPACE TO LAUNCH \u00B7 M MUTE \u00B7 ESC EXIT', w / 2, h - 20);
        ctx.globalAlpha = 1;
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.paddle; ctx.font = 'bold 48px monospace';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 120);

        ctx.fillStyle = C.score; ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, h / 2 - 80);

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
      el.removeEventListener('click', onMouseClick);
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
        <div data-breakout-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-breakout-game], [data-breakout-game] * { cursor: default !important; }`}</style>}
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
