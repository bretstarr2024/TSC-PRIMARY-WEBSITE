'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/* ── Brand colors ── */
const C = {
  ship: '#FF5910',
  bullet: '#FF5910',
  asteroid: '#73F5FF',
  score: '#E1FF00',
  ui: '#d1d1c6',
  fx: ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2'],
  ufo: '#ED0AD2',
  bg: '#0a0a0a',
};

/* ── Tuning knobs ── */
const SHIP_R = 15;
const ROT_SPEED = 0.065;
const THRUST = 0.12;
const FRICTION = 0.992;
const MAX_V = 6;
const BULLET_V = 8;
const FIRE_RATE = 8;
const INVULN = 120;
const A_RADIUS: Record<ASize, number> = { large: 40, medium: 20, small: 10 };
const A_SPEED: Record<ASize, number> = { large: 1.5, medium: 2.5, small: 3.5 };
const A_SCORE: Record<ASize, number> = { large: 20, medium: 50, small: 100 };
const START_ROCKS = 4;

/* UFO (Ocho) tuning */
const UFO_SPEED = 2.5;
const UFO_R = 22;
const UFO_SCORE = 300;
const UFO_FIRE_INTERVAL = 150;
const UFO_BULLET_V = 4;
const UFO_SPAWN_MIN = 600;
const UFO_SPAWN_MAX = 1200;
const UFO_IMG_SIZE = 50;

/* High scores */
const HS_KEY = 'tsc-asteroids-scores';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ── Types ── */
type ASize = 'large' | 'medium' | 'small';

interface Ship {
  x: number; y: number;
  vx: number; vy: number;
  rot: number;
  alive: boolean;
  invuln: number;
  respawn: number;
}

interface Rock {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; spin: number;
  size: ASize; r: number;
  verts: number[];
}

interface Bullet { x: number; y: number; vx: number; vy: number; life: number }

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  color: string;
}

interface Ufo {
  x: number; y: number;
  vx: number;
  baseY: number;
  sinPhase: number;
  cooldown: number;
}

interface HighScore {
  initials: string;
  score: number;
}

interface Game {
  ship: Ship;
  rocks: Rock[];
  bullets: Bullet[];
  sparks: Spark[];
  ufo: Ufo | null;
  ufoBullets: Bullet[];
  ufoTimer: number;
  score: number;
  lives: number;
  level: number;
  over: boolean;
  overTimer: number;
  cooldown: number;
  shake: number;
  frame: number;
  bulletLife: number;
  /* high-score entry */
  enteringInitials: boolean;
  initialsChars: number[];
  initialsPos: number;
  highScores: HighScore[];
  scoreSubmitted: boolean;
  scoreIndex: number;
}

/* ── Helpers ── */
function rockVerts(): number[] {
  const n = 8 + Math.floor(Math.random() * 5);
  return Array.from({ length: n }, () => 0.7 + Math.random() * 0.6);
}

function makeRock(x: number, y: number, size: ASize): Rock {
  const a = Math.random() * Math.PI * 2;
  const v = A_SPEED[size] * (0.5 + Math.random() * 0.5);
  return {
    x, y,
    vx: Math.cos(a) * v, vy: Math.sin(a) * v,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    size, r: A_RADIUS[size],
    verts: rockVerts(),
  };
}

function spawnWave(n: number, w: number, h: number, sx?: number, sy?: number): Rock[] {
  const out: Rock[] = [];
  for (let i = 0; i < n; i++) {
    let x: number, y: number;
    do { x = Math.random() * w; y = Math.random() * h; }
    while (sx !== undefined && sy !== undefined && Math.hypot(x - sx, y - sy) < 150);
    out.push(makeRock(x, y, 'large'));
  }
  return out;
}

function splitRock(r: Rock): Rock[] {
  const next: Record<ASize, ASize | null> = { large: 'medium', medium: 'small', small: null };
  const ns = next[r.size];
  return ns ? [makeRock(r.x, r.y, ns), makeRock(r.x, r.y, ns)] : [];
}

function boom(x: number, y: number, n: number): Spark[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 1 + Math.random() * 3;
    const life = 20 + Math.floor(Math.random() * 30);
    return {
      x, y,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      life, max: life,
      color: C.fx[Math.floor(Math.random() * C.fx.length)],
    };
  });
}

function wrap(v: number, max: number): number {
  if (v < -20) return max + 20;
  if (v > max + 20) return -20;
  return v;
}

function hit(ax: number, ay: number, ar: number, bx: number, by: number, br: number): boolean {
  return Math.hypot(ax - bx, ay - by) < ar + br;
}

function spawnUfo(w: number, h: number): Ufo {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -UFO_R * 2 : w + UFO_R * 2,
    y: h * 0.15 + Math.random() * h * 0.7,
    vx: (fromLeft ? 1 : -1) * UFO_SPEED,
    baseY: h * 0.15 + Math.random() * h * 0.7,
    sinPhase: Math.random() * Math.PI * 2,
    cooldown: Math.floor(UFO_FIRE_INTERVAL * 0.4),
  };
}

function loadHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(HS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HighScore[];
  } catch { return []; }
}

function saveHighScores(scores: HighScore[]): void {
  try { localStorage.setItem(HS_KEY, JSON.stringify(scores.slice(0, HS_MAX))); }
  catch { /* ignore */ }
}

function qualifiesForHighScore(score: number, scores: HighScore[]): boolean {
  if (score <= 0) return false;
  if (scores.length < HS_MAX) return true;
  return score > scores[scores.length - 1].score;
}

/* ── Component ── */
export function AsteroidsGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);
  const ochoImg = useRef<HTMLImageElement | null>(null);

  const init = useCallback((w: number, h: number): Game => ({
    ship: {
      x: w / 2, y: h / 2,
      vx: 0, vy: 0,
      rot: -Math.PI / 2,
      alive: true, invuln: INVULN, respawn: 0,
    },
    rocks: spawnWave(START_ROCKS, w, h, w / 2, h / 2),
    bullets: [], sparks: [],
    ufo: null, ufoBullets: [],
    ufoTimer: UFO_SPAWN_MIN + Math.floor(Math.random() * (UFO_SPAWN_MAX - UFO_SPAWN_MIN)),
    score: 0, lives: 3, level: 1,
    over: false, overTimer: 0, cooldown: 0, shake: 0, frame: 0,
    bulletLife: Math.ceil(Math.hypot(w, h) * 0.8 / BULLET_V),
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

    /* Load ocho mascot image */
    const img = new Image();
    img.src = '/images/ocho-color.png';
    ochoImg.current = img;

    game.current = init(el.width, el.height);

    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const g = game.current;
      if (!g) return;

      /* ── Game over input ── */
      if (g.over) {
        if (g.overTimer < 40) return; // brief delay before accepting input

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
          } else if (/^[a-zA-Z]$/.test(key)) {
            g.initialsChars[g.initialsPos] = key.toUpperCase().charCodeAt(0) - 65;
            if (g.initialsPos < 2) g.initialsPos++;
          }
          return;
        }

        if (e.key === 'Enter') {
          keys.current.clear();
          game.current = init(el.width, el.height);
        }
        return;
      }

      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    /* ── GAME LOOP ── */
    const loop = () => {
      const g = game.current;
      if (!g) return;
      const w = el.width;
      const h = el.height;
      const k = keys.current;
      g.frame++;

      if (!g.over) {
        const s = g.ship;

        /* helper: kill the ship */
        const die = () => {
          s.alive = false; s.respawn = 90; g.lives--; g.shake = 15;
          g.sparks.push(...boom(s.x, s.y, 20));
          if (g.lives <= 0) {
            g.over = true;
            const hs = loadHighScores();
            g.highScores = hs;
            g.enteringInitials = qualifiesForHighScore(g.score, hs);
          }
        };

        /* update ship */
        if (s.alive) {
          if (k.has('arrowleft') || k.has('a')) s.rot -= ROT_SPEED;
          if (k.has('arrowright') || k.has('d')) s.rot += ROT_SPEED;
          if (k.has('arrowup') || k.has('w')) {
            s.vx += Math.cos(s.rot) * THRUST;
            s.vy += Math.sin(s.rot) * THRUST;
            const spd = Math.hypot(s.vx, s.vy);
            if (spd > MAX_V) { s.vx = (s.vx / spd) * MAX_V; s.vy = (s.vy / spd) * MAX_V; }
          }
          s.vx *= FRICTION; s.vy *= FRICTION;
          s.x = wrap(s.x + s.vx, w); s.y = wrap(s.y + s.vy, h);
          if (s.invuln > 0) s.invuln--;

          if (g.cooldown > 0) g.cooldown--;
          if (k.has(' ') && g.cooldown === 0) {
            g.bullets.push({
              x: s.x + Math.cos(s.rot) * SHIP_R,
              y: s.y + Math.sin(s.rot) * SHIP_R,
              vx: Math.cos(s.rot) * BULLET_V + s.vx * 0.3,
              vy: Math.sin(s.rot) * BULLET_V + s.vy * 0.3,
              life: g.bulletLife,
            });
            g.cooldown = FIRE_RATE;
          }
        } else {
          s.respawn--;
          if (s.respawn <= 0) {
            s.x = w / 2; s.y = h / 2; s.vx = 0; s.vy = 0;
            s.rot = -Math.PI / 2; s.alive = true; s.invuln = INVULN;
          }
        }

        /* update bullets */
        g.bullets = g.bullets.filter(b => {
          b.x = wrap(b.x + b.vx, w); b.y = wrap(b.y + b.vy, h);
          return --b.life > 0;
        });

        /* update rocks */
        for (const r of g.rocks) {
          r.x = wrap(r.x + r.vx, w); r.y = wrap(r.y + r.vy, h);
          r.rot += r.spin;
        }

        /* update sparks */
        g.sparks = g.sparks.filter(p => {
          p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98;
          return --p.life > 0;
        });

        /* ── UFO (Ocho) ── */
        if (g.ufo) {
          const u = g.ufo;
          u.x += u.vx;
          u.sinPhase += 0.02;
          u.y = u.baseY + Math.sin(u.sinPhase) * 50;

          /* UFO fires at player */
          u.cooldown--;
          if (u.cooldown <= 0 && s.alive) {
            const accuracy = Math.max(0.15, 0.6 - g.level * 0.05);
            const angle = Math.atan2(s.y - u.y, s.x - u.x) + (Math.random() - 0.5) * accuracy * 2;
            g.ufoBullets.push({
              x: u.x, y: u.y,
              vx: Math.cos(angle) * UFO_BULLET_V,
              vy: Math.sin(angle) * UFO_BULLET_V,
              life: g.bulletLife,
            });
            u.cooldown = UFO_FIRE_INTERVAL;
          }

          /* UFO left the screen */
          if (u.x < -UFO_R * 3 || u.x > w + UFO_R * 3) {
            g.ufo = null;
            g.ufoTimer = UFO_SPAWN_MIN + Math.floor(Math.random() * (UFO_SPAWN_MAX - UFO_SPAWN_MIN));
          }
        } else {
          g.ufoTimer--;
          if (g.ufoTimer <= 0) {
            g.ufo = spawnUfo(w, h);
          }
        }

        /* update UFO bullets */
        g.ufoBullets = g.ufoBullets.filter(b => {
          b.x = wrap(b.x + b.vx, w); b.y = wrap(b.y + b.vy, h);
          return --b.life > 0;
        });

        /* ── Collisions ── */
        const addRocks: Rock[] = [];
        const deadB = new Set<number>();
        const deadR = new Set<number>();

        /* bullet ↔ rock */
        for (let bi = 0; bi < g.bullets.length; bi++) {
          const b = g.bullets[bi];
          for (let ri = 0; ri < g.rocks.length; ri++) {
            if (deadR.has(ri)) continue;
            const r = g.rocks[ri];
            if (hit(b.x, b.y, 2, r.x, r.y, r.r * 0.8)) {
              deadB.add(bi); deadR.add(ri);
              g.score += A_SCORE[r.size];
              addRocks.push(...splitRock(r));
              g.sparks.push(...boom(r.x, r.y, r.size === 'large' ? 15 : r.size === 'medium' ? 10 : 6));
              break;
            }
          }
        }

        /* bullet ↔ UFO */
        if (g.ufo) {
          for (let bi = 0; bi < g.bullets.length; bi++) {
            if (deadB.has(bi)) continue;
            const b = g.bullets[bi];
            if (hit(b.x, b.y, 2, g.ufo.x, g.ufo.y, UFO_R)) {
              deadB.add(bi);
              g.score += UFO_SCORE;
              g.sparks.push(...boom(g.ufo.x, g.ufo.y, 25));
              g.ufo = null;
              g.ufoTimer = UFO_SPAWN_MIN + Math.floor(Math.random() * (UFO_SPAWN_MAX - UFO_SPAWN_MIN));
              break;
            }
          }
        }

        g.bullets = g.bullets.filter((_, i) => !deadB.has(i));
        g.rocks = g.rocks.filter((_, i) => !deadR.has(i));
        g.rocks.push(...addRocks);

        /* ship ↔ rock */
        if (s.alive && s.invuln <= 0) {
          for (const r of g.rocks) {
            if (hit(s.x, s.y, SHIP_R * 0.6, r.x, r.y, r.r * 0.8)) {
              die(); break;
            }
          }
        }

        /* ship ↔ UFO (touching the ocho kills you) */
        if (s.alive && s.invuln <= 0 && g.ufo) {
          if (hit(s.x, s.y, SHIP_R * 0.6, g.ufo.x, g.ufo.y, UFO_R)) {
            g.sparks.push(...boom(g.ufo.x, g.ufo.y, 15));
            g.ufo = null;
            g.ufoTimer = UFO_SPAWN_MIN + Math.floor(Math.random() * (UFO_SPAWN_MAX - UFO_SPAWN_MIN));
            die();
          }
        }

        /* UFO bullet ↔ ship */
        if (s.alive && s.invuln <= 0) {
          for (let i = g.ufoBullets.length - 1; i >= 0; i--) {
            const b = g.ufoBullets[i];
            if (hit(b.x, b.y, 3, s.x, s.y, SHIP_R * 0.6)) {
              g.ufoBullets.splice(i, 1);
              die(); break;
            }
          }
        }

        /* next wave */
        if (g.rocks.length === 0) {
          g.level++;
          g.rocks = spawnWave(START_ROCKS + g.level - 1, w, h, s.x, s.y);
        }
      }

      /* shake decay — OUTSIDE the game-active block so it always runs */
      if (g.shake > 0) {
        g.shake *= g.over ? 0.8 : 0.9;
        if (g.shake < 0.5) g.shake = 0;
      }

      /* game over timer */
      if (g.over) g.overTimer++;

      /* ── RENDER ── */
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);

      ctx.fillStyle = C.bg;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      /* sparks */
      for (const p of g.sparks) {
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* rocks */
      for (const r of g.rocks) {
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
        ctx.strokeStyle = C.asteroid; ctx.lineWidth = 1.5;
        ctx.beginPath();
        const n = r.verts.length;
        for (let i = 0; i <= n; i++) {
          const idx = i % n;
          const ang = (idx / n) * Math.PI * 2;
          const d = r.r * r.verts[idx];
          const px = Math.cos(ang) * d;
          const py = Math.sin(ang) * d;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke(); ctx.restore();
      }

      /* ── Ocho UFO ── */
      if (g.ufo) {
        const u = g.ufo;
        ctx.save();
        const imgOk = ochoImg.current?.complete && ochoImg.current.naturalWidth > 0;
        if (imgOk) {
          ctx.shadowColor = C.ufo;
          ctx.shadowBlur = 20;
          const sz = UFO_IMG_SIZE;
          ctx.drawImage(ochoImg.current!, u.x - sz / 2, u.y - sz / 2, sz, sz);
          ctx.shadowBlur = 0;
        } else {
          /* fallback saucer */
          ctx.strokeStyle = C.ufo; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(u.x, u.y, UFO_R, UFO_R * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      /* UFO bullets (pink) */
      ctx.fillStyle = C.ufo;
      for (const b of g.ufoBullets) {
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
      }

      /* player bullets */
      ctx.fillStyle = C.bullet;
      for (const b of g.bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx.fill(); }

      /* ship */
      if (g.ship.alive) {
        const s = g.ship;
        if (s.invuln <= 0 || Math.floor(s.invuln / 4) % 2 === 0) {
          ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
          ctx.strokeStyle = C.ship; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(SHIP_R, 0);
          ctx.lineTo(-SHIP_R * 0.7, -SHIP_R * 0.6);
          ctx.lineTo(-SHIP_R * 0.4, 0);
          ctx.lineTo(-SHIP_R * 0.7, SHIP_R * 0.6);
          ctx.closePath(); ctx.stroke();

          /* thrust flame */
          if (k.has('arrowup') || k.has('w')) {
            const fl = 0.5 + Math.random() * 0.8;
            ctx.strokeStyle = C.score; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-SHIP_R * 0.5, -SHIP_R * 0.25);
            ctx.lineTo(-SHIP_R * (0.7 + fl * 0.5), 0);
            ctx.lineTo(-SHIP_R * 0.5, SHIP_R * 0.25);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      /* ── HUD ── */
      ctx.fillStyle = C.score; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left';
      ctx.fillText(String(g.score).padStart(6, '0'), 20, 40);

      ctx.fillStyle = C.ui; ctx.font = '14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${g.level}`, w / 2, 30);

      /* lives as mini ships */
      for (let i = 0; i < g.lives; i++) {
        ctx.save(); ctx.translate(30 + i * 25, 65); ctx.rotate(-Math.PI / 2);
        ctx.strokeStyle = C.ship; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, 0); ctx.lineTo(-5, -4); ctx.lineTo(-3, 0); ctx.lineTo(-5, 4);
        ctx.closePath(); ctx.stroke(); ctx.restore();
      }

      /* controls hint */
      ctx.fillStyle = C.ui; ctx.globalAlpha = 0.4; ctx.font = '12px monospace'; ctx.textAlign = 'center';
      ctx.fillText('ARROWS / WASD \u00B7 SPACE TO FIRE \u00B7 ESC TO EXIT', w / 2, h - 20);
      ctx.globalAlpha = 1;

      /* ── GAME OVER OVERLAY ── */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = C.ship; ctx.font = 'bold 48px monospace';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 120);

        ctx.fillStyle = C.score; ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, h / 2 - 80);

        /* Wait for the brief delay before showing interactive UI */
        if (g.overTimer >= 40) {
          if (g.enteringInitials) {
            /* ── Initials entry ── */
            ctx.fillStyle = C.score; ctx.font = 'bold 22px monospace';
            ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', w / 2, h / 2 - 40);

            ctx.fillStyle = C.ui; ctx.font = '13px monospace';
            ctx.fillText('TYPE INITIALS  \u00B7  \u2190\u2192 MOVE  \u00B7  ENTER TO CONFIRM', w / 2, h / 2 - 10);

            ctx.font = 'bold 40px monospace';
            const blink = Math.floor(g.frame / 18) % 2 === 0;
            for (let i = 0; i < 3; i++) {
              const cx = w / 2 + (i - 1) * 55;
              const cy = h / 2 + 40;
              const char = ABC[g.initialsChars[i]];

              if (i === g.initialsPos) {
                ctx.fillStyle = C.score;
                /* blinking underline cursor */
                if (blink) {
                  ctx.fillRect(cx - 16, cy + 8, 32, 4);
                }
              } else {
                ctx.fillStyle = C.ui;
              }
              ctx.fillText(char, cx, cy);
            }
          } else {
            /* ── High score table ── */
            const scores = g.highScores;
            const hasScores = scores.length > 0;

            if (hasScores) {
              ctx.fillStyle = C.score; ctx.font = 'bold 20px monospace';
              ctx.fillText('\u2550\u2550\u2550 HIGH SCORES \u2550\u2550\u2550', w / 2, h / 2 - 40);

              ctx.font = '17px monospace';
              const startY = h / 2 - 10;
              for (let i = 0; i < Math.min(scores.length, HS_MAX); i++) {
                const hs = scores[i];
                const y = startY + i * 26;
                const isPlayer = g.scoreSubmitted && i === g.scoreIndex;

                /* rank */
                ctx.fillStyle = isPlayer ? C.score : C.ui;
                ctx.textAlign = 'right';
                ctx.fillText(`${i + 1}.`, w / 2 - 85, y);

                /* initials */
                ctx.textAlign = 'left';
                ctx.fillText(hs.initials, w / 2 - 65, y);

                /* score */
                ctx.textAlign = 'right';
                ctx.fillText(String(hs.score).padStart(6, '0'), w / 2 + 110, y);
              }

              const bottomY = startY + Math.min(scores.length, HS_MAX) * 26 + 25;
              ctx.fillStyle = C.ui; ctx.font = '16px monospace'; ctx.textAlign = 'center';
              ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, bottomY);
            } else {
              ctx.fillStyle = C.ui; ctx.font = '16px monospace';
              ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, h / 2 + 20);
            }
          }
        }
      }

      ctx.restore();
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      document.body.style.overflow = prevOverflow;
    };
  }, [init, onClose]);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: C.bg }}>
      <canvas ref={cvs} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>,
    document.body,
  );
}
