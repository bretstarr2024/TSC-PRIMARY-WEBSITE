'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  snake: '#E1FF00', snakeHead: '#FF5910', food: '#ED0AD2', bonus: '#73F5FF',
  ui: '#d1d1c6', bg: '#0a0a0a', grid: 'rgba(225, 255, 0, 0.04)', score: '#E1FF00',
};
const AI_COLORS = ['#FF3333', '#73F5FF', '#ED0AD2', '#FFA500', '#00FF88'];
type AIBehavior = 'hunter' | 'forager' | 'aggressive';
const AI_BEHAVIORS: AIBehavior[] = ['hunter', 'forager', 'aggressive', 'hunter', 'aggressive'];

/* ── Tuning ── */
const BASE_TICK = 100;
const AI_BASE_TICK = 120;
const INVULN_TICKS = 40;
const WAVE_PAUSE = 90;
const FOOD_COUNT = 6;
const POWERUP_INTERVAL = 250;
const POWERUP_LIFE = 150;
const GHOST_DURATION = 120;
const BOOST_COST_INTERVAL = 20;
const MIN_SNAKE_LEN = 3;
const SHRINK_INTERVAL = 500;
const MIN_ARENA_W = 16;
const MIN_ARENA_H = 12;
const HS_KEY = 'tsc-snake-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ── SFX ── */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private ensure(): AudioContext | null {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  get muted() { return this._muted; }
  toggle(): boolean { this._muted = !this._muted; return this._muted; }

  eat() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(600, c.currentTime); o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.08);
  }
  crash() {
    const c = this.ensure(); if (!c || this._muted) return;
    const dur = 0.5, len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); g.gain.setValueAtTime(0.25, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(600, c.currentTime); f.frequency.exponentialRampToValueAtTime(100, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination); src.start(); src.stop(c.currentTime + dur);
  }
  kill() {
    const c = this.ensure(); if (!c || this._muted) return;
    const dur = 0.3, len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(200, c.currentTime); f.frequency.exponentialRampToValueAtTime(100, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination); src.start(); src.stop(c.currentTime + dur);
    const o = c.createOscillator(), g2 = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(200, c.currentTime); o.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.15);
    g2.gain.setValueAtTime(0.1, c.currentTime); g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.connect(g2).connect(c.destination); o.start(); o.stop(c.currentTime + 0.15);
  }
  boost() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(80, c.currentTime);
    g.gain.setValueAtTime(0.08, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.04);
  }
  shieldHit() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(800, c.currentTime);
    g.gain.setValueAtTime(0.15, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.2);
  }
  lightning() {
    const c = this.ensure(); if (!c || this._muted) return;
    const dur = 0.3, len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(2000, c.currentTime); f.frequency.exponentialRampToValueAtTime(200, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination); src.start(); src.stop(c.currentTime + dur);
  }
  powerUp() {
    const c = this.ensure(); if (!c || this._muted) return;
    [800, 1000, 1200, 1600].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(freq, c.currentTime + i * 0.04);
      g.gain.setValueAtTime(0.1, c.currentTime + i * 0.04); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.04 + 0.08);
      o.connect(g).connect(c.destination); o.start(c.currentTime + i * 0.04); o.stop(c.currentTime + i * 0.04 + 0.08);
    });
  }
  waveClear() {
    const c = this.ensure(); if (!c || this._muted) return;
    [440, 554, 659, 880].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(freq, c.currentTime + i * 0.1);
      g.gain.setValueAtTime(0.1, c.currentTime + i * 0.1); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.15);
      o.connect(g).connect(c.destination); o.start(c.currentTime + i * 0.1); o.stop(c.currentTime + i * 0.1 + 0.15);
    });
  }
  waveStart() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(100, c.currentTime); o.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.3);
    g.gain.setValueAtTime(0.1, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.3);
  }
  gameOver() {
    const c = this.ensure(); if (!c || this._muted) return;
    [440, 370, 311, 220].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(freq, c.currentTime + i * 0.2);
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.2); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.2 + 0.25);
      o.connect(g).connect(c.destination); o.start(c.currentTime + i * 0.2); o.stop(c.currentTime + i * 0.2 + 0.25);
    });
  }
  dispose() { try { this.ctx?.close(); } catch { /* */ } this.ctx = null; }
}

/* ── Types ── */
type Dir = 'up' | 'down' | 'left' | 'right';
interface Pt { x: number; y: number }
interface Snake { segs: Pt[]; dir: Dir; alive: boolean; color: string; behavior: AIBehavior; tickInterval: number; lastTick: number }
interface Food { x: number; y: number; color: string; value: number; glow: boolean }
type PwrType = 'shield' | 'ghost' | 'lightning';
interface PowerUp { x: number; y: number; type: PwrType; ttl: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface FloatingText { x: number; y: number; text: string; color: string; life: number; max: number }
interface HighScore { initials: string; score: number }

interface Game {
  player: Pt[]; dir: Dir; pendingDir: Dir | null;
  ais: Snake[];
  foods: Food[]; powerUp: PowerUp | null; powerUpTimer: number;
  gridW: number; gridH: number; cellSize: number;
  borderShrink: number; shrinkTimer: number;
  score: number; wave: number; kills: number; tick: number; frame: number;
  shield: boolean; ghostTicks: number;
  boosting: boolean; boostCostTimer: number; boostStarted: boolean;
  invuln: number; wavePause: number; waveCleared: boolean;
  over: boolean; overTimer: number; shake: number;
  sparks: Spark[]; floats: FloatingText[];
  enteringInitials: boolean; initialsChars: number[]; initialsPos: number;
  highScores: HighScore[]; scoreSubmitted: boolean; scoreIndex: number;
}

/* ── Helpers ── */
const opposite: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const dirVec: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const DIRS: Dir[] = ['up', 'down', 'left', 'right'];

function boom(x: number, y: number, n: number, color: string): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 3, life = 15 + Math.floor(Math.random() * 20);
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, color };
  });
}

function manhattan(a: Pt, b: Pt) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }

function inBounds(p: Pt, shrink: number, gw: number, gh: number) {
  return p.x >= shrink && p.x < gw - shrink && p.y >= shrink && p.y < gh - shrink;
}

function cellOccupied(x: number, y: number, player: Pt[], ais: Snake[], foods: Food[]): boolean {
  for (const p of player) if (p.x === x && p.y === y) return true;
  for (const ai of ais) { if (!ai.alive) continue; for (const s of ai.segs) if (s.x === x && s.y === y) return true; }
  for (const f of foods) if (f.x === x && f.y === y) return true;
  return false;
}

function findEmpty(shrink: number, gw: number, gh: number, player: Pt[], ais: Snake[], foods: Food[]): Pt | null {
  for (let i = 0; i < 500; i++) {
    const x = shrink + Math.floor(Math.random() * (gw - shrink * 2));
    const y = shrink + Math.floor(Math.random() * (gh - shrink * 2));
    if (!cellOccupied(x, y, player, ais, foods)) return { x, y };
  }
  return null;
}

function placeFood(g: Game, color: string, value: number, glow: boolean) {
  const pt = findEmpty(g.borderShrink, g.gridW, g.gridH, g.player, g.ais, g.foods);
  if (pt) g.foods.push({ ...pt, color, value, glow });
}

function spawnAI(g: Game, index: number): Snake {
  const edges: Pt[] = [];
  const s = g.borderShrink;
  for (let x = s + 2; x < g.gridW - s - 2; x++) { edges.push({ x, y: s + 1 }); edges.push({ x, y: g.gridH - s - 2 }); }
  for (let y = s + 2; y < g.gridH - s - 2; y++) { edges.push({ x: s + 1, y }); edges.push({ x: g.gridW - s - 2, y }); }
  const shuffled = edges.sort(() => Math.random() - 0.5);
  let head = shuffled[0] || { x: Math.floor(g.gridW / 2), y: s + 1 };
  for (const e of shuffled) {
    if (!cellOccupied(e.x, e.y, g.player, g.ais, [])) { head = e; break; }
  }
  const dir: Dir = head.y <= s + 2 ? 'down' : head.y >= g.gridH - s - 3 ? 'up' : head.x <= s + 2 ? 'right' : 'left';
  const v = dirVec[opposite[dir]];
  const segs: Pt[] = [];
  for (let i = 0; i < 4; i++) segs.push({ x: head.x + v.x * i, y: head.y + v.y * i });
  const aiTick = Math.max(70, AI_BASE_TICK - (g.wave - 1) * 5);
  return { segs, dir, alive: true, color: AI_COLORS[index % AI_COLORS.length], behavior: AI_BEHAVIORS[index % AI_BEHAVIORS.length], tickInterval: aiTick, lastTick: 0 };
}

function initWave(g: Game) {
  g.wave++; g.invuln = INVULN_TICKS;
  const aiCount = Math.min(2 + g.wave, 6);
  g.ais = [];
  for (let i = 0; i < aiCount; i++) g.ais.push(spawnAI(g, i));
  while (g.foods.length < FOOD_COUNT) placeFood(g, C.food, 10 * g.wave, false);
  g.powerUp = null; g.powerUpTimer = POWERUP_INTERVAL;
}

function loadHighScores(): HighScore[] {
  try { const r = localStorage.getItem(HS_KEY); return r ? JSON.parse(r) as HighScore[] : []; } catch { return []; }
}
function saveHighScores(s: HighScore[]) { try { localStorage.setItem(HS_KEY, JSON.stringify(s.slice(0, HS_MAX))); } catch { /* */ } }
function qualifiesForHighScore(score: number, scores: HighScore[]) {
  if (score <= 0) return false;
  return scores.length < HS_MAX || score > scores[scores.length - 1].score;
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
      const cy = h * 0.68, sp = r * 2.5;
      btns.push({ id: 'left', x: w / 2 - sp * 2, y: cy, r, label: '\u25C0' });
      btns.push({ id: 'up', x: w / 2 - sp, y: cy, r, label: '\u25B2' });
      btns.push({ id: 'confirm', x: w / 2, y: cy, r: r * 1.15, label: '\u2713' });
      btns.push({ id: 'down', x: w / 2 + sp, y: cy, r, label: '\u25BC' });
      btns.push({ id: 'right', x: w / 2 + sp * 2, y: cy, r, label: '\u25B6' });
    } else {
      btns.push({ id: 'restart', x: w / 2, y: h * 0.82, r: r * 1.4, label: '\u25B6' });
    }
  } else if (!g.over) {
    const cx = w * 0.3, cy = h - r * 4;
    btns.push({ id: 'dup', x: cx, y: cy - r * 2.2, r, label: '\u25B2' });
    btns.push({ id: 'ddown', x: cx, y: cy + r * 2.2, r, label: '\u25BC' });
    btns.push({ id: 'dleft', x: cx - r * 2.2, y: cy, r, label: '\u25C0' });
    btns.push({ id: 'dright', x: cx + r * 2.2, y: cy, r, label: '\u25B6' });
    btns.push({ id: 'boost', x: w * 0.75, y: cy, r: r * 1.1, label: '\u26A1' });
  }
  return btns;
}

function drawBtn(ctx: CanvasRenderingContext2D, b: TBtn, active: boolean, sfxMuted: boolean) {
  ctx.save(); ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = active ? 'rgba(255,89,16,0.25)' : 'rgba(20,18,19,0.55)'; ctx.fill();
  ctx.strokeStyle = active ? 'rgba(255,89,16,0.9)' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = active ? '#FF5910' : 'rgba(255,255,255,0.65)';
  ctx.font = `bold ${Math.round(b.r * 0.65)}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(b.label, b.x, b.y + 1);
  if (b.id === 'mute' && sfxMuted) {
    ctx.strokeStyle = '#FF5910'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(b.x - b.r * 0.55, b.y - b.r * 0.55); ctx.lineTo(b.x + b.r * 0.55, b.y + b.r * 0.55); ctx.stroke();
  }
  ctx.restore();
}

/* ── Component ── */
export function SnakeGame({ onClose }: { onClose: () => void }) {
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
  const lastPlayerTick = useRef(0);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((sw: number, sh: number): Game => {
    const cellSize = Math.max(16, Math.min(Math.floor(sw / 42), Math.floor(sh / 32)));
    const gridW = Math.min(40, Math.floor(sw / cellSize));
    const gridH = Math.min(30, Math.floor(sh / cellSize));
    const cx = Math.floor(gridW / 2), cy = Math.floor(gridH / 2);
    const player: Pt[] = [];
    for (let i = 0; i < 5; i++) player.push({ x: cx - i, y: cy });
    const g: Game = {
      player, dir: 'right', pendingDir: null,
      ais: [], foods: [], powerUp: null, powerUpTimer: POWERUP_INTERVAL,
      gridW, gridH, cellSize, borderShrink: 0, shrinkTimer: SHRINK_INTERVAL,
      score: 0, wave: 0, kills: 0, tick: 0, frame: 0,
      shield: false, ghostTicks: 0, boosting: false, boostCostTimer: 0, boostStarted: false,
      invuln: INVULN_TICKS, wavePause: 0, waveCleared: false,
      over: false, overTimer: 0, shake: 0,
      sparks: [], floats: [],
      enteringInitials: false, initialsChars: [0, 0, 0], initialsPos: 0,
      highScores: [], scoreSubmitted: false, scoreIndex: -1,
    };
    initWave(g);
    return g;
  }, []);

  useEffect(() => {
    const el = cvs.current; if (!el) return;
    const ctx = el.getContext('2d'); if (!ctx) return;
    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const sfx = new SFX(); sfxRef.current = sfx;
    game.current = init(el.width, el.height);
    lastPlayerTick.current = performance.now();

    /* Touch */
    function updateTouchState(e: TouchEvent) {
      const state: Record<string, boolean> = {};
      for (let t = 0; t < e.touches.length; t++) {
        const tx = e.touches[t].clientX, ty = e.touches[t].clientY;
        for (const btn of btnsRef.current) { if (Math.hypot(tx - btn.x, ty - btn.y) < btn.r * 1.5) state[btn.id] = true; }
      }
      touchActive.current = state;
    }
    const onTS = (e: TouchEvent) => { e.preventDefault(); showTouch.current = true; updateTouchState(e); };
    const onTE = (e: TouchEvent) => { e.preventDefault(); updateTouchState(e); };
    el.addEventListener('touchstart', onTS, { passive: false });
    el.addEventListener('touchmove', onTS, { passive: false });
    el.addEventListener('touchend', onTE, { passive: false });
    el.addEventListener('touchcancel', onTE, { passive: false });

    /* Keyboard */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      const g = game.current; if (!g) return;
      if (g.over) {
        if (g.overTimer < 40) return;
        if (g.enteringInitials) {
          if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.initialsPos = Math.max(0, g.initialsPos - 1);
          else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.initialsPos = Math.min(2, g.initialsPos + 1);
          else if (e.key === 'Enter') submitInitials(g);
          else if (/^[a-zA-Z]$/.test(e.key)) { g.initialsChars[g.initialsPos] = e.key.toUpperCase().charCodeAt(0) - 65; if (g.initialsPos < 2) g.initialsPos++; }
          return;
        }
        if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
        if (e.key === 'Enter') { keys.current.clear(); game.current = init(el.width, el.height); lastPlayerTick.current = performance.now(); setIsOver(false); }
        return;
      }
      if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
      let nd: Dir | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') nd = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') nd = 'down';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') nd = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') nd = 'right';
      if (nd && nd !== opposite[g.dir]) g.pendingDir = nd;
      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    function submitInitials(g: Game) {
      const initials = g.initialsChars.map(i => ABC[i]).join('');
      const entry: HighScore = { initials, score: g.score };
      const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
      saveHighScores(scores); g.highScores = scores; g.scoreIndex = scores.indexOf(entry);
      g.enteringInitials = false; g.scoreSubmitted = true;
      if (g.scoreIndex === 0) { bossActive.current = true; setBossData({ game: 'snake', score: g.score, initials }); }
    }

    function startWave(g: Game) {
      initWave(g);
      sfx.waveStart();
    }

    function killSnake(segs: Pt[], color: string, g: Game, ox: number, oy: number, cs: number) {
      const hx = ox + segs[0].x * cs + cs / 2, hy = oy + segs[0].y * cs + cs / 2;
      g.sparks.push(...boom(hx, hy, 25, color)); g.shake = 12;
      for (let i = 1; i < segs.length; i += 2) {
        g.foods.push({ x: segs[i].x, y: segs[i].y, color, value: 5 * g.wave, glow: true });
      }
    }

    function aiDecide(ai: Snake, g: Game) {
      const head = ai.segs[0];
      let bestDir = ai.dir, bestScore = -99999;
      for (const d of DIRS) {
        if (d === opposite[ai.dir]) continue;
        const v = dirVec[d];
        const nx = head.x + v.x, ny = head.y + v.y;
        if (!inBounds({ x: nx, y: ny }, g.borderShrink, g.gridW, g.gridH)) { continue; }
        let blocked = false;
        for (const s of g.player) if (s.x === nx && s.y === ny) { blocked = true; break; }
        if (!blocked) for (const other of g.ais) { if (!other.alive) continue; for (const s of other.segs) if (s.x === nx && s.y === ny) { blocked = true; break; } if (blocked) break; }
        if (blocked) continue;
        let exits = 0;
        for (const d2 of DIRS) {
          const ex = nx + dirVec[d2].x, ey = ny + dirVec[d2].y;
          if (!inBounds({ x: ex, y: ey }, g.borderShrink, g.gridW, g.gridH)) continue;
          let free = true;
          for (const s of g.player) if (s.x === ex && s.y === ey) { free = false; break; }
          if (free) for (const other of g.ais) { if (!other.alive) continue; for (const s of other.segs) if (s.x === ex && s.y === ey) { free = false; break; } if (!free) break; }
          if (free) exits++;
        }
        if (exits === 0) { if (bestScore < -4000) { bestScore = -4000; bestDir = d; } continue; }
        let sc = exits * 15;
        let target: Pt = g.player[0];
        if (ai.behavior === 'forager') {
          let best = Infinity;
          for (const f of g.foods) { const dd = manhattan(head, f); if (dd < best) { best = dd; target = f; } }
        } else if (ai.behavior === 'aggressive') {
          let best = Infinity;
          const allHeads: Pt[] = [g.player[0]];
          for (const o of g.ais) if (o !== ai && o.alive) allHeads.push(o.segs[0]);
          for (const h of allHeads) { const dd = manhattan(head, h); if (dd < best) { best = dd; target = h; } }
        }
        const oldD = manhattan(head, target), newD = manhattan({ x: nx, y: ny }, target);
        sc += (oldD - newD) * 10;
        const bDist = Math.min(nx - g.borderShrink, g.gridW - g.borderShrink - 1 - nx, ny - g.borderShrink, g.gridH - g.borderShrink - 1 - ny);
        if (bDist <= 2) sc -= (3 - bDist) * 8;
        sc += Math.random() * 8;
        if (sc > bestScore) { bestScore = sc; bestDir = d; }
      }
      ai.dir = bestDir;
    }

    let wasOver = false;

    /* ═══ GAME LOOP ═══ */
    const loop = (now: number) => {
      const g = game.current; if (!g) return;
      const w = el.width, h = el.height;
      const ta = touchActive.current;
      g.frame++;
      const justTouched = (id: string): boolean => !!ta[id] && !prevTouch.current[id];
      if (showTouch.current) btnsRef.current = calcButtons(w, h, g);

      /* Touch game-over input */
      if (g.over && g.overTimer >= 40 && showTouch.current) {
        if (g.enteringInitials) {
          if (justTouched('up')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          if (justTouched('down')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          if (justTouched('left')) g.initialsPos = Math.max(0, g.initialsPos - 1);
          if (justTouched('right')) g.initialsPos = Math.min(2, g.initialsPos + 1);
          if (justTouched('confirm')) submitInitials(g);
        } else if (justTouched('restart')) {
          game.current = init(el.width, el.height); lastPlayerTick.current = performance.now(); setIsOver(false);
          prevTouch.current = { ...ta }; raf.current = requestAnimationFrame(loop); return;
        }
      }
      if (!g.over && showTouch.current) {
        let nd: Dir | null = null;
        if (justTouched('dup')) nd = 'up'; else if (justTouched('ddown')) nd = 'down';
        else if (justTouched('dleft')) nd = 'left'; else if (justTouched('dright')) nd = 'right';
        if (nd && nd !== opposite[g.dir]) g.pendingDir = nd;
      }
      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      const cs = g.cellSize;
      const gridPxW = g.gridW * cs, gridPxH = g.gridH * cs;
      const ox = Math.floor((w - gridPxW) / 2), oy = Math.floor((h - gridPxH) / 2);

      /* Boost check */
      const boostPressed = keys.current.has(' ') || !!ta.boost;
      if (!g.over && !g.wavePause) {
        g.boosting = boostPressed && g.player.length > MIN_SNAKE_LEN;
        if (g.boosting && !g.boostStarted) { sfx.boost(); g.boostStarted = true; }
        if (!g.boosting) g.boostStarted = false;
      }

      /* ═══ GAME LOGIC ═══ */
      if (!g.over) {
        if (g.wavePause > 0) { g.wavePause--; if (g.wavePause <= 0) startWave(g); }
        else {
          const playerInterval = g.boosting ? BASE_TICK / 2 : BASE_TICK;
          const pdt = now - lastPlayerTick.current;

          /* Player tick */
          if (pdt >= playerInterval) {
            lastPlayerTick.current = now;
            g.tick++;
            if (g.pendingDir) { g.dir = g.pendingDir; g.pendingDir = null; }
            if (g.invuln > 0) g.invuln--;

            /* Boost cost */
            if (g.boosting) {
              g.boostCostTimer++;
              if (g.boostCostTimer >= BOOST_COST_INTERVAL) { g.boostCostTimer = 0; if (g.player.length > MIN_SNAKE_LEN) g.player.pop(); }
            } else { g.boostCostTimer = 0; }

            /* Ghost decay */
            if (g.ghostTicks > 0) g.ghostTicks--;

            /* Border shrink */
            if (g.wave >= 2) {
              g.shrinkTimer--;
              if (g.shrinkTimer <= 0) {
                const safeW = g.gridW - g.borderShrink * 2, safeH = g.gridH - g.borderShrink * 2;
                if (safeW > MIN_ARENA_W && safeH > MIN_ARENA_H) g.borderShrink++;
                g.shrinkTimer = SHRINK_INTERVAL;
              }
            }

            /* Move player */
            const head = g.player[0], v = dirVec[g.dir];
            const nx = head.x + v.x, ny = head.y + v.y;

            if (!inBounds({ x: nx, y: ny }, g.borderShrink, g.gridW, g.gridH)) {
              if (g.shield) { g.shield = false; sfx.shieldHit(); g.floats.push({ x: ox + head.x * cs + cs / 2, y: oy + head.y * cs, text: 'SHIELD!', color: '#FFD700', life: 40, max: 40 }); }
              else { playerDie(g); }
            } else {
              let hitBody = false;
              for (let i = 1; i < g.player.length; i++) if (g.player[i].x === nx && g.player[i].y === ny) { hitBody = true; break; }
              if (!hitBody && g.ghostTicks <= 0) {
                for (const ai of g.ais) { if (!ai.alive) continue; for (const s of ai.segs) if (s.x === nx && s.y === ny) { hitBody = true; break; } if (hitBody) break; }
              }
              if (hitBody) {
                if (g.shield) { g.shield = false; sfx.shieldHit(); g.floats.push({ x: ox + head.x * cs + cs / 2, y: oy + head.y * cs, text: 'SHIELD!', color: '#FFD700', life: 40, max: 40 }); }
                else if (g.invuln <= 0) { playerDie(g); }
                else { g.player.unshift({ x: nx, y: ny }); g.player.pop(); }
              } else {
                g.player.unshift({ x: nx, y: ny });
                let ate = false;
                const fi = g.foods.findIndex(f => f.x === nx && f.y === ny);
                if (fi >= 0) {
                  const food = g.foods[fi]; g.foods.splice(fi, 1);
                  g.score += food.value; ate = true; sfx.eat();
                  g.sparks.push(...boom(ox + nx * cs + cs / 2, oy + ny * cs + cs / 2, 8, food.color));
                  g.floats.push({ x: ox + nx * cs + cs / 2, y: oy + ny * cs, text: `+${food.value}`, color: food.color, life: 35, max: 35 });
                }
                /* Power-up pickup */
                if (g.powerUp && g.powerUp.x === nx && g.powerUp.y === ny) {
                  const pu = g.powerUp; g.powerUp = null; g.score += 25; sfx.powerUp(); ate = true;
                  if (pu.type === 'shield') { g.shield = true; g.floats.push({ x: ox + nx * cs + cs / 2, y: oy + ny * cs, text: 'SHIELD', color: '#FFD700', life: 40, max: 40 }); }
                  else if (pu.type === 'ghost') { g.ghostTicks = GHOST_DURATION; g.floats.push({ x: ox + nx * cs + cs / 2, y: oy + ny * cs, text: 'GHOST', color: '#FFFFFF', life: 40, max: 40 }); }
                  else if (pu.type === 'lightning') {
                    let nearest: Snake | null = null, best = Infinity;
                    for (const ai of g.ais) { if (!ai.alive) continue; const d = manhattan(g.player[0], ai.segs[0]); if (d < best) { best = d; nearest = ai; } }
                    if (nearest) { nearest.alive = false; killSnake(nearest.segs, nearest.color, g, ox, oy, cs); g.kills++; g.score += 100 * g.wave; sfx.lightning();
                      g.floats.push({ x: ox + nearest.segs[0].x * cs + cs / 2, y: oy + nearest.segs[0].y * cs, text: `+${100 * g.wave}`, color: '#FFFF00', life: 40, max: 40 }); }
                    else sfx.lightning();
                  }
                }
                if (!ate) g.player.pop();
              }
            }

            /* Maintain food count */
            while (g.foods.filter(f => !f.glow).length < Math.min(FOOD_COUNT, 8)) placeFood(g, C.food, 10 * g.wave, false);

            /* Power-up spawning */
            if (g.powerUp) { g.powerUp.ttl--; if (g.powerUp.ttl <= 0) g.powerUp = null; }
            else { g.powerUpTimer--; if (g.powerUpTimer <= 0) { const pt = findEmpty(g.borderShrink, g.gridW, g.gridH, g.player, g.ais, g.foods); if (pt) { const types: PwrType[] = ['shield', 'ghost', 'lightning']; g.powerUp = { ...pt, type: types[Math.floor(Math.random() * 3)], ttl: POWERUP_LIFE }; } g.powerUpTimer = POWERUP_INTERVAL; } }

            /* Check wave clear */
            if (g.ais.length > 0 && g.ais.every(a => !a.alive) && g.wavePause <= 0) {
              const bonus = 200 * g.wave; g.score += bonus; sfx.waveClear();
              g.floats.push({ x: w / 2, y: h / 2, text: `WAVE ${g.wave} CLEAR! +${bonus}`, color: C.score, life: 60, max: 60 });
              g.wavePause = WAVE_PAUSE;
            }
          }

          /* AI ticks */
          for (const ai of g.ais) {
            if (!ai.alive) continue;
            const adt = now - ai.lastTick;
            if (adt < ai.tickInterval) continue;
            ai.lastTick = now;
            aiDecide(ai, g);
            const ah = ai.segs[0], av = dirVec[ai.dir];
            const anx = ah.x + av.x, any = ah.y + av.y;

            /* Check AI death: wall */
            if (!inBounds({ x: anx, y: any }, g.borderShrink, g.gridW, g.gridH)) {
              ai.alive = false; killSnake(ai.segs, ai.color, g, ox, oy, cs); continue;
            }

            /* Check AI head collision with player body (player gets kill) */
            let aiHitPlayer = false;
            for (const s of g.player) if (s.x === anx && s.y === any) { aiHitPlayer = true; break; }
            if (aiHitPlayer) {
              ai.alive = false; killSnake(ai.segs, ai.color, g, ox, oy, cs);
              g.kills++; const pts = 100 * g.wave; g.score += pts; sfx.kill();
              g.floats.push({ x: ox + anx * cs + cs / 2, y: oy + any * cs, text: `+${pts}`, color: C.snakeHead, life: 40, max: 40 });
              continue;
            }

            /* Check AI head collision with any body */
            let aiDied = false;
            for (const other of g.ais) {
              if (!other.alive || other === ai) continue;
              for (const s of other.segs) if (s.x === anx && s.y === any) { aiDied = true; break; }
              if (aiDied) break;
            }
            /* Self collision */
            if (!aiDied) for (let i = 1; i < ai.segs.length; i++) if (ai.segs[i].x === anx && ai.segs[i].y === any) { aiDied = true; break; }

            /* Head-to-head */
            if (!aiDied) {
              if (g.player[0].x === anx && g.player[0].y === any) {
                if (ai.segs.length <= g.player.length) { aiDied = true; }
                else if (g.invuln <= 0 && !g.shield) { playerDie(g); }
                else if (g.shield) { g.shield = false; sfx.shieldHit(); aiDied = true; }
              }
              for (const other of g.ais) {
                if (!other.alive || other === ai) continue;
                if (other.segs[0].x === anx && other.segs[0].y === any) {
                  if (ai.segs.length <= other.segs.length) aiDied = true;
                }
              }
            }

            if (aiDied) { ai.alive = false; killSnake(ai.segs, ai.color, g, ox, oy, cs); continue; }

            /* Move AI */
            ai.segs.unshift({ x: anx, y: any });
            const afi = g.foods.findIndex(f => f.x === anx && f.y === any);
            if (afi >= 0) { g.foods.splice(afi, 1); }
            else { ai.segs.pop(); }
          }
        }
      }

      function playerDie(g: Game) {
        g.over = true; setIsOver(true); g.shake = 15; sfx.crash(); sfx.gameOver();
        const hx = ox + g.player[0].x * cs + cs / 2, hy = oy + g.player[0].y * cs + cs / 2;
        g.sparks.push(...boom(hx, hy, 25, C.snake));
        const hs = loadHighScores(); g.highScores = hs;
        g.enteringInitials = qualifiesForHighScore(g.score, hs);
      }

      /* Sparks & floats */
      g.sparks = g.sparks.filter(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; return --p.life > 0; });
      g.floats = g.floats.filter(f => --f.life > 0);
      if (g.over && !wasOver) wasOver = true;
      if (!g.over) wasOver = false;
      if (g.shake > 0) { g.shake *= 0.85; if (g.shake < 0.5) g.shake = 0; }
      if (g.over) g.overTimer++;

      /* ═══ RENDER ═══ */
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      ctx.fillStyle = C.bg; ctx.fillRect(-10, -10, w + 20, h + 20);

      /* Grid lines */
      ctx.strokeStyle = C.grid; ctx.lineWidth = 0.5;
      for (let gx = 0; gx <= g.gridW; gx++) { const px = ox + gx * cs; ctx.beginPath(); ctx.moveTo(px, oy); ctx.lineTo(px, oy + gridPxH); ctx.stroke(); }
      for (let gy = 0; gy <= g.gridH; gy++) { const py = oy + gy * cs; ctx.beginPath(); ctx.moveTo(ox, py); ctx.lineTo(ox + gridPxW, py); ctx.stroke(); }

      /* Danger zone */
      if (g.borderShrink > 0) {
        const s = g.borderShrink;
        ctx.fillStyle = 'rgba(255,0,0,0.12)';
        ctx.fillRect(ox, oy, s * cs, gridPxH);
        ctx.fillRect(ox + (g.gridW - s) * cs, oy, s * cs, gridPxH);
        ctx.fillRect(ox + s * cs, oy, (g.gridW - s * 2) * cs, s * cs);
        ctx.fillRect(ox + s * cs, oy + (g.gridH - s) * cs, (g.gridW - s * 2) * cs, s * cs);
        /* Noise dots */
        ctx.fillStyle = 'rgba(255,0,0,0.2)';
        for (let i = 0; i < s * (g.gridW + g.gridH); i++) {
          const dx = ox + Math.random() * gridPxW, dy = oy + Math.random() * gridPxH;
          const cx2 = Math.floor((dx - ox) / cs), cy2 = Math.floor((dy - oy) / cs);
          if (cx2 < s || cx2 >= g.gridW - s || cy2 < s || cy2 >= g.gridH - s) {
            ctx.fillRect(dx, dy, 2, 2);
          }
        }
        /* Pulsing border */
        const pulse = 0.4 + 0.3 * Math.sin(g.frame * 0.08);
        ctx.strokeStyle = `rgba(255,0,0,${pulse})`; ctx.lineWidth = 2;
        ctx.strokeRect(ox + s * cs, oy + s * cs, (g.gridW - s * 2) * cs, (g.gridH - s * 2) * cs);
      }

      /* Grid border */
      ctx.strokeStyle = 'rgba(225, 255, 0, 0.15)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(ox - 0.5, oy - 0.5, gridPxW + 1, gridPxH + 1);

      /* Food */
      for (const f of g.foods) {
        const fcx = ox + f.x * cs + cs / 2, fcy = oy + f.y * cs + cs / 2;
        const pulse = 6 + 4 * Math.sin(g.frame * 0.1);
        ctx.save();
        ctx.fillStyle = f.color; ctx.shadowColor = f.color; ctx.shadowBlur = f.glow ? pulse + 4 : pulse;
        const r = f.glow ? cs * 0.25 : cs * 0.35;
        ctx.beginPath(); ctx.arc(fcx, fcy, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* Power-up */
      if (g.powerUp) {
        const pu = g.powerUp;
        const pcx = ox + pu.x * cs + cs / 2, pcy = oy + pu.y * cs + cs / 2;
        const blink = pu.ttl < 40 && Math.floor(g.frame / 4) % 2 === 0;
        if (!blink) {
          ctx.save();
          const pulse = 8 + 5 * Math.sin(g.frame * 0.12);
          if (pu.type === 'shield') {
            ctx.strokeStyle = '#FFD700'; ctx.shadowColor = '#FFD700'; ctx.shadowBlur = pulse; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(pcx, pcy, cs * 0.4, 0, Math.PI * 2); ctx.stroke();
          } else if (pu.type === 'ghost') {
            ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = pulse;
            const s = cs * 0.4;
            ctx.beginPath(); ctx.moveTo(pcx, pcy - s); ctx.lineTo(pcx + s, pcy); ctx.lineTo(pcx, pcy + s); ctx.lineTo(pcx - s, pcy); ctx.closePath(); ctx.fill();
          } else {
            ctx.fillStyle = '#FFFF00'; ctx.shadowColor = '#FFFF00'; ctx.shadowBlur = pulse;
            ctx.font = `bold ${Math.round(cs * 0.8)}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('\u26A1', pcx, pcy);
          }
          ctx.restore();
        }
      }

      /* AI snakes */
      for (const ai of g.ais) {
        if (!ai.alive) continue;
        const len = ai.segs.length;
        for (let i = len - 1; i >= 0; i--) {
          const seg = ai.segs[i];
          const sx = ox + seg.x * cs + 1, sy = oy + seg.y * cs + 1, sz = cs - 2;
          let alpha = 1.0;
          const fs = Math.floor(len * 0.7);
          if (i >= fs && len > 3) alpha = 1.0 - 0.6 * ((i - fs) / (len - fs));
          ctx.save(); ctx.globalAlpha = alpha;
          ctx.fillStyle = i === 0 ? '#FFFFFF' : ai.color; ctx.shadowColor = ai.color; ctx.shadowBlur = 6;
          ctx.beginPath();
          const br = 3;
          ctx.moveTo(sx + br, sy); ctx.lineTo(sx + sz - br, sy); ctx.quadraticCurveTo(sx + sz, sy, sx + sz, sy + br);
          ctx.lineTo(sx + sz, sy + sz - br); ctx.quadraticCurveTo(sx + sz, sy + sz, sx + sz - br, sy + sz);
          ctx.lineTo(sx + br, sy + sz); ctx.quadraticCurveTo(sx, sy + sz, sx, sy + sz - br);
          ctx.lineTo(sx, sy + br); ctx.quadraticCurveTo(sx, sy, sx + br, sy);
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
      }

      /* Player snake */
      const playerVisible = g.invuln <= 0 || Math.floor(g.frame / 4) % 2 === 0;
      if (playerVisible && !g.over) {
        const plen = g.player.length;
        for (let i = plen - 1; i >= 0; i--) {
          const seg = g.player[i];
          const sx = ox + seg.x * cs + 1, sy = oy + seg.y * cs + 1, sz = cs - 2;
          let alpha = 1.0;
          const fs = Math.floor(plen * 0.7);
          if (i >= fs && plen > 3) alpha = 1.0 - 0.6 * ((i - fs) / (plen - fs));
          if (g.ghostTicks > 0) alpha *= 0.5;
          ctx.save(); ctx.globalAlpha = alpha;
          ctx.fillStyle = i === 0 ? '#F0FF40' : C.snake; ctx.shadowColor = C.snake; ctx.shadowBlur = 8;
          if (g.shield && i === 0) { ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 14; }
          const br = 3;
          ctx.beginPath();
          ctx.moveTo(sx + br, sy); ctx.lineTo(sx + sz - br, sy); ctx.quadraticCurveTo(sx + sz, sy, sx + sz, sy + br);
          ctx.lineTo(sx + sz, sy + sz - br); ctx.quadraticCurveTo(sx + sz, sy + sz, sx + sz - br, sy + sz);
          ctx.lineTo(sx + br, sy + sz); ctx.quadraticCurveTo(sx, sy + sz, sx, sy + sz - br);
          ctx.lineTo(sx, sy + br); ctx.quadraticCurveTo(sx, sy, sx + br, sy);
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
        /* Shield outline */
        if (g.shield) {
          ctx.save(); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5 + 0.3 * Math.sin(g.frame * 0.15);
          for (const seg of g.player) {
            ctx.strokeRect(ox + seg.x * cs, oy + seg.y * cs, cs, cs);
          }
          ctx.restore();
        }
        /* Eyes */
        const head = g.player[0];
        const hcx = ox + head.x * cs + cs / 2, hcy = oy + head.y * cs + cs / 2;
        const eyeR = 2, eyeOff = 3;
        let e1x: number, e1y: number, e2x: number, e2y: number;
        if (g.dir === 'right') { e1x = hcx + eyeOff; e1y = hcy - eyeOff; e2x = hcx + eyeOff; e2y = hcy + eyeOff; }
        else if (g.dir === 'left') { e1x = hcx - eyeOff; e1y = hcy - eyeOff; e2x = hcx - eyeOff; e2y = hcy + eyeOff; }
        else if (g.dir === 'up') { e1x = hcx - eyeOff; e1y = hcy - eyeOff; e2x = hcx + eyeOff; e2y = hcy - eyeOff; }
        else { e1x = hcx - eyeOff; e1y = hcy + eyeOff; e2x = hcx + eyeOff; e2y = hcy + eyeOff; }
        ctx.save(); ctx.fillStyle = C.snakeHead;
        ctx.beginPath(); ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* Sparks */
      for (const p of g.sparks) { ctx.globalAlpha = p.life / p.max; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;

      /* Floating text */
      for (const ft of g.floats) {
        ctx.save(); ctx.globalAlpha = ft.life / ft.max; ctx.fillStyle = ft.color;
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y - (ft.max - ft.life) * 0.6); ctx.restore();
      }

      /* HUD */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);
      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`WAVE ${g.wave}`, w / 2, 24);
      ctx.fillStyle = C.ui; ctx.font = '12px monospace'; ctx.globalAlpha = 0.6;
      ctx.fillText('SERPENT ARENA', w / 2, 42); ctx.globalAlpha = 1;
      ctx.fillStyle = C.snakeHead; ctx.font = '16px monospace'; ctx.textAlign = 'right';
      ctx.fillText(`KILLS: ${g.kills}`, w - 20, 40);

      /* Power-up indicators */
      let indY = 60;
      if (g.shield) { ctx.fillStyle = '#FFD700'; ctx.font = '12px monospace'; ctx.textAlign = 'left'; ctx.fillText('SHIELD \u25CF', 20, indY); indY += 16; }
      if (g.ghostTicks > 0) { ctx.fillStyle = '#FFFFFF'; ctx.font = '12px monospace'; ctx.textAlign = 'left'; ctx.fillText(`GHOST ${g.ghostTicks}`, 20, indY); indY += 16; }

      if (!showTouch.current && !g.over) {
        ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('ARROWS\u00B7SPACE BOOST\u00B7M MUTE\u00B7ESC EXIT', w / 2, h - 20); ctx.globalAlpha = 1;
      }

      /* GAME OVER */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);
        ctx.textAlign = 'center';
        ctx.fillStyle = C.snakeHead; ctx.font = 'bold 48px monospace'; ctx.fillText('GAME OVER', w / 2, h / 2 - 130);
        ctx.fillStyle = C.score; ctx.font = '24px monospace'; ctx.fillText(`SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, h / 2 - 90);
        ctx.fillStyle = C.ui; ctx.font = '16px monospace'; ctx.fillText(`WAVE ${g.wave}  \u00B7  KILLS ${g.kills}`, w / 2, h / 2 - 60);

        if (g.overTimer >= 40) {
          if (g.enteringInitials) {
            ctx.fillStyle = C.score; ctx.font = 'bold 22px monospace'; ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, h / 2 - 30);
            ctx.fillStyle = C.ui; ctx.font = '13px monospace';
            ctx.fillText(showTouch.current ? 'USE BUTTONS BELOW TO ENTER INITIALS' : 'TYPE INITIALS  \u00B7  \u2190\u2192 MOVE  \u00B7  ENTER TO CONFIRM', w / 2, h / 2);
            ctx.font = 'bold 40px monospace';
            const blink = Math.floor(g.frame / 18) % 2 === 0;
            for (let i = 0; i < 3; i++) {
              const cx2 = w / 2 + (i - 1) * 55, cy2 = h / 2 + 50;
              const char = ABC[g.initialsChars[i]];
              if (i === g.initialsPos) { ctx.fillStyle = C.score; if (blink) ctx.fillRect(cx2 - 16, cy2 + 8, 32, 4); }
              else ctx.fillStyle = C.ui;
              ctx.fillText(char, cx2, cy2);
            }
          } else {
            const scores = g.highScores;
            if (scores.length > 0) {
              ctx.fillStyle = C.score; ctx.font = 'bold 20px monospace';
              ctx.fillText('\u2550\u2550\u2550 HIGH SCORES \u2550\u2550\u2550', w / 2, h / 2 - 25);
              ctx.font = '17px monospace';
              const startY = h / 2 + 5;
              for (let i = 0; i < Math.min(scores.length, HS_MAX); i++) {
                const hs = scores[i], y = startY + i * 26;
                ctx.fillStyle = (g.scoreSubmitted && i === g.scoreIndex) ? C.score : C.ui;
                ctx.textAlign = 'right'; ctx.fillText(`${i + 1}.`, w / 2 - 85, y);
                ctx.textAlign = 'left'; ctx.fillText(hs.initials, w / 2 - 65, y);
                ctx.textAlign = 'right'; ctx.fillText(String(hs.score).padStart(6, '0'), w / 2 + 110, y);
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

      /* Touch buttons */
      if (showTouch.current) { for (const b of btnsRef.current) drawBtn(ctx, b, !!ta[b.id], sfx.muted); }

      ctx.restore();
      prevTouch.current = { ...ta };
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current); sfx.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp);
      el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTS);
      el.removeEventListener('touchend', onTE); el.removeEventListener('touchcancel', onTE);
      document.body.style.overflow = prevOverflow;
    };
  }, [init, onClose]);

  return (
    <>
      {createPortal(
        <div data-snake-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-snake-game], [data-snake-game] * { cursor: default !important; }`}</style>}
          <canvas ref={cvs} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
        </div>,
        document.body,
      )}
      {bossData && (
        <ArcadeBossOverlay
          game={bossData.game} score={bossData.score} initials={bossData.initials}
          onClose={() => { bossActive.current = false; setBossData(null); }}
        />
      )}
    </>
  );
}
