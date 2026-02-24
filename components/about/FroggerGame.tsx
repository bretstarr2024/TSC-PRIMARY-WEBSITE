'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Client data for obstacles ── */
const allClients = [
  'ADP', 'Oracle', 'SAP', 'ServiceNow', 'Thomson Reuters',
  'Bank of America', 'Equifax', 'Korn Ferry', 'Willis Towers Watson',
  'Aon', 'Randstad', 'Lyft', 'Zendesk', 'John Wiley & Sons',
  'Infor', 'Ceridian', 'Kronos', 'Ultimate Software', 'Paychex',
  'Insperity', 'Alight Solutions', 'Workhuman', 'O.C. Tanner',
  'PlanSource', 'Indeed', 'SeatGeek', 'ZipRecruiter', 'CareerBuilder',
  'iCIMS', 'Jobvite', 'HireVue', 'SmartRecruiters', 'Greenhouse',
  'Checkr', 'HireRight', 'Coursera', 'Udemy', 'MasterClass',
  'Degreed', 'Instructure', 'Gusto', 'SoFi', 'Fitbit', 'Headspace',
  'Medallia', 'Culture Amp', 'Virgin Pulse', 'Bright Horizons',
  'Multiverse', 'DailyPay', 'Cornerstone OnDemand', 'Bitwarden',
];

/* ── Brand colors ── */
const TANGERINE = '#FF5910';
const CACTUS = '#E1FF00';
const TIDAL = '#73F5FF';
const SPRINKLES = '#ED0AD2';
const SHROOMY = '#d1d1c6';
const GREIGE = '#6D6D69';
const BG = '#141213';
const LANE_COLORS = [TANGERINE, TIDAL, SPRINKLES, CACTUS, TANGERINE];

/* ── High scores ── */
const HS_KEY = 'tsc-frogger-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  hop() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(350, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.06);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.06);
  }

  hit() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const dur = 0.3;
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
interface Pill { x: number; w: number; label: string }

interface Lane {
  y: number;
  speed: number;
  dir: 1 | -1;
  pills: Pill[];
  color: string;
}

interface HighScore { initials: string; score: number }

interface GameState {
  lanes: Lane[];
  playerX: number;
  playerLane: number; // 0 = bottom safe, 1-5 = traffic, 6 = top goal
  lives: number;
  score: number;
  level: number;
  over: boolean;
  won: boolean;
  respawning: number;
  shake: number;
  laneH: number;
  pillH: number;
  started: boolean;
  frame: number;
  overTimer: number;
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
}

interface TBtn { id: string; x: number; y: number; r: number; label: string }

/* ── Helpers ── */
function measurePill(ctx: CanvasRenderingContext2D, label: string, pillH: number): number {
  ctx.font = `bold ${pillH * 0.34}px Inter, system-ui, sans-serif`;
  return ctx.measureText(label).width + pillH * 2;
}

function buildLane(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  laneH: number,
  pillH: number,
  speed: number,
  dir: 1 | -1,
  color: string,
  laneY: number,
  clientSubset: string[],
): Lane {
  const pills: Pill[] = [];
  let x = dir === 1 ? -canvasW * 0.3 : 0;
  const gap = pillH * 4.5 + Math.random() * pillH * 3;

  for (let i = 0; i < clientSubset.length; i++) {
    const label = clientSubset[i];
    const w = measurePill(ctx, label, pillH);
    pills.push({ x, w, label });
    x += w + gap;
    if (x > canvasW * 3) break;
  }

  return { y: laneY, speed, dir, pills, color };
}

/* ── Draw a side-view car with client name ── */
function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string, label: string, dir: 1 | -1,
) {
  const r = Math.min(6, h * 0.15);

  // Car body fill
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = hexToRgba(color, 0.12);
  ctx.fill();

  // Hood + windshield (clipped to body shape)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  // Hood / bumper section
  const hoodW = Math.max(8, w * 0.1);
  ctx.fillStyle = hexToRgba(color, 0.28);
  if (dir === 1) {
    ctx.fillRect(x + w - hoodW, y, hoodW, h);
  } else {
    ctx.fillRect(x, y, hoodW, h);
  }

  // Windshield
  const winH = h * 0.42;
  const winW = Math.min(w * 0.18, 30);
  const winY = y + (h - winH) / 2;
  const winX = dir === 1 ? x + w - hoodW - winW - 4 : x + hoodW + 4;
  ctx.fillStyle = 'rgba(115, 245, 255, 0.07)';
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(winX, winY, winW, winH);

  ctx.restore();

  // Body outline
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.strokeStyle = hexToRgba(color, 0.45);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wheels (semicircles at bottom edge)
  const wheelR = Math.max(3, h * 0.15);
  const wheelY2 = y + h;
  const fwX = dir === 1 ? x + w * 0.78 : x + w * 0.22;
  const rwX = dir === 1 ? x + w * 0.22 : x + w * 0.78;

  for (const wx of [fwX, rwX]) {
    ctx.beginPath();
    ctx.arc(wx, wheelY2, wheelR, Math.PI, 0);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(wx, wheelY2, wheelR * 0.5, Math.PI, 0);
    ctx.fillStyle = '#555';
    ctx.fill();
  }

  // Headlights (front)
  const hlR = Math.max(1.5, h * 0.06);
  const hlX = dir === 1 ? x + w - 2 : x + 2;
  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(hlX, y + h * 0.28, hlR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(hlX, y + h * 0.72, hlR, 0, Math.PI * 2);
  ctx.fill();

  // Taillights (rear)
  const tlR = hlR * 0.8;
  const tlX = dir === 1 ? x + 3 : x + w - 3;
  ctx.fillStyle = '#FF4444';
  ctx.beginPath();
  ctx.arc(tlX, y + h * 0.28, tlR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tlX, y + h * 0.72, tlR, 0, Math.PI * 2);
  ctx.fill();

  // Client name
  ctx.fillStyle = SHROOMY;
  ctx.font = `bold ${h * 0.34}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
}

/* ── High score helpers ── */
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

/* ── Touch button layout ── */
function calcButtons(w: number, h: number, g: GameState): TBtn[] {
  const r = Math.max(18, Math.min(26, Math.min(w, h) * 0.05));
  const btns: TBtn[] = [];
  btns.push({ id: 'close', x: 22, y: 22, r: 14, label: '\u2715' });
  btns.push({ id: 'mute', x: w - 22, y: 22, r: 14, label: '\u266B' });

  if (g.over && g.overTimer >= 40) {
    if (g.enteringInitials) {
      const cy = h * 0.82;
      const sp = r * 2.2;
      btns.push({ id: 'i-left', x: w / 2 - sp * 2, y: cy, r, label: '\u25C0' });
      btns.push({ id: 'i-up', x: w / 2 - sp, y: cy, r, label: '\u25B2' });
      btns.push({ id: 'i-confirm', x: w / 2, y: cy, r: r * 1.1, label: '\u2713' });
      btns.push({ id: 'i-down', x: w / 2 + sp, y: cy, r, label: '\u25BC' });
      btns.push({ id: 'i-right', x: w / 2 + sp * 2, y: cy, r, label: '\u25B6' });
    } else {
      btns.push({ id: 'restart', x: w / 2, y: h * 0.88, r: r * 1.3, label: '\u25B6' });
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

/* ── D-pad drawing ── */
function drawDpad(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const btnSize = 52;
  const pad = 20;
  const cx = w - pad - btnSize * 1.5;
  const cy = h - pad - btnSize * 1.5;

  const buttons = [
    { label: '\u25B2', x: cx, y: cy - btnSize - 8 },
    { label: '\u25BC', x: cx, y: cy + btnSize + 8 },
    { label: '\u25C0', x: cx - btnSize - 8, y: cy },
    { label: '\u25B6', x: cx + btnSize + 8, y: cy },
  ];

  for (const btn of buttons) {
    ctx.beginPath();
    ctx.arc(btn.x, btn.y, btnSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${btnSize * 0.4}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(btn.label, btn.x, btn.y);
  }
}

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
export function FroggerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const ochoImg = useRef<HTMLImageElement | null>(null);
  const animRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const touchBtns = useRef<Record<string, boolean>>({});
  const prevBtns = useRef<Record<string, boolean>>({});
  const showTouch = useRef(false);
  const btnsRef = useRef<TBtn[]>([]);
  const bossActive = useRef(false);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const NUM_LANES = 5;
    const laneH = h / (NUM_LANES + 2);
    const pillH = Math.min(laneH * 0.55, 38);

    const lanes: Lane[] = [];
    const baseSpeed = 0.35;

    for (let i = 0; i < NUM_LANES; i++) {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const speed = baseSpeed + Math.random() * 0.25 + i * 0.08;
      const laneY = h - laneH * (i + 1) - laneH;
      const start = (i * 10) % allClients.length;
      const subset = [...allClients.slice(start), ...allClients.slice(0, start)];
      lanes.push(buildLane(ctx, w, laneH, pillH, speed, dir, LANE_COLORS[i % LANE_COLORS.length], laneY, subset));
    }

    gameRef.current = {
      lanes,
      playerX: w / 2,
      playerLane: 0,
      lives: 3,
      score: 0,
      level: 1,
      over: false,
      won: false,
      respawning: 0,
      shake: 0,
      laneH,
      pillH,
      started: false,
      frame: 0,
      overTimer: 0,
      enteringInitials: false,
      initialsChars: [0, 0, 0],
      initialsPos: 0,
      highScores: [],
      scoreSubmitted: false,
      scoreIndex: -1,
    };
  }, []);

  const getPlayerY = useCallback((g: GameState, h: number): number => {
    if (g.playerLane === 0) return h - g.laneH * 0.5;
    if (g.playerLane >= 6) return g.laneH * 0.5;
    return h - g.laneH * (g.playerLane + 0.5);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    if (parent) {
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    /* Load Ocho mascot */
    const img = new Image();
    img.src = '/images/ocho-color.png';
    ochoImg.current = img;

    /* Sound engine */
    const sfx = new SFX();

    /* Init game state */
    initGame();

    /* ── Touch handlers ── */
    const updateBtnState = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      const g = gameRef.current;
      if (!g || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const logW = canvas.width / dpr;
      const logH = canvas.height / dpr;
      const state: Record<string, boolean> = {};
      const btns = btnsRef.current;
      for (let t = 0; t < e.touches.length; t++) {
        const tx = (e.touches[t].clientX - rect.left) * (logW / rect.width);
        const ty = (e.touches[t].clientY - rect.top) * (logH / rect.height);
        for (const btn of btns) {
          if (Math.hypot(tx - btn.x, ty - btn.y) < btn.r * 1.5) {
            state[btn.id] = true;
          }
        }
      }
      touchBtns.current = state;
    };

    const handleTouchStart = (e: TouchEvent) => {
      updateBtnState(e);
      const g = gameRef.current;
      if (!g || !canvas || bossActive.current) return;

      if (!g.started) { g.started = true; sfx.hop(); return; }
      if (g.over) return; // Handled by system buttons in game loop

      const rect = canvas.getBoundingClientRect();
      const logW = canvas.width / dpr;
      const logH = canvas.height / dpr;

      /* D-pad movement */
      for (let i = 0; i < e.touches.length; i++) {
        const tx = (e.touches[i].clientX - rect.left) * (logW / rect.width);
        const ty = (e.touches[i].clientY - rect.top) * (logH / rect.height);

        const btnSize = 52;
        const pad = 20;
        const cx = logW - pad - btnSize * 1.5;
        const cy = logH - pad - btnSize * 1.5;
        const step = g.laneH * 0.7;

        const dpadBtns = [
          { action: 'up', x: cx, y: cy - btnSize - 8 },
          { action: 'down', x: cx, y: cy + btnSize + 8 },
          { action: 'left', x: cx - btnSize - 8, y: cy },
          { action: 'right', x: cx + btnSize + 8, y: cy },
        ];

        for (const btn of dpadBtns) {
          if (Math.hypot(tx - btn.x, ty - btn.y) < btnSize * 0.7) {
            if (btn.action === 'up' && g.playerLane < 6) { g.playerLane++; sfx.hop(); }
            else if (btn.action === 'down' && g.playerLane > 0) { g.playerLane--; sfx.hop(); }
            else if (btn.action === 'left') { g.playerX = Math.max(step, g.playerX - step); sfx.hop(); }
            else if (btn.action === 'right') { g.playerX = Math.min(logW - step, g.playerX + step); sfx.hop(); }
          }
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', updateBtnState, { passive: false });
    canvas.addEventListener('touchend', updateBtnState, { passive: false });
    canvas.addEventListener('touchcancel', updateBtnState, { passive: false });

    /* ── Keyboard handler ── */
    const onDown = (e: KeyboardEvent) => {
      if (bossActive.current) return;

      const g = gameRef.current;
      if (!g) return;

      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }

      if (!g.started) {
        g.started = true;
        sfx.hop();
        return;
      }

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
              setBossData({ game: 'frogger', score: g.score, initials });
            }
          } else if (/^[a-zA-Z]$/.test(key)) {
            g.initialsChars[g.initialsPos] = key.toUpperCase().charCodeAt(0) - 65;
            if (g.initialsPos < 2) g.initialsPos++;
          }
          return;
        }

        /* Not entering initials — viewing scores */
        if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }
        if (e.key === 'Enter') {
          keysRef.current.clear();
          initGame();
        }
        return;
      }

      /* Gameplay */
      if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }

      const logW = canvas.width / dpr;
      const step = g.laneH * 0.7;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp' || e.key === 'w') {
        if (g.playerLane < 6) { g.playerLane++; sfx.hop(); }
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (g.playerLane > 0) { g.playerLane--; sfx.hop(); }
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        g.playerX = Math.max(step, g.playerX - step);
        sfx.hop();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        g.playerX = Math.min(logW - step, g.playerX + step);
        sfx.hop();
      }

      keysRef.current.add(e.key);
    };

    const onUp = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let wasOver = false;

    /* ═══════════════════════════════════
       GAME LOOP
       ═══════════════════════════════════ */
    function loop() {
      const g = gameRef.current;
      if (!g || !ctx || !canvas) return;

      const dprLoop = window.devicePixelRatio || 1;
      const w = canvas.width / dprLoop;
      const h = canvas.height / dprLoop;
      g.frame++;

      const justTouched = (id: string): boolean => !!touchBtns.current[id] && !prevBtns.current[id];

      /* Calculate button positions */
      if (showTouch.current) {
        btnsRef.current = calcButtons(w, h, g);
      }

      /* ── Handle system button touches ── */
      if (g.over && g.overTimer >= 40 && showTouch.current) {
        if (g.enteringInitials) {
          if (justTouched('i-up')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          if (justTouched('i-down')) g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          if (justTouched('i-left')) g.initialsPos = Math.max(0, g.initialsPos - 1);
          if (justTouched('i-right')) g.initialsPos = Math.min(2, g.initialsPos + 1);
          if (justTouched('i-confirm')) {
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
              setBossData({ game: 'frogger', score: g.score, initials });
            }
          }
        } else if (justTouched('restart')) {
          wasOver = false;
          initGame();
          prevBtns.current = { ...touchBtns.current };
          animRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      /* ═══ UPDATE ═══ */

      /* Always drift pills (even on start screen) */
      for (const lane of g.lanes) {
        const speedMult = g.started ? 1 + (g.level - 1) * 0.08 : 0.5;
        for (const pill of lane.pills) {
          pill.x += lane.speed * lane.dir * speedMult;
        }
        for (const pill of lane.pills) {
          if (lane.dir === 1 && pill.x > w + 100) {
            let minX = 0;
            for (const p of lane.pills) {
              if (p !== pill && p.x < minX) minX = p.x;
            }
            pill.x = minX - pill.w - g.pillH * 3 - Math.random() * g.pillH * 2;
          } else if (lane.dir === -1 && pill.x + pill.w < -100) {
            let maxR = w;
            for (const p of lane.pills) {
              if (p !== pill) {
                const right = p.x + p.w;
                if (right > maxR) maxR = right;
              }
            }
            pill.x = maxR + g.pillH * 3 + Math.random() * g.pillH * 2;
          }
        }
      }

      if (g.started && !g.over) {
        /* Collision check */
        if (g.respawning > 0) {
          g.respawning--;
        } else if (g.playerLane >= 1 && g.playerLane <= 5) {
          const lane = g.lanes[g.playerLane - 1];
          const py = getPlayerY(g, h);
          const playerSize = g.laneH * 0.35;
          const px = g.playerX;

          for (const pill of lane.pills) {
            const pillTop = lane.y + (g.laneH - g.pillH) / 2;
            const pillBot = pillTop + g.pillH;
            const pillL = pill.x;
            const pillR = pill.x + pill.w;

            if (
              px + playerSize * 0.4 > pillL &&
              px - playerSize * 0.4 < pillR &&
              py + playerSize * 0.4 > pillTop &&
              py - playerSize * 0.4 < pillBot
            ) {
              g.lives--;
              g.shake = 12;
              sfx.hit();
              if (g.lives <= 0) {
                g.over = true;
                const hs = loadHighScores();
                g.highScores = hs;
                g.enteringInitials = qualifiesForHighScore(g.score, hs);
              } else {
                g.playerLane = 0;
                g.playerX = w / 2;
                g.respawning = 60;
              }
              break;
            }
          }
        }

        /* Win check — reached top */
        if (g.playerLane >= 6) {
          g.score += 10 * g.level;
          g.level++;
          g.playerLane = 0;
          g.playerX = w / 2;
          sfx.levelUp();
          for (const lane of g.lanes) {
            lane.speed += 0.06;
          }
        }
      }

      /* Shake decay */
      if (g.shake > 0) {
        g.shake *= g.over ? 0.85 : 0.9;
        if (g.shake < 0.3) g.shake = 0;
      }

      /* Game over timer + sound */
      if (g.over) g.overTimer++;
      if (g.over && !wasOver) { sfx.gameOver(); wasOver = true; }
      if (!g.over) wasOver = false;

      /* ═══════════════════════════════════
         RENDER
         ═══════════════════════════════════ */
      ctx.save();
      if (g.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * g.shake * 2,
          (Math.random() - 0.5) * g.shake * 2,
        );
      }

      /* Background */
      ctx.fillStyle = BG;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* Safe zones */
      const safeAlpha = 0.04;
      ctx.fillStyle = `rgba(225, 255, 0, ${safeAlpha})`;
      ctx.fillRect(0, h - g.laneH, w, g.laneH);
      ctx.fillRect(0, 0, w, g.laneH);

      /* Goal text */
      ctx.fillStyle = CACTUS;
      ctx.globalAlpha = 0.3;
      ctx.font = `bold ${g.laneH * 0.25}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SAFE ZONE', w / 2, g.laneH * 0.6);
      ctx.globalAlpha = 1;

      /* Start zone text */
      ctx.fillStyle = CACTUS;
      ctx.globalAlpha = 0.3;
      ctx.fillText('START', w / 2, h - g.laneH * 0.4);
      ctx.globalAlpha = 1;

      /* Lane dividers */
      for (let i = 0; i <= 5; i++) {
        const ly = h - g.laneH * (i + 1);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(w, ly);
        ctx.stroke();
      }

      /* Draw cars */
      for (const lane of g.lanes) {
        for (const pill of lane.pills) {
          const px = pill.x;
          const py = lane.y + (g.laneH - g.pillH) / 2;
          drawCar(ctx, px, py, pill.w, g.pillH, lane.color, pill.label, lane.dir);
        }
      }

      /* Draw player (Ocho) — only when game has started */
      if (g.started && !g.over) {
        const py = getPlayerY(g, h);
        const playerSize = g.laneH * 0.45;
        const blinkOn = g.respawning === 0 || Math.floor(g.respawning / 4) % 2 === 0;

        if (blinkOn) {
          if (ochoImg.current && ochoImg.current.complete && ochoImg.current.naturalWidth > 0) {
            ctx.shadowColor = SPRINKLES;
            ctx.shadowBlur = 18;
            ctx.drawImage(
              ochoImg.current,
              g.playerX - playerSize / 2,
              py - playerSize / 2,
              playerSize,
              playerSize,
            );
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = SPRINKLES;
            ctx.beginPath();
            ctx.arc(g.playerX, py, playerSize / 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* HUD — when started and not in game-over overlay */
      if (g.started && !g.over) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillStyle = CACTUS;
        ctx.font = `bold ${Math.min(18, w * 0.025)}px monospace`;
        ctx.fillText(`SCORE: ${g.score}`, 16, 16);

        ctx.fillStyle = TIDAL;
        ctx.fillText(`LEVEL ${g.level}`, 16, 38);

        ctx.textAlign = 'right';
        ctx.fillStyle = TANGERINE;
        for (let i = 0; i < g.lives; i++) {
          ctx.fillText('\u2665', w - 16 - i * 24, 16);
        }
      }

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(20,18,19,0.85)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = TANGERINE;
        ctx.font = `bold ${Math.min(36, w * 0.05)}px monospace`;
        ctx.fillText('GAME OVER', w / 2, h * 0.18);

        ctx.fillStyle = CACTUS;
        ctx.font = `bold ${Math.min(20, w * 0.03)}px monospace`;
        ctx.fillText(`SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, h * 0.26);

        if (g.overTimer >= 40) {
          if (g.enteringInitials) {
            /* ── Initials entry ── */
            ctx.fillStyle = CACTUS; ctx.font = `bold ${Math.min(18, w * 0.025)}px monospace`;
            ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, h * 0.34);

            ctx.fillStyle = SHROOMY; ctx.font = `${Math.min(12, w * 0.017)}px monospace`;
            if (showTouch.current) {
              ctx.fillText('USE BUTTONS BELOW TO ENTER INITIALS', w / 2, h * 0.40);
            } else {
              ctx.fillText('TYPE INITIALS \u00B7 \u2190\u2192 MOVE \u00B7 ENTER CONFIRM', w / 2, h * 0.40);
            }

            ctx.font = `bold ${Math.min(32, w * 0.045)}px monospace`;
            const blink = Math.floor(g.frame / 18) % 2 === 0;
            for (let i = 0; i < 3; i++) {
              const cx = w / 2 + (i - 1) * 45;
              const cy = h * 0.52;
              const char = ABC[g.initialsChars[i]];

              if (i === g.initialsPos) {
                ctx.fillStyle = CACTUS;
                if (blink) ctx.fillRect(cx - 14, cy + 8, 28, 3);
              } else {
                ctx.fillStyle = SHROOMY;
              }
              ctx.fillText(char, cx, cy);
            }
          } else {
            /* ── High score table ── */
            const scores = g.highScores;
            if (scores.length > 0) {
              ctx.fillStyle = CACTUS; ctx.font = `bold ${Math.min(16, w * 0.022)}px monospace`;
              ctx.fillText('\u2550\u2550\u2550 HIGH SCORES \u2550\u2550\u2550', w / 2, h * 0.34);

              ctx.font = `${Math.min(14, w * 0.019)}px monospace`;
              const startY = h * 0.40;
              const rowH = Math.min(20, h * 0.05);
              for (let i = 0; i < Math.min(scores.length, 8); i++) {
                const hs = scores[i];
                const y = startY + i * rowH;
                const isPlayer = g.scoreSubmitted && i === g.scoreIndex;

                ctx.fillStyle = isPlayer ? CACTUS : SHROOMY;
                ctx.textAlign = 'right';
                ctx.fillText(`${i + 1}.`, w / 2 - 70, y);
                ctx.textAlign = 'left';
                ctx.fillText(hs.initials, w / 2 - 50, y);
                ctx.textAlign = 'right';
                ctx.fillText(String(hs.score).padStart(6, '0'), w / 2 + 90, y);
              }
              ctx.textAlign = 'center';

              if (!showTouch.current) {
                ctx.fillStyle = GREIGE; ctx.font = `${Math.min(12, w * 0.017)}px monospace`;
                ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, h * 0.92);
              }
            } else if (!showTouch.current) {
              ctx.fillStyle = GREIGE; ctx.font = `${Math.min(12, w * 0.017)}px monospace`;
              ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, h * 0.92);
            }
          }
        }
      }

      /* ── Start screen ── */
      if (!g.started) {
        ctx.fillStyle = 'rgba(20,18,19,0.75)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const iconSize = Math.min(50, w * 0.07);
        if (ochoImg.current && ochoImg.current.complete && ochoImg.current.naturalWidth > 0) {
          ctx.shadowColor = SPRINKLES;
          ctx.shadowBlur = 20;
          ctx.drawImage(ochoImg.current, w / 2 - iconSize / 2, h / 2 - 80 - iconSize / 2, iconSize, iconSize);
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = TANGERINE;
        ctx.font = `bold ${Math.min(36, w * 0.045)}px Inter, system-ui, sans-serif`;
        ctx.fillText('CLIENT FROGGER', w / 2, h / 2 - 16);

        ctx.fillStyle = SHROOMY;
        ctx.font = `${Math.min(14, w * 0.018)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Navigate Ocho through the client traffic', w / 2, h / 2 + 14);
        ctx.fillText('Arrow keys or WASD to move', w / 2, h / 2 + 34);

        const pulse = 0.6 + Math.sin(Date.now() * 0.004) * 0.4;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = CACTUS;
        ctx.font = `bold ${Math.min(16, w * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Press any key or tap to start', w / 2, h / 2 + 68);
        ctx.globalAlpha = 1;

        ctx.fillStyle = GREIGE;
        ctx.font = `${Math.min(12, w * 0.015)}px Inter, system-ui, sans-serif`;
        ctx.fillText('ESC to exit', w / 2, h / 2 + 94);
      }

      /* ── D-pad (touch, gameplay only) ── */
      if (showTouch.current && !g.over && g.started) {
        drawDpad(ctx, w, h);
      }

      /* ── System buttons (close, mute, initials, restart) ── */
      if (showTouch.current) {
        const btns = btnsRef.current;
        for (const b of btns) {
          drawBtn(ctx, b, !!touchBtns.current[b.id], sfx.muted);
        }
      }

      ctx.restore();

      /* Update prev touch state for rising-edge detection */
      prevBtns.current = { ...touchBtns.current };

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      sfx.dispose();
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', updateBtnState);
      canvas.removeEventListener('touchend', updateBtnState);
      canvas.removeEventListener('touchcancel', updateBtnState);
    };
  }, [initGame, getPlayerY, onClose]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-30"
        style={{ touchAction: 'none' }}
      />
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
