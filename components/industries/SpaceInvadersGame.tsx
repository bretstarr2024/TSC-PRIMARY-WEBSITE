'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors (classic arcade palette mapped to TSC brand) ── */
const C = {
  player: '#FF5910',
  bullet: '#FFFFFF',
  enemyTop: '#ED0AD2',    // Sprinkles — commander row
  enemyMid: '#73F5FF',    // Tidal Wave — middle rows
  enemyBot: '#E1FF00',    // Neon Cactus — grunt rows
  ufo: '#FF5910',         // Atomic Tangerine
  shield: '#E1FF00',      // Neon Cactus (classic green-ish)
  ground: '#FF5910',      // Atomic Tangerine ground line
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a1e',          // Deep navy — classic arcade CRT blue-black
};

/* ── Tuning knobs ── */
const ROWS = 5;
const COLS = 11;
const ENEMY_W = 28;
const ENEMY_H = 20;
const ENEMY_GAP_X = 12;
const ENEMY_GAP_Y = 10;
const PLAYER_W = 30;
const PLAYER_H = 16;
const BULLET_W = 3;
const BULLET_H = 10;
const PLAYER_BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 3;
const PLAYER_SPEED = 5;
const MAX_PLAYER_BULLETS = 10;
const SHIELD_COUNT = 4;
const SHIELD_W = 44;
const SHIELD_H = 32;
const SHIELD_PIXEL = 2;
const BASE_MOVE_INTERVAL = 30;
const UFO_SPEED = 2;
const FIRE_COOLDOWN = 8;

/* ── UFO color alternation (same pattern as Asteroids) ── */
const UFO_COLORS = ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2', '#FFBDAE', '#088BA0'];

/* ── UFO shot-counter scoring table (authentic 1978 pattern) ── */
const UFO_SCORE_TABLE = [50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100, 100, 50];

/* ── Dramatic speed curve — authentic Space Invaders feel ── */
function getSpeedInterval(aliveCount: number, level: number): number {
  let base: number;
  if (aliveCount >= 50) base = 20;
  else if (aliveCount >= 40) base = 16;
  else if (aliveCount >= 30) base = 12;
  else if (aliveCount >= 20) base = 8;
  else if (aliveCount >= 15) base = 5;
  else if (aliveCount >= 10) base = 3;
  else if (aliveCount >= 5) base = 2;
  else if (aliveCount >= 3) base = 1;
  else base = 1;
  return Math.max(1, base - Math.min(level - 1, 5));
}

/* High scores */
const HS_KEY = 'tsc-invaders-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ══════════════════════════════════════════════════════
   Sound Engine — Web Audio API retro synth sounds
   ══════════════════════════════════════════════════════ */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private ufoNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

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
    if (this._muted) this.stopUfo();
    return this._muted;
  }

  shoot() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(880, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.1);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.1);
  }

  enemyHit() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(800, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.12);
  }

  playerHit() {
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

  march(step: number, interval?: number) {
    const c = this.ensure();
    if (!c || this._muted) return;
    const freqs = [55, 65, 75, 85];
    const freq = freqs[step % 4];
    const dur = interval ? Math.min(0.12, Math.max(0.03, interval * 0.003)) : 0.05;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }

  ufoSound() {
    const c = this.ensure();
    if (!c || this._muted || this.ufoNodes) return;
    const osc1 = c.createOscillator();
    const osc2 = c.createOscillator();
    const gain = c.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, c.currentTime);
    osc2.frequency.setValueAtTime(126, c.currentTime);
    gain.gain.setValueAtTime(0.06, c.currentTime);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);
    osc1.start();
    osc2.start();
    this.ufoNodes = { osc1, osc2, gain };
  }

  stopUfo() {
    if (this.ufoNodes) {
      try { this.ufoNodes.osc1.stop(); } catch { /* */ }
      try { this.ufoNodes.osc2.stop(); } catch { /* */ }
      this.ufoNodes = null;
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

  dispose() {
    this.stopUfo();
    try { this.ctx?.close(); } catch { /* */ }
    this.ctx = null;
  }
}

/* ── Types ── */
interface Enemy {
  col: number; row: number;
  x: number; y: number;
  alive: boolean;
  type: 0 | 1 | 2;
  animFrame: 0 | 1;
}
interface Bullet { x: number; y: number; vy: number }
interface EnemyBullet extends Bullet { shotType: 'rolling' | 'plunger' | 'squiggly' }
interface Shield { x: number; y: number; pixels: boolean[][] }
interface Ufo { x: number; dir: 1 | -1; points: number; showPts: number; ptsX: number; ptsY: number; color: string }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface HighScore { initials: string; score: number }

interface Game {
  enemies: Enemy[];
  enemyDir: 1 | -1;
  enemyMoveTimer: number;
  enemyMoveInterval: number;
  enemyMoveStep: number;
  enemyDrop: boolean;
  playerX: number;
  playerAlive: boolean;
  playerRespawn: number;
  bullets: Bullet[];
  enemyBullets: EnemyBullet[];
  shields: Shield[];
  ufo: Ufo | null;
  ufoTimer: number;
  sparks: Spark[];
  score: number;
  lives: number;
  level: number;
  shotCount: number;
  plungerCol: number;
  flashTimer: number;
  fireCooldown: number;
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
}

/* ── Helpers ── */
function makeEnemies(canvasW: number, level: number): Enemy[] {
  const enemies: Enemy[] = [];
  const formW = COLS * ENEMY_W + (COLS - 1) * ENEMY_GAP_X;
  const startX = (canvasW - formW) / 2;
  const startY = 80 + Math.min(level - 1, 8) * 14;
  for (let r = 0; r < ROWS; r++) {
    const type: 0 | 1 | 2 = r === 0 ? 0 : r <= 2 ? 1 : 2;
    for (let c = 0; c < COLS; c++) {
      enemies.push({
        col: c, row: r,
        x: startX + c * (ENEMY_W + ENEMY_GAP_X),
        y: startY + r * (ENEMY_H + ENEMY_GAP_Y),
        alive: true,
        type,
        animFrame: 0,
      });
    }
  }
  return enemies;
}

function makeShields(canvasW: number, canvasH: number): Shield[] {
  const shields: Shield[] = [];
  const playerY = canvasH - 40;
  const shieldY = playerY - 70;
  const totalW = SHIELD_COUNT * SHIELD_W + (SHIELD_COUNT - 1) * 40;
  const startX = (canvasW - totalW) / 2;
  const gridCols = Math.floor(SHIELD_W / SHIELD_PIXEL);
  const gridRows = Math.floor(SHIELD_H / SHIELD_PIXEL);

  for (let s = 0; s < SHIELD_COUNT; s++) {
    const pixels: boolean[][] = [];
    const cx = gridCols / 2;
    for (let r = 0; r < gridRows; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < gridCols; c++) {
        const dx = c - cx;
        const distTop = Math.sqrt(dx * dx + r * r);
        let on = distTop < gridCols * 0.7;
        // Carve out bottom-center arch
        if (on && r >= gridRows - 5 && Math.abs(c - cx) < 3) on = false;
        row.push(on);
      }
      pixels.push(row);
    }
    shields.push({
      x: startX + s * (SHIELD_W + 40),
      y: shieldY,
      pixels,
    });
  }
  return shields;
}

function boom(x: number, y: number, n: number, color: string, intense = false): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = intense ? (2 + Math.random() * 5) : (1 + Math.random() * 3);
    const life = intense ? (20 + Math.floor(Math.random() * 30)) : (15 + Math.floor(Math.random() * 20));
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
  } else if (!g.over) {
    btns.push({ id: 'left', x: r * 2, y: h - r * 2.5, r, label: '\u25C0' });
    btns.push({ id: 'right', x: r * 5, y: h - r * 2.5, r, label: '\u25B6' });
    btns.push({ id: 'fire', x: w - r * 2.5, y: h - r * 2.5, r: r * 1.3, label: '\u25CF' });
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

/* ── Sprite drawing ── */
function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, ochoImage?: HTMLImageElement | null) {
  const cx = e.x + ENEMY_W / 2;
  const cy = e.y + ENEMY_H / 2;
  const hw = ENEMY_W / 2;
  const hh = ENEMY_H / 2;
  ctx.save();

  if (e.type === 0) {
    // Commander row — Ocho mascots!
    const imgOk = ochoImage?.complete && ochoImage.naturalWidth > 0;
    if (imgOk) {
      ctx.shadowColor = C.enemyTop;
      ctx.shadowBlur = 8;
      const sz = Math.max(ENEMY_W, ENEMY_H) + 4;
      const bob = e.animFrame === 1 ? -2 : 0;
      ctx.drawImage(ochoImage, cx - sz / 2, cy - sz / 2 + bob, sz, sz);
    } else {
      // Fallback diamond
      ctx.fillStyle = C.enemyTop;
      ctx.shadowColor = C.enemyTop;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(cx, e.y);
      ctx.lineTo(e.x + ENEMY_W, cy);
      ctx.lineTo(cx, e.y + ENEMY_H);
      ctx.lineTo(e.x, cy);
      ctx.closePath();
      ctx.fill();
    }
  } else if (e.type === 1) {
    // Middle — inverted trapezoid with legs
    ctx.fillStyle = C.enemyMid;
    ctx.shadowColor = C.enemyMid;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(e.x + 3, e.y);
    ctx.lineTo(e.x + ENEMY_W - 3, e.y);
    ctx.lineTo(e.x + ENEMY_W, e.y + hh + 2);
    ctx.lineTo(e.x, e.y + hh + 2);
    ctx.closePath();
    ctx.fill();
    // Legs
    ctx.strokeStyle = C.enemyMid;
    ctx.lineWidth = 2;
    if (e.animFrame === 0) {
      ctx.beginPath();
      ctx.moveTo(e.x + 4, e.y + hh + 2);
      ctx.lineTo(e.x + 4, e.y + ENEMY_H);
      ctx.moveTo(e.x + ENEMY_W - 4, e.y + hh + 2);
      ctx.lineTo(e.x + ENEMY_W - 4, e.y + ENEMY_H);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(e.x + 4, e.y + hh + 2);
      ctx.lineTo(e.x - 2, e.y + ENEMY_H);
      ctx.moveTo(e.x + ENEMY_W - 4, e.y + hh + 2);
      ctx.lineTo(e.x + ENEMY_W + 2, e.y + ENEMY_H);
      ctx.stroke();
    }
  } else {
    // Bottom — rounded top with tentacles
    ctx.fillStyle = C.enemyBot;
    ctx.shadowColor = C.enemyBot;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx, e.y + hh - 2, hw, Math.PI, 0);
    ctx.lineTo(e.x + ENEMY_W, e.y + hh + 2);
    ctx.lineTo(e.x, e.y + hh + 2);
    ctx.closePath();
    ctx.fill();
    // Tentacles
    ctx.strokeStyle = C.enemyBot;
    ctx.lineWidth = 1.5;
    const tentY = e.y + hh + 2;
    if (e.animFrame === 0) {
      ctx.beginPath();
      ctx.moveTo(cx - 8, tentY); ctx.lineTo(cx - 8, tentY + 6);
      ctx.moveTo(cx, tentY); ctx.lineTo(cx, tentY + 6);
      ctx.moveTo(cx + 8, tentY); ctx.lineTo(cx + 8, tentY + 6);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 8, tentY); ctx.quadraticCurveTo(cx - 12, tentY + 4, cx - 10, tentY + 6);
      ctx.moveTo(cx, tentY); ctx.lineTo(cx, tentY + 6);
      ctx.moveTo(cx + 8, tentY); ctx.quadraticCurveTo(cx + 12, tentY + 4, cx + 10, tentY + 6);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = C.player;
  ctx.shadowColor = C.player;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x, y - PLAYER_H);
  ctx.lineTo(x + PLAYER_W / 2, y);
  ctx.lineTo(x - PLAYER_W / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawUfo(ctx: CanvasRenderingContext2D, ufo: Ufo) {
  const cx = ufo.x;
  const cy = 50;
  ctx.save();
  ctx.fillStyle = ufo.color;
  ctx.shadowColor = ufo.color;
  ctx.shadowBlur = 10;
  // Saucer body
  ctx.beginPath();
  ctx.ellipse(cx, cy, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Dome
  ctx.beginPath();
  ctx.arc(cx, cy - 5, 8, Math.PI, 0);
  ctx.fill();
  ctx.restore();
  // Show points if recently hit
  if (ufo.showPts > 0) {
    ctx.save();
    ctx.fillStyle = C.score;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, ufo.showPts / 20);
    ctx.fillText(String(ufo.points), ufo.ptsX, ufo.ptsY - (40 - ufo.showPts));
    ctx.restore();
  }
}

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
export function SpaceInvadersGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);
  const sfxRef = useRef<SFX | null>(null);
  const ochoImg = useRef<HTMLImageElement | null>(null);
  const touchActive = useRef<Record<string, boolean>>({});
  const prevTouch = useRef<Record<string, boolean>>({});
  const showTouch = useRef(false);
  const btnsRef = useRef<TBtn[]>([]);
  const bossActive = useRef(false);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((w: number, h: number): Game => ({
    enemies: makeEnemies(w, 1),
    enemyDir: 1,
    enemyMoveTimer: 0,
    enemyMoveInterval: BASE_MOVE_INTERVAL,
    enemyMoveStep: 0,
    enemyDrop: false,
    playerX: w / 2,
    playerAlive: true,
    playerRespawn: 0,
    bullets: [],
    enemyBullets: [],
    shields: makeShields(w, h),
    ufo: null,
    ufoTimer: 1200 + Math.floor(Math.random() * 1200),
    sparks: [],
    score: 0,
    lives: 3,
    level: 1,
    shotCount: 0,
    plungerCol: 0,
    flashTimer: 0,
    fireCooldown: 0,
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

    /* Load ocho mascot for commander row */
    const img = new Image();
    img.src = '/images/ocho-color.png';
    ochoImg.current = img;

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
      if (['ArrowLeft', 'ArrowRight', ' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();

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
              setBossData({ game: 'invaders', score: g.score, initials });
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
    let wasUfo = false;
    /* floating pts display */
    let floatingPts: { x: number; y: number; pts: number; timer: number }[] = [];

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
      const playerY = h - 40;
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
              setBossData({ game: 'invaders', score: g.score, initials });
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
        /* ── Move player ── */
        if (g.playerAlive) {
          if (k.has('arrowleft') || k.has('a') || ta['left']) {
            g.playerX = Math.max(PLAYER_W / 2, g.playerX - PLAYER_SPEED);
          }
          if (k.has('arrowright') || k.has('d') || ta['right']) {
            g.playerX = Math.min(w - PLAYER_W / 2, g.playerX + PLAYER_SPEED);
          }

          /* ── Fire ── */
          if (g.fireCooldown > 0) g.fireCooldown--;
          if ((k.has(' ') || ta['fire']) && g.fireCooldown <= 0 && g.bullets.length < MAX_PLAYER_BULLETS) {
            g.bullets.push({ x: g.playerX, y: playerY - PLAYER_H, vy: -PLAYER_BULLET_SPEED });
            g.fireCooldown = FIRE_COOLDOWN;
            g.shotCount++;
            sfx.shoot();
          }
        }

        /* ── Player respawn ── */
        if (!g.playerAlive) {
          g.playerRespawn--;
          if (g.playerRespawn <= 0) {
            g.playerAlive = true;
            g.playerX = w / 2;
          }
        }

        /* ── Enemy movement ── */
        g.enemyMoveTimer++;
        const aliveCount = g.enemies.filter(e => e.alive).length;
        g.enemyMoveInterval = getSpeedInterval(aliveCount, g.level);

        if (g.enemyMoveTimer >= g.enemyMoveInterval) {
          g.enemyMoveTimer = 0;
          g.enemyMoveStep++;
          sfx.march(g.enemyMoveStep, g.enemyMoveInterval);

          if (g.enemyDrop) {
            // Drop all enemies
            for (const e of g.enemies) {
              if (e.alive) e.y += 20;
            }
            g.enemyDrop = false;
          } else {
            // Move horizontally
            const dx = 4 * g.enemyDir;
            let shouldReverse = false;
            for (const e of g.enemies) {
              if (!e.alive) continue;
              const nx = e.x + dx;
              if (nx < 10 || nx + ENEMY_W > w - 10) {
                shouldReverse = true;
                break;
              }
            }
            if (shouldReverse) {
              g.enemyDir = (g.enemyDir * -1) as 1 | -1;
              g.enemyDrop = true;
            } else {
              for (const e of g.enemies) {
                if (e.alive) {
                  e.x += dx;
                  e.animFrame = (e.animFrame === 0 ? 1 : 0) as 0 | 1;
                }
              }
            }
          }
        }

        /* ── Enemy shooting (3 types: rolling/plunger/squiggly — authentic pattern) ── */
        const maxEnemyBullets = Math.min(3 + g.level, 8);
        const fireChance = Math.max(15, 35 - g.level * 3);
        if (g.enemyBullets.length < maxEnemyBullets && Math.random() * fireChance < 1) {
          const colBottoms: Enemy[] = [];
          for (let c = 0; c < COLS; c++) {
            let bottom: Enemy | null = null;
            for (const e of g.enemies) {
              if (e.alive && e.col === c) {
                if (!bottom || e.row > bottom.row) bottom = e;
              }
            }
            if (bottom) colBottoms.push(bottom);
          }
          if (colBottoms.length > 0) {
            const roll = Math.random();
            let shooter: Enemy;
            let shotType: 'rolling' | 'plunger' | 'squiggly';
            if (roll < 0.4) {
              // Rolling: aimed at player X (most dangerous)
              shooter = colBottoms.reduce((best, e) =>
                Math.abs((e.x + ENEMY_W / 2) - g.playerX) < Math.abs((best.x + ENEMY_W / 2) - g.playerX) ? e : best
              );
              shotType = 'rolling';
            } else if (roll < 0.7) {
              // Plunger: cycling columns
              shooter = colBottoms[g.plungerCol % colBottoms.length];
              g.plungerCol++;
              shotType = 'plunger';
            } else {
              // Squiggly: random column
              shooter = colBottoms[Math.floor(Math.random() * colBottoms.length)];
              shotType = 'squiggly';
            }
            g.enemyBullets.push({
              x: shooter.x + ENEMY_W / 2,
              y: shooter.y + ENEMY_H,
              vy: ENEMY_BULLET_SPEED + Math.min(g.level * 0.3, 2),
              shotType,
            });
          }
        }

        /* ── Move player bullets ── */
        g.bullets = g.bullets.filter(b => {
          b.y += b.vy;
          return b.y > -BULLET_H;
        });

        /* ── Move enemy bullets ── */
        g.enemyBullets = g.enemyBullets.filter(b => {
          b.y += b.vy;
          return b.y < h + BULLET_H;
        });

        /* ── Player bullet → enemy collision ── */
        for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
          const b = g.bullets[bi];
          let hit = false;
          for (const e of g.enemies) {
            if (!e.alive) continue;
            if (b.x >= e.x && b.x <= e.x + ENEMY_W && b.y >= e.y && b.y <= e.y + ENEMY_H) {
              e.alive = false;
              const pts = e.type === 0 ? 30 : e.type === 1 ? 20 : 10;
              g.score += pts;
              const color = e.type === 0 ? C.enemyTop : e.type === 1 ? C.enemyMid : C.enemyBot;
              g.sparks.push(...boom(e.x + ENEMY_W / 2, e.y + ENEMY_H / 2, 12, color));
              g.flashTimer = 3;
              sfx.enemyHit();
              hit = true;
              break;
            }
          }
          if (hit) g.bullets.splice(bi, 1);
        }

        /* ── Player bullet → UFO collision ── */
        if (g.ufo) {
          for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
            const b = g.bullets[bi];
            if (Math.abs(b.x - g.ufo.x) < 20 && b.y < 58 && b.y > 34) {
              g.score += g.ufo.points;
              g.sparks.push(...boom(g.ufo.x, 50, 20, g.ufo.color, true));
              g.shake = 6;
              sfx.enemyHit();
              sfx.stopUfo();
              wasUfo = false;
              floatingPts.push({ x: g.ufo.x, y: 50, pts: g.ufo.points, timer: 40 });
              g.ufo = null;
              g.bullets.splice(bi, 1);
              break;
            }
          }
        }

        /* ── Player bullet → shield collision ── */
        for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
          const b = g.bullets[bi];
          let hitShield = false;
          for (const sh of g.shields) {
            const lx = b.x - sh.x;
            const ly = b.y - sh.y;
            const pc = Math.floor(lx / SHIELD_PIXEL);
            const pr = Math.floor(ly / SHIELD_PIXEL);
            if (pc >= 0 && pc < sh.pixels[0].length && pr >= 0 && pr < sh.pixels.length && sh.pixels[pr][pc]) {
              // Destroy 2x2 area
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  const rr = pr + dr;
                  const cc = pc + dc;
                  if (rr >= 0 && rr < sh.pixels.length && cc >= 0 && cc < sh.pixels[0].length) {
                    sh.pixels[rr][cc] = false;
                  }
                }
              }
              hitShield = true;
              break;
            }
          }
          if (hitShield) g.bullets.splice(bi, 1);
        }

        /* ── Enemy bullet → shield collision ── */
        for (let bi = g.enemyBullets.length - 1; bi >= 0; bi--) {
          const b = g.enemyBullets[bi];
          let hitShield = false;
          for (const sh of g.shields) {
            const lx = b.x - sh.x;
            const ly = b.y - sh.y;
            const pc = Math.floor(lx / SHIELD_PIXEL);
            const pr = Math.floor(ly / SHIELD_PIXEL);
            if (pc >= 0 && pc < sh.pixels[0].length && pr >= 0 && pr < sh.pixels.length && sh.pixels[pr][pc]) {
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  const rr = pr + dr;
                  const cc = pc + dc;
                  if (rr >= 0 && rr < sh.pixels.length && cc >= 0 && cc < sh.pixels[0].length) {
                    sh.pixels[rr][cc] = false;
                  }
                }
              }
              hitShield = true;
              break;
            }
          }
          if (hitShield) g.enemyBullets.splice(bi, 1);
        }

        /* ── Enemy bullet → player collision ── */
        if (g.playerAlive) {
          for (let bi = g.enemyBullets.length - 1; bi >= 0; bi--) {
            const b = g.enemyBullets[bi];
            if (b.x >= g.playerX - PLAYER_W / 2 && b.x <= g.playerX + PLAYER_W / 2 &&
                b.y >= playerY - PLAYER_H && b.y <= playerY) {
              g.enemyBullets.splice(bi, 1);
              g.playerAlive = false;
              g.playerRespawn = 90;
              g.lives--;
              g.shake = 10;
              g.sparks.push(...boom(g.playerX, playerY - PLAYER_H / 2, 20, C.player, true));
              sfx.playerHit();
              if (g.lives <= 0) {
                g.over = true;
                setIsOver(true);
                sfx.stopUfo();
                wasUfo = false;
                const hs = loadHighScores();
                g.highScores = hs;
                g.enteringInitials = qualifiesForHighScore(g.score, hs);
              }
              break;
            }
          }
        }

        /* ── Enemies reaching player level → game over ── */
        for (const e of g.enemies) {
          if (e.alive && e.y + ENEMY_H > playerY - PLAYER_H) {
            g.over = true;
            setIsOver(true);
            sfx.stopUfo();
            wasUfo = false;
            const hs = loadHighScores();
            g.highScores = hs;
            g.enteringInitials = qualifiesForHighScore(g.score, hs);
            break;
          }
        }

        /* ── Enemies passing through shields ── */
        for (const e of g.enemies) {
          if (!e.alive) continue;
          for (const sh of g.shields) {
            if (e.x + ENEMY_W > sh.x && e.x < sh.x + SHIELD_W &&
                e.y + ENEMY_H > sh.y && e.y < sh.y + SHIELD_H) {
              // Destroy pixels in the overlap area
              const startC = Math.max(0, Math.floor((e.x - sh.x) / SHIELD_PIXEL));
              const endC = Math.min(sh.pixels[0].length - 1, Math.floor((e.x + ENEMY_W - sh.x) / SHIELD_PIXEL));
              const startR = Math.max(0, Math.floor((e.y - sh.y) / SHIELD_PIXEL));
              const endR = Math.min(sh.pixels.length - 1, Math.floor((e.y + ENEMY_H - sh.y) / SHIELD_PIXEL));
              for (let r = startR; r <= endR; r++) {
                for (let c = startC; c <= endC; c++) {
                  sh.pixels[r][c] = false;
                }
              }
            }
          }
        }

        /* ── UFO logic ── */
        if (!g.ufo) {
          g.ufoTimer--;
          if (g.ufoTimer <= 0) {
            const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
            const pts = UFO_SCORE_TABLE[g.shotCount % 16];
            g.ufo = {
              x: dir === 1 ? -20 : w + 20,
              dir,
              points: pts,
              showPts: 0,
              ptsX: 0,
              ptsY: 0,
              color: UFO_COLORS[Math.floor(Math.random() * UFO_COLORS.length)],
            };
            sfx.ufoSound();
            wasUfo = true;
          }
        } else {
          g.ufo.x += UFO_SPEED * g.ufo.dir;
          if ((g.ufo.dir === 1 && g.ufo.x > w + 30) || (g.ufo.dir === -1 && g.ufo.x < -30)) {
            g.ufo = null;
            sfx.stopUfo();
            wasUfo = false;
            g.ufoTimer = 1200 + Math.floor(Math.random() * 1200);
          }
        }

        /* ── All enemies cleared → next level ── */
        if (g.enemies.every(e => !e.alive)) {
          g.level++;
          g.levelFlash = 90;
          sfx.stopUfo();
          wasUfo = false;
          sfx.levelUp();
        }
      }

      /* ── Level transition ── */
      if (g.levelFlash > 0) {
        g.levelFlash--;
        if (g.levelFlash <= 0) {
          g.enemies = makeEnemies(w, g.level);
          g.enemyDir = 1;
          g.enemyMoveTimer = 0;
          g.enemyMoveStep = 0;
          g.enemyDrop = false;
          g.bullets = [];
          g.enemyBullets = [];
          // Partially repair shields (75% of destroyed pixels restored — progressive degradation)
          const gridCols = Math.floor(SHIELD_W / SHIELD_PIXEL);
          const gridRows = Math.floor(SHIELD_H / SHIELD_PIXEL);
          const cx = gridCols / 2;
          for (const sh of g.shields) {
            for (let r = 0; r < gridRows; r++) {
              for (let c = 0; c < gridCols; c++) {
                if (!sh.pixels[r][c]) {
                  const dx = c - cx;
                  const distTop = Math.sqrt(dx * dx + r * r);
                  const shouldExist = distTop < gridCols * 0.7 && !(r >= gridRows - 5 && Math.abs(c - cx) < 3);
                  if (shouldExist && Math.random() < 0.75) {
                    sh.pixels[r][c] = true;
                  }
                }
              }
            }
          }
          g.ufo = null;
          g.ufoTimer = 1200 + Math.floor(Math.random() * 1200);
          g.playerAlive = true;
          g.playerX = w / 2;
        }
      }

      /* ── Sparks ── */
      g.sparks = g.sparks.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97;
        return --p.life > 0;
      });

      /* ── Floating points ── */
      floatingPts = floatingPts.filter(fp => {
        fp.timer--;
        return fp.timer > 0;
      });

      /* ── Sound management ── */
      if (g.over && !wasOver) { sfx.gameOver(); wasOver = true; }
      if (!g.over) wasOver = false;

      // UFO sound management
      if (g.ufo && !wasUfo && !g.over) {
        sfx.ufoSound();
        wasUfo = true;
      }
      if (!g.ufo && wasUfo) {
        sfx.stopUfo();
        wasUfo = false;
      }

      /* ── Shake decay ── */
      if (g.shake > 0) {
        g.shake *= 0.85;
        if (g.shake < 0.5) g.shake = 0;
      }

      /* ── Flash timer decay ── */
      if (g.flashTimer > 0) g.flashTimer--;

      if (g.over) g.overTimer++;

      /* ═══════════════════════════════════
         RENDER
         ═══════════════════════════════════ */
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);

      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* ── Kill flash ── */
      if (g.flashTimer > 0) {
        ctx.fillStyle = `rgba(255,255,255,${g.flashTimer * 0.03})`;
        ctx.fillRect(0, 0, w, h);
      }

      /* ── Scanlines ── */
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.restore();

      /* ── Shields ── */
      for (const sh of g.shields) {
        ctx.save();
        ctx.shadowColor = C.shield;
        ctx.shadowBlur = 4;
        ctx.fillStyle = C.shield;
        for (let r = 0; r < sh.pixels.length; r++) {
          for (let c = 0; c < sh.pixels[r].length; c++) {
            if (sh.pixels[r][c]) {
              ctx.fillRect(sh.x + c * SHIELD_PIXEL, sh.y + r * SHIELD_PIXEL, SHIELD_PIXEL, SHIELD_PIXEL);
            }
          }
        }
        ctx.restore();
      }

      /* ── Enemies ── */
      for (const e of g.enemies) {
        if (!e.alive) continue;
        drawEnemy(ctx, e, ochoImg.current);
      }

      /* ── UFO ── */
      if (g.ufo) {
        drawUfo(ctx, g.ufo);
      }

      /* ── Player ── */
      if (g.playerAlive && !g.over) {
        // Blink during respawn protection would go here, but we only hide when dead
        drawPlayer(ctx, g.playerX, playerY);
      } else if (!g.playerAlive && !g.over) {
        // Blinking respawn indicator
        if (Math.floor(g.frame / 8) % 2 === 0) {
          ctx.save();
          ctx.globalAlpha = 0.3;
          drawPlayer(ctx, g.playerX, playerY);
          ctx.restore();
        }
      }

      /* ── Player bullets ── */
      ctx.fillStyle = C.bullet;
      for (const b of g.bullets) {
        ctx.fillRect(b.x - BULLET_W / 2, b.y - BULLET_H / 2, BULLET_W, BULLET_H);
      }

      /* ── Enemy bullets (visually distinct by type) ── */
      for (const b of g.enemyBullets) {
        ctx.save();
        if (b.shotType === 'rolling') {
          ctx.fillStyle = '#FF5910';
          ctx.shadowColor = '#FF5910';
          ctx.shadowBlur = 6;
          const zigX = Math.sin(b.y * 0.3) * 2;
          ctx.fillRect(b.x - BULLET_W / 2 + zigX, b.y - BULLET_H / 2, BULLET_W, BULLET_H);
        } else if (b.shotType === 'plunger') {
          ctx.fillStyle = '#ED0AD2';
          ctx.shadowColor = '#ED0AD2';
          ctx.shadowBlur = 4;
          ctx.fillRect(b.x - 1, b.y - 5, 2, 10);
          ctx.fillRect(b.x - 3, b.y - 1, 6, 2);
        } else {
          ctx.fillStyle = '#73F5FF';
          ctx.shadowColor = '#73F5FF';
          ctx.shadowBlur = 4;
          const squigX = Math.sin(b.y * 0.5) * 3;
          ctx.fillRect(b.x - BULLET_W / 2 + squigX, b.y - BULLET_H / 2, BULLET_W, BULLET_H);
        }
        ctx.restore();
      }

      /* ── Sparks ── */
      for (const p of g.sparks) {
        const t = p.life / p.max;
        ctx.globalAlpha = t;
        ctx.fillStyle = p.color;
        const size = 1 + t * 3;
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Floating points ── */
      for (const fp of floatingPts) {
        ctx.save();
        ctx.fillStyle = C.score;
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, fp.timer / 20);
        ctx.fillText(String(fp.pts), fp.x, fp.y - (40 - fp.timer));
        ctx.restore();
      }

      /* ── Ground line (classic arcade) ── */
      ctx.save();
      ctx.strokeStyle = C.ground;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, playerY + 8);
      ctx.lineTo(w, playerY + 8);
      ctx.stroke();
      ctx.restore();

      /* ── HUD ── */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);

      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${g.level}`, w / 2, 30);

      /* Lives as player icons */
      for (let i = 0; i < g.lives; i++) {
        const lx = 28 + i * 28;
        const ly = 65;
        ctx.save();
        ctx.fillStyle = C.player;
        ctx.beginPath();
        ctx.moveTo(lx, ly - 6);
        ctx.lineTo(lx + 6, ly + 4);
        ctx.lineTo(lx - 6, ly + 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      /* ── Ready prompt ── */
      if (g.playerAlive && !g.over && g.levelFlash <= 0 && g.frame < 120) {
        ctx.fillStyle = C.ui;
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(g.frame * 0.06);
        ctx.font = '16px monospace'; ctx.textAlign = 'center';
        ctx.fillText(
          showTouch.current ? 'USE BUTTONS TO MOVE & FIRE' : 'ARROWS + SPACE TO FIRE \u00B7 M MUTE',
          w / 2, playerY - 60,
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
        ctx.fillText('ARROWS / WASD \u00B7 SPACE FIRE \u00B7 M MUTE \u00B7 ESC EXIT', w / 2, h - 20);
        ctx.globalAlpha = 1;
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.player; ctx.font = 'bold 48px monospace';
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
        <div data-invaders-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-invaders-game], [data-invaders-game] * { cursor: default !important; }`}</style>}
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
