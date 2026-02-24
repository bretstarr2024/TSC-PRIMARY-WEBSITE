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
  bg: '#0a0a0a',
};

/* ── Tuning knobs ── */
const SHIP_R = 15;
const ROT_SPEED = 0.065;
const THRUST = 0.12;
const FRICTION = 0.992;
const MAX_V = 6;
const BULLET_V = 8;
const BULLET_LIFE = 50;
const FIRE_RATE = 8;
const INVULN = 120;
const A_RADIUS: Record<ASize, number> = { large: 40, medium: 20, small: 10 };
const A_SPEED: Record<ASize, number> = { large: 1.5, medium: 2.5, small: 3.5 };
const A_SCORE: Record<ASize, number> = { large: 20, medium: 50, small: 100 };
const START_ROCKS = 4;

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

interface Game {
  ship: Ship;
  rocks: Rock[];
  bullets: Bullet[];
  sparks: Spark[];
  score: number;
  lives: number;
  level: number;
  over: boolean;
  cooldown: number;
  shake: number;
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

/* ── Component ── */
export function AsteroidsGame({ onClose }: { onClose: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const raf = useRef(0);

  const init = useCallback((w: number, h: number): Game => ({
    ship: {
      x: w / 2, y: h / 2,
      vx: 0, vy: 0,
      rot: -Math.PI / 2,
      alive: true, invuln: INVULN, respawn: 0,
    },
    rocks: spawnWave(START_ROCKS, w, h, w / 2, h / 2),
    bullets: [], sparks: [],
    score: 0, lives: 3, level: 1,
    over: false, cooldown: 0, shake: 0,
  }), []);

  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // prevent body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    game.current = init(el.width, el.height);

    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      // prevent scroll for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keys.current.add(e.key.toLowerCase());
      if (e.key === 'Enter' && game.current?.over) {
        game.current = init(el.width, el.height);
      }
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

      if (!g.over) {
        const s = g.ship;

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
              life: BULLET_LIFE,
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

        if (g.shake > 0) { g.shake *= 0.9; if (g.shake < 0.5) g.shake = 0; }

        /* bullet ↔ rock collisions */
        const addRocks: Rock[] = [];
        const deadB = new Set<number>();
        const deadR = new Set<number>();
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
        g.bullets = g.bullets.filter((_, i) => !deadB.has(i));
        g.rocks = g.rocks.filter((_, i) => !deadR.has(i));
        g.rocks.push(...addRocks);

        /* ship ↔ rock collisions */
        if (s.alive && s.invuln <= 0) {
          for (const r of g.rocks) {
            if (hit(s.x, s.y, SHIP_R * 0.6, r.x, r.y, r.r * 0.8)) {
              s.alive = false; s.respawn = 90; g.lives--; g.shake = 15;
              g.sparks.push(...boom(s.x, s.y, 20));
              if (g.lives <= 0) g.over = true;
              break;
            }
          }
        }

        /* next wave */
        if (g.rocks.length === 0) {
          g.level++;
          g.rocks = spawnWave(START_ROCKS + g.level - 1, w, h, s.x, s.y);
        }
      }

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

      /* bullets */
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

      /* game over overlay */
      if (g.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = C.ship; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 30);
        ctx.fillStyle = C.score; ctx.font = '24px monospace';
        ctx.fillText(`SCORE: ${g.score}`, w / 2, h / 2 + 20);
        ctx.fillStyle = C.ui; ctx.font = '16px monospace';
        ctx.fillText('ENTER TO RESTART \u00B7 ESC TO EXIT', w / 2, h / 2 + 60);
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
