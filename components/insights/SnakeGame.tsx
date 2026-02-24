'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  snake: '#E1FF00',
  snakeHead: '#FF5910',
  food: '#ED0AD2',
  score: '#E1FF00',
  ui: '#d1d1c6',
  bg: '#0a0a0a',
  grid: 'rgba(225, 255, 0, 0.04)',
};

/* ── Tuning knobs ── */
const CELL = 16;
const BASE_TICK_MS = 120;
const TICK_DEC = 8;
const MIN_TICK_MS = 50;
const FOOD_PER_LEVEL = 5;

/* High scores */
const HS_KEY = 'tsc-snake-scores';
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

  eat() {
    const c = this.ensure();
    if (!c || this._muted) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(600, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.08);
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
type Dir = 'up' | 'down' | 'left' | 'right';
interface Pt { x: number; y: number }

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  color: string;
}

interface HighScore { initials: string; score: number }

interface Game {
  snake: Pt[];
  dir: Dir;
  pendingDir: Dir | null;
  food: Pt;
  gridW: number;
  gridH: number;
  score: number;
  level: number;
  foodEaten: number;
  tickInterval: number;
  over: boolean;
  overTimer: number;
  shake: number;
  frame: number;
  sparks: Spark[];
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
}

/* ── Helpers ── */
const opposite: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const dirVec: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

function boom(x: number, y: number, n: number, color: string): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 1 + Math.random() * 3;
    const life = 15 + Math.floor(Math.random() * 20);
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, color };
  });
}

function placeFood(snake: Pt[], gridW: number, gridH: number): Pt {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  let x: number, y: number;
  do {
    x = Math.floor(Math.random() * gridW);
    y = Math.floor(Math.random() * gridH);
  } while (occupied.has(`${x},${y}`));
  return { x, y };
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

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */
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
  const lastTick = useRef(0);

  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);
  const [isOver, setIsOver] = useState(false);

  const init = useCallback((w: number, h: number): Game => {
    const gridW = Math.floor(w / CELL);
    const gridH = Math.floor(h / CELL);
    const cx = Math.floor(gridW / 2);
    const cy = Math.floor(gridH / 2);
    const snake: Pt[] = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    return {
      snake,
      dir: 'right',
      pendingDir: null,
      food: placeFood(snake, gridW, gridH),
      gridW,
      gridH,
      score: 0,
      level: 1,
      foodEaten: 0,
      tickInterval: BASE_TICK_MS,
      over: false,
      overTimer: 0,
      shake: 0,
      frame: 0,
      sparks: [],
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
              setBossData({ game: 'snake', score: g.score, initials });
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
          setIsOver(false);
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

      if (newDir && newDir !== opposite[g.dir]) {
        g.pendingDir = newDir;
      }

      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let wasOver = false;

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
              setBossData({ game: 'snake', score: g.score, initials });
            }
          }
        } else if (justTouched('restart')) {
          game.current = init(el.width, el.height);
          lastTick.current = performance.now();
          setIsOver(false);
          prevTouch.current = { ...ta };
          raf.current = requestAnimationFrame(loop);
          return;
        }
      }

      /* Touch direction input during gameplay */
      if (!g.over && showTouch.current) {
        let newDir: Dir | null = null;
        if (justTouched('dup')) newDir = 'up';
        else if (justTouched('ddown')) newDir = 'down';
        else if (justTouched('dleft')) newDir = 'left';
        else if (justTouched('dright')) newDir = 'right';
        if (newDir && newDir !== opposite[g.dir]) {
          g.pendingDir = newDir;
        }
      }

      if (justTouched('close')) { sfx.dispose(); onClose(); return; }
      if (justTouched('mute')) sfx.toggle();

      /* ═══ GAME LOGIC — tick-based movement ═══ */
      if (!g.over) {
        const dt = now - lastTick.current;

        if (dt >= g.tickInterval) {
          lastTick.current = now;

          /* Apply pending direction */
          if (g.pendingDir) {
            if (g.pendingDir !== g.dir) sfx.turn();
            g.dir = g.pendingDir;
            g.pendingDir = null;
          }

          /* Move snake */
          const head = g.snake[0];
          const v = dirVec[g.dir];
          const nx = head.x + v.x;
          const ny = head.y + v.y;

          /* Check wall collision */
          if (nx < 0 || nx >= g.gridW || ny < 0 || ny >= g.gridH) {
            g.over = true;
            setIsOver(true);
            g.shake = 15;
            sfx.crash();
            const ox = (g.gridW * CELL - w) / -2;
            const oy = (g.gridH * CELL - h) / -2;
            g.sparks.push(...boom(head.x * CELL + CELL / 2 + ox, head.y * CELL + CELL / 2 + oy, 20, C.snake));
            const hs = loadHighScores();
            g.highScores = hs;
            g.enteringInitials = qualifiesForHighScore(g.score, hs);
          } else {
            /* Check self collision */
            let hitSelf = false;
            for (let i = 0; i < g.snake.length; i++) {
              if (g.snake[i].x === nx && g.snake[i].y === ny) {
                hitSelf = true;
                break;
              }
            }

            if (hitSelf) {
              g.over = true;
              setIsOver(true);
              g.shake = 15;
              sfx.crash();
              const ox = (w - g.gridW * CELL) / 2;
              const oy = (h - g.gridH * CELL) / 2;
              g.sparks.push(...boom(head.x * CELL + CELL / 2 + ox, head.y * CELL + CELL / 2 + oy, 20, C.snake));
              const hs = loadHighScores();
              g.highScores = hs;
              g.enteringInitials = qualifiesForHighScore(g.score, hs);
            } else {
              /* Move head */
              g.snake.unshift({ x: nx, y: ny });

              /* Check food */
              if (nx === g.food.x && ny === g.food.y) {
                /* Ate food — don't remove tail (snake grows) */
                g.score += 10 * g.level;
                g.foodEaten++;
                sfx.eat();

                if (g.foodEaten >= FOOD_PER_LEVEL) {
                  g.level++;
                  g.foodEaten = 0;
                  g.tickInterval = Math.max(MIN_TICK_MS, BASE_TICK_MS - TICK_DEC * (g.level - 1));
                  sfx.levelUp();
                }

                g.food = placeFood(g.snake, g.gridW, g.gridH);
              } else {
                /* Normal move — remove tail */
                g.snake.pop();
              }
            }
          }
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

      /* ── Grid offset to center play area ── */
      const gridPxW = g.gridW * CELL;
      const gridPxH = g.gridH * CELL;
      const ox = Math.floor((w - gridPxW) / 2);
      const oy = Math.floor((h - gridPxH) / 2);

      /* ── Grid lines ── */
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx <= g.gridW; gx++) {
        const px = ox + gx * CELL;
        ctx.beginPath(); ctx.moveTo(px, oy); ctx.lineTo(px, oy + gridPxH); ctx.stroke();
      }
      for (let gy = 0; gy <= g.gridH; gy++) {
        const py = oy + gy * CELL;
        ctx.beginPath(); ctx.moveTo(ox, py); ctx.lineTo(ox + gridPxW, py); ctx.stroke();
      }

      /* ── Grid border ── */
      ctx.save();
      ctx.strokeStyle = 'rgba(225, 255, 0, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox - 0.5, oy - 0.5, gridPxW + 1, gridPxH + 1);
      ctx.restore();

      /* ── Snake body ── */
      const snakeLen = g.snake.length;
      for (let i = snakeLen - 1; i >= 0; i--) {
        const seg = g.snake[i];
        const sx = ox + seg.x * CELL + 1;
        const sy = oy + seg.y * CELL + 1;
        const sz = CELL - 2;
        const br = 3;

        /* Tail fade: last 30% of length fades from 1.0 to 0.4 */
        let alpha = 1.0;
        const fadeStart = Math.floor(snakeLen * 0.7);
        if (i >= fadeStart && snakeLen > 3) {
          alpha = 1.0 - 0.6 * ((i - fadeStart) / (snakeLen - fadeStart));
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = i === 0 ? '#F0FF40' : C.snake;
        ctx.shadowColor = C.snake;
        ctx.shadowBlur = 8;

        /* Rounded rectangle */
        ctx.beginPath();
        ctx.moveTo(sx + br, sy);
        ctx.lineTo(sx + sz - br, sy);
        ctx.quadraticCurveTo(sx + sz, sy, sx + sz, sy + br);
        ctx.lineTo(sx + sz, sy + sz - br);
        ctx.quadraticCurveTo(sx + sz, sy + sz, sx + sz - br, sy + sz);
        ctx.lineTo(sx + br, sy + sz);
        ctx.quadraticCurveTo(sx, sy + sz, sx, sy + sz - br);
        ctx.lineTo(sx, sy + br);
        ctx.quadraticCurveTo(sx, sy, sx + br, sy);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      /* ── Snake head eyes ── */
      {
        const head = g.snake[0];
        const hcx = ox + head.x * CELL + CELL / 2;
        const hcy = oy + head.y * CELL + CELL / 2;
        const eyeR = 2;
        const eyeOff = 3;
        let e1x: number, e1y: number, e2x: number, e2y: number;

        if (g.dir === 'right') {
          e1x = hcx + eyeOff; e1y = hcy - eyeOff;
          e2x = hcx + eyeOff; e2y = hcy + eyeOff;
        } else if (g.dir === 'left') {
          e1x = hcx - eyeOff; e1y = hcy - eyeOff;
          e2x = hcx - eyeOff; e2y = hcy + eyeOff;
        } else if (g.dir === 'up') {
          e1x = hcx - eyeOff; e1y = hcy - eyeOff;
          e2x = hcx + eyeOff; e2y = hcy - eyeOff;
        } else {
          e1x = hcx - eyeOff; e1y = hcy + eyeOff;
          e2x = hcx + eyeOff; e2y = hcy + eyeOff;
        }

        ctx.save();
        ctx.fillStyle = C.snakeHead;
        ctx.beginPath(); ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* ── Food ── */
      {
        const fcx = ox + g.food.x * CELL + CELL / 2;
        const fcy = oy + g.food.y * CELL + CELL / 2;
        const fr = CELL * 0.35;
        const pulse = 6 + 4 * Math.sin(g.frame * 0.1);

        ctx.save();
        ctx.fillStyle = C.food;
        ctx.shadowColor = C.food;
        ctx.shadowBlur = pulse;
        ctx.beginPath(); ctx.arc(fcx, fcy, fr, 0, Math.PI * 2); ctx.fill();
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

      ctx.fillStyle = C.ui; ctx.font = '12px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`${g.foodEaten}/${FOOD_PER_LEVEL}`, w / 2, 48);

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
        ctx.fillStyle = C.snakeHead; ctx.font = 'bold 48px monospace';
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
        <div data-snake-game style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg, touchAction: 'none', cursor: isOver ? 'default' : 'none' }}>
          {isOver && <style>{`[data-snake-game], [data-snake-game] * { cursor: default !important; }`}</style>}
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
