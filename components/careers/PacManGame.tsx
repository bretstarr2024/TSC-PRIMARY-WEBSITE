'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  pacman: '#FF5910',
  blinky: '#FF5910',
  pinky: '#ED0AD2',
  inky: '#73F5FF',
  clyde: '#E1FF00',
  frightened: '#088BA0',
  wall: '#73F5FF',
  dot: '#d1d1c6',
  powerPellet: '#FF5910',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
  fx: ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2'],
};

/* ── Tuning knobs ── */
const MAZE_W = 28;
const MAZE_H = 31;
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const GHOST_FRIGHTENED_SPEED = 0.8;
const GHOST_EATEN_SPEED = 3;
const POWER_DURATION = 360;
const POWER_DEC_PER_LEVEL = 30;
const MIN_POWER_DURATION = 60;

/* High scores */
const HS_KEY = 'tsc-pacman-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ── Maze template ── */
/* 28 cols x 31 rows. Every row is padded/validated to exactly 28 chars. */
const MAZE_RAW = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW', //  0
  'W............WW............W', //  1
  'W.WWWW.WWWWW.WW.WWWWW.WWWWW', //  2
  'WoWWWW.WWWWW.WW.WWWWW.WWWWoW', //  3
  'W.WWWW.WWWWW.WW.WWWWW.WWWWW', //  4
  'W..........................W', //  5
  'W.WWWW.WW.WWWWWWWW.WW.WWWWW', //  6
  'W.WWWW.WW.WWWWWWWW.WW.WWWWW', //  7
  'W......WW....WW....WW......W', //  8
  'WWWWWW.WWWWW WW WWWWW.WWWWWW', //  9
  '     W.WWWWW WW WWWWW.W     ', // 10
  '     W.WW          WW.W     ', // 11
  '     W.WW WWWGGWWW WW.W     ', // 12
  'WWWWWW.WW W  NI  W WW.WWWWWW', // 13
  '      .   W BK   W   .      ', // 14  tunnel
  'WWWWWW.WW W      W WW.WWWWWW', // 15
  '     W.WW WWWWWWWW WW.W     ', // 16
  '     W.WW          WW.W     ', // 17
  '     W.WW WWWWWWWW WW.W     ', // 18
  'WWWWWW.WW WWWWWWWW WW.WWWWWW', // 19
  'W............WW............W', // 20
  'W.WWWW.WWWWW.WW.WWWWW.WWWWW', // 21
  'W.WWWW.WWWWW.WW.WWWWW.WWWWW', // 22
  'Wo..WW.......P........WW..oW', // 23
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW', // 24
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW', // 25
  'W......WW....WW....WW......W', // 26
  'W.WWWWWWWWWW.WW.WWWWWWWWWW.W', // 27
  'W.WWWWWWWWWW.WW.WWWWWWWWWW.W', // 28
  'W..........................W', // 29
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW', // 30
];
/* Runtime-pad every row to exactly MAZE_W so off-by-one in the template is harmless. */
const MAZE_TEMPLATE = MAZE_RAW.map(r => {
  if (r.length >= MAZE_W) return r.slice(0, MAZE_W);
  return r + ' '.repeat(MAZE_W - r.length);
});

/* ── Mode cycle durations (frames at 60fps) ── */
const MODE_DURATIONS = [420, 1200, 420, 1200, 300, 1200, 300, Infinity];

/* ══════════════════════════════════════════════════════
   Sound Engine — Web Audio API retro synth sounds
   ══════════════════════════════════════════════════════ */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
      catch { return null; }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  get muted() { return this._muted; }
  toggle(): boolean { this._muted = !this._muted; if (this._muted) this.stopSiren(); return this._muted; }

  waka(alt: boolean) {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    if (alt) {
      o.frequency.setValueAtTime(520, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(260, c.currentTime + 0.05);
    } else {
      o.frequency.setValueAtTime(260, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(520, c.currentTime + 0.05);
    }
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.05);
  }

  powerPellet() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, c.currentTime);
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(6, c.currentTime);
    lfoGain.gain.setValueAtTime(0.06, c.currentTime);
    lfo.connect(lfoGain).connect(g.gain);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.3);
    lfo.start(); lfo.stop(c.currentTime + 0.3);
  }

  eatGhost() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(1760, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.15);
  }

  death() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const dur = 0.8;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(800, c.currentTime);
    f.frequency.exponentialRampToValueAtTime(200, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(); src.stop(c.currentTime + dur);
    const o = c.createOscillator();
    const g2 = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(110, c.currentTime + dur);
    g2.gain.setValueAtTime(0.15, c.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g2).connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }

  startSiren() {
    const c = this.ensure();
    if (!c || this._muted) return;
    if (this.sirenOsc) return;
    const o = c.createOscillator();
    const g = c.createGain();
    const f = c.createBiquadFilter();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, c.currentTime);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(200, c.currentTime);
    g.gain.setValueAtTime(0.04, c.currentTime);
    o.connect(f).connect(g).connect(c.destination);
    o.start();
    this.sirenOsc = o;
    this.sirenGain = g;
  }

  stopSiren() {
    if (this.sirenOsc) {
      try { this.sirenOsc.stop(); } catch { /* */ }
      this.sirenOsc = null;
      this.sirenGain = null;
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
    this.stopSiren();
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
    this.stopSiren();
    try { this.ctx?.close(); } catch { /* */ }
    this.ctx = null;
  }
}

/* ── Types ── */
type Dir = 'up' | 'down' | 'left' | 'right';
type GhostMode = 'scatter' | 'chase' | 'frightened' | 'eaten';

interface Ghost {
  x: number; y: number;
  gridX: number; gridY: number;
  dir: Dir;
  nextDir: Dir | null;
  mode: GhostMode;
  prevMode: GhostMode;
  color: string;
  name: string;
  scatterTarget: { x: number; y: number };
  frightenedTimer: number;
  speed: number;
  inHouse: boolean;
  houseTimer: number;
}

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }

interface HighScore { initials: string; score: number }

interface Game {
  maze: number[][];
  cellSize: number;
  offsetX: number; offsetY: number;
  pacX: number; pacY: number;
  pacGridX: number; pacGridY: number;
  pacDir: Dir;
  pendingDir: Dir | null;
  pacSpeed: number;
  mouthAngle: number;
  mouthOpen: boolean;
  ghosts: Ghost[];
  dotsRemaining: number;
  totalDots: number;
  ghostsEatenStreak: number;
  powerTimer: number;
  fruitActive: boolean;
  fruitTimer: number;
  fruitX: number; fruitY: number;
  fruitEaten70: boolean;
  fruitEaten170: boolean;
  score: number;
  lives: number;
  level: number;
  over: boolean;
  overTimer: number;
  shake: number;
  frame: number;
  levelFlash: number;
  wakaAlt: boolean;
  modeTimer: number;
  modePhase: number;
  deathAnim: number;
  sparks: Spark[];
  readyTimer: number;
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
  } else if (!g.over && g.readyTimer <= 0 && g.deathAnim <= 0) {
    /* D-pad for gameplay */
    const cx = w / 2;
    const cy = h - r * 4;
    btns.push({ id: 'dup', x: cx, y: cy - r * 2.2, r, label: '\u25B2' });
    btns.push({ id: 'ddown', x: cx, y: cy + r * 2.2, r, label: '\u25BC' });
    btns.push({ id: 'dleft', x: cx - r * 2.2, y: cy, r, label: '\u25C0' });
    btns.push({ id: 'dright', x: cx + r * 2.2, y: cy, r, label: '\u25B6' });
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

/* ── Direction helpers ── */
const DIR_DX: Record<Dir, number> = { left: -1, right: 1, up: 0, down: 0 };
const DIR_DY: Record<Dir, number> = { left: 0, right: 0, up: -1, down: 1 };
const OPPOSITE: Record<Dir, Dir> = { left: 'right', right: 'left', up: 'down', down: 'up' };
const ALL_DIRS: Dir[] = ['up', 'left', 'down', 'right'];

function isWall(maze: number[][], gx: number, gy: number): boolean {
  if (gy < 0 || gy >= MAZE_H) return true;
  /* Tunnel wrap — cells outside horizontal bounds on tunnel row are passable */
  if (gx < 0 || gx >= MAZE_W) {
    return gy !== 14;
  }
  return maze[gy][gx] === 1;
}

function isGhostWall(maze: number[][], gx: number, gy: number, mode: GhostMode, movingUp: boolean): boolean {
  if (gy < 0 || gy >= MAZE_H) return true;
  if (gx < 0 || gx >= MAZE_W) return gy !== 14;
  const cell = maze[gy][gx];
  if (cell === 1) return true;
  /* Ghost gate: only passable for eaten ghosts going down, or ghosts leaving house going up */
  if (cell === 4) {
    if (mode === 'eaten') return false;
    if (movingUp) return false; /* leaving house */
    return true;
  }
  return false;
}

function parseMaze(): { maze: number[][]; pacStart: { x: number; y: number }; ghostStarts: Record<string, { x: number; y: number }>; totalDots: number } {
  const maze: number[][] = [];
  let pacStart = { x: 14, y: 23 };
  const ghostStarts: Record<string, { x: number; y: number }> = {};
  let totalDots = 0;

  for (let gy = 0; gy < MAZE_H; gy++) {
    const row: number[] = [];
    const line = MAZE_TEMPLATE[gy] || '';
    for (let gx = 0; gx < MAZE_W; gx++) {
      const ch = gx < line.length ? line[gx] : ' ';
      switch (ch) {
        case 'W': row.push(1); break;
        case '.': row.push(2); totalDots++; break;
        case 'o': row.push(3); totalDots++; break;
        case 'G': row.push(4); break;
        case 'P': row.push(0); pacStart = { x: gx, y: gy }; break;
        case 'B': row.push(0); ghostStarts.blinky = { x: gx, y: gy }; break;
        case 'N': row.push(0); ghostStarts.pinky = { x: gx, y: gy }; break;
        case 'I': row.push(0); ghostStarts.inky = { x: gx, y: gy }; break;
        case 'K': row.push(0); ghostStarts.clyde = { x: gx, y: gy }; break;
        default: row.push(0); break;
      }
    }
    maze.push(row);
  }
  return { maze, pacStart, ghostStarts, totalDots };
}

function makeGhost(
  name: string,
  color: string,
  gx: number,
  gy: number,
  scatterTarget: { x: number; y: number },
  houseTimer: number,
  inHouse: boolean,
): Ghost {
  return {
    x: 0, y: 0, gridX: gx, gridY: gy,
    dir: 'left', nextDir: null,
    mode: 'scatter', prevMode: 'scatter',
    color, name, scatterTarget,
    frightenedTimer: 0,
    speed: GHOST_SPEED,
    inHouse, houseTimer,
  };
}

function fruitPoints(level: number): number {
  if (level === 1) return 100;
  if (level === 2) return 300;
  if (level <= 4) return 500;
  if (level <= 6) return 700;
  return 1000;
}

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
export function PacManGame({ onClose }: { onClose: () => void }) {
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

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((w: number, h: number): Game => {
    const { maze, pacStart, ghostStarts, totalDots } = parseMaze();
    const cellSize = Math.min(Math.floor(w / MAZE_W), Math.floor((h - 60) / MAZE_H));
    const offsetX = Math.floor((w - MAZE_W * cellSize) / 2);
    const offsetY = Math.floor((h - MAZE_H * cellSize) / 2);

    const pacPixelX = offsetX + pacStart.x * cellSize + cellSize / 2;
    const pacPixelY = offsetY + pacStart.y * cellSize + cellSize / 2;

    const gs = ghostStarts;
    const blinkyPos = gs.blinky || { x: 13, y: 14 };
    const pinkyPos = gs.pinky || { x: 13, y: 13 };
    const inkyPos = gs.inky || { x: 14, y: 13 };
    const clydePos = gs.clyde || { x: 14, y: 14 };

    const ghosts: Ghost[] = [
      makeGhost('blinky', C.blinky, blinkyPos.x, blinkyPos.y, { x: MAZE_W - 1, y: 0 }, 0, true),
      makeGhost('pinky', C.pinky, pinkyPos.x, pinkyPos.y, { x: 0, y: 0 }, 120, true),
      makeGhost('inky', C.inky, inkyPos.x, inkyPos.y, { x: MAZE_W - 1, y: MAZE_H - 1 }, 300, true),
      makeGhost('clyde', C.clyde, clydePos.x, clydePos.y, { x: 0, y: MAZE_H - 1 }, 480, true),
    ];

    for (const g of ghosts) {
      g.x = offsetX + g.gridX * cellSize + cellSize / 2;
      g.y = offsetY + g.gridY * cellSize + cellSize / 2;
    }

    return {
      maze,
      cellSize,
      offsetX,
      offsetY,
      pacX: pacPixelX,
      pacY: pacPixelY,
      pacGridX: pacStart.x,
      pacGridY: pacStart.y,
      pacDir: 'left',
      pendingDir: null,
      pacSpeed: PACMAN_SPEED,
      mouthAngle: 0,
      mouthOpen: true,
      ghosts,
      dotsRemaining: totalDots,
      totalDots,
      ghostsEatenStreak: 0,
      powerTimer: 0,
      fruitActive: false,
      fruitTimer: 0,
      fruitX: offsetX + 14 * cellSize + cellSize / 2,
      fruitY: offsetY + 17 * cellSize + cellSize / 2,
      fruitEaten70: false,
      fruitEaten170: false,
      score: 0,
      lives: 3,
      level: 1,
      over: false,
      overTimer: 0,
      shake: 0,
      frame: 0,
      levelFlash: 0,
      wakaAlt: false,
      modeTimer: MODE_DURATIONS[0],
      modePhase: 0,
      deathAnim: 0,
      sparks: [],
      readyTimer: 120,
      enteringInitials: false,
      initialsChars: [0, 0, 0],
      initialsPos: 0,
      highScores: [],
      scoreSubmitted: false,
      scoreIndex: -1,
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
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();

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
              setBossData({ game: 'pacman', score: g.score, initials });
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

      /* Movement keys set pending direction */
      if (e.key === 'ArrowLeft' || e.key === 'a') g.pendingDir = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd') g.pendingDir = 'right';
      else if (e.key === 'ArrowUp' || e.key === 'w') g.pendingDir = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's') g.pendingDir = 'down';

      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let wasOver = false;
    let sirenStarted = false;

    /* ═══════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════ */
    const loop = () => {
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
              setBossData({ game: 'pacman', score: g.score, initials });
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

      /* ── D-pad touch → pendingDir ── */
      if (showTouch.current && !g.over) {
        if (ta['dup']) g.pendingDir = 'up';
        else if (ta['ddown']) g.pendingDir = 'down';
        else if (ta['dleft']) g.pendingDir = 'left';
        else if (ta['dright']) g.pendingDir = 'right';
      }

      const cs = g.cellSize;
      const ox = g.offsetX;
      const oy = g.offsetY;

      /* ── Ready timer ── */
      if (g.readyTimer > 0) {
        g.readyTimer--;
        /* Skip to render */
      }

      /* ═══ GAME LOGIC ═══ */
      else if (!g.over && g.levelFlash <= 0 && g.deathAnim <= 0) {

        /* Start siren */
        if (!sirenStarted && g.powerTimer <= 0) {
          sfx.startSiren();
          sirenStarted = true;
        }

        /* ── Mode cycling ── */
        if (g.powerTimer <= 0) {
          g.modeTimer--;
          if (g.modeTimer <= 0 && g.modePhase < MODE_DURATIONS.length - 1) {
            g.modePhase++;
            g.modeTimer = MODE_DURATIONS[g.modePhase];
            /* Reverse all non-frightened/eaten ghosts */
            const newMode: GhostMode = g.modePhase % 2 === 0 ? 'scatter' : 'chase';
            for (const gh of g.ghosts) {
              if (gh.mode === 'scatter' || gh.mode === 'chase') {
                gh.mode = newMode;
                gh.dir = OPPOSITE[gh.dir];
              }
            }
          }
        }

        /* ── Power pellet timer ── */
        if (g.powerTimer > 0) {
          g.powerTimer--;
          if (g.powerTimer <= 0) {
            /* End frightened mode */
            for (const gh of g.ghosts) {
              if (gh.mode === 'frightened') {
                gh.mode = g.modePhase % 2 === 0 ? 'scatter' : 'chase';
                gh.speed = GHOST_SPEED + (g.level - 1) * 0.1;
              }
            }
            sfx.startSiren();
            sirenStarted = true;
          }
        }

        /* ── Pac-Man movement ── */
        const cellCenterX = (gx: number) => ox + gx * cs + cs / 2;
        const cellCenterY = (gy: number) => oy + gy * cs + cs / 2;

        /* Calculate current grid position */
        g.pacGridX = Math.round((g.pacX - ox - cs / 2) / cs);
        g.pacGridY = Math.round((g.pacY - oy - cs / 2) / cs);

        const ccx = cellCenterX(g.pacGridX);
        const ccy = cellCenterY(g.pacGridY);
        const nearCenter = Math.abs(g.pacX - ccx) < g.pacSpeed + 0.5 && Math.abs(g.pacY - ccy) < g.pacSpeed + 0.5;

        if (nearCenter) {
          /* Check pending direction */
          if (g.pendingDir) {
            const ndx = DIR_DX[g.pendingDir];
            const ndy = DIR_DY[g.pendingDir];
            const nx = g.pacGridX + ndx;
            const ny = g.pacGridY + ndy;
            if (!isWall(g.maze, nx, ny)) {
              g.pacDir = g.pendingDir;
              g.pendingDir = null;
              /* Snap to center */
              g.pacX = ccx;
              g.pacY = ccy;
            }
          }

          /* Check current direction */
          const cdx = DIR_DX[g.pacDir];
          const cdy = DIR_DY[g.pacDir];
          const cnx = g.pacGridX + cdx;
          const cny = g.pacGridY + cdy;
          if (isWall(g.maze, cnx, cny)) {
            /* Stop at center */
            g.pacX = ccx;
            g.pacY = ccy;
          } else {
            /* Move */
            g.pacX += DIR_DX[g.pacDir] * g.pacSpeed;
            g.pacY += DIR_DY[g.pacDir] * g.pacSpeed;
          }
        } else {
          /* Continue moving in current direction */
          g.pacX += DIR_DX[g.pacDir] * g.pacSpeed;
          g.pacY += DIR_DY[g.pacDir] * g.pacSpeed;
        }

        /* Tunnel wrap */
        const mazeLeft = ox;
        const mazeRight = ox + MAZE_W * cs;
        if (g.pacX < mazeLeft - cs / 2) {
          g.pacX = mazeRight + cs / 2;
        } else if (g.pacX > mazeRight + cs / 2) {
          g.pacX = mazeLeft - cs / 2;
        }

        /* ── Eat dots ── */
        const pgx = Math.round((g.pacX - ox - cs / 2) / cs);
        const pgy = Math.round((g.pacY - oy - cs / 2) / cs);
        if (pgx >= 0 && pgx < MAZE_W && pgy >= 0 && pgy < MAZE_H) {
          const cell = g.maze[pgy][pgx];
          if (cell === 2) {
            g.maze[pgy][pgx] = 0;
            g.score += 10;
            g.dotsRemaining--;
            g.wakaAlt = !g.wakaAlt;
            sfx.waka(g.wakaAlt);
          } else if (cell === 3) {
            g.maze[pgy][pgx] = 0;
            g.score += 50;
            g.dotsRemaining--;
            g.ghostsEatenStreak = 0;
            const dur = Math.max(MIN_POWER_DURATION, POWER_DURATION - POWER_DEC_PER_LEVEL * (g.level - 1));
            g.powerTimer = dur;
            sfx.stopSiren();
            sirenStarted = false;
            sfx.powerPellet();
            /* Set all non-eaten ghosts to frightened */
            for (const gh of g.ghosts) {
              if (gh.mode !== 'eaten' && !gh.inHouse) {
                gh.prevMode = gh.mode;
                gh.mode = 'frightened';
                gh.frightenedTimer = dur;
                gh.speed = GHOST_FRIGHTENED_SPEED;
                gh.dir = OPPOSITE[gh.dir];
              }
            }
          }
        }

        /* ── Fruit logic ── */
        const dotsEaten = g.totalDots - g.dotsRemaining;
        if (dotsEaten >= 70 && !g.fruitEaten70 && !g.fruitActive) {
          g.fruitActive = true;
          g.fruitTimer = 480;
          g.fruitEaten70 = true;
        } else if (dotsEaten >= 170 && !g.fruitEaten170 && !g.fruitActive) {
          g.fruitActive = true;
          g.fruitTimer = 480;
          g.fruitEaten170 = true;
        }
        if (g.fruitActive) {
          g.fruitTimer--;
          if (g.fruitTimer <= 0) {
            g.fruitActive = false;
          } else {
            /* Check if pac-man eats fruit */
            const dist = Math.hypot(g.pacX - g.fruitX, g.pacY - g.fruitY);
            if (dist < cs * 0.7) {
              g.score += fruitPoints(g.level);
              g.fruitActive = false;
              g.sparks.push(...boom(g.fruitX, g.fruitY, 10, C.pinky));
            }
          }
        }

        /* ── Mouth animation ── */
        if (g.frame % 8 === 0) {
          g.mouthOpen = !g.mouthOpen;
        }
        g.mouthAngle = g.mouthOpen ? 0.25 : 0.02;

        /* ── Ghost AI ── */
        for (const gh of g.ghosts) {
          /* House timer */
          if (gh.inHouse) {
            gh.houseTimer--;
            if (gh.houseTimer <= 0) {
              /* Move ghost to gate exit position */
              gh.inHouse = false;
              /* Find gate position — row 12, middle */
              gh.gridX = 14;
              gh.gridY = 11;
              gh.x = cellCenterX(gh.gridX);
              gh.y = cellCenterY(gh.gridY);
              gh.dir = 'left';
              gh.mode = g.modePhase % 2 === 0 ? 'scatter' : 'chase';
              if (g.powerTimer > 0) {
                gh.mode = 'frightened';
                gh.frightenedTimer = g.powerTimer;
                gh.speed = GHOST_FRIGHTENED_SPEED;
              }
            } else {
              /* Bob up and down inside house */
              const bobCenter = cellCenterY(gh.gridY);
              gh.y = bobCenter + Math.sin(g.frame * 0.1) * cs * 0.3;
              gh.x = cellCenterX(gh.gridX);
              prevTouch.current = { ...ta };
              continue; /* Skip movement for housed ghosts */
            }
          }

          /* Eaten ghost reaching house */
          if (gh.mode === 'eaten') {
            const houseGateX = 13;
            const houseGateY = 12;
            const hgx = cellCenterX(houseGateX);
            const hgy = cellCenterY(houseGateY);
            if (Math.abs(gh.x - hgx) < cs && Math.abs(gh.y - hgy) < cs) {
              /* Respawn */
              gh.mode = g.modePhase % 2 === 0 ? 'scatter' : 'chase';
              gh.speed = GHOST_SPEED + (g.level - 1) * 0.1;
              gh.gridX = 14;
              gh.gridY = 11;
              gh.x = cellCenterX(gh.gridX);
              gh.y = cellCenterY(gh.gridY);
              gh.dir = 'left';
              continue;
            }
          }

          /* Calculate ghost grid position */
          gh.gridX = Math.round((gh.x - ox - cs / 2) / cs);
          gh.gridY = Math.round((gh.y - oy - cs / 2) / cs);

          const gcx = cellCenterX(gh.gridX);
          const gcy = cellCenterY(gh.gridY);
          const ghostNearCenter = Math.abs(gh.x - gcx) < gh.speed + 0.5 && Math.abs(gh.y - gcy) < gh.speed + 0.5;

          if (ghostNearCenter) {
            /* Choose direction at intersection */
            let target = { x: 0, y: 0 };

            if (gh.mode === 'scatter') {
              target = gh.scatterTarget;
            } else if (gh.mode === 'chase') {
              if (gh.name === 'blinky') {
                target = { x: g.pacGridX, y: g.pacGridY };
              } else if (gh.name === 'pinky') {
                target = {
                  x: g.pacGridX + DIR_DX[g.pacDir] * 4,
                  y: g.pacGridY + DIR_DY[g.pacDir] * 4,
                };
              } else if (gh.name === 'inky') {
                const ahead = {
                  x: g.pacGridX + DIR_DX[g.pacDir] * 2,
                  y: g.pacGridY + DIR_DY[g.pacDir] * 2,
                };
                const blinky = g.ghosts[0];
                target = {
                  x: 2 * ahead.x - blinky.gridX,
                  y: 2 * ahead.y - blinky.gridY,
                };
              } else if (gh.name === 'clyde') {
                const dist = Math.hypot(gh.gridX - g.pacGridX, gh.gridY - g.pacGridY);
                if (dist > 8) {
                  target = { x: g.pacGridX, y: g.pacGridY };
                } else {
                  target = gh.scatterTarget;
                }
              }
            } else if (gh.mode === 'eaten') {
              /* Target ghost house entrance */
              target = { x: 13, y: 12 };
            }
            /* frightened: random */

            /* Snap to center */
            gh.x = gcx;
            gh.y = gcy;

            /* Choose best direction */
            let bestDir: Dir = gh.dir;
            let bestDist = Infinity;
            const opposite = OPPOSITE[gh.dir];

            for (const d of ALL_DIRS) {
              if (d === opposite) continue; /* No reversing */
              const nx = gh.gridX + DIR_DX[d];
              const ny = gh.gridY + DIR_DY[d];
              if (isGhostWall(g.maze, nx, ny, gh.mode, d === 'up')) continue;

              if (gh.mode === 'frightened') {
                /* Random valid direction */
                if (Math.random() < 0.3 || bestDist === Infinity) {
                  bestDir = d;
                  bestDist = 0;
                }
              } else {
                const dist = Math.hypot(nx - target.x, ny - target.y);
                if (dist < bestDist) {
                  bestDist = dist;
                  bestDir = d;
                }
              }
            }

            /* If no valid direction found except opposite, allow it */
            if (bestDist === Infinity) {
              bestDir = opposite;
            }

            gh.dir = bestDir;
          }

          /* Move ghost */
          const spd = gh.mode === 'eaten' ? GHOST_EATEN_SPEED : gh.speed;
          gh.x += DIR_DX[gh.dir] * spd;
          gh.y += DIR_DY[gh.dir] * spd;

          /* Tunnel wrap for ghosts */
          if (gh.x < mazeLeft - cs / 2) {
            gh.x = mazeRight + cs / 2;
          } else if (gh.x > mazeRight + cs / 2) {
            gh.x = mazeLeft - cs / 2;
          }

          /* Frightened timer */
          if (gh.mode === 'frightened') {
            gh.frightenedTimer--;
            if (gh.frightenedTimer <= 0) {
              gh.mode = g.modePhase % 2 === 0 ? 'scatter' : 'chase';
              gh.speed = GHOST_SPEED + (g.level - 1) * 0.1;
            }
          }
        }

        /* ── Collision: pac-man vs ghosts ── */
        for (const gh of g.ghosts) {
          if (gh.inHouse) continue;
          const dist = Math.hypot(g.pacX - gh.x, g.pacY - gh.y);
          if (dist < cs * 0.6) {
            if (gh.mode === 'frightened') {
              /* Eat ghost */
              gh.mode = 'eaten';
              gh.speed = GHOST_EATEN_SPEED;
              const points = 200 * Math.pow(2, g.ghostsEatenStreak);
              g.score += points;
              g.ghostsEatenStreak++;
              g.sparks.push(...boom(gh.x, gh.y, 12, gh.color));
              sfx.eatGhost();
            } else if (gh.mode !== 'eaten') {
              /* Pac-man dies */
              g.deathAnim = 60;
              sfx.stopSiren();
              sirenStarted = false;
              sfx.death();
              g.shake = 8;
            }
          }
        }

        /* ── Level complete ── */
        if (g.dotsRemaining === 0) {
          g.levelFlash = 90;
          sfx.stopSiren();
          sirenStarted = false;
          sfx.levelUp();
        }
      }

      /* ── Death animation ── */
      if (g.deathAnim > 0) {
        g.deathAnim--;
        if (g.deathAnim <= 0) {
          g.lives--;
          if (g.lives <= 0) {
            g.over = true;
            setIsOver(true);
            const hs = loadHighScores();
            g.highScores = hs;
            g.enteringInitials = qualifiesForHighScore(g.score, hs);
            sfx.stopSiren();
            sirenStarted = false;
          } else {
            /* Reset positions, keep score and maze */
            const { pacStart, ghostStarts } = parseMaze();
            g.pacX = ox + pacStart.x * cs + cs / 2;
            g.pacY = oy + pacStart.y * cs + cs / 2;
            g.pacGridX = pacStart.x;
            g.pacGridY = pacStart.y;
            g.pacDir = 'left';
            g.pendingDir = null;
            g.powerTimer = 0;
            g.readyTimer = 60;

            const gs = ghostStarts;
            const positions = [
              { name: 'blinky', pos: gs.blinky || { x: 13, y: 14 }, timer: 0 },
              { name: 'pinky', pos: gs.pinky || { x: 13, y: 13 }, timer: 120 },
              { name: 'inky', pos: gs.inky || { x: 14, y: 13 }, timer: 300 },
              { name: 'clyde', pos: gs.clyde || { x: 14, y: 14 }, timer: 480 },
            ];
            for (let i = 0; i < g.ghosts.length; i++) {
              const gh = g.ghosts[i];
              const p = positions[i];
              gh.gridX = p.pos.x;
              gh.gridY = p.pos.y;
              gh.x = ox + gh.gridX * cs + cs / 2;
              gh.y = oy + gh.gridY * cs + cs / 2;
              gh.dir = 'left';
              gh.mode = 'scatter';
              gh.inHouse = true;
              gh.houseTimer = p.timer;
              gh.speed = GHOST_SPEED + (g.level - 1) * 0.1;
              gh.frightenedTimer = 0;
            }
            g.modeTimer = MODE_DURATIONS[0];
            g.modePhase = 0;
          }
        }
      }

      /* ── Level transition ── */
      if (g.levelFlash > 0) {
        g.levelFlash--;
        if (g.levelFlash <= 0) {
          g.level++;
          /* Re-parse maze for dots */
          const { maze: newMaze, pacStart, ghostStarts, totalDots } = parseMaze();
          g.maze = newMaze;
          g.dotsRemaining = totalDots;
          g.totalDots = totalDots;
          g.fruitEaten70 = false;
          g.fruitEaten170 = false;
          g.fruitActive = false;

          /* Recalculate cell size in case of resize */
          g.cellSize = Math.min(Math.floor(w / MAZE_W), Math.floor((h - 60) / MAZE_H));
          g.offsetX = Math.floor((w - MAZE_W * g.cellSize) / 2);
          g.offsetY = Math.floor((h - MAZE_H * g.cellSize) / 2);
          const nox = g.offsetX;
          const noy = g.offsetY;
          const ncs = g.cellSize;

          g.pacX = nox + pacStart.x * ncs + ncs / 2;
          g.pacY = noy + pacStart.y * ncs + ncs / 2;
          g.pacGridX = pacStart.x;
          g.pacGridY = pacStart.y;
          g.pacDir = 'left';
          g.pendingDir = null;
          g.pacSpeed = PACMAN_SPEED;
          g.powerTimer = 0;
          g.readyTimer = 60;
          g.modeTimer = MODE_DURATIONS[0];
          g.modePhase = 0;

          g.fruitX = nox + 14 * ncs + ncs / 2;
          g.fruitY = noy + 17 * ncs + ncs / 2;

          const gs = ghostStarts;
          const positions = [
            { name: 'blinky', pos: gs.blinky || { x: 13, y: 14 }, timer: 0 },
            { name: 'pinky', pos: gs.pinky || { x: 13, y: 13 }, timer: 120 },
            { name: 'inky', pos: gs.inky || { x: 14, y: 13 }, timer: 300 },
            { name: 'clyde', pos: gs.clyde || { x: 14, y: 14 }, timer: 480 },
          ];
          for (let i = 0; i < g.ghosts.length; i++) {
            const gh = g.ghosts[i];
            const p = positions[i];
            gh.gridX = p.pos.x;
            gh.gridY = p.pos.y;
            gh.x = nox + gh.gridX * ncs + ncs / 2;
            gh.y = noy + gh.gridY * ncs + ncs / 2;
            gh.dir = 'left';
            gh.mode = 'scatter';
            gh.inHouse = true;
            gh.houseTimer = p.timer;
            gh.speed = GHOST_SPEED + (g.level - 1) * 0.1;
            gh.frightenedTimer = 0;
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

      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      const rcs = g.cellSize;
      const rox = g.offsetX;
      const roy = g.offsetY;

      /* ── Draw maze walls ── */
      for (let gy = 0; gy < MAZE_H; gy++) {
        for (let gx = 0; gx < MAZE_W; gx++) {
          const cell = g.maze[gy][gx];
          const px = rox + gx * rcs;
          const py = roy + gy * rcs;

          if (cell === 1) {
            /* Wall — draw inset filled square with glow */
            const inset = Math.max(1, rcs * 0.08);
            ctx.save();
            ctx.fillStyle = C.wall;
            ctx.globalAlpha = 0.25;
            ctx.fillRect(px + inset, py + inset, rcs - inset * 2, rcs - inset * 2);
            ctx.globalAlpha = 1;

            /* Draw border lines on sides facing non-wall cells */
            ctx.strokeStyle = C.wall;
            ctx.lineWidth = Math.max(1.5, rcs * 0.08);
            ctx.shadowColor = C.wall;
            ctx.shadowBlur = 4;

            const top = gy > 0 && g.maze[gy - 1][gx] !== 1;
            const bottom = gy < MAZE_H - 1 && g.maze[gy + 1][gx] !== 1;
            const left = gx > 0 && g.maze[gy][gx - 1] !== 1;
            const right = gx < MAZE_W - 1 && g.maze[gy][gx + 1] !== 1;

            if (top) { ctx.beginPath(); ctx.moveTo(px, py + inset); ctx.lineTo(px + rcs, py + inset); ctx.stroke(); }
            if (bottom) { ctx.beginPath(); ctx.moveTo(px, py + rcs - inset); ctx.lineTo(px + rcs, py + rcs - inset); ctx.stroke(); }
            if (left) { ctx.beginPath(); ctx.moveTo(px + inset, py); ctx.lineTo(px + inset, py + rcs); ctx.stroke(); }
            if (right) { ctx.beginPath(); ctx.moveTo(px + rcs - inset, py); ctx.lineTo(px + rcs - inset, py + rcs); ctx.stroke(); }
            ctx.restore();
          } else if (cell === 4) {
            /* Ghost gate */
            ctx.save();
            ctx.fillStyle = C.pinky;
            ctx.globalAlpha = 0.7;
            const gateH = Math.max(2, rcs * 0.15);
            ctx.fillRect(px, py + rcs / 2 - gateH / 2, rcs, gateH);
            ctx.restore();
          } else if (cell === 2) {
            /* Dot */
            const dotR = Math.max(1.5, rcs * 0.12);
            ctx.fillStyle = C.dot;
            ctx.beginPath();
            ctx.arc(px + rcs / 2, py + rcs / 2, dotR, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            /* Power pellet — pulsing */
            const pelletR = Math.max(3, rcs * 0.3);
            const pulse = 0.6 + 0.4 * Math.sin(g.frame * 0.1);
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.fillStyle = C.powerPellet;
            ctx.shadowColor = C.powerPellet;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px + rcs / 2, py + rcs / 2, pelletR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      /* ── Draw fruit ── */
      if (g.fruitActive) {
        ctx.save();
        ctx.fillStyle = C.pinky;
        ctx.shadowColor = C.pinky;
        ctx.shadowBlur = 8;
        const fr = rcs * 0.4;
        ctx.beginPath();
        ctx.moveTo(g.fruitX, g.fruitY - fr);
        ctx.lineTo(g.fruitX + fr, g.fruitY);
        ctx.lineTo(g.fruitX, g.fruitY + fr);
        ctx.lineTo(g.fruitX - fr, g.fruitY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      /* ── Draw ghosts ── */
      for (const gh of g.ghosts) {
        const gr = rcs * 0.45;

        if (gh.mode === 'eaten') {
          /* Just eyes */
          drawGhostEyes(ctx, gh.x, gh.y, gr, gh.dir);
          continue;
        }

        let ghostColor = gh.color;
        if (gh.mode === 'frightened') {
          /* Flash white in last 120 frames */
          if (gh.frightenedTimer < 120 && Math.floor(g.frame / 10) % 2 === 0) {
            ghostColor = '#FFFFFF';
          } else {
            ghostColor = C.frightened;
          }
        }

        /* Ghost body */
        ctx.save();
        ctx.fillStyle = ghostColor;
        if (gh.mode !== 'frightened') {
          ctx.shadowColor = ghostColor;
          ctx.shadowBlur = 6;
        }
        ctx.beginPath();
        /* Top: semicircle */
        ctx.arc(gh.x, gh.y - gr * 0.2, gr, Math.PI, 0);
        /* Right side down */
        ctx.lineTo(gh.x + gr, gh.y + gr);
        /* Wavy bottom — 3 bumps */
        const bumpW = (gr * 2) / 3;
        for (let i = 0; i < 3; i++) {
          const bx = gh.x + gr - bumpW * i;
          const by = gh.y + gr;
          ctx.quadraticCurveTo(bx - bumpW * 0.25, by + gr * 0.35, bx - bumpW * 0.5, by);
          ctx.quadraticCurveTo(bx - bumpW * 0.75, by - gr * 0.2, bx - bumpW, by);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        /* Eyes */
        if (gh.mode === 'frightened') {
          /* Simple frightened face */
          const eyeR = gr * 0.18;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(gh.x - gr * 0.3, gh.y - gr * 0.2, eyeR, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(gh.x + gr * 0.3, gh.y - gr * 0.2, eyeR, 0, Math.PI * 2);
          ctx.fill();
          /* Zigzag mouth */
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const mouthY = gh.y + gr * 0.2;
          ctx.moveTo(gh.x - gr * 0.4, mouthY);
          for (let i = 0; i < 4; i++) {
            const mx = gh.x - gr * 0.4 + (gr * 0.8 / 4) * (i + 0.5);
            const my = mouthY + (i % 2 === 0 ? -gr * 0.12 : gr * 0.12);
            ctx.lineTo(mx, my);
          }
          ctx.lineTo(gh.x + gr * 0.4, mouthY);
          ctx.stroke();
        } else {
          drawGhostEyes(ctx, gh.x, gh.y - gr * 0.15, gr, gh.dir);
        }
      }

      /* ── Draw Pac-Man ── */
      if (g.deathAnim > 0) {
        /* Death animation — pac-man opens mouth wider and shrinks */
        const progress = 1 - g.deathAnim / 60;
        const deathAngle = progress * Math.PI;
        const deathRadius = rcs * 0.45 * (1 - progress * 0.5);
        ctx.save();
        ctx.fillStyle = C.pacman;
        ctx.shadowColor = C.pacman;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(g.pacX, g.pacY, deathRadius, deathAngle + 0.01, Math.PI * 2 - deathAngle - 0.01);
        ctx.lineTo(g.pacX, g.pacY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (g.readyTimer <= 0 || g.frame % 20 < 15) {
        /* Normal pac-man */
        const pacR = rcs * 0.45;
        let startAngle = 0;

        switch (g.pacDir) {
          case 'right': startAngle = 0; break;
          case 'down': startAngle = Math.PI * 0.5; break;
          case 'left': startAngle = Math.PI; break;
          case 'up': startAngle = Math.PI * 1.5; break;
        }

        ctx.save();
        ctx.fillStyle = C.pacman;
        ctx.shadowColor = C.pacman;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(
          g.pacX, g.pacY, pacR,
          startAngle + g.mouthAngle * Math.PI,
          startAngle + (2 - g.mouthAngle) * Math.PI,
        );
        ctx.lineTo(g.pacX, g.pacY);
        ctx.closePath();
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

      /* ── HUD ── */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);

      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${g.level}`, w / 2, 30);

      /* Lives as pac-man icons */
      for (let i = 0; i < g.lives; i++) {
        ctx.save();
        ctx.fillStyle = C.pacman;
        ctx.beginPath();
        ctx.arc(28 + i * 26, 60, 8, 0.25 * Math.PI, 1.75 * Math.PI);
        ctx.lineTo(28 + i * 26, 60);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      /* ── Ready prompt ── */
      if (g.readyTimer > 0) {
        ctx.fillStyle = C.score;
        ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
        ctx.fillText('READY!', w / 2, h / 2);
      }

      /* ── Level flash ── */
      if (g.levelFlash > 0) {
        const alpha = Math.min(1, g.levelFlash / 30);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = C.score; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
        ctx.globalAlpha = alpha;
        ctx.fillText(`LEVEL ${g.level + 1}`, w / 2, h / 2);
        ctx.globalAlpha = 1;
      }

      /* Controls hint */
      if (!showTouch.current && !g.over) {
        ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('ARROWS / WASD \u00B7 M MUTE \u00B7 ESC EXIT', w / 2, h - 20);
        ctx.globalAlpha = 1;
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.pacman; ctx.font = 'bold 48px monospace';
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
        <div data-pacman-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-pacman-game], [data-pacman-game] * { cursor: default !important; }`}</style>}
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

/* ── Ghost eyes helper ── */
function drawGhostEyes(ctx: CanvasRenderingContext2D, x: number, y: number, gr: number, dir: Dir) {
  const eyeR = gr * 0.28;
  const pupilR = gr * 0.14;
  const eyeSpacing = gr * 0.35;

  /* Pupil offset based on direction */
  let pdx = 0, pdy = 0;
  const shift = pupilR * 0.6;
  switch (dir) {
    case 'left': pdx = -shift; break;
    case 'right': pdx = shift; break;
    case 'up': pdy = -shift; break;
    case 'down': pdy = shift; break;
  }

  /* Left eye */
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x - eyeSpacing, y, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(x - eyeSpacing + pdx, y + pdy, pupilR, 0, Math.PI * 2);
  ctx.fill();

  /* Right eye */
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + eyeSpacing, y, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(x + eyeSpacing + pdx, y + pdy, pupilR, 0, Math.PI * 2);
  ctx.fill();
}
