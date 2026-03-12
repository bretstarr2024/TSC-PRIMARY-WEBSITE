'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

/* ── Brand colors ── */
const C = {
  bg: '#0a0a0a', ground: '#1a1a28', groundLine: '#3a3a55',
  city: '#ED0AD2', cityDead: '#2a1525',
  battery: '#73F5FF', batteryDead: '#1a2828',
  enemy: '#FF5910', enemyTrail: 'rgba(255,89,16,0.5)',
  mirv: '#FF3333', mirvTrail: 'rgba(255,51,51,0.5)',
  player: '#E1FF00', playerTrail: 'rgba(225,255,0,0.35)',
  score: '#E1FF00', ui: '#d1d1c6', bonus: '#73F5FF',
  crosshair: 'rgba(225,255,0,0.85)',
};

/* ── Constants ── */
const GROUND_RATIO = 0.88;
const PLAYER_SPEED = 7;
const MAX_EX_R = 42;
const EX_EXPAND = 24;
const EX_HOLD = 12;
const EX_CONTRACT = 18;
const EX_TOTAL = EX_EXPAND + EX_HOLD + EX_CONTRACT;
const TRAIL_LEN = 22;
const BATTERY_AMMO = 10;
const HS_KEY = 'tsc-missile-hs';
const HS_MAX = 10;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* ── Wave defs ── */
const WAVES = [
  { count: 10, speed: 1.0, mirvChance: 0.00, interval: 110 },
  { count: 14, speed: 1.3, mirvChance: 0.08, interval: 90  },
  { count: 18, speed: 1.6, mirvChance: 0.15, interval: 75  },
  { count: 22, speed: 1.9, mirvChance: 0.25, interval: 62  },
  { count: 28, speed: 2.2, mirvChance: 0.32, interval: 52  },
  { count: 32, speed: 2.5, mirvChance: 0.38, interval: 44  },
];
const getWaveDef = (level: number) => WAVES[Math.min(level - 1, WAVES.length - 1)];

/* ── SFX ── */
class SFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private ensure() {
    if (!this.ctx) try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  get muted() { return this._muted; }
  toggle() { this._muted = !this._muted; return this._muted; }
  fire() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(900, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.14);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.14);
    o.start(); o.stop(c.currentTime + 0.14);
  }
  explode() {
    const c = this.ensure(); if (!c || this._muted) return;
    const buf = c.createBuffer(1, c.sampleRate * 0.28, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(), g = c.createGain(), flt = c.createBiquadFilter();
    flt.type = 'bandpass'; flt.frequency.value = 450; flt.Q.value = 0.8;
    src.buffer = buf; src.connect(flt); flt.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0.35, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
    src.start(); src.stop(c.currentTime + 0.28);
  }
  intercept() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(350, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(1100, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.start(); o.stop(c.currentTime + 0.12);
  }
  cityHit() {
    const c = this.ensure(); if (!c || this._muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'square';
    o.frequency.setValueAtTime(250, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(35, c.currentTime + 0.7);
    g.gain.setValueAtTime(0.28, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7);
    o.start(); o.stop(c.currentTime + 0.7);
  }
  waveStart() {
    const c = this.ensure(); if (!c || this._muted) return;
    [0, 0.14, 0.28].forEach((t, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.frequency.value = [440, 554, 660][i];
      g.gain.setValueAtTime(0.1, c.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.22);
      o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.22);
    });
  }
}

/* ── Types ── */
interface HS { score: number; initials: string; wave: number; }
interface City { x: number; alive: boolean; }
interface Battery { x: number; ammo: number; alive: boolean; }
interface EnemyMissile {
  id: number; startX: number; startY: number;
  x: number; y: number; vx: number; vy: number;
  trail: { x: number; y: number }[];
  alive: boolean; isMirv: boolean;
}
interface PlayerMissile {
  id: number; startX: number; startY: number;
  x: number; y: number; vx: number; vy: number;
  targetX: number; targetY: number;
  trail: { x: number; y: number }[];
  alive: boolean;
}
interface Explosion {
  id: number; x: number; y: number; frame: number; maxR: number;
  alive: boolean; fromPlayer: boolean;
}
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; r: number;
}
interface GameState {
  w: number; h: number; groundY: number;
  cities: City[]; batteries: Battery[];
  enemies: EnemyMissile[]; playerMissiles: PlayerMissile[];
  explosions: Explosion[]; particles: Particle[];
  stars: { x: number; y: number; r: number }[];
  wave: number; spawned: number; total: number;
  spawnTimer: number; spawnInterval: number;
  waveEndTimer: number; waveEndBonus: number;
  score: number; over: boolean;
  enteringInitials: boolean; initialsChars: number[]; initialsPos: number;
  nextId: number; cursorX: number; cursorY: number;
}

/* ── Helpers ── */
function loadHS(): HS[] { try { return JSON.parse(localStorage.getItem(HS_KEY) || '[]'); } catch { return []; } }
function saveHS(hs: HS[]) { try { localStorage.setItem(HS_KEY, JSON.stringify(hs)); } catch {} }
function isTopScore(score: number, hs: HS[]) { return hs.length < HS_MAX || score > (hs[hs.length - 1]?.score ?? 0); }

function getLayout(w: number) {
  return {
    batteryXs: [w * 0.06, w * 0.50, w * 0.94],
    cityXs: [w * 0.17, w * 0.27, w * 0.38, w * 0.62, w * 0.73, w * 0.83],
  };
}

function exRadius(ex: Explosion): number {
  const f = ex.frame;
  if (f < EX_EXPAND) return ex.maxR * (f / EX_EXPAND);
  if (f < EX_EXPAND + EX_HOLD) return ex.maxR;
  return ex.maxR * (1 - (f - EX_EXPAND - EX_HOLD) / EX_CONTRACT);
}

function nearestBat(bats: Battery[], tx: number): number | null {
  let best: number | null = null, bestD = Infinity;
  bats.forEach((b, i) => {
    if (!b.alive || b.ammo <= 0) return;
    const d = Math.abs(b.x - tx);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

function initGame(w: number, h: number): GameState {
  const groundY = h * GROUND_RATIO;
  const { batteryXs, cityXs } = getLayout(w);
  const wdef = getWaveDef(1);
  return {
    w, h, groundY,
    cities: cityXs.map(x => ({ x, alive: true })),
    batteries: batteryXs.map(x => ({ x, ammo: BATTERY_AMMO, alive: true })),
    enemies: [], playerMissiles: [], explosions: [], particles: [],
    stars: Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h * GROUND_RATIO * 0.9,
      r: Math.random() < 0.7 ? 0.5 : 1,
    })),
    wave: 1, spawned: 0, total: wdef.count,
    spawnTimer: 0, spawnInterval: wdef.interval,
    waveEndTimer: 0, waveEndBonus: 0,
    score: 0, over: false,
    enteringInitials: false, initialsChars: [0, 0, 0], initialsPos: 0,
    nextId: 0, cursorX: w / 2, cursorY: h / 2,
  };
}

function spawnEnemy(g: GameState): EnemyMissile {
  const wdef = getWaveDef(g.wave);
  const isMirv = Math.random() < wdef.mirvChance;
  const startX = Math.random() * g.w;
  const targets = [
    ...g.cities.filter(c => c.alive).map(c => c.x),
    ...g.batteries.filter(b => b.alive).map(b => b.x),
  ];
  const targetX = targets.length > 0 && Math.random() < 0.8
    ? targets[Math.floor(Math.random() * targets.length)] + (Math.random() * 40 - 20)
    : Math.random() * g.w;
  const dx = targetX - startX, dy = g.groundY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    id: g.nextId++, startX, startY: 0,
    x: startX, y: 0,
    vx: (dx / dist) * wdef.speed, vy: (dy / dist) * wdef.speed,
    trail: [], alive: true, isMirv,
  };
}

function fireMissile(g: GameState, tx: number, ty: number, sfx: SFX): void {
  if (ty >= g.groundY - 10) return;
  const bi = nearestBat(g.batteries, tx);
  if (bi === null) return;
  const bat = g.batteries[bi];
  bat.ammo--;
  const sx = bat.x, sy = g.groundY - 16;
  const dx = tx - sx, dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  g.playerMissiles.push({
    id: g.nextId++, startX: sx, startY: sy,
    x: sx, y: sy,
    vx: (dx / dist) * PLAYER_SPEED, vy: (dy / dist) * PLAYER_SPEED,
    targetX: tx, targetY: ty,
    trail: [], alive: true,
  });
  sfx.fire();
}

function spawnParticles(g: GameState, x: number, y: number, color: string, n: number): void {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3.5;
    const life = 15 + (Math.random() * 20 | 0);
    g.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1, life, maxLife: life + 5, color, r: 1 + Math.random() * 2.5 });
  }
}

/* ── Update ── */
function updateGame(g: GameState, sfx: SFX): void {
  if (g.over || g.enteringInitials) return;

  if (g.waveEndTimer > 0) {
    g.waveEndTimer--;
    if (g.waveEndTimer === 0) {
      g.wave++;
      const wdef = getWaveDef(g.wave);
      g.spawned = 0; g.total = wdef.count;
      g.spawnTimer = 0; g.spawnInterval = wdef.interval;
      for (const b of g.batteries) if (b.alive) b.ammo = BATTERY_AMMO;
      sfx.waveStart();
    }
    return;
  }

  // Spawn
  if (g.spawned < g.total) {
    g.spawnTimer++;
    if (g.spawnTimer >= g.spawnInterval) {
      g.spawnTimer = 0;
      g.enemies.push(spawnEnemy(g));
      g.spawned++;
    }
  }

  // Move enemies
  for (const em of g.enemies) {
    if (!em.alive) continue;
    em.trail.push({ x: em.x, y: em.y });
    if (em.trail.length > TRAIL_LEN) em.trail.shift();
    em.x += em.vx; em.y += em.vy;
    if (em.y >= g.groundY) {
      em.alive = false;
      g.explosions.push({ id: g.nextId++, x: em.x, y: g.groundY - 2, frame: 0, maxR: MAX_EX_R * 1.3, alive: true, fromPlayer: false });
      sfx.cityHit();
      const HIT_R = 38;
      for (const city of g.cities) {
        if (city.alive && Math.abs(city.x - em.x) < HIT_R) {
          city.alive = false;
          spawnParticles(g, city.x, g.groundY - 15, C.city, 10);
        }
      }
      for (const bat of g.batteries) {
        if (bat.alive && Math.abs(bat.x - em.x) < HIT_R) {
          bat.alive = false;
          spawnParticles(g, bat.x, g.groundY - 10, C.battery, 8);
        }
      }
    }
  }

  // Move player missiles
  for (const pm of g.playerMissiles) {
    if (!pm.alive) continue;
    pm.trail.push({ x: pm.x, y: pm.y });
    if (pm.trail.length > TRAIL_LEN) pm.trail.shift();
    const dx = pm.targetX - pm.x, dy = pm.targetY - pm.y;
    if (Math.sqrt(dx * dx + dy * dy) <= PLAYER_SPEED) {
      pm.alive = false;
      g.explosions.push({ id: g.nextId++, x: pm.targetX, y: pm.targetY, frame: 0, maxR: MAX_EX_R, alive: true, fromPlayer: true });
      sfx.explode();
    } else {
      pm.x += pm.vx; pm.y += pm.vy;
    }
  }

  // Update explosions + intercept check
  const mirvChildren: EnemyMissile[] = [];
  for (const ex of g.explosions) {
    ex.frame++;
    if (ex.frame >= EX_TOTAL) { ex.alive = false; continue; }
    if (!ex.fromPlayer) continue;
    const r = exRadius(ex);
    for (const em of g.enemies) {
      if (!em.alive) continue;
      const dx = em.x - ex.x, dy = em.y - ex.y;
      if (dx * dx + dy * dy <= r * r) {
        em.alive = false;
        g.score += 25;
        sfx.intercept();
        spawnParticles(g, em.x, em.y, em.isMirv ? C.mirv : C.enemy, 8);
        if (em.isMirv) {
          const spd = getWaveDef(g.wave).speed * 1.4;
          for (let i = 0; i < 3; i++) {
            const angle = Math.PI / 2 + (i - 1) * (Math.PI / 5);
            mirvChildren.push({
              id: g.nextId++, startX: em.x, startY: em.y,
              x: em.x, y: em.y,
              vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
              trail: [], alive: true, isMirv: false,
            });
          }
        }
      }
    }
  }
  if (mirvChildren.length) g.enemies.push(...mirvChildren);

  // Particles
  for (const p of g.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life--; }

  // Cleanup
  g.enemies = g.enemies.filter(e => e.alive);
  g.playerMissiles = g.playerMissiles.filter(p => p.alive);
  g.explosions = g.explosions.filter(e => e.alive);
  g.particles = g.particles.filter(p => p.life > 0);

  // Game over: all cities destroyed
  if (g.cities.every(c => !c.alive)) { g.over = true; return; }

  // Wave complete
  if (g.spawned >= g.total && g.enemies.length === 0 && !g.explosions.some(e => e.fromPlayer)) {
    const alive = g.cities.filter(c => c.alive).length;
    const ammoLeft = g.batteries.reduce((s, b) => s + (b.alive ? b.ammo : 0), 0);
    const bonus = alive * 100 * g.wave + ammoLeft * 5 * g.wave;
    g.score += bonus;
    g.waveEndBonus = bonus;
    g.waveEndTimer = 180;
  }
}

/* ── Drawing ── */
function drawCity(ctx: CanvasRenderingContext2D, x: number, groundY: number, alive: boolean): void {
  if (!alive) {
    ctx.fillStyle = '#2a1525';
    ctx.fillRect(x - 8, groundY - 5, 5, 5);
    ctx.fillRect(x, groundY - 9, 6, 9);
    ctx.fillRect(x + 8, groundY - 3, 5, 3);
    return;
  }
  ctx.fillStyle = C.city;
  ctx.fillRect(x - 15, groundY - 22, 30, 22);
  ctx.fillRect(x - 5, groundY - 30, 10, 8);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(x - 11, groundY - 17, 6, 6);
  ctx.fillRect(x + 5, groundY - 17, 6, 6);
  ctx.fillRect(x - 11, groundY - 8, 6, 5);
  ctx.fillRect(x + 5, groundY - 8, 6, 5);
}

function drawBattery(ctx: CanvasRenderingContext2D, x: number, groundY: number, alive: boolean): void {
  if (!alive) {
    ctx.fillStyle = C.batteryDead;
    ctx.fillRect(x - 12, groundY - 8, 24, 8);
    return;
  }
  ctx.fillStyle = C.battery;
  ctx.fillRect(x - 14, groundY - 11, 28, 11);
  ctx.fillRect(x - 3, groundY - 24, 6, 13);
  ctx.fillRect(x - 1, groundY - 26, 2, 3);
}

function drawCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const sz = 11;
  ctx.save();
  ctx.strokeStyle = C.crosshair;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - sz, y); ctx.lineTo(x - 3, y);
  ctx.moveTo(x + 3, y); ctx.lineTo(x + sz, y);
  ctx.moveTo(x, y - sz); ctx.lineTo(x, y - 3);
  ctx.moveTo(x, y + 3); ctx.lineTo(x, y + sz);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function renderGame(ctx: CanvasRenderingContext2D, g: GameState): void {
  const { w, h, groundY } = g;

  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);

  for (const s of g.stars) {
    ctx.fillStyle = s.r < 0.7 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = C.ground; ctx.fillRect(0, groundY, w, h - groundY);
  ctx.strokeStyle = C.groundLine; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();

  // Enemy trails
  for (const em of g.enemies) {
    if (em.trail.length < 2) continue;
    ctx.strokeStyle = em.isMirv ? C.mirvTrail : C.enemyTrail;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(em.startX, em.startY);
    for (const pt of em.trail) ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.fillStyle = em.isMirv ? C.mirv : C.enemy;
    ctx.beginPath(); ctx.arc(em.x, em.y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  // Player missile trails
  for (const pm of g.playerMissiles) {
    if (pm.trail.length < 2) continue;
    ctx.strokeStyle = C.playerTrail; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pm.startX, pm.startY);
    for (const pt of pm.trail) ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.fillStyle = C.player;
    ctx.beginPath(); ctx.arc(pm.x, pm.y, 2, 0, Math.PI * 2); ctx.fill();
  }

  // Explosions
  for (const ex of g.explosions) {
    const r = exRadius(ex); if (r <= 0) continue;
    const f = ex.frame;
    const alpha = f < EX_EXPAND ? f / EX_EXPAND
      : f < EX_EXPAND + EX_HOLD ? 1
      : 1 - (f - EX_EXPAND - EX_HOLD) / EX_CONTRACT;
    const grad = ctx.createRadialGradient(ex.x, ex.y, 0, ex.x, ex.y, r);
    if (ex.fromPlayer) {
      grad.addColorStop(0, `rgba(225,255,0,${(alpha * 0.95).toFixed(2)})`);
      grad.addColorStop(0.45, `rgba(255,89,16,${(alpha * 0.75).toFixed(2)})`);
      grad.addColorStop(1, 'rgba(255,89,16,0)');
    } else {
      grad.addColorStop(0, `rgba(255,180,50,${(alpha * 0.9).toFixed(2)})`);
      grad.addColorStop(0.5, `rgba(255,89,16,${(alpha * 0.6).toFixed(2)})`);
      grad.addColorStop(1, 'rgba(255,20,0,0)');
    }
    ctx.beginPath(); ctx.arc(ex.x, ex.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
  }

  // Particles
  for (const p of g.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const city of g.cities) drawCity(ctx, city.x, groundY, city.alive);
  for (const bat of g.batteries) drawBattery(ctx, bat.x, groundY, bat.alive);

  // Ammo counts
  ctx.font = '11px monospace'; ctx.textAlign = 'center';
  for (const bat of g.batteries) {
    if (!bat.alive) continue;
    ctx.fillStyle = bat.ammo > 3 ? C.battery : '#FF5910';
    ctx.fillText(String(bat.ammo), bat.x, groundY + 18);
  }

  // Score
  ctx.textAlign = 'left'; ctx.font = 'bold 18px monospace'; ctx.fillStyle = C.score;
  ctx.fillText(String(g.score).padStart(6, '0'), 16, 28);

  // Wave
  ctx.textAlign = 'center'; ctx.font = '13px monospace'; ctx.fillStyle = C.ui;
  ctx.fillText(`WAVE ${g.wave}`, w / 2, 22);

  // Cities
  ctx.textAlign = 'right'; ctx.font = '13px monospace'; ctx.fillStyle = C.city;
  ctx.fillText(`CITIES ${g.cities.filter(c => c.alive).length}`, w - 16, 22);

  // No ammo warning
  const hasAmmo = g.batteries.some(b => b.alive && b.ammo > 0);
  if (!hasAmmo && g.enemies.length > 0) {
    ctx.textAlign = 'center'; ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#FF5910';
    ctx.fillText('NO AMMO', w / 2, 42);
  }

  if (!g.over) drawCrosshair(ctx, g.cursorX, g.cursorY);

  // Wave end overlay
  if (g.waveEndTimer > 0) {
    const t = g.waveEndTimer;
    ctx.globalAlpha = Math.min(1, t > 150 ? 1 : t / 30);
    ctx.textAlign = 'center';
    ctx.fillStyle = C.score; ctx.font = 'bold 32px monospace';
    ctx.fillText('WAVE COMPLETE', w / 2, h * 0.4);
    ctx.fillStyle = C.bonus; ctx.font = '18px monospace';
    ctx.fillText(`+${g.waveEndBonus} BONUS`, w / 2, h * 0.4 + 40);
    ctx.fillStyle = C.ui; ctx.font = '14px monospace';
    ctx.fillText('GET READY...', w / 2, h * 0.4 + 70);
    ctx.globalAlpha = 1;
  }

  if (g.over && !g.enteringInitials) renderGameOver(ctx, g);
  if (g.enteringInitials) renderInitials(ctx, g);
}

function renderGameOver(ctx: CanvasRenderingContext2D, g: GameState): void {
  const { w, h } = g;
  ctx.fillStyle = 'rgba(10,10,10,0.78)'; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FF5910'; ctx.font = 'bold 48px monospace';
  ctx.fillText('GAME OVER', w / 2, h * 0.28);
  ctx.fillStyle = C.score; ctx.font = '22px monospace';
  ctx.fillText(String(g.score).padStart(6, '0'), w / 2, h * 0.28 + 50);
  ctx.fillStyle = C.ui; ctx.font = '14px monospace';
  ctx.fillText(`WAVE ${g.wave} REACHED`, w / 2, h * 0.28 + 78);
  const hs = loadHS();
  if (hs.length > 0) {
    ctx.fillStyle = C.bonus; ctx.font = 'bold 13px monospace';
    ctx.fillText('— HIGH SCORES —', w / 2, h * 0.28 + 116);
    hs.slice(0, 5).forEach((e, i) => {
      ctx.font = '13px monospace';
      ctx.fillStyle = i === 0 ? C.score : C.ui;
      ctx.fillText(`${e.initials}  ${String(e.score).padStart(6, '0')}  W${e.wave}`, w / 2, h * 0.28 + 138 + i * 22);
    });
  }
  ctx.fillStyle = 'rgba(225,255,0,0.55)'; ctx.font = '13px monospace';
  ctx.fillText('[ R ] PLAY AGAIN   [ ESC ] EXIT', w / 2, h * 0.28 + 258);
}

function renderInitials(ctx: CanvasRenderingContext2D, g: GameState): void {
  const { w, h } = g;
  ctx.fillStyle = 'rgba(10,10,10,0.8)'; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.fillStyle = C.score; ctx.font = 'bold 28px monospace';
  ctx.fillText('HIGH SCORE!', w / 2, h * 0.32);
  ctx.font = '20px monospace';
  ctx.fillText(String(g.score).padStart(6, '0'), w / 2, h * 0.32 + 42);
  ctx.fillStyle = C.ui; ctx.font = '13px monospace';
  ctx.fillText('ENTER YOUR INITIALS', w / 2, h * 0.32 + 72);
  const cy = h * 0.32 + 120;
  for (let i = 0; i < 3; i++) {
    const x = w / 2 + (i - 1) * 52;
    const active = i === g.initialsPos;
    ctx.strokeStyle = active ? C.score : 'rgba(225,255,0,0.25)';
    ctx.lineWidth = active ? 2 : 1;
    ctx.strokeRect(x - 19, cy - 32, 38, 42);
    ctx.fillStyle = active ? C.score : C.ui;
    ctx.font = active ? 'bold 28px monospace' : '28px monospace';
    ctx.fillText(ABC[g.initialsChars[i]], x, cy);
  }
  ctx.fillStyle = C.ui; ctx.font = '12px monospace';
  ctx.fillText('↑↓ SELECT  →/ENTER NEXT  ← BACK', w / 2, cy + 56);
}

/* ── React component ── */
const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 6, color: '#d1d1c6', cursor: 'pointer',
  padding: '6px 10px', fontSize: 14, fontFamily: 'monospace',
};

interface Props { onClose: () => void; }

export function MissileCommandGame({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const sfxRef = useRef(new SFX());
  const rafRef = useRef(0);
  const isOverRef = useRef(false);
  const [isOver, setIsOver] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [muted, setMuted] = useState(false);
  const [, forceUpdate] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  isOverRef.current = isOver;

  useEffect(() => {
    if (!mounted) return;
    const el = canvasRef.current;
    if (!el) return;
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    gameRef.current = initGame(el.width, el.height);
    sfxRef.current.waveStart();
    const onResize = () => {
      el.width = window.innerWidth;
      el.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const loop = () => {
      const el = canvasRef.current;
      const ctx = el?.getContext('2d');
      const g = gameRef.current;
      if (el && ctx && g) {
        updateGame(g, sfxRef.current);
        renderGame(ctx, g);
        if (g.over && !g.enteringInitials && !isOverRef.current) {
          setIsOver(true);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (!g) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key.toLowerCase() === 'b') { setIsBoss(p => !p); return; }
      if (e.key.toLowerCase() === 'm') { setMuted(sfxRef.current.toggle()); return; }
      if (g.over && !g.enteringInitials && e.key.toLowerCase() === 'r') {
        const el = canvasRef.current;
        if (!el) return;
        gameRef.current = initGame(el.width, el.height);
        sfxRef.current.waveStart();
        setIsOver(false);
        return;
      }
      if (!g.enteringInitials) return;
      if (e.key === 'ArrowUp') {
        g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
      } else if (e.key === 'ArrowDown') {
        g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (g.initialsPos < 2) { g.initialsPos++; }
        else {
          const initials = g.initialsChars.map(c => ABC[c]).join('');
          const hs = loadHS();
          hs.push({ score: g.score, initials, wave: g.wave });
          hs.sort((a, b) => b.score - a.score);
          saveHS(hs.slice(0, HS_MAX));
          g.enteringInitials = false;
          setIsOver(true);
        }
      } else if (e.key === 'ArrowLeft') {
        if (g.initialsPos > 0) g.initialsPos--;
      }
      forceUpdate(n => n + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const g = gameRef.current;
    if (!g) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    g.cursorX = e.clientX - r.left;
    g.cursorY = e.clientY - r.top;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const g = gameRef.current;
    if (!g || g.over || g.waveEndTimer > 0 || g.enteringInitials) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    fireMissile(g, e.clientX - r.left, e.clientY - r.top, sfxRef.current);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const g = gameRef.current;
    if (!g || g.over || g.waveEndTimer > 0 || g.enteringInitials) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      fireMissile(g, t.clientX - r.left, t.clientY - r.top, sfxRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const g = gameRef.current;
    if (!g || e.touches.length === 0) return;
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    g.cursorX = e.touches[0].clientX - r.left;
    g.cursorY = e.touches[0].clientY - r.top;
  }, []);

  const handleRestart = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    gameRef.current = initGame(el.width, el.height);
    sfxRef.current.waveStart();
    setIsOver(false);
  }, []);

  if (!mounted) return null;

  const g = gameRef.current;
  const bossInitials = g ? g.initialsChars.map(c => ABC[c]).join('') : 'AAA';
  const bossScore = g?.score ?? 0;

  return createPortal(
    <>
      {isBoss && (
        <ArcadeBossOverlay
          game="Missile Command"
          score={bossScore}
          initials={bossInitials}
          onClose={() => setIsBoss(false)}
        />
      )}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0a', fontFamily: 'monospace' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', cursor: 'none', width: '100%', height: '100%' }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
        <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 8, zIndex: 10 }}>
          <button onClick={() => setMuted(sfxRef.current.toggle())} style={btnStyle} title="Mute (M)">
            {muted ? '🔇' : '🔊'}
          </button>
          <button onClick={() => setIsBoss(true)} style={btnStyle} title="Boss Key (B)">👔</button>
          <button onClick={onClose} style={btnStyle} title="Exit (Esc)">✕</button>
        </div>
        {isOver && !gameRef.current?.enteringInitials && (
          <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 10 }}>
            <button onClick={handleRestart} style={{ ...btnStyle, padding: '10px 24px', fontSize: 14, letterSpacing: 2 }}>
              PLAY AGAIN
            </button>
            <button onClick={onClose} style={{ ...btnStyle, padding: '10px 24px', fontSize: 14, letterSpacing: 2, borderColor: 'rgba(225,255,0,0.2)', color: '#888' }}>
              EXIT
            </button>
          </div>
        )}
        {/* Mobile initials controls */}
        {g?.enteringInitials && (
          <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
            {(['↑', '↓', '←', '→', '✓'] as const).map((lbl) => (
              <button
                key={lbl}
                style={{ ...btnStyle, padding: '12px 16px', fontSize: 18, minWidth: 48 }}
                onPointerDown={() => {
                  const eg = gameRef.current; if (!eg) return;
                  const key = lbl === '↑' ? 'ArrowUp' : lbl === '↓' ? 'ArrowDown' : lbl === '←' ? 'ArrowLeft' : lbl === '→' ? 'ArrowRight' : 'Enter';
                  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
                }}
              >{lbl}</button>
            ))}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
