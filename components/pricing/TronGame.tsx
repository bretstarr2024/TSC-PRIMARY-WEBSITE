'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  player: '#FF5910',
  enemy: '#73F5FF',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
  grid: 'rgba(115, 245, 255, 0.06)',
  gridBright: 'rgba(115, 245, 255, 0.12)',
  fx: ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2'],
  enemies: ['#73F5FF', '#ED0AD2', '#E1FF00', '#088BA0'],
};

/* ── Tuning knobs ── */
const CELL = 4;
const BASE_SPEED = 4;
const SPEED_INC = 0.5;
const TICK_MS = 50;
const ENEMY_TURN_CHANCE = 0.12;
const COUNTDOWN_TICKS = 60;

/* High scores */
const HS_KEY = 'tsc-tron-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ══════════════════════════════════════════════════════
   Sound Engine — Web Audio API retro synth sounds
   ══════════════════════════════════════════════════════ */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private engineNodes: { osc: OscillatorNode; gain: GainNode } | null = null;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
      catch { return null; }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get muted() { return this._muted; }
  toggle(): boolean {
    this._muted = !this._muted;
    if (this._muted) this.stopEngine();
    return this._muted;
  }

  turn() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(220, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.05);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.05);
  }

  crash() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const dur = 0.5;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0.25, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(600, c.currentTime);
    f.frequency.exponentialRampToValueAtTime(100, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(); src.stop(c.currentTime + dur);
  }

  enemyCrash() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(600, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.2);
  }

  startEngine() {
    const c = this.ensure();
    if (!c || this._muted || this.engineNodes) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, c.currentTime);
    gain.gain.setValueAtTime(0.04, c.currentTime);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(150, c.currentTime);
    osc.connect(f).connect(gain).connect(c.destination);
    osc.start();
    this.engineNodes = { osc, gain };
  }

  stopEngine() {
    if (this.engineNodes) {
      try { this.engineNodes.osc.stop(); } catch { /* */ }
      this.engineNodes = null;
    }
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

  countdown() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, c.currentTime);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.1);
  }

  dispose() {
    this.stopEngine();
    try { this.ctx?.close(); } catch { /* */ }
    this.ctx = null;
  }
}

/* ── Types ── */
type Dir = 'up' | 'down' | 'left' | 'right';

interface Pt { x: number; y: number }

interface Cycle {
  x: number;
  y: number;
  dir: Dir;
  trail: Pt[];
  alive: boolean;
  color: string;
  glowColor: string;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  color: string;
}

interface HighScore { initials: string; score: number }

interface Game {
  player: Cycle;
  enemies: Cycle[];
  gridW: number;
  gridH: number;
  score: number;
  level: number;
  speed: number;
  tick: number;
  tickAccum: number;
  sparks: Spark[];
  over: boolean;
  overTimer: number;
  shake: number;
  frame: number;
  countdown: number;
  levelFlash: number;
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
  pendingDir: Dir | null;
}

/* ── Helpers ── */
const opposite: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const dirVec: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const dirs: Dir[] = ['up', 'down', 'left', 'right'];

function boom(x: number, y: number, n: number, color: string): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 1 + Math.random() * 4;
    const life = 15 + Math.floor(Math.random() * 25);
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

function isOccupied(x: number, y: number, cycles: Cycle[], gridW: number, gridH: number): boolean {
  if (x < 0 || y < 0 || x >= gridW || y >= gridH) return true;
  for (const c of cycles) {
    if (!c.alive && c.trail.length === 0) continue;
    for (const p of c.trail) {
      if (p.x === x && p.y === y) return true;
    }
    if (c.alive && c.x === x && c.y === y) return true;
  }
  return false;
}

function makeEnemy(gridW: number, gridH: number, index: number, totalEnemies: number, colorIdx: number): Cycle {
  const color = C.enemies[colorIdx % C.enemies.length];
  /* Place enemies at different edges */
  const positions: { x: number; y: number; dir: Dir }[] = [
    { x: gridW - 5, y: gridH - 5, dir: 'up' },
    { x: gridW - 5, y: 5, dir: 'left' },
    { x: 5, y: gridH - 5, dir: 'right' },
    { x: Math.floor(gridW / 2), y: gridH - 5, dir: 'left' },
  ];
  const pos = positions[index % positions.length];
  return {
    x: pos.x,
    y: pos.y,
    dir: pos.dir,
    trail: [{ x: pos.x, y: pos.y }],
    alive: true,
    color,
    glowColor: color,
  };
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
  } else if (!g.over && g.countdown <= 0) {
    /* Directional controls during gameplay */
    const cx = w / 2;
    const cy = h - r * 3.5;
    const sp = r * 2.8;
    btns.push({ id: 'dup', x: cx, y: cy - sp, r, label: '\u25B2' });
    btns.push({ id: 'ddown', x: cx, y: cy + sp, r, label: '\u25BC' });
    btns.push({ id: 'dleft', x: cx - sp, y: cy, r, label: '\u25C0' });
    btns.push({ id: 'dright', x: cx + sp, y: cy, r, label: '\u25B6' });
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
export function TronGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);
  const sfxRef = useRef<SFX | null>(null);
  const touchActive = useRef<Record<string, boolean>>({});
  const prevTouch = useRef<Record<string, boolean>>({});
  const showTouch = useRef(false);
  const btnsRef = useRef<TBtn[]>([]);
  const bossActive = useRef(false);
  const lastTick = useRef(0);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);

  const init = useCallback((w: number, h: number, level: number = 1, score: number = 0): Game => {
    const gridW = Math.floor(w / CELL);
    const gridH = Math.floor(h / CELL);
    const px = Math.floor(gridW * 0.2);
    const py = Math.floor(gridH / 2);
    const numEnemies = Math.min(level, 4);
    const enemies: Cycle[] = [];
    for (let i = 0; i < numEnemies; i++) {
      enemies.push(makeEnemy(gridW, gridH, i, numEnemies, i));
    }

    return {
      player: {
        x: px, y: py, dir: 'right',
        trail: [{ x: px, y: py }],
        alive: true,
        color: C.player,
        glowColor: C.player,
      },
      enemies,
      gridW,
      gridH,
      score,
      level,
      speed: BASE_SPEED + SPEED_INC * (level - 1),
      tick: 0,
      tickAccum: 0,
      sparks: [],
      over: false,
      overTimer: 0,
      shake: 0,
      frame: 0,
      countdown: COUNTDOWN_TICKS,
      levelFlash: 0,
      enteringInitials: false,
      initialsChars: [0, 0, 0],
      initialsPos: 0,
      highScores: [],
      scoreSubmitted: false,
      scoreIndex: -1,
      pendingDir: null,
    };
  }, []);

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
    lastTick.current = performance.now();

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
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      updateTouchState(e);
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      updateTouchState(e);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    /* ── Keyboard handlers ── */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

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
              setBossData({ game: 'tron', score: g.score, initials });
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
          lastTick.current = performance.now();
        }
        return;
      }

      if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }

      /* Direction input */
      let newDir: Dir | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') newDir = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') newDir = 'down';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') newDir = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') newDir = 'right';

      if (newDir && newDir !== opposite[g.player.dir] && newDir !== g.player.dir) {
        g.pendingDir = newDir;
      }

      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let wasOver = false;
    let wasEngine = false;
    let lastCountdown = -1;

    /* ═══════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════ */
    const loop = (now: number) => {
      const g = game.current;
      if (!g) return;
      const w = el.width;
      const h = el.height;
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
            const entry: HighScore = { initials, score: g.score };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) {
              bossActive.current = true;
              setBossData({ game: 'tron', score: g.score, initials });
            }
          }
        } else if (justTouched('restart')) {
          game.current = init(el.width, el.height);
          lastTick.current = performance.now();
          prevTouch.current = { ...ta };
          raf.current = requestAnimationFrame(loop);
          return;
        }
      }

      /* Touch direction input during gameplay */
      if (!g.over && g.countdown <= 0 && showTouch.current) {
        let newDir: Dir | null = null;
        if (justTouched('dup')) newDir = 'up';
        else if (justTouched('ddown')) newDir = 'down';
        else if (justTouched('dleft')) newDir = 'left';
        else if (justTouched('dright')) newDir = 'right';
        if (newDir && newDir !== opposite[g.player.dir] && newDir !== g.player.dir) {
          g.pendingDir = newDir;
        }
      }

      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      /* ═══ GAME LOGIC ═══ */

      /* Countdown phase */
      if (g.countdown > 0 && !g.over) {
        const sec = Math.ceil(g.countdown / 20);
        if (sec !== lastCountdown) {
          sfx.countdown();
          lastCountdown = sec;
        }
        g.countdown--;
        if (g.countdown <= 0) {
          sfx.startEngine();
          wasEngine = true;
        }
      }

      /* Tick-based movement */
      if (!g.over && g.countdown <= 0 && g.levelFlash <= 0) {
        const tickInterval = Math.max(20, TICK_MS - (g.speed - BASE_SPEED) * 5);
        const dt = now - lastTick.current;

        if (dt >= tickInterval) {
          lastTick.current = now;
          g.tick++;

          /* Apply pending direction */
          if (g.pendingDir) {
            g.player.dir = g.pendingDir;
            sfx.turn();
            g.pendingDir = null;
          }

          /* Move player */
          const pv = dirVec[g.player.dir];
          const nx = g.player.x + pv.x;
          const ny = g.player.y + pv.y;

          /* Check player collision */
          if (nx < 0 || ny < 0 || nx >= g.gridW || ny >= g.gridH ||
              isOccupied(nx, ny, [g.player, ...g.enemies], g.gridW, g.gridH)) {
            g.player.alive = false;
            g.over = true;
            sfx.stopEngine();
            wasEngine = false;
            g.shake = 15;
            g.sparks.push(...boom(g.player.x * CELL + CELL / 2, g.player.y * CELL + CELL / 2, 30, C.player));
            const hs = loadHighScores();
            g.highScores = hs;
            g.enteringInitials = qualifiesForHighScore(g.score, hs);
          } else {
            g.player.x = nx;
            g.player.y = ny;
            g.player.trail.push({ x: nx, y: ny });
            g.score++;
          }

          /* Move enemies */
          if (g.player.alive) {
            for (const enemy of g.enemies) {
              if (!enemy.alive) continue;

              /* Simple AI: mostly go straight, occasionally turn toward player, avoid walls */
              let bestDir = enemy.dir;

              if (Math.random() < ENEMY_TURN_CHANCE) {
                /* Try to turn toward player */
                const dx = g.player.x - enemy.x;
                const dy = g.player.y - enemy.y;
                const preferred: Dir[] = [];
                if (Math.abs(dx) > Math.abs(dy)) {
                  preferred.push(dx > 0 ? 'right' : 'left');
                  preferred.push(dy > 0 ? 'down' : 'up');
                } else {
                  preferred.push(dy > 0 ? 'down' : 'up');
                  preferred.push(dx > 0 ? 'right' : 'left');
                }
                for (const d of preferred) {
                  if (d === opposite[enemy.dir]) continue;
                  const v = dirVec[d];
                  const ex = enemy.x + v.x;
                  const ey = enemy.y + v.y;
                  if (!isOccupied(ex, ey, [g.player, ...g.enemies], g.gridW, g.gridH)) {
                    bestDir = d;
                    break;
                  }
                }
              }

              /* Check if current dir is safe, if not find alternative */
              const cv = dirVec[bestDir];
              const cx = enemy.x + cv.x;
              const cy = enemy.y + cv.y;
              if (isOccupied(cx, cy, [g.player, ...g.enemies], g.gridW, g.gridH)) {
                /* Try all dirs */
                const shuffled = dirs.filter(d => d !== opposite[enemy.dir]);
                let found = false;
                for (const d of shuffled) {
                  const v = dirVec[d];
                  const ex = enemy.x + v.x;
                  const ey = enemy.y + v.y;
                  if (!isOccupied(ex, ey, [g.player, ...g.enemies], g.gridW, g.gridH)) {
                    bestDir = d;
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  /* Enemy trapped — dies */
                  enemy.alive = false;
                  g.score += 100 * g.level;
                  sfx.enemyCrash();
                  g.sparks.push(...boom(enemy.x * CELL + CELL / 2, enemy.y * CELL + CELL / 2, 20, enemy.color));
                  continue;
                }
              }

              enemy.dir = bestDir;
              const ev = dirVec[enemy.dir];
              enemy.x += ev.x;
              enemy.y += ev.y;
              enemy.trail.push({ x: enemy.x, y: enemy.y });
            }
          }

          /* Check if all enemies dead → next level */
          if (g.player.alive && g.enemies.every(e => !e.alive)) {
            g.level++;
            g.levelFlash = 90;
            sfx.stopEngine();
            wasEngine = false;
            sfx.levelUp();
          }
        }
      }

      /* Level transition */
      if (g.levelFlash > 0) {
        g.levelFlash--;
        if (g.levelFlash <= 0) {
          const savedScore = g.score;
          const savedLevel = g.level;
          const ng = init(el.width, el.height, savedLevel, savedScore);
          game.current = ng;
          lastTick.current = performance.now();
        }
      }

      /* Sparks */
      g.sparks = g.sparks.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97;
        return --p.life > 0;
      });

      /* Sound management */
      if (g.over && !wasOver) { sfx.gameOver(); wasOver = true; }
      if (!g.over) wasOver = false;

      if (!g.over && g.countdown <= 0 && g.levelFlash <= 0 && !wasEngine) {
        sfx.startEngine();
        wasEngine = true;
      }

      /* Shake decay */
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

      /* ── Grid ── */
      const gridSpacing = CELL * 8;
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      /* ── Brighter grid border ── */
      ctx.strokeStyle = C.gridBright;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 0, g.gridW * CELL, g.gridH * CELL);

      /* ── Draw trails ── */
      const drawTrail = (cycle: Cycle) => {
        if (cycle.trail.length < 2) return;
        ctx.save();
        ctx.strokeStyle = cycle.color;
        ctx.lineWidth = CELL - 1;
        ctx.shadowColor = cycle.glowColor;
        ctx.shadowBlur = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cycle.trail[0].x * CELL + CELL / 2, cycle.trail[0].y * CELL + CELL / 2);
        for (let i = 1; i < cycle.trail.length; i++) {
          ctx.lineTo(cycle.trail[i].x * CELL + CELL / 2, cycle.trail[i].y * CELL + CELL / 2);
        }
        ctx.stroke();
        ctx.restore();
      };

      /* Draw all trails */
      for (const enemy of g.enemies) {
        drawTrail(enemy);
      }
      drawTrail(g.player);

      /* ── Draw cycle heads ── */
      const drawHead = (cycle: Cycle) => {
        if (!cycle.alive) return;
        const hx = cycle.x * CELL + CELL / 2;
        const hy = cycle.y * CELL + CELL / 2;
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = cycle.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(hx, hy, CELL, 0, Math.PI * 2);
        ctx.fill();
        /* Inner glow */
        ctx.fillStyle = cycle.color;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(hx, hy, CELL * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      for (const enemy of g.enemies) {
        drawHead(enemy);
      }
      drawHead(g.player);

      /* ── Sparks ── */
      for (const p of g.sparks) {
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── HUD ── */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);

      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${g.level}`, w / 2, 30);

      /* Enemies alive indicator */
      const aliveEnemies = g.enemies.filter(e => e.alive).length;
      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'right';
      ctx.fillText(`CYCLES: ${aliveEnemies}`, w - 20, 30);

      /* ── Countdown ── */
      if (g.countdown > 0 && !g.over) {
        const sec = Math.ceil(g.countdown / 20);
        ctx.fillStyle = C.score;
        ctx.font = 'bold 72px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const pulse = 1 + 0.1 * Math.sin(g.frame * 0.15);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(pulse, pulse);
        ctx.fillText(String(sec), 0, 0);
        ctx.restore();
        ctx.textBaseline = 'alphabetic';
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
      if (!showTouch.current && !g.over && g.countdown <= 0) {
        ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('ARROWS / WASD \u00B7 M MUTE \u00B7 ESC EXIT', w / 2, h - 20);
        ctx.globalAlpha = 1;
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.player; ctx.font = 'bold 48px monospace';
        ctx.fillText('DERESOLVED', w / 2, h / 2 - 120);

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
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: 'none' }}>
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
