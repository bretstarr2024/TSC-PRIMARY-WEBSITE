'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  player: '#FF5910',
  boss: '#73F5FF',
  butterfly: '#ED0AD2',
  grunt: '#E1FF00',
  bullet: '#FFFFFF',
  beam: '#ED0AD2',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
  star: ['#FFFFFF', '#73F5FF', '#E1FF00'],
};

/* ── Tuning knobs ── */
const PLAYER_W = 24;
const PLAYER_H = 20;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 8;
const ENEMY_BULLET_SPEED = 4;
const FIRE_COOLDOWN = 3;
const FORMATION_ROWS = 5;
const FORMATION_COLS = 10;
const ENEMY_SIZE = 22;
const ENEMY_GAP = 6;
const BASE_DIVE_INTERVAL = 120;
const STAR_COUNT = 100;
const ENTRY_SPEED = 0.012;
const ENTRY_WAVE_DELAY = 50;
const ENTRY_STAGGER = 8;
const BEAM_DEPLOY_FRAMES = 40;
const BEAM_ACTIVE_FRAMES = 300;
const BEAM_RETRACT_FRAMES = 25;
const BEAM_WIDTH_TOP = 16;
const BEAM_WIDTH_BOT = 80;
const RESCUE_SPEED = 2.5;
const CHALLENGE_WAVE_DELAY = 70;
const CHALLENGE_INTRO_FRAMES = 120;
const CHALLENGE_RESULTS_FRAMES = 210;
const CHALLENGE_ENEMIES_PER_WAVE = 8;
const CHALLENGE_WAVES = 5;

/* High scores */
const HS_KEY = 'tsc-galaga-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ══════════════════════════════════════════════════════
   Path Math — Cubic Bezier
   ══════════════════════════════════════════════════════ */
interface PathSeg {
  x0: number; y0: number;
  cx0: number; cy0: number;
  cx1: number; cy1: number;
  x1: number; y1: number;
}

function cubicBez(t: number, a: number, b: number, c: number, d: number): number {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function evalPath(path: PathSeg[], progress: number): { x: number; y: number } {
  const n = path.length;
  const clamped = Math.max(0, Math.min(progress, 0.9999));
  const st = clamped * n;
  const i = Math.min(Math.floor(st), n - 1);
  const t = st - i;
  const s = path[i];
  return {
    x: cubicBez(t, s.x0, s.cx0, s.cx1, s.x1),
    y: cubicBez(t, s.y0, s.cy0, s.cy1, s.y1),
  };
}

function approxPathLen(path: PathSeg[]): number {
  let len = 0;
  for (const s of path) {
    const dx = s.x1 - s.x0, dy = s.y1 - s.y0;
    len += Math.sqrt(dx * dx + dy * dy) * 1.3;
  }
  return Math.max(len, 100);
}

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

  shoot() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(880, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.08);
  }

  enemyHit() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator(); const g = c.createGain();
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
    const dur = 0.5;
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

  dive() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(300, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.2);
  }

  beamDeploy() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, c.currentTime);
    o.frequency.linearRampToValueAtTime(80, c.currentTime + 1.5);
    lfo.type = 'sine'; lfo.frequency.setValueAtTime(6, c.currentTime);
    lfoGain.gain.setValueAtTime(0.08, c.currentTime);
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.linearRampToValueAtTime(0.001, c.currentTime + 1.5);
    o.connect(g).connect(c.destination);
    lfo.start(); lfo.stop(c.currentTime + 1.5);
    o.start(); o.stop(c.currentTime + 1.5);
  }

  capture() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(200, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.8);
    lfo.type = 'sine'; lfo.frequency.setValueAtTime(8, c.currentTime);
    lfoGain.gain.setValueAtTime(0.15, c.currentTime);
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.8);
    o.connect(g).connect(c.destination);
    lfo.start(); lfo.stop(c.currentTime + 0.8);
    o.start(); o.stop(c.currentTime + 0.8);
  }

  rescue() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [440, 660, 880, 1100].forEach((freq, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.08);
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.08 + 0.12);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.08); o.stop(c.currentTime + i * 0.08 + 0.12);
    });
  }

  challengeFanfare() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'square';
      const t = c.currentTime + i * 0.12;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + 0.14);
    });
  }

  perfect() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [523, 659, 784, 1047, 1319, 1568].forEach((freq, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'square';
      const t = c.currentTime + i * 0.1;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + 0.18);
    });
  }

  levelUp() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [440, 554, 659, 880].forEach((freq, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.1);
      g.gain.setValueAtTime(0.1, c.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.15);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.1); o.stop(c.currentTime + i * 0.1 + 0.15);
    });
  }

  gameOver() {
    const c = this.ensure();
    if (!c || this._muted) return;
    [440, 370, 311, 220].forEach((freq, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.2);
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.2 + 0.25);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.2); o.stop(c.currentTime + i * 0.2 + 0.25);
    });
  }

  dispose() {
    try { this.ctx?.close(); } catch { /* */ }
    this.ctx = null;
  }
}

/* ══════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════ */
type EnemyType = 'grunt' | 'butterfly' | 'boss';
type EnemyState = 'entering' | 'formation' | 'diving' | 'beaming' | 'returning' | 'dead';
type GamePhase = 'entering' | 'playing' | 'challenge' | 'challengeResults' | 'levelComplete';
type BeamPhase = 'none' | 'deploying' | 'active' | 'retracting';

interface Star { x: number; y: number; speed: number; size: number; color: string }
interface Bullet { x: number; y: number; vy: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface HighScore { initials: string; score: number }

interface GEnemy {
  type: EnemyType;
  state: EnemyState;
  formRow: number; formCol: number;
  x: number; y: number;
  hp: number;
  points: number;
  divePoints: number;
  color: string;
  /* Entry */
  entryPath: PathSeg[];
  entryProgress: number;
  entryDelay: number;
  /* Dive */
  divePath: PathSeg[];
  diveProgress: number;
  diveSpeed: number;
  diveBulletsFired: number;
  /* Returning */
  returnStartX: number; returnStartY: number;
  returnProgress: number;
  /* Capture/beam */
  capturing: boolean;
  capturedShip: boolean;
  beamPhase: BeamPhase;
  beamTimer: number;
  /* Escort */
  isEscort: boolean;
  escortBossIdx: number;
  /* Anim */
  animFrame: number;
}

interface ChalEnemy {
  x: number; y: number;
  path: PathSeg[];
  progress: number;
  speed: number;
  alive: boolean;
  type: EnemyType;
  color: string;
  stagger: number;
}

interface RescueShip {
  x: number; y: number;
  targetX: number;
  docked: boolean;
}

interface Game {
  phase: GamePhase;
  enemies: GEnemy[];
  playerX: number;
  playerAlive: boolean;
  playerRespawn: number;
  dualFighter: boolean;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  stars: Star[];
  sparks: Spark[];
  score: number;
  lives: number;
  level: number;
  frame: number;
  /* Formation */
  formationOffsetX: number;
  breathPhase: number;
  /* Diving */
  diveTimer: number;
  diveInterval: number;
  bossDiveCount: number;
  /* Player */
  fireCooldown: number;
  capturedByBoss: number;
  captureTimer: number;
  captureY: number;
  /* Rescue */
  rescueShip: RescueShip | null;
  /* Challenge */
  challengeWave: number;
  challengeHits: number;
  challengeTimer: number;
  challengeEnemies: ChalEnemy[];
  /* Level transition */
  levelFlash: number;
  /* Effects */
  shake: number;
  /* Game over */
  over: boolean;
  overTimer: number;
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
}

/* ══════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════ */
function makeStars(): Star[] {
  const speeds = [0.3, 0.7, 1.2];
  const sizes = [1, 1.5, 2];
  return Array.from({ length: STAR_COUNT }, () => {
    const layer = Math.floor(Math.random() * 3);
    return { x: Math.random() * 2000, y: Math.random() * 2000, speed: speeds[layer], size: sizes[layer], color: C.star[layer] };
  });
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
  try { const raw = localStorage.getItem(HS_KEY); return raw ? JSON.parse(raw) as HighScore[] : []; }
  catch { return []; }
}
function saveHighScores(scores: HighScore[]): void {
  try { localStorage.setItem(HS_KEY, JSON.stringify(scores.slice(0, HS_MAX))); } catch { /* */ }
}
function qualifiesForHighScore(score: number, scores: HighScore[]): boolean {
  if (score <= 0) return false;
  if (scores.length < HS_MAX) return true;
  return score > scores[scores.length - 1].score;
}

/* ── Formation position helpers ── */
function formPixelX(col: number, w: number, offsetX: number, breathScale: number): number {
  const spacing = (ENEMY_SIZE + ENEMY_GAP) * breathScale;
  const formW = FORMATION_COLS * spacing - (spacing - ENEMY_SIZE);
  return (w - formW) / 2 + col * spacing + ENEMY_SIZE / 2 + offsetX;
}
function formPixelY(row: number, breathScale: number): number {
  const spacing = (ENEMY_SIZE + ENEMY_GAP) * breathScale;
  return 100 + row * spacing;
}

/* ══════════════════════════════════════════════════════
   Entry Path Generation
   ══════════════════════════════════════════════════════ */
function assignWave(row: number, col: number): { wave: number; idx: number } {
  if (row === 4) return { wave: 0, idx: col };
  if (row === 3) return { wave: 1, idx: col };
  if (row === 0) return { wave: 2, idx: col >= 3 ? col - 3 : 0 };
  if (row === 1) return { wave: 3, idx: col >= 1 ? col - 1 : 0 };
  if (row === 2) return { wave: 4, idx: col >= 1 ? col - 1 : 0 };
  return { wave: 4, idx: 0 };
}

function entryDirection(wave: number, level: number): 'right' | 'left' | 'top' {
  const pattern = level % 3;
  const dirs: ('right' | 'left' | 'top')[][] = [
    ['right', 'left', 'top', 'right', 'left'],
    ['left', 'right', 'top', 'left', 'right'],
    ['top', 'right', 'left', 'top', 'right'],
  ];
  return dirs[pattern][wave % 5];
}

function generateEntryPath(dir: 'right' | 'left' | 'top', fx: number, fy: number, w: number, h: number): PathSeg[] {
  switch (dir) {
    case 'right':
      return [{
        x0: w + 60, y0: h * 0.15 + Math.random() * 40,
        cx0: w * 0.65, cy0: -10 + Math.random() * 30,
        cx1: fx + 80 + Math.random() * 40, cy1: fy - 50,
        x1: fx, y1: fy,
      }];
    case 'left':
      return [{
        x0: -60, y0: h * 0.18 + Math.random() * 40,
        cx0: w * 0.35, cy0: -10 + Math.random() * 30,
        cx1: fx - 80 - Math.random() * 40, cy1: fy - 50,
        x1: fx, y1: fy,
      }];
    case 'top':
      return [{
        x0: w * 0.5 + (Math.random() - 0.5) * 200, y0: -60,
        cx0: w * 0.5 + (fx - w * 0.5) * 0.4, cy0: h * 0.06,
        cx1: fx + (Math.random() - 0.5) * 60, cy1: fy - 70,
        x1: fx, y1: fy,
      }];
  }
}

/* ══════════════════════════════════════════════════════
   Dive Path Generation
   ══════════════════════════════════════════════════════ */
type DivePattern = 'swoop' | 'loop' | 'sCurve' | 'sideSweep';
const DIVE_PATTERNS: DivePattern[] = ['swoop', 'loop', 'sCurve', 'sideSweep'];

function pickDivePattern(level: number): DivePattern {
  if (level <= 2) return 'swoop';
  return DIVE_PATTERNS[Math.floor(Math.random() * DIVE_PATTERNS.length)];
}

function generateDivePath(pattern: DivePattern, fx: number, fy: number, tx: number, w: number, h: number): PathSeg[] {
  switch (pattern) {
    case 'swoop':
      return [{
        x0: fx, y0: fy,
        cx0: fx + (tx - fx) * 0.3 + (Math.random() - 0.5) * 150, cy0: fy + (h - fy) * 0.35,
        cx1: tx + (Math.random() - 0.5) * 80, cy1: h * 0.7,
        x1: tx + (Math.random() - 0.5) * 60, y1: h + 60,
      }];
    case 'loop': {
      const side = Math.random() > 0.5 ? 1 : -1;
      const lw = 80 + Math.random() * 80;
      const mx = Math.max(30, Math.min(w - 30, fx + side * lw));
      return [
        { x0: fx, y0: fy, cx0: fx, cy0: fy + 60, cx1: mx, cy1: h * 0.35, x1: mx, y1: h * 0.48 },
        { x0: mx, y0: h * 0.48, cx0: mx + side * lw, cy0: h * 0.32, cx1: fx + side * lw * 0.5, cy1: fy + 30, x1: fx, y1: fy + 60 },
        { x0: fx, y0: fy + 60, cx0: fx - side * 30, cy0: h * 0.45, cx1: tx, cy1: h * 0.75, x1: tx + side * 20, y1: h + 60 },
      ];
    }
    case 'sCurve': {
      const sOff = (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 80);
      return [
        { x0: fx, y0: fy, cx0: fx + sOff, cy0: fy + 80, cx1: fx - sOff, cy1: h * 0.4, x1: tx, y1: h * 0.5 },
        { x0: tx, y0: h * 0.5, cx0: tx + sOff * 0.7, cy0: h * 0.6, cx1: tx - sOff * 0.5, cy1: h * 0.85, x1: tx + sOff * 0.3, y1: h + 60 },
      ];
    }
    case 'sideSweep': {
      const dir = fx < w * 0.5 ? 1 : -1;
      const farX = Math.max(30, Math.min(w - 30, fx + dir * 250));
      return [
        { x0: fx, y0: fy, cx0: fx, cy0: fy + 50, cx1: fx + dir * 150, cy1: h * 0.42, x1: farX, y1: h * 0.5 },
        { x0: farX, y0: h * 0.5, cx0: farX + dir * 30, cy0: h * 0.6, cx1: fx + dir * 100, cy1: h * 0.8, x1: fx + dir * 50, y1: h + 60 },
      ];
    }
  }
}

function generateCapturePath(fx: number, fy: number, tx: number, h: number): PathSeg[] {
  return [{
    x0: fx, y0: fy,
    cx0: fx, cy0: fy + 40,
    cx1: tx, cy1: h * 0.28,
    x1: tx, y1: h * 0.42,
  }];
}

/* ══════════════════════════════════════════════════════
   Challenge Stage Paths
   ══════════════════════════════════════════════════════ */
function challengeWavePath(wave: number, w: number, h: number): PathSeg[] {
  switch (wave % 5) {
    case 0:
      return [
        { x0: w + 40, y0: h * 0.25, cx0: w * 0.6, cy0: h * 0.05, cx1: w * 0.3, cy1: h * 0.45, x1: w * 0.15, y1: h * 0.55 },
        { x0: w * 0.15, y0: h * 0.55, cx0: w * 0.05, cy0: h * 0.65, cx1: w * 0.15, cy1: h * 0.25, x1: -40, y1: h * 0.15 },
      ];
    case 1:
      return [
        { x0: -40, y0: h * 0.25, cx0: w * 0.4, cy0: h * 0.05, cx1: w * 0.7, cy1: h * 0.45, x1: w * 0.85, y1: h * 0.55 },
        { x0: w * 0.85, y0: h * 0.55, cx0: w * 0.95, cy0: h * 0.65, cx1: w * 0.85, cy1: h * 0.25, x1: w + 40, y1: h * 0.15 },
      ];
    case 2:
      return [
        { x0: w * 0.5, y0: -40, cx0: w * 0.5, cy0: h * 0.2, cx1: w * 0.3, cy1: h * 0.5, x1: w * 0.5, y1: h * 0.65 },
        { x0: w * 0.5, y0: h * 0.65, cx0: w * 0.7, cy0: h * 0.8, cx1: w * 0.5, cy1: h * 0.9, x1: w * 0.5, y1: h + 40 },
      ];
    case 3:
      return [
        { x0: w + 40, y0: h * 0.15, cx0: w * 0.5, cy0: h * 0.3, cx1: w * 0.2, cy1: h * 0.55, x1: w * 0.5, y1: h * 0.65 },
        { x0: w * 0.5, y0: h * 0.65, cx0: w * 0.8, cy0: h * 0.75, cx1: w * 0.3, cy1: h * 0.9, x1: -40, y1: h * 0.7 },
      ];
    case 4:
      return [
        { x0: w * 0.5, y0: -40, cx0: w * 0.85, cy0: h * 0.15, cx1: w * 0.85, cy1: h * 0.65, x1: w * 0.5, y1: h * 0.75 },
        { x0: w * 0.5, y0: h * 0.75, cx0: w * 0.15, cy0: h * 0.65, cx1: w * 0.15, cy1: h * 0.15, x1: w * 0.5, y1: -40 },
      ];
    default:
      return [{ x0: w + 40, y0: h * 0.5, cx0: w * 0.5, cy0: h * 0.5, cx1: -40, cy1: h * 0.5, x1: -40, y1: h * 0.5 }];
  }
}

function spawnChallengeWave(wave: number, w: number, h: number): ChalEnemy[] {
  const path = challengeWavePath(wave, w, h);
  const enemies: ChalEnemy[] = [];
  for (let i = 0; i < CHALLENGE_ENEMIES_PER_WAVE; i++) {
    const t = i < 2 ? 'boss' as EnemyType : i < 5 ? 'butterfly' as EnemyType : 'grunt' as EnemyType;
    const color = t === 'boss' ? C.boss : t === 'butterfly' ? C.butterfly : C.grunt;
    let adjustedPath = path;
    if (wave === 2) {
      const spread = (i - 3.5) * 25;
      adjustedPath = path.map(s => ({
        ...s, x0: s.x0 + spread, cx0: s.cx0 + spread, cx1: s.cx1 + spread * 0.5, x1: s.x1 + spread * 0.3,
      }));
    }
    enemies.push({
      x: 0, y: 0, path: adjustedPath,
      progress: 0, stagger: i * 0.12,
      speed: 0.002,
      alive: true, type: t, color,
    });
  }
  return enemies;
}

/* ══════════════════════════════════════════════════════
   Formation Builder
   ══════════════════════════════════════════════════════ */
function makeFormation(level: number, w: number, h: number): GEnemy[] {
  const enemies: GEnemy[] = [];
  for (let row = 0; row < FORMATION_ROWS; row++) {
    for (let col = 0; col < FORMATION_COLS; col++) {
      let type: EnemyType;
      let hp: number;
      let points: number;
      let divePoints: number;
      let color: string;

      if (row === 0) {
        if (col < 3 || col > 6) continue;
        type = 'boss'; hp = 2; points = 150; divePoints = 400; color = C.boss;
      } else if (row === 1 || row === 2) {
        if (col < 1 || col > 8) continue;
        type = 'butterfly'; hp = 1; points = 80; divePoints = 160; color = C.butterfly;
      } else {
        type = 'grunt'; hp = 1; points = 50; divePoints = 100; color = C.grunt;
      }

      if (type === 'boss' && level > 3) hp += Math.floor((level - 1) / 3);

      const { wave, idx } = assignWave(row, col);
      const dir = entryDirection(wave, level);
      const fx = formPixelX(col, w, 0, 1);
      const fy = formPixelY(row, 1);
      const ePath = generateEntryPath(dir, fx, fy, w, h);

      enemies.push({
        type, state: 'entering',
        formRow: row, formCol: col,
        x: ePath[0].x0, y: ePath[0].y0,
        hp, points, divePoints, color,
        entryPath: ePath,
        entryProgress: 0,
        entryDelay: wave * ENTRY_WAVE_DELAY + idx * ENTRY_STAGGER,
        divePath: [], diveProgress: 0, diveSpeed: 0, diveBulletsFired: 0,
        returnStartX: 0, returnStartY: 0, returnProgress: 0,
        capturing: false, capturedShip: false,
        beamPhase: 'none', beamTimer: 0,
        isEscort: false, escortBossIdx: -1,
        animFrame: Math.floor(Math.random() * 60),
      });
    }
  }
  return enemies;
}

/* ══════════════════════════════════════════════════════
   Drawing Helpers
   ══════════════════════════════════════════════════════ */
function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = C.player; ctx.shadowColor = C.player; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x, y - PLAYER_H / 2);
  ctx.lineTo(x + PLAYER_W / 2, y + PLAYER_H / 2);
  ctx.lineTo(x - PLAYER_W / 2, y + PLAYER_H / 2);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawBoss(ctx: CanvasRenderingContext2D, e: GEnemy, s: number) {
  ctx.save();
  const pulse = 1 + Math.sin(e.animFrame * 0.08) * 0.08;
  const sz = s * pulse;
  ctx.fillStyle = e.hp <= 1 && e.type === 'boss' ? '#8B5CF6' : e.color;
  ctx.shadowColor = e.color; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(e.x, e.y - sz / 2);
  ctx.lineTo(e.x + sz / 2, e.y);
  ctx.lineTo(e.x, e.y + sz / 2);
  ctx.lineTo(e.x - sz / 2, e.y);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.arc(e.x, e.y, sz * 0.18, 0, Math.PI * 2); ctx.fill();
  if (e.capturedShip) {
    ctx.fillStyle = C.player; ctx.shadowColor = C.player; ctx.shadowBlur = 6;
    ctx.beginPath();
    const cy = e.y + sz / 2 + 6;
    ctx.moveTo(e.x, cy - 5); ctx.lineTo(e.x + 5, cy + 5); ctx.lineTo(e.x - 5, cy + 5);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawButterfly(ctx: CanvasRenderingContext2D, e: GEnemy, s: number) {
  ctx.save();
  ctx.fillStyle = e.color; ctx.shadowColor = e.color; ctx.shadowBlur = 6;
  const wingAngle = Math.sin(e.animFrame * 0.12) * 0.3;
  ctx.beginPath();
  ctx.moveTo(e.x, e.y - s * 0.4);
  ctx.lineTo(e.x + s * 0.25, e.y);
  ctx.lineTo(e.x, e.y + s * 0.4);
  ctx.lineTo(e.x - s * 0.25, e.y);
  ctx.closePath(); ctx.fill();
  /* Left wing */
  ctx.save(); ctx.translate(e.x - s * 0.25, e.y); ctx.rotate(-wingAngle);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.15); ctx.lineTo(-s * 0.3, -s * 0.35);
  ctx.lineTo(-s * 0.3, s * 0.15); ctx.lineTo(0, s * 0.15);
  ctx.closePath(); ctx.fill(); ctx.restore();
  /* Right wing */
  ctx.save(); ctx.translate(e.x + s * 0.25, e.y); ctx.rotate(wingAngle);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.15); ctx.lineTo(s * 0.3, -s * 0.35);
  ctx.lineTo(s * 0.3, s * 0.15); ctx.lineTo(0, s * 0.15);
  ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.restore();
}

function drawGrunt(ctx: CanvasRenderingContext2D, e: GEnemy, s: number) {
  ctx.save();
  ctx.fillStyle = e.color; ctx.shadowColor = e.color; ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(e.x - s * 0.4, e.y - s * 0.35);
  ctx.lineTo(e.x + s * 0.4, e.y - s * 0.35);
  ctx.lineTo(e.x, e.y + s * 0.4);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: GEnemy | ChalEnemy, s: number) {
  if (e.type === 'boss') drawBoss(ctx, e as GEnemy, s);
  else if (e.type === 'butterfly') drawButterfly(ctx, e as GEnemy, s);
  else drawGrunt(ctx, e as GEnemy, s);
}

function drawBeam(ctx: CanvasRenderingContext2D, e: GEnemy, h: number, frame: number) {
  const playerY = h - 40;
  let beamFrac = 1;
  if (e.beamPhase === 'deploying') beamFrac = e.beamTimer / BEAM_DEPLOY_FRAMES;
  else if (e.beamPhase === 'retracting') beamFrac = 1 - e.beamTimer / BEAM_RETRACT_FRAMES;
  if (beamFrac <= 0) return;

  const beamH = (playerY - e.y - ENEMY_SIZE / 2) * beamFrac;
  if (beamH <= 0) return;

  ctx.save();
  /* Animated stripes */
  const stripes = 10;
  for (let si = 0; si < stripes; si++) {
    const offset = (frame * 3 + si * (beamH / stripes)) % beamH;
    const y = e.y + ENEMY_SIZE / 2 + offset;
    if (y > e.y + ENEMY_SIZE / 2 + beamH) continue;
    const prog = (y - e.y) / (playerY - e.y);
    const sw = BEAM_WIDTH_TOP + (BEAM_WIDTH_BOT - BEAM_WIDTH_TOP) * prog;
    ctx.fillStyle = C.beam;
    ctx.globalAlpha = 0.2 + 0.12 * Math.sin(frame * 0.2 + si);
    ctx.fillRect(e.x - sw / 2, y, sw, 4);
  }
  /* Main cone */
  ctx.globalAlpha = 0.15 + 0.05 * Math.sin(frame * 0.15);
  ctx.fillStyle = C.beam;
  ctx.beginPath();
  ctx.moveTo(e.x - BEAM_WIDTH_TOP / 2, e.y + ENEMY_SIZE / 2);
  ctx.lineTo(e.x + BEAM_WIDTH_TOP / 2, e.y + ENEMY_SIZE / 2);
  const endY = e.y + ENEMY_SIZE / 2 + beamH;
  const progEnd = beamH / (playerY - e.y - ENEMY_SIZE / 2);
  const endW = BEAM_WIDTH_TOP + (BEAM_WIDTH_BOT - BEAM_WIDTH_TOP) * progEnd;
  ctx.lineTo(e.x + endW / 2, endY);
  ctx.lineTo(e.x - endW / 2, endY);
  ctx.closePath(); ctx.fill();
  /* Bright edge lines */
  ctx.strokeStyle = C.beam;
  ctx.globalAlpha = 0.4 + 0.2 * Math.sin(frame * 0.1);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(e.x - BEAM_WIDTH_TOP / 2, e.y + ENEMY_SIZE / 2);
  ctx.lineTo(e.x - endW / 2, endY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.x + BEAM_WIDTH_TOP / 2, e.y + ENEMY_SIZE / 2);
  ctx.lineTo(e.x + endW / 2, endY);
  ctx.stroke();
  ctx.restore();
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
    btns.push({ id: 'tleft', x: r * 2, y: h - r * 2.5, r, label: '\u25C0' });
    btns.push({ id: 'tright', x: r * 5, y: h - r * 2.5, r, label: '\u25B6' });
    btns.push({ id: 'fire', x: w - r * 2.5, y: h - r * 2.5, r: r * 1.3, label: '\u25CF' });
  }
  return btns;
}

function drawBtn(ctx: CanvasRenderingContext2D, b: TBtn, active: boolean, sfxMuted: boolean) {
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = active ? 'rgba(255,89,16,0.25)' : 'rgba(20,18,19,0.55)'; ctx.fill();
  ctx.strokeStyle = active ? 'rgba(255,89,16,0.9)' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.stroke();
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
export function GalagaGame({ onClose }: { onClose: () => void }) {
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

  function isChallenge(level: number): boolean {
    return level >= 3 && (level - 3) % 4 === 0;
  }

  const init = useCallback((w: number, h: number): Game => ({
    phase: 'entering',
    enemies: makeFormation(1, w, h),
    playerX: w / 2,
    playerAlive: true,
    playerRespawn: 0,
    dualFighter: false,
    bullets: [],
    enemyBullets: [],
    stars: makeStars(),
    sparks: [],
    score: 0,
    lives: 3,
    level: 1,
    frame: 0,
    formationOffsetX: 0,
    breathPhase: 0,
    diveTimer: 0,
    diveInterval: BASE_DIVE_INTERVAL,
    bossDiveCount: 0,
    fireCooldown: 0,
    capturedByBoss: -1,
    captureTimer: 0,
    captureY: 0,
    rescueShip: null,
    challengeWave: -1,
    challengeHits: 0,
    challengeTimer: 0,
    challengeEnemies: [],
    levelFlash: 0,
    shake: 0,
    over: false,
    overTimer: 0,
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

    /* ── Touch helpers ── */
    function updateTouchState(e: TouchEvent) {
      const state: Record<string, boolean> = {};
      const btns = btnsRef.current;
      for (let t = 0; t < e.touches.length; t++) {
        const tx = e.touches[t].clientX;
        const ty = e.touches[t].clientY;
        for (const btn of btns) {
          if (Math.hypot(tx - btn.x, ty - btn.y) < btn.r * 1.5) state[btn.id] = true;
        }
      }
      touchActive.current = state;
    }

    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); showTouch.current = true; updateTouchState(e); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); showTouch.current = true; updateTouchState(e); };
    const onTouchEnd = (e: TouchEvent) => { e.preventDefault(); updateTouchState(e); };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    /* ── Keyboard ── */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();

      const g = game.current;
      if (!g) return;

      if (g.over) {
        if (g.overTimer < 40) return;
        if (g.enteringInitials) {
          const key = e.key;
          if (key === 'ArrowUp' || key === 'w' || key === 'W') g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          else if (key === 'ArrowDown' || key === 's' || key === 'S') g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          else if (key === 'ArrowLeft' || key === 'a' || key === 'A') g.initialsPos = Math.max(0, g.initialsPos - 1);
          else if (key === 'ArrowRight' || key === 'd' || key === 'D') g.initialsPos = Math.min(2, g.initialsPos + 1);
          else if (key === 'Enter') {
            const initials = g.initialsChars.map(i => ABC[i]).join('');
            const entry: HighScore = { initials, score: g.score };
            const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
            saveHighScores(scores);
            g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false;
            g.scoreSubmitted = true;
            if (g.scoreIndex === 0) { bossActive.current = true; setBossData({ game: 'galaga', score: g.score, initials }); }
          } else if (/^[a-zA-Z]$/.test(key)) {
            g.initialsChars[g.initialsPos] = key.toUpperCase().charCodeAt(0) - 65;
            if (g.initialsPos < 2) g.initialsPos++;
          }
          return;
        }
        if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
        if (e.key === 'Enter') { keys.current.clear(); game.current = init(el.width, el.height); setIsOver(false); }
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

      if (showTouch.current) btnsRef.current = calcButtons(w, h, g);

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
            saveHighScores(scores); g.highScores = scores;
            g.scoreIndex = scores.indexOf(entry);
            g.enteringInitials = false; g.scoreSubmitted = true;
            if (g.scoreIndex === 0) { bossActive.current = true; setBossData({ game: 'galaga', score: g.score, initials }); }
          }
        } else if (justTouched('restart')) {
          game.current = init(el.width, el.height); setIsOver(false);
          prevTouch.current = { ...ta }; raf.current = requestAnimationFrame(loop); return;
        }
      }

      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      /* ═══ GAME LOGIC ═══ */
      const playerY = h - 40;
      const breathScale = 1 + Math.sin(g.breathPhase) * 0.04;
      g.breathPhase += 0.015;
      g.formationOffsetX = Math.sin(g.frame * 0.01) * 30;

      if (!g.over && g.levelFlash <= 0 && g.phase !== 'challengeResults') {

        /* ── Player movement (always active unless captured) ── */
        if (g.playerAlive && g.capturedByBoss < 0) {
          if (k.has('arrowleft') || k.has('a') || ta['tleft'])
            g.playerX = Math.max(PLAYER_W / 2 + 5, g.playerX - PLAYER_SPEED);
          if (k.has('arrowright') || k.has('d') || ta['tright'])
            g.playerX = Math.min(w - PLAYER_W / 2 - 5, g.playerX + PLAYER_SPEED);

          if (g.fireCooldown > 0) g.fireCooldown--;
          if ((k.has(' ') || ta['fire']) && g.fireCooldown <= 0 && g.bullets.length < 10) {
            if (g.dualFighter) {
              g.bullets.push({ x: g.playerX - 10, y: playerY - PLAYER_H / 2, vy: -BULLET_SPEED });
              g.bullets.push({ x: g.playerX + 10, y: playerY - PLAYER_H / 2, vy: -BULLET_SPEED });
            } else {
              g.bullets.push({ x: g.playerX, y: playerY - PLAYER_H / 2, vy: -BULLET_SPEED });
            }
            g.fireCooldown = FIRE_COOLDOWN;
            sfx.shoot();
          }
        } else if (!g.playerAlive && g.capturedByBoss < 0) {
          g.playerRespawn--;
          if (g.playerRespawn <= 0) { g.playerAlive = true; g.playerX = w / 2; }
        }

        /* ── Player being captured (pulled up by beam) ── */
        if (g.capturedByBoss >= 0 && g.playerAlive) {
          const boss = g.enemies[g.capturedByBoss];
          if (boss && boss.state !== 'dead') {
            g.captureTimer++;
            /* Lerp player upward toward boss over 60 frames */
            const t = Math.min(g.captureTimer / 60, 1);
            g.captureY = playerY + (boss.y + 20 - playerY) * t;

            if (g.captureTimer >= 60) {
              /* Capture complete — boss gets the ship */
              boss.capturedShip = true;
              boss.beamPhase = 'retracting';
              boss.beamTimer = 0;
              g.capturedByBoss = -1;
              g.captureTimer = 0;
              g.playerAlive = false;
              g.lives--;
              sfx.capture();
              g.sparks.push(...boom(boss.x, boss.y + 20, 6, C.player));
              if (g.lives <= 0) {
                g.over = true; setIsOver(true);
                const hs = loadHighScores(); g.highScores = hs;
                g.enteringInitials = qualifiesForHighScore(g.score, hs);
              } else {
                g.playerRespawn = 90;
              }
            }
          } else {
            g.capturedByBoss = -1;
            g.captureTimer = 0;
          }
        }

        /* ══════════════════════════
           PHASE: ENTERING
           ══════════════════════════ */
        if (g.phase === 'entering') {
          let allEntered = true;
          for (const e of g.enemies) {
            if (e.state === 'dead') continue;
            if (e.state === 'entering') {
              if (g.frame < e.entryDelay) { allEntered = false; continue; }
              e.entryProgress += ENTRY_SPEED;
              if (e.entryProgress >= 1) {
                e.state = 'formation';
                e.entryProgress = 1;
              } else {
                const pos = evalPath(e.entryPath, e.entryProgress);
                e.x = pos.x; e.y = pos.y;
                allEntered = false;
              }
            }
            e.animFrame++;
            if (e.state === 'formation') {
              e.x = formPixelX(e.formCol, w, g.formationOffsetX, breathScale);
              e.y = formPixelY(e.formRow, breathScale);
            }
          }
          if (allEntered) g.phase = 'playing';
        }

        /* ══════════════════════════
           PHASE: PLAYING
           ══════════════════════════ */
        if (g.phase === 'playing') {
          /* Update all enemy positions */
          for (const e of g.enemies) {
            if (e.state === 'dead') continue;
            e.animFrame++;

            if (e.state === 'formation') {
              e.x = formPixelX(e.formCol, w, g.formationOffsetX, breathScale);
              e.y = formPixelY(e.formRow, breathScale);
            } else if (e.state === 'diving') {
              const speed = e.diveSpeed;
              e.diveProgress += speed;

              /* Clamp escorts with negative progress */
              if (e.diveProgress < 0) continue;

              const pos = evalPath(e.divePath, Math.min(e.diveProgress, 1));
              e.x = pos.x; e.y = pos.y;

              /* Fire bullets during dive (up to 2) */
              if (e.diveBulletsFired < 2 && !e.capturing) {
                const fireAt = e.diveBulletsFired === 0 ? 0.35 : 0.7;
                if (e.diveProgress >= fireAt) {
                  e.diveBulletsFired++;
                  g.enemyBullets.push({ x: e.x, y: e.y + ENEMY_SIZE / 2, vy: ENEMY_BULLET_SPEED + Math.min(g.level * 0.3, 3) });
                }
              }

              /* Dive complete */
              if (e.diveProgress >= 1.0) {
                if (e.capturing) {
                  /* Boss reached capture position → deploy tractor beam */
                  e.state = 'beaming';
                  e.beamPhase = 'deploying';
                  e.beamTimer = 0;
                  sfx.beamDeploy();
                } else {
                  e.state = 'returning';
                  e.isEscort = false;
                  e.escortBossIdx = -1;
                  /* Wrap to top if below screen */
                  if (e.y > h - 60) {
                    e.returnStartX = e.x + (Math.random() - 0.5) * 100;
                    e.returnStartY = -30;
                  } else {
                    e.returnStartX = e.x;
                    e.returnStartY = e.y;
                  }
                  e.returnProgress = 0;
                }
              }
            } else if (e.state === 'beaming') {
              /* Boss is hovering with tractor beam */
              e.beamTimer++;

              if (e.beamPhase === 'deploying' && e.beamTimer >= BEAM_DEPLOY_FRAMES) {
                e.beamPhase = 'active'; e.beamTimer = 0;
              } else if (e.beamPhase === 'active') {
                /* Check if player is in beam (can't capture dual fighter) */
                if (g.playerAlive && g.capturedByBoss < 0 && !g.dualFighter) {
                  const bx = e.x;
                  const prog = (playerY - e.y) / (playerY - e.y + 1);
                  const beamW = BEAM_WIDTH_TOP + (BEAM_WIDTH_BOT - BEAM_WIDTH_TOP) * Math.min(prog, 1);
                  if (Math.abs(g.playerX - bx) < beamW / 2) {
                    /* Player captured! Start pull-up */
                    g.capturedByBoss = g.enemies.indexOf(e);
                    g.captureTimer = 0;
                    g.captureY = playerY;
                    sfx.capture();
                  }
                }
                if (e.beamTimer >= BEAM_ACTIVE_FRAMES) {
                  e.beamPhase = 'retracting'; e.beamTimer = 0;
                }
              } else if (e.beamPhase === 'retracting' && e.beamTimer >= BEAM_RETRACT_FRAMES) {
                e.beamPhase = 'none';
                e.state = 'returning';
                e.capturing = false;
                e.returnStartX = e.x;
                e.returnStartY = e.y;
                e.returnProgress = 0;
              }
            } else if (e.state === 'returning') {
              e.returnProgress += 1 / 60;
              const tx = formPixelX(e.formCol, w, g.formationOffsetX, breathScale);
              const ty = formPixelY(e.formRow, breathScale);
              const t = Math.min(e.returnProgress, 1);
              e.x = e.returnStartX + (tx - e.returnStartX) * t;
              e.y = e.returnStartY + (ty - e.returnStartY) * t;
              if (e.returnProgress >= 1.0) {
                e.state = 'formation';
                e.isEscort = false;
                e.escortBossIdx = -1;
              }
            }
          }

          /* ── Dive attack timer ── */
          g.diveTimer++;
          g.diveInterval = Math.max(35, BASE_DIVE_INTERVAL - g.level * 12);

          if (g.diveTimer >= g.diveInterval) {
            g.diveTimer = 0;
            const maxDivers = Math.min(g.level + 1, 6);
            const currentDivers = g.enemies.filter(e => e.state === 'diving' || e.state === 'beaming').length;
            const canDive = maxDivers - currentDivers;
            const candidates = g.enemies.filter(e => e.state === 'formation');

            if (candidates.length > 0 && canDive > 0) {
              const count = Math.min(1 + Math.floor(Math.random() * 2), canDive, candidates.length);
              for (let di = 0; di < count; di++) {
                const idx = Math.floor(Math.random() * candidates.length);
                const e = candidates.splice(idx, 1)[0];
                const eIdx = g.enemies.indexOf(e);

                /* Boss capture mechanic — never activate when player has dual fighter */
                let doCapture = false;
                if (e.type === 'boss' && !e.capturedShip && !g.dualFighter) {
                  g.bossDiveCount++;
                  if (g.bossDiveCount % 4 === 0) doCapture = true;
                }

                if (doCapture) {
                  /* Capture dive */
                  e.capturing = true;
                  e.state = 'diving';
                  e.diveProgress = 0;
                  e.diveBulletsFired = 99;
                  const capPath = generateCapturePath(e.x, e.y, g.playerX, h);
                  e.divePath = capPath;
                  e.diveSpeed = 3 / approxPathLen(capPath);
                  sfx.dive();
                } else {
                  /* Normal dive */
                  const pattern = pickDivePattern(g.level);
                  const path = generateDivePath(pattern, e.x, e.y, g.playerX + (Math.random() - 0.5) * 80, w, h);
                  e.state = 'diving';
                  e.diveProgress = 0;
                  e.diveBulletsFired = 0;
                  e.divePath = path;
                  e.diveSpeed = 3.5 / approxPathLen(path);
                  e.capturing = false;
                  sfx.dive();

                  /* Boss escort mechanic */
                  if (e.type === 'boss') {
                    const nearButterflies = g.enemies.filter(esc =>
                      esc.type === 'butterfly' && esc.state === 'formation' &&
                      Math.abs(esc.formCol - e.formCol) <= 2 && !esc.isEscort
                    );
                    const numEscorts = Math.min(nearButterflies.length, Math.random() > 0.4 ? 2 : 1);
                    for (let ei = 0; ei < numEscorts; ei++) {
                      const esc = nearButterflies[ei];
                      esc.state = 'diving';
                      esc.isEscort = true;
                      esc.escortBossIdx = eIdx;
                      esc.diveProgress = -0.06 * (ei + 1);
                      esc.diveBulletsFired = 0;
                      const offset = (ei === 0 ? -28 : 28);
                      esc.divePath = path.map(s => ({
                        ...s, x0: s.x0 + offset, cx0: s.cx0 + offset, cx1: s.cx1 + offset, x1: s.x1 + offset,
                      }));
                      esc.diveSpeed = e.diveSpeed;
                    }
                  }
                }
              }
            }
          }

          /* (beam transition now handled inline in dive-complete check above) */

          /* ── Rescue ship animation ── */
          if (g.rescueShip) {
            const rs = g.rescueShip;
            if (!rs.docked) {
              if (rs.y < playerY - 5) {
                rs.y += RESCUE_SPEED;
                const dx = g.playerX - rs.x;
                rs.x += Math.sign(dx) * Math.min(Math.abs(dx), 1.5);
              } else {
                const dx = g.playerX - rs.x;
                if (Math.abs(dx) > 5) {
                  rs.x += Math.sign(dx) * Math.min(Math.abs(dx), 2.5);
                } else {
                  rs.docked = true;
                  g.dualFighter = true;
                  sfx.rescue();
                  g.sparks.push(...boom(g.playerX, playerY, 10, C.player));
                  g.rescueShip = null;
                }
              }
            }
          }

          /* ── Level complete ── */
          if (g.enemies.every(e => e.state === 'dead')) {
            g.level++;
            g.phase = 'levelComplete';
            g.levelFlash = 90;
            sfx.levelUp();
          }
        }

        /* ══════════════════════════
           PHASE: CHALLENGE
           ══════════════════════════ */
        if (g.phase === 'challenge') {
          g.challengeTimer++;

          /* Intro period */
          if (g.challengeWave < 0) {
            if (g.challengeTimer >= CHALLENGE_INTRO_FRAMES) {
              g.challengeWave = 0;
              g.challengeTimer = 0;
              g.challengeEnemies = spawnChallengeWave(0, w, h);
            }
          } else {
            /* Update challenge enemies */
            let allDone = true;
            for (const ce of g.challengeEnemies) {
              if (!ce.alive) continue;
              const effectiveProgress = ce.progress - ce.stagger;
              if (effectiveProgress < 0) {
                ce.progress += ce.speed;
                allDone = false;
                continue;
              }
              ce.progress += ce.speed;
              if (effectiveProgress >= 1) {
                ce.alive = false;
                continue;
              }
              const pos = evalPath(ce.path, effectiveProgress);
              ce.x = pos.x; ce.y = pos.y;
              allDone = false;
            }

            if (allDone) {
              g.challengeWave++;
              if (g.challengeWave >= CHALLENGE_WAVES) {
                /* Challenge complete → results */
                g.phase = 'challengeResults';
                g.challengeTimer = 0;
                const total = CHALLENGE_WAVES * CHALLENGE_ENEMIES_PER_WAVE;
                if (g.challengeHits >= total) {
                  g.score += 10000;
                  sfx.perfect();
                }
              } else {
                g.challengeTimer = 0;
                g.challengeEnemies = spawnChallengeWave(g.challengeWave, w, h);
              }
            }
          }
        }

        /* ── Move player bullets ── */
        g.bullets = g.bullets.filter(b => { b.y += b.vy; return b.y > -10; });

        /* ── Move enemy bullets (not during challenge) ── */
        if (g.phase !== 'challenge') {
          g.enemyBullets = g.enemyBullets.filter(b => { b.y += b.vy; return b.y < h + 10; });
        }

        /* ── Bullet → enemy collision (regular) ── */
        if (g.phase === 'entering' || g.phase === 'playing') {
          for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
            const b = g.bullets[bi];
            let hit = false;
            for (let ei = 0; ei < g.enemies.length; ei++) {
              const e = g.enemies[ei];
              if (e.state === 'dead' || e.state === 'entering') continue;
              if (Math.abs(b.x - e.x) < ENEMY_SIZE / 2 && Math.abs(b.y - e.y) < ENEMY_SIZE / 2) {
                e.hp--;
                if (e.hp <= 0) {
                  let pts = (e.state === 'diving' || e.state === 'returning' || e.state === 'beaming') ? e.divePoints : e.points;
                  /* Boss escort scoring */
                  if (e.type === 'boss' && (e.state === 'diving' || e.state === 'beaming')) {
                    const livingEscorts = g.enemies.filter(esc => esc.isEscort && esc.escortBossIdx === ei && esc.state !== 'dead').length;
                    if (livingEscorts >= 2) pts = 1600;
                    else if (livingEscorts >= 1) pts = 800;
                  }
                  if (g.dualFighter) pts *= 2;
                  g.score += pts;
                  g.sparks.push(...boom(e.x, e.y, 10, e.color));
                  /* Rescue captured ship */
                  if (e.capturedShip && !g.rescueShip) {
                    e.capturedShip = false;
                    g.rescueShip = { x: e.x, y: e.y, targetX: g.playerX, docked: false };
                    g.score += 1000;
                    g.sparks.push(...boom(e.x, e.y + 10, 8, C.player));
                  }
                  e.state = 'dead';
                  sfx.enemyHit();
                } else {
                  g.sparks.push(...boom(e.x, e.y, 5, '#FFFFFF'));
                  sfx.enemyHit();
                }
                hit = true; break;
              }
            }
            if (hit) g.bullets.splice(bi, 1);
          }
        }

        /* ── Bullet → challenge enemy collision ── */
        if (g.phase === 'challenge') {
          for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
            const b = g.bullets[bi];
            let hit = false;
            for (const ce of g.challengeEnemies) {
              if (!ce.alive) continue;
              const ep = ce.progress - ce.stagger;
              if (ep < 0 || ep >= 1) continue;
              if (Math.abs(b.x - ce.x) < ENEMY_SIZE / 2 && Math.abs(b.y - ce.y) < ENEMY_SIZE / 2) {
                ce.alive = false;
                g.challengeHits++;
                const pts = (g.dualFighter ? 200 : 100);
                g.score += pts;
                g.sparks.push(...boom(ce.x, ce.y, 8, ce.color));
                sfx.enemyHit();
                hit = true; break;
              }
            }
            if (hit) g.bullets.splice(bi, 1);
          }
        }

        /* ── Enemy bullet → player collision ── */
        if (g.playerAlive && g.capturedByBoss < 0) {
          const pw = g.dualFighter ? PLAYER_W + 20 : PLAYER_W;
          for (let bi = g.enemyBullets.length - 1; bi >= 0; bi--) {
            const b = g.enemyBullets[bi];
            if (Math.abs(b.x - g.playerX) < pw / 2 && Math.abs(b.y - playerY) < PLAYER_H / 2) {
              g.enemyBullets.splice(bi, 1);
              if (g.dualFighter) {
                g.dualFighter = false; g.shake = 8; sfx.playerHit();
                g.sparks.push(...boom(g.playerX + 10, playerY, 8, C.player));
              } else {
                g.playerAlive = false; g.lives--; g.shake = 12; sfx.playerHit();
                g.sparks.push(...boom(g.playerX, playerY, 12, C.player));
                if (g.lives <= 0) {
                  g.over = true; setIsOver(true);
                  const hs = loadHighScores(); g.highScores = hs;
                  g.enteringInitials = qualifiesForHighScore(g.score, hs);
                } else { g.playerRespawn = 90; }
              }
              break;
            }
          }
        }

        /* ── Diving enemy body → player collision ── */
        if (g.playerAlive && g.capturedByBoss < 0 && (g.phase === 'playing' || g.phase === 'entering')) {
          const pw = g.dualFighter ? PLAYER_W + 20 : PLAYER_W;
          for (const e of g.enemies) {
            if (e.state !== 'diving' && e.state !== 'returning') continue;
            if (Math.abs(e.x - g.playerX) < (pw + ENEMY_SIZE) / 2 && Math.abs(e.y - playerY) < (PLAYER_H + ENEMY_SIZE) / 2) {
              e.state = 'dead';
              g.sparks.push(...boom(e.x, e.y, 8, e.color));
              sfx.enemyHit();
              if (e.capturedShip && !g.rescueShip) {
                e.capturedShip = false;
                g.rescueShip = { x: e.x, y: e.y, targetX: g.playerX, docked: false };
                g.score += 1000;
              }
              if (g.dualFighter) {
                g.dualFighter = false; g.shake = 8; sfx.playerHit();
                g.sparks.push(...boom(g.playerX + 10, playerY, 8, C.player));
              } else {
                g.playerAlive = false; g.lives--; g.shake = 12; sfx.playerHit();
                g.sparks.push(...boom(g.playerX, playerY, 12, C.player));
                if (g.lives <= 0) {
                  g.over = true; setIsOver(true);
                  const hs = loadHighScores(); g.highScores = hs;
                  g.enteringInitials = qualifiesForHighScore(g.score, hs);
                } else { g.playerRespawn = 90; }
              }
              break;
            }
          }
        }
      }

      /* ── Level transition ── */
      if (g.levelFlash > 0) {
        g.levelFlash--;
        if (g.levelFlash <= 0 && g.phase === 'levelComplete') {
          if (isChallenge(g.level)) {
            g.phase = 'challenge';
            g.challengeWave = -1;
            g.challengeHits = 0;
            g.challengeTimer = 0;
            g.challengeEnemies = [];
            g.bullets = [];
            g.enemyBullets = [];
            g.enemies = [];
            sfx.challengeFanfare();
          } else {
            g.phase = 'entering';
            g.enemies = makeFormation(g.level, w, h);
            g.bullets = [];
            g.enemyBullets = [];
            g.diveTimer = 0;
            g.diveInterval = Math.max(35, BASE_DIVE_INTERVAL - g.level * 12);
            g.playerAlive = true;
            g.playerX = w / 2;
            g.playerRespawn = 0;
          }
        }
      }

      /* ── Challenge results transition ── */
      if (g.phase === 'challengeResults') {
        g.challengeTimer++;
        if (g.challengeTimer >= CHALLENGE_RESULTS_FRAMES) {
          g.level++;
          g.phase = 'levelComplete';
          g.levelFlash = 90;
          sfx.levelUp();
        }
      }

      /* ── Stars ── */
      for (const s of g.stars) {
        s.y += s.speed;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        if (s.x > w) s.x = Math.random() * w;
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
      if (g.shake > 0) { g.shake *= 0.85; if (g.shake < 0.5) g.shake = 0; }

      if (g.over) g.overTimer++;

      /* ═══════════════════════════════════
         RENDER
         ═══════════════════════════════════ */
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);

      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* ── Starfield ── */
      for (const s of g.stars) {
        ctx.globalAlpha = 0.4 + s.speed * 0.4;
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Enemies ── */
      for (const e of g.enemies) {
        if (e.state === 'dead') continue;
        if (e.state === 'entering' && g.frame < e.entryDelay) continue;

        /* Draw beam */
        if ((e.state === 'beaming') && e.beamPhase !== 'none') {
          drawBeam(ctx, e, h, g.frame);
        }

        drawEnemy(ctx, e, ENEMY_SIZE);
      }

      /* ── Challenge enemies ── */
      if (g.phase === 'challenge') {
        for (const ce of g.challengeEnemies) {
          if (!ce.alive) continue;
          const ep = ce.progress - ce.stagger;
          if (ep < 0 || ep >= 1) continue;
          drawEnemy(ctx, ce, ENEMY_SIZE);
        }
      }

      /* ── Rescue ship ── */
      if (g.rescueShip && !g.rescueShip.docked) {
        const rs = g.rescueShip;
        const alpha = 0.7 + 0.3 * Math.sin(g.frame * 0.15);
        drawPlayer(ctx, rs.x, rs.y, alpha);
      }

      /* ── Player bullets ── */
      ctx.fillStyle = C.bullet;
      for (const b of g.bullets) {
        ctx.save();
        ctx.shadowColor = C.player; ctx.shadowBlur = 6;
        ctx.fillRect(b.x - 1.5, b.y - 6, 3, 12);
        ctx.restore();
      }

      /* ── Enemy bullets ── */
      for (const b of g.enemyBullets) {
        ctx.save();
        ctx.fillStyle = C.grunt; ctx.shadowColor = C.grunt; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* ── Player ── */
      if (g.capturedByBoss >= 0 && g.playerAlive) {
        /* Player being pulled up by beam */
        const alpha = 0.6 + 0.4 * Math.sin(g.frame * 0.2);
        drawPlayer(ctx, g.playerX, g.captureY, alpha);
      } else if (g.playerAlive) {
        const alpha = g.playerRespawn > 0 ? 0.5 + 0.5 * Math.sin(g.frame * 0.3) : 1;
        if (g.dualFighter) {
          drawPlayer(ctx, g.playerX - 10, playerY, alpha);
          drawPlayer(ctx, g.playerX + 10, playerY, alpha);
        } else {
          drawPlayer(ctx, g.playerX, playerY, alpha);
        }
      } else if (!g.over) {
        if (Math.floor(g.frame / 10) % 2 === 0) {
          ctx.globalAlpha = 0.3; ctx.fillStyle = C.player;
          ctx.beginPath(); ctx.arc(w / 2, playerY, 4, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
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
      ctx.fillText(`STAGE ${g.level}`, w / 2, 30);

      /* Stage indicators (bottom-right) */
      const badgeY = h - 20;
      let badgeX = w - 20;
      ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillStyle = C.ui;
      let remaining = g.level;
      const badges = [50, 30, 20, 10, 5, 1];
      const badgeColors = [C.boss, C.butterfly, C.player, C.grunt, C.score, C.ui];
      for (let bi = 0; bi < badges.length; bi++) {
        const val = badges[bi];
        while (remaining >= val) {
          ctx.fillStyle = badgeColors[bi];
          const sz = Math.min(8, 4 + val * 0.1);
          ctx.fillRect(badgeX - sz, badgeY - sz / 2, sz, sz);
          badgeX -= sz + 3;
          remaining -= val;
        }
      }

      /* Lives */
      for (let i = 0; i < g.lives; i++) {
        ctx.fillStyle = C.player;
        ctx.beginPath();
        const lx = 28 + i * 22, ly = 60;
        ctx.moveTo(lx, ly - 6); ctx.lineTo(lx + 5, ly + 4); ctx.lineTo(lx - 5, ly + 4);
        ctx.closePath(); ctx.fill();
      }

      /* Dual fighter indicator */
      if (g.dualFighter) {
        ctx.fillStyle = C.boss; ctx.font = '12px monospace'; ctx.textAlign = 'left';
        ctx.fillText('DUAL', 20, 80);
      }

      /* ── Launch prompt ── */
      if (g.frame < 120 && !g.over && g.levelFlash <= 0 && g.phase !== 'challenge' && g.phase !== 'challengeResults') {
        ctx.fillStyle = C.ui;
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(g.frame * 0.06);
        ctx.font = '16px monospace'; ctx.textAlign = 'center';
        ctx.fillText(showTouch.current ? 'USE BUTTONS TO PLAY' : 'ARROWS + SPACE TO FIRE', w / 2, playerY - 50);
        ctx.globalAlpha = 1;
      }

      /* ── Challenge stage banner ── */
      if (g.phase === 'challenge' && g.challengeWave < 0) {
        const alpha = Math.min(1, g.challengeTimer / 30);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = C.boss; ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center';
        ctx.fillText('CHALLENGING STAGE', w / 2, h / 2 - 20);
        ctx.fillStyle = C.ui; ctx.font = '18px monospace';
        ctx.fillText(`STAGE ${g.level}`, w / 2, h / 2 + 20);
        ctx.globalAlpha = 1;
      }

      /* ── Challenge results ── */
      if (g.phase === 'challengeResults') {
        const alpha = Math.min(1, g.challengeTimer / 30);
        ctx.globalAlpha = alpha;
        const total = CHALLENGE_WAVES * CHALLENGE_ENEMIES_PER_WAVE;
        const isPerfect = g.challengeHits >= total;

        ctx.fillStyle = C.ui; ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center';
        ctx.fillText('RESULTS', w / 2, h / 2 - 80);

        ctx.fillStyle = C.score; ctx.font = '22px monospace';
        ctx.fillText(`NUMBER OF HITS: ${g.challengeHits}`, w / 2, h / 2 - 30);

        const ratio = total > 0 ? Math.round((g.challengeHits / total) * 100) : 0;
        ctx.fillStyle = C.ui; ctx.font = '18px monospace';
        ctx.fillText(`HIT/MISS RATIO: ${ratio}%`, w / 2, h / 2 + 10);

        if (isPerfect) {
          ctx.fillStyle = C.player; ctx.font = 'bold 32px monospace';
          const flash = 0.7 + 0.3 * Math.sin(g.challengeTimer * 0.08);
          ctx.globalAlpha = flash;
          ctx.fillText('PERFECT!', w / 2, h / 2 + 60);
          ctx.fillStyle = C.score; ctx.font = '20px monospace';
          ctx.fillText('+10,000 BONUS', w / 2, h / 2 + 95);
        }
        ctx.globalAlpha = 1;
      }

      /* ── Level flash ── */
      if (g.levelFlash > 0) {
        const alpha = Math.min(1, g.levelFlash / 30);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = C.score; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
        ctx.globalAlpha = alpha;
        ctx.fillText(`STAGE ${g.level}`, w / 2, h / 2);
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
                const isPlayerScore = g.scoreSubmitted && i === g.scoreIndex;
                ctx.fillStyle = isPlayerScore ? C.score : C.ui;
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
        for (const b of btns) drawBtn(ctx, b, !!ta[b.id], sfx.muted);
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
        <div data-galaga-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-galaga-game], [data-galaga-game] * { cursor: default !important; }`}</style>}
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
