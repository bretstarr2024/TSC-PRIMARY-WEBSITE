'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArcadeBossOverlay } from '@/components/ArcadeBossOverlay';

// ── Types ─────────────────────────────────────────────────────────
type Phase = 'CHARACTER_SELECT' | 'VS_SCREEN' | 'FIGHTING' | 'ROUND_WIN' | 'ROUND_LOSE' | 'SCORE_ENTRY' | 'GAME_OVER';
type Anim  = 'idle' | 'walk' | 'jump' | 'punch' | 'kick' | 'special' | 'hit' | 'dead';

interface Fighter {
  x: number; y: number; vx: number; vy: number;
  health: number; maxHealth: number;
  special: number;
  anim: Anim; animTimer: number;
  facing: 1 | -1;
  onGround: boolean;
  iframes: number;
}

interface HighScore { initials: string; score: number; }

interface G {
  phase: Phase; frame: number;
  hovered: number; selected: number;
  vsTimer: number;
  player: Fighter; boss: Fighter;
  bossIndex: number; bossesDefeated: number;
  bossAttackTimer: number;
  groundY: number; phaseTimer: number; roundTimer: number;
  score: number; won: boolean;
  enteringInitials: boolean;
  initialsChars: number[]; initialsPos: number;
  scoreSubmitted: boolean; scoreIndex: number;
  highScores: HighScore[];
}

// ── Static data ───────────────────────────────────────────────────
const FIGHTERS = [
  { id: 'bret',    name: 'BRET STARR',    title: 'FOUNDER & CEO',           color: '#FF5910', img: '/images/Bret.png'    },
  { id: 'jj',      name: 'JJ LA PATA',    title: 'STRATEGY LEAD',           color: '#73F5FF', img: '/images/JJ.png'      },
  { id: 'racheal', name: 'RACHEAL BATES', title: 'EXPERIENCE LEAD',         color: '#ED0AD2', img: '/images/Racheal.png' },
  { id: 'dan',     name: 'DAN MCCARRON',  title: 'CHIEF OPERATING OFFICER', color: '#E1FF00', img: '/images/Dan.png'     },
] as const;

const BOSSES = [
  { name: 'MISALIGNED STRATEGY', domain: 'DOMAIN I: STRATEGY',    color: '#7C3AED', hp: 100 },
  { name: 'BROKEN PIPELINE',     domain: 'DOMAIN II: DEMAND',     color: '#DC2626', hp: 120 },
  { name: 'THE AI IMPOSTOR',     domain: 'DOMAIN III: EXECUTION', color: '#059669', hp: 140 },
];

// ── Constants ─────────────────────────────────────────────────────
const BG        = '#050508';
const UI_C      = '#d1d1c6';
const SCORE_C   = '#E1FF00';
const ABC       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const HS_KEY    = 'tsc-fighter-hs';
const HS_MAX    = 10;

const GRAVITY   = 0.55;
const JUMP_V    = -13;
const MOVE_SPD  = 3.5;
const BOSS_SPDS = [1.8, 2.2, 2.7];

// fighter body dims (relative to feet at y=0)
const FW = 52, FH = 72, HR = 20;

const PUNCH_DUR    = 16,  KICK_DUR    = 22,  SPECIAL_DUR = 30;
const HIT_DUR      = 18,  IFRAME_DUR  = 28;
const PUNCH_DMG    = 8,   KICK_DMG    = 14,  SPECIAL_DMG = 22;
const PUNCH_RANGE  = 95,  KICK_RANGE  = 115, SPEC_RANGE  = 135;
const ROUND_FRAMES     = 90 * 60;
const BOSS_ATK_MIN     = 70,  BOSS_ATK_MAX = 150;
const SCORE_PER_BOSS_WIN = 500;

// ── SFX ───────────────────────────────────────────────────────────
class SFX {
  private ac: AudioContext | null = null;
  muted = false;
  private get ctx(): AudioContext | null {
    if (!this.ac) {
      try { this.ac = new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); } catch { /* ignore */ }
    }
    return this.ac;
  }
  private beep(f: number, d: number, t: OscillatorType = 'square', v = 0.15) {
    const c = this.ctx; if (!c || this.muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    o.start(); o.stop(c.currentTime + d);
  }
  punch()   { this.beep(260, 0.07, 'sawtooth', 0.2); }
  kick()    { this.beep(170, 0.11, 'sawtooth', 0.25); }
  special() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => this.beep(f, 0.1, 'square', 0.18), i * 35)); }
  hit()     { this.beep(110, 0.15, 'sawtooth', 0.3); }
  jump()    {
    const c = this.ctx; if (!c || this.muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'square'; o.frequency.setValueAtTime(200, c.currentTime);
    o.frequency.linearRampToValueAtTime(420, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.start(); o.stop(c.currentTime + 0.12);
  }
  ko()      { [200, 160, 120].forEach((f, i) => setTimeout(() => this.beep(f, 0.25, 'sawtooth', 0.3), i * 160)); }
  victory() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.beep(f, 0.14, 'square', 0.18), i * 90)); }
  select()  { this.beep(660, 0.08, 'square', 0.12); }
  toggle()  { this.muted = !this.muted; }
  dispose() { this.ac?.close().catch(() => {}); }
}

// ── Helpers ───────────────────────────────────────────────────────
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function loadHS(): HighScore[] { try { const s = localStorage.getItem(HS_KEY); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveHS(hs: HighScore[]) { try { localStorage.setItem(HS_KEY, JSON.stringify(hs)); } catch { /* ignore */ } }

function mkFighter(x: number, gy: number, facing: 1 | -1, hp: number): Fighter {
  return { x, y: gy, vx: 0, vy: 0, health: hp, maxHealth: hp, special: 0, anim: 'idle', animTimer: 0, facing, onGround: true, iframes: 0 };
}

function initState(w: number, h: number): G {
  const gy = h - 90;
  return {
    phase: 'CHARACTER_SELECT', frame: 0,
    hovered: 0, selected: 0, vsTimer: 0,
    player: mkFighter(w * 0.25, gy, 1, 100),
    boss:   mkFighter(w * 0.75, gy, -1, BOSSES[0].hp),
    bossIndex: 0, bossesDefeated: 0,
    bossAttackTimer: rnd(BOSS_ATK_MIN, BOSS_ATK_MAX),
    groundY: gy, phaseTimer: 0, roundTimer: ROUND_FRAMES,
    score: 0, won: false,
    enteringInitials: true,
    initialsChars: [0, 0, 0], initialsPos: 0,
    scoreSubmitted: false, scoreIndex: -1,
    highScores: loadHS(),
  };
}

// ── Combat ────────────────────────────────────────────────────────
function tryAttack(atk: Fighter, def: Fighter, move: 'punch' | 'kick' | 'special', sfx: SFX) {
  if (def.iframes > 0 || def.anim === 'dead') return;
  const range = move === 'punch' ? PUNCH_RANGE : move === 'kick' ? KICK_RANGE : SPEC_RANGE;
  const dmg   = move === 'punch' ? PUNCH_DMG   : move === 'kick' ? KICK_DMG   : SPECIAL_DMG;
  const dx = (def.x - atk.x) * atk.facing;
  if (dx < -20 || dx > range) return;
  if (Math.abs(def.y - atk.y) > 90) return;
  def.health    = Math.max(0, def.health - dmg);
  def.anim      = 'hit'; def.animTimer = 0; def.iframes = IFRAME_DUR;
  def.vx        = atk.facing * (move === 'special' ? 7 : move === 'kick' ? 4.5 : 3);
  if (move === 'special') def.vy = -6;
  sfx.hit();
}

// ── Drawing helpers ───────────────────────────────────────────────
function px(ctx: CanvasRenderingContext2D, size: number) {
  ctx.font = `${size}px 'Press Start 2P', monospace`;
}

function txt(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size: number, align: CanvasTextAlign = 'center') {
  px(ctx, size);
  ctx.textAlign = align;
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + 2, y + 2);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function hbar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, cur: number, max: number, color: string, rtl = false) {
  const pct = Math.max(0, cur / max);
  const fill = pct > 0.5 ? color : pct > 0.25 ? '#FF8C00' : '#FF3030';
  ctx.fillStyle = '#111'; ctx.fillRect(x, y, w, h);
  const bw = w * pct;
  ctx.fillStyle = fill;
  ctx.fillRect(rtl ? x + w - bw : x, y, bw, h);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}

// ── Sprite: player ────────────────────────────────────────────────
// Origin: (0,0) = feet center. Sprite draws facing right; caller flips for facing left.
function drawPlayer(ctx: CanvasRenderingContext2D, f: Fighter, color: string, fr: number) {
  const bob  = Math.sin(fr * 0.08) * 1.5 + (f.anim === 'walk' ? Math.sin(fr * 0.22) * 2.5 : 0);
  const bodyY = -FH + bob;
  const legPhase = f.anim === 'walk' ? Math.sin(fr * 0.22) * 6 : 0;

  ctx.fillStyle = color;
  // Legs
  ctx.fillRect(-FW / 2,     -32 + bob,             FW / 2 - 3, 32);
  ctx.fillRect(3,            -32 + bob + legPhase, FW / 2 - 3, 32);
  // Body
  ctx.fillRect(-FW / 2 + 4, bodyY, FW - 8, FH - 32);
  // Head
  ctx.beginPath(); ctx.arc(0, bodyY - HR + 6, HR, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, bodyY - HR + 2, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(7, bodyY - HR + 2, 1.5, 0, Math.PI * 2); ctx.fill();

  // Attack extensions
  if (f.anim === 'punch') {
    const ext = Math.min(1, f.animTimer / (PUNCH_DUR * 0.5));
    ctx.fillStyle = color;
    ctx.fillRect(FW / 2 - 4, bodyY + 8, ext * 38, 14);
    ctx.beginPath(); ctx.arc(FW / 2 - 4 + ext * 38 + 8, bodyY + 15, 10, 0, Math.PI * 2); ctx.fill();
  } else if (f.anim === 'kick') {
    const ext = Math.min(1, f.animTimer / (KICK_DUR * 0.5));
    ctx.save(); ctx.translate(FW / 2 - 4, -24); ctx.rotate(-0.3 + ext * 1.4);
    ctx.fillStyle = color; ctx.fillRect(0, 0, 44, 14);
    ctx.restore();
  } else if (f.anim === 'special') {
    const ext = Math.min(1, f.animTimer / (SPECIAL_DUR * 0.4));
    // aura
    ctx.save(); ctx.globalAlpha = ext * 0.55; ctx.fillStyle = SCORE_C;
    ctx.beginPath(); ctx.ellipse(0, bodyY - HR, 44 + ext * 24, 96 + ext * 32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = color;
    ctx.fillRect( FW / 2 - 4,           bodyY + 8, 54 * ext, 14);
    ctx.fillRect(-FW / 2 + 4 - 54 * ext, bodyY + 8, 54 * ext, 14);
  } else {
    // idle arms
    ctx.fillStyle = color;
    ctx.fillRect( FW / 2 - 6,      bodyY + 8, 14, 12);
    ctx.fillRect(-FW / 2 + 6 - 14, bodyY + 8, 14, 12);
  }
}

// ── Sprite: boss ──────────────────────────────────────────────────
// Origin: (0,0) = feet center. Drawn facing right; caller flips if needed.
function drawBoss(ctx: CanvasRenderingContext2D, f: Fighter, idx: number, fr: number) {
  const bob   = Math.sin(fr * 0.06) * 2.2;
  const boss  = BOSSES[idx];
  const color = boss.color;
  const atkExt = (f.anim === 'punch' || f.anim === 'kick' || f.anim === 'special')
    ? Math.min(1, f.animTimer / 10) : 0;

  if (idx === 0) {
    // MISALIGNED STRATEGY — fat body, 5 stacked hats, confused X-eyes
    const bw = FW + 24;
    const bodyY = -FH - 18 + bob;
    ctx.fillStyle = color;
    ctx.fillRect(-bw / 2, bodyY, bw, FH + 18);
    // 5 hats
    const hc = ['#7C3AED','#8B5CF6','#A78BFA','#C4B5FD','#DDD6FE'];
    for (let i = 0; i < 5; i++) {
      const hw = bw - i * 8;
      ctx.fillStyle = hc[i];
      ctx.fillRect(-hw / 2, bodyY - 22 - i * 18, hw, 18);
      ctx.fillRect(-hw / 2 - 6, bodyY - 22 - i * 18 + 14, hw + 12, 5);
    }
    // X eyes
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    [[-10, bodyY + 14], [10, bodyY + 14]].forEach(([ex, ey]) => {
      ctx.beginPath(); ctx.moveTo(ex - 5, ey - 5); ctx.lineTo(ex + 5, ey + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex + 5, ey - 5); ctx.lineTo(ex - 5, ey + 5); ctx.stroke();
    });
    if (atkExt > 0) {
      ctx.fillStyle = color; ctx.fillRect(bw / 2, bodyY + 22, 46 * atkExt, 18);
    }

  } else if (idx === 1) {
    // BROKEN PIPELINE — cylindrical pipe body with animated leaks
    const bw = 46;
    const bodyY = -FH + bob;
    ctx.fillStyle = color;
    ctx.fillRect(-bw / 2, bodyY, bw, FH);
    // pipe bands
    ctx.fillStyle = '#991B1B';
    for (let i = 0; i < 3; i++) ctx.fillRect(-bw / 2 - 5, bodyY + i * 24, bw + 10, 6);
    // animated drips
    ctx.fillStyle = '#FCA5A5';
    ([-bw / 2 - 5, bw / 2 - 1]).forEach(lx => {
      for (let d = 0; d < 3; d++) {
        const dy = (fr * 2 + d * 20) % 60;
        ctx.beginPath(); ctx.arc(lx + (lx < 0 ? -4 : 4), bodyY + 10 + dy, 4, 0, Math.PI * 2); ctx.fill();
      }
    });
    // pressure-gauge head
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, bodyY - 22, HR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-7, bodyY - 28, 14, 7);
    ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-11, bodyY - 14); ctx.lineTo(-4, bodyY - 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, bodyY - 14); ctx.lineTo(4, bodyY - 11); ctx.stroke();
    if (atkExt > 0) {
      ctx.fillStyle = color; ctx.fillRect(bw / 2, bodyY + 10, 52 * atkExt, 14);
      if (f.anim === 'special') {
        ctx.fillStyle = '#FCA5A5';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(bw / 2 + 52 * atkExt + (i * 7 - 14), bodyY + (i * 6 - 10), 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

  } else {
    // THE AI IMPOSTOR — glitchy dashed outline, binary eyes, color artifacts
    const glitch = Math.sin(fr * 0.31) > 0.72 ? (fr % 3) - 1 : 0;
    const bodyY  = -FH + bob;
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([8, 4]);
    ctx.strokeRect(-FW / 2 + glitch, bodyY, FW, FH);
    ctx.setLineDash([]);
    ctx.fillStyle = color + '44';
    ctx.fillRect(-FW / 2 + glitch, bodyY, FW, FH);
    // head
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.arc(glitch, bodyY - HR, HR, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // binary label
    px(ctx, 7); ctx.textAlign = 'center';
    ctx.fillStyle = color; ctx.fillText('01', glitch, bodyY - HR + 5);
    // random artifact (deterministic by frame)
    if ((fr * 7) % 13 < 3) {
      ctx.fillStyle = color + '88';
      ctx.fillRect(-FW / 2 + (fr % 18), bodyY + (fr % FH), (fr % 24) + 8, 4);
    }
    if (atkExt > 0) {
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = color; ctx.lineWidth = 4;
      ctx.strokeRect(FW / 2, bodyY + 14, 46 * atkExt, 13);
      ctx.setLineDash([]);
    }
  }
}

// ── Portrait helper ───────────────────────────────────────────────
function portrait(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | undefined,
  x: number, y: number, w: number, h: number,
  color: string, label: string
) {
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = color + '22'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    px(ctx, 10); ctx.textAlign = 'center';
    ctx.fillStyle = color; ctx.fillText(label.slice(0, 3).toUpperCase(), x + w / 2, y + h / 2 + 4);
  }
}

// ── Touch buttons ─────────────────────────────────────────────────
type Btn = { id: string; x: number; y: number; r: number };

function calcButtons(w: number, h: number, phase: Phase): Btn[] {
  const btns: Btn[] = [];
  if (phase === 'CHARACTER_SELECT' || phase === 'SCORE_ENTRY' || phase === 'GAME_OVER') {
    const r = 36;
    const cy = h - 80;
    // Left / Right / Confirm (punch)
    btns.push({ id: 'left',  x: 80,     y: cy, r });
    btns.push({ id: 'right', x: 80+90,  y: cy, r });
    btns.push({ id: 'up',    x: 80+45,  y: cy-75, r });
    btns.push({ id: 'down',  x: 80+45,  y: cy+30, r });
    btns.push({ id: 'punch', x: w - 80, y: cy, r });
  } else if (phase === 'FIGHTING') {
    const r = 40;
    const cy = h - 90;
    // D-pad left side
    btns.push({ id: 'left',    x: 80,        y: cy,     r });
    btns.push({ id: 'right',   x: 80 + 100,  y: cy,     r });
    btns.push({ id: 'up',      x: 80 + 50,   y: cy - 90, r });
    // Action right side
    btns.push({ id: 'punch',   x: w - 80,       y: cy - 5,  r });
    btns.push({ id: 'kick',    x: w - 80 - 100, y: cy + 10, r });
    btns.push({ id: 'special', x: w - 80 - 50,  y: cy - 95, r });
  }
  return btns;
}

function drawButtons(ctx: CanvasRenderingContext2D, btns: Btn[], active: Record<string, boolean>) {
  const labels: Record<string, string> = { left: '◀', right: '▶', up: '▲', down: '▼', punch: 'Z', kick: 'X', special: 'S' };
  btns.forEach(b => {
    const on = !!active[b.id];
    ctx.save();
    ctx.globalAlpha = on ? 0.85 : 0.45;
    ctx.fillStyle = on ? '#fff' : '#222';
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = on ? SCORE_C : '#666'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
    px(ctx, b.r < 38 ? 9 : 11); ctx.textAlign = 'center';
    ctx.fillStyle = on ? BG : UI_C;
    ctx.fillText(labels[b.id] ?? b.id, b.x, b.y + 5);
    ctx.restore();
  });
}

// ── Phase renderers ───────────────────────────────────────────────
function drawCharacterSelect(
  ctx: CanvasRenderingContext2D, g: G,
  imgs: Record<string, HTMLImageElement>,
  w: number, h: number
) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
  txt(ctx, 'SELECT YOUR FIGHTER', w / 2, 70, SCORE_C, 14);

  const cardW = Math.min(180, (w - 100) / 4 - 10);
  const cardH = cardW * 1.4;
  const totalW = cardW * 4 + 30 * 3;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < FIGHTERS.length; i++) {
    const f  = FIGHTERS[i];
    const cx = startX + i * (cardW + 20);
    const cy = h / 2 - cardH / 2;
    const on = g.hovered === i;

    if (on) { ctx.shadowBlur = 24; ctx.shadowColor = f.color; }
    ctx.fillStyle   = on ? f.color + '1a' : '#0f0f14'; ctx.fillRect(cx, cy, cardW, cardH);
    ctx.strokeStyle = on ? f.color : '#333'; ctx.lineWidth = on ? 3 : 1;
    ctx.strokeRect(cx, cy, cardW, cardH);
    ctx.shadowBlur = 0;

    const ph = cardW * 1.05;
    portrait(ctx, imgs[f.id], cx + 4, cy + 4, cardW - 8, ph, f.color, f.name);
    txt(ctx, f.name,  cx + cardW / 2, cy + ph + 24, f.color, 7);
    txt(ctx, f.title, cx + cardW / 2, cy + ph + 44, UI_C,    5);
  }

  txt(ctx, '← → SELECT    Z / ENTER CONFIRM', w / 2, h - 50, UI_C, 7);
  txt(ctx, 'M MUTE', w / 2, h - 26, '#555', 5);
}

function drawVsScreen(
  ctx: CanvasRenderingContext2D, g: G,
  imgs: Record<string, HTMLImageElement>,
  w: number, h: number
) {
  ctx.fillStyle = '#130022'; ctx.fillRect(0, 0, w / 2, h);
  ctx.fillStyle = '#001a10'; ctx.fillRect(w / 2, 0, w / 2, h);

  const fi = FIGHTERS[g.selected];
  const bo = BOSSES[g.bossIndex];
  const ph = Math.min(h * 0.55, 380);
  const pw = ph * 0.7;
  portrait(ctx, imgs[fi.id], 40, h / 2 - ph / 2, pw, ph, fi.color, fi.name);

  const pulse = 1 + Math.sin(g.vsTimer * 0.1) * 0.04;
  ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(pulse, pulse);
  txt(ctx, 'VS', 0, 12, '#FF1111', 48);
  ctx.restore();

  // Boss art (right side)
  ctx.save();
  ctx.translate(w - 40 - pw / 2, h / 2 + 10);
  ctx.scale(2.2, 2.2);
  const fb = mkFighter(0, 0, -1, bo.hp);
  drawBoss(ctx, fb, g.bossIndex, g.vsTimer);
  ctx.restore();

  txt(ctx, fi.name, 40 + pw / 2, h / 2 + ph / 2 + 30, fi.color, 9);
  txt(ctx, bo.name, w - 40 - pw / 2, h / 2 + ph / 2 + 30, bo.color, 9);
  txt(ctx, bo.domain, w - 40 - pw / 2, h / 2 + ph / 2 + 54, UI_C, 6);
  txt(ctx, `ROUND ${g.bossIndex + 1}`, w / 2, 60, SCORE_C, 14);

  if (g.vsTimer > 120) {
    const a = Math.min(1, (g.vsTimer - 120) / 30);
    ctx.globalAlpha = a;
    txt(ctx, 'FIGHT!', w / 2, h / 2 - 30, SCORE_C, 34);
    ctx.globalAlpha = 1;
  }
}

function drawArena(
  ctx: CanvasRenderingContext2D, g: G,
  imgs: Record<string, HTMLImageElement>,
  w: number, h: number,
  btns: Btn[], touchActive: Record<string, boolean>,
  showTouch: boolean
) {
  // Stage
  const sky = ctx.createLinearGradient(0, 0, 0, g.groundY);
  sky.addColorStop(0, '#08081a'); sky.addColorStop(1, '#1a1a30');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, g.groundY);
  ctx.strokeStyle = '#1a1a2a'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, g.groundY); ctx.stroke(); }
  for (let y = 0; y < g.groundY; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.fillStyle = '#1e1e28'; ctx.fillRect(0, g.groundY, w, h - g.groundY);
  ctx.fillStyle = '#2a2a40'; ctx.fillRect(0, g.groundY, w, 4);
  ctx.strokeStyle = '#252538'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, g.groundY); ctx.lineTo(x, h); ctx.stroke(); }

  // HUD
  const fi = FIGHTERS[g.selected];
  const bo = BOSSES[g.bossIndex];
  const bw = Math.min(290, w * 0.3);
  const bh = 20;
  const hudY = 12;
  const psz = 50;

  // Player side
  if (imgs[fi.id] && imgs[fi.id].complete && imgs[fi.id].naturalWidth > 0) {
    ctx.drawImage(imgs[fi.id], 8, hudY + 6, psz, psz);
  } else {
    ctx.fillStyle = fi.color + '44'; ctx.fillRect(8, hudY + 6, psz, psz);
    ctx.strokeStyle = fi.color; ctx.lineWidth = 1.5; ctx.strokeRect(8, hudY + 6, psz, psz);
  }
  txt(ctx, fi.name, 64, hudY + 9, fi.color, 7, 'left');
  hbar(ctx, 64, hudY + 20, bw, bh, g.player.health, g.player.maxHealth, fi.color);
  // special bar
  ctx.fillStyle = '#111'; ctx.fillRect(64, hudY + bh + 24, bw, 8);
  const sg = ctx.createLinearGradient(64, 0, 64 + bw, 0);
  sg.addColorStop(0, '#FF5910'); sg.addColorStop(1, SCORE_C);
  ctx.fillStyle = sg; ctx.fillRect(64, hudY + bh + 24, bw * (g.player.special / 100), 8);
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(64, hudY + bh + 24, bw, 8);
  if (g.player.special >= 100) txt(ctx, 'SPECIAL READY', 64 + bw / 2, hudY + bh + 31, SCORE_C, 5);

  // Boss side
  txt(ctx, bo.name, w - 64, hudY + 9, bo.color, 7, 'right');
  hbar(ctx, w - 64 - bw, hudY + 20, bw, bh, g.boss.health, g.boss.maxHealth, bo.color, true);

  // Timer
  const secs = Math.max(0, Math.ceil(g.roundTimer / 60));
  txt(ctx, String(secs).padStart(2, '0'), w / 2, hudY + 32, secs <= 10 ? '#FF3030' : SCORE_C, 18);
  txt(ctx, `SCORE ${String(g.score).padStart(6, '0')}`, w / 2, hudY + 56, UI_C, 7);

  // Shadows
  const p = g.player, b = g.boss;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(p.x, g.groundY + 6, 28, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(b.x, g.groundY + 6, 32, 9, 0, 0, Math.PI * 2); ctx.fill();

  // Player sprite
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.facing === -1) ctx.scale(-1, 1);
  if (p.iframes > 0 && Math.floor(g.frame / 4) % 2 === 0) ctx.globalAlpha = 0.3;
  drawPlayer(ctx, p, fi.color, g.frame);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Boss sprite
  ctx.save();
  ctx.translate(b.x, b.y);
  if (b.facing === -1) ctx.scale(-1, 1);
  if (b.iframes > 0 && Math.floor(g.frame / 4) % 2 === 0) ctx.globalAlpha = 0.3;
  drawBoss(ctx, b, g.bossIndex, g.frame);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Controls hint
  if (!showTouch) txt(ctx, '← → MOVE   ↑ JUMP   Z PUNCH   X KICK   S SPECIAL   M MUTE', w / 2, h - 12, '#444', 5);
  if (showTouch) drawButtons(ctx, btns, touchActive);
}

function drawKO(ctx: CanvasRenderingContext2D, g: G, w: number, h: number) {
  const t = g.phaseTimer;
  if (t < 16) return;
  if (t < 28) {
    ctx.fillStyle = `rgba(255,255,255,${(28 - t) / 28 * 0.5})`;
    ctx.fillRect(0, 0, w, h);
  }
  const a = Math.min(1, (t - 16) / 20);
  ctx.globalAlpha = a;
  const win = g.phase === 'ROUND_WIN';
  const scale = 1 + Math.sin(t * 0.08) * 0.03;
  ctx.save(); ctx.translate(w / 2, h / 2 - 20); ctx.scale(scale, scale);
  txt(ctx, win ? 'K.O.!' : 'K.O...', 0, 0, win ? SCORE_C : '#FF3030', 52);
  ctx.restore();
  if (win && g.bossesDefeated >= 3) txt(ctx, 'TSC WINS!', w / 2, h / 2 + 60, SCORE_C, 20);
  else if (win) txt(ctx, `BOSS ${g.bossIndex + 1} DEFEATED`, w / 2, h / 2 + 60, UI_C, 13);
  else txt(ctx, 'YOU WERE DEFEATED', w / 2, h / 2 + 60, '#FF5555', 11);
  ctx.globalAlpha = 1;
}

function drawScoreEntry(ctx: CanvasRenderingContext2D, g: G, w: number, h: number, btns: Btn[], ta: Record<string, boolean>, showTouch: boolean) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
  txt(ctx, g.won ? 'VICTORY!' : 'GAME OVER', w / 2, 100, g.won ? SCORE_C : '#FF3030', 22);
  txt(ctx, `SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, 155, UI_C, 13);
  txt(ctx, `BOSSES DEFEATED: ${g.bossesDefeated} / 3`, w / 2, 186, UI_C, 8);
  txt(ctx, 'ENTER YOUR INITIALS', w / 2, 258, UI_C, 9);

  const cw = 60;
  const sx = w / 2 - cw;
  for (let i = 0; i < 3; i++) {
    const x = sx + i * cw;
    const on = g.initialsPos === i;
    ctx.fillStyle   = on ? SCORE_C + '22' : '#111'; ctx.fillRect(x - 18, 278, 36, 46);
    ctx.strokeStyle = on ? SCORE_C : '#444'; ctx.lineWidth = on ? 2.5 : 1;
    ctx.strokeRect(x - 18, 278, 36, 46);
    txt(ctx, ABC[g.initialsChars[i]], x, 322, on ? SCORE_C : UI_C, 22);
  }
  // cursor blink
  if (Math.floor(g.frame / 28) % 2 === 0) {
    const x = sx + g.initialsPos * cw;
    ctx.fillStyle = SCORE_C; ctx.fillRect(x - 14, 330, 28, 3);
  }
  if (!showTouch) txt(ctx, '↑↓ CHANGE   ←→ MOVE   ENTER CONFIRM', w / 2, h - 50, UI_C, 7);
  if (showTouch) drawButtons(ctx, btns, ta);
}

function drawGameOver(ctx: CanvasRenderingContext2D, g: G, w: number, h: number, btns: Btn[], ta: Record<string, boolean>, showTouch: boolean) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
  txt(ctx, g.won ? 'TSC WINS!' : 'GAME OVER', w / 2, 80, g.won ? SCORE_C : '#FF3030', 22);
  txt(ctx, `SCORE: ${String(g.score).padStart(6, '0')}`, w / 2, 135, UI_C, 13);
  txt(ctx, `BOSSES: ${g.bossesDefeated} / 3`, w / 2, 164, UI_C, 8);
  txt(ctx, '— HIGH SCORES —', w / 2, 220, SCORE_C, 9);

  const hs = g.highScores.slice(0, 8);
  hs.forEach((e, i) => {
    const y = 248 + i * 28;
    const c = i === g.scoreIndex ? SCORE_C : (i === 0 ? '#FFD700' : UI_C);
    txt(ctx, `${String(i + 1).padStart(2, ' ')}.  ${e.initials}  ${String(e.score).padStart(6, '0')}`, w / 2, y, c, 9);
  });

  if (!showTouch) txt(ctx, 'PRESS ENTER TO PLAY AGAIN', w / 2, h - 50, UI_C, 8);
  if (showTouch) drawButtons(ctx, btns, ta);
}

// ── Main component ────────────────────────────────────────────────
export function TSCFighterGame({ onClose }: { onClose: () => void }) {
  const cvs         = useRef<HTMLCanvasElement>(null);
  const game        = useRef<G | null>(null);
  const keys        = useRef<Set<string>>(new Set());
  const touchActive = useRef<Record<string, boolean>>({});
  const prevTouch   = useRef<Record<string, boolean>>({});
  const showTouch   = useRef(false);
  const btnsRef     = useRef<Btn[]>([]);
  const raf         = useRef(0);
  const imgs        = useRef<Record<string, HTMLImageElement>>({});
  const bossActive  = useRef(false);
  const sfxRef      = useRef(new SFX());
  const [bossData, setBossData] = useState<{ game: string; score: number; initials: string } | null>(null);

  // Load portraits
  useEffect(() => {
    FIGHTERS.forEach(f => {
      const img = new Image(); img.src = f.img;
      imgs.current[f.id] = img;
    });
  }, []);

  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const sfx = sfxRef.current;

    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const prevOv = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    game.current = initState(el.width, el.height);

    // Touch
    const updateTouch = (e: TouchEvent) => {
      e.preventDefault();
      showTouch.current = true;
      const state: Record<string, boolean> = {};
      for (let t = 0; t < e.touches.length; t++) {
        const tx = e.touches[t].clientX, ty = e.touches[t].clientY;
        for (const b of btnsRef.current) {
          if (Math.hypot(tx - b.x, ty - b.y) < b.r * 1.5) state[b.id] = true;
        }
      }
      touchActive.current = state;
    };
    el.addEventListener('touchstart',  updateTouch, { passive: false });
    el.addEventListener('touchmove',   updateTouch, { passive: false });
    el.addEventListener('touchend',    updateTouch, { passive: false });
    el.addEventListener('touchcancel', updateTouch, { passive: false });

    // Internal helpers
    function startBoss(g: G, w: number, h: number) {
      const gy = h - 90;
      g.boss = mkFighter(w * 0.75, gy, -1, BOSSES[g.bossIndex].hp);
      g.player.x = w * 0.25; g.player.y = gy;
      g.player.vx = 0; g.player.vy = 0;
      g.player.onGround = true; g.player.anim = 'idle'; g.player.animTimer = 0;
      g.groundY = gy; g.roundTimer = ROUND_FRAMES; g.phaseTimer = 0;
      g.bossAttackTimer = rnd(BOSS_ATK_MIN, BOSS_ATK_MAX);
    }

    function submitScore(g: G) {
      const initials = g.initialsChars.map(i => ABC[i]).join('');
      const entry: HighScore = { initials, score: g.score };
      const scores = [...g.highScores, entry].sort((a, b) => b.score - a.score).slice(0, HS_MAX);
      saveHS(scores);
      g.highScores = scores;
      g.scoreIndex = scores.findIndex(s => s === entry);
      g.enteringInitials = false; g.scoreSubmitted = true;
      g.phase = 'GAME_OVER';
      window.dispatchEvent(new CustomEvent('arcade-score', { detail: { game: 'tsc-fighter', initials, score: g.score } }));
      if (g.scoreIndex === 0 && !sessionStorage.getItem('tsc-fighter-boss')) {
        sessionStorage.setItem('tsc-fighter-boss', '1');
        bossActive.current = true;
        setBossData({ game: 'tsc-fighter', score: g.score, initials });
      }
    }

    // Keyboard
    const onDown = (e: KeyboardEvent) => {
      const g = game.current;
      if (!g) return;
      if (e.key === 'Escape') { sfx.dispose(); onClose(); return; }
      if (e.key === 'm' || e.key === 'M') { sfx.toggle(); return; }

      if (g.phase === 'CHARACTER_SELECT') {
        if (e.key === 'ArrowLeft')  g.hovered = (g.hovered + 3) % 4;
        if (e.key === 'ArrowRight') g.hovered = (g.hovered + 1) % 4;
        if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
          g.selected = g.hovered; sfx.select();
          g.phase = 'VS_SCREEN'; g.vsTimer = 0;
          startBoss(g, el.width, el.height);
        }
        return;
      }
      if (g.phase === 'SCORE_ENTRY') {
        if (e.key === 'ArrowUp')    g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
        if (e.key === 'ArrowDown')  g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
        if (e.key === 'ArrowLeft')  g.initialsPos = Math.max(0, g.initialsPos - 1);
        if (e.key === 'ArrowRight') g.initialsPos = Math.min(2, g.initialsPos + 1);
        if (e.key === 'Enter') submitScore(g);
        if (/^[a-zA-Z]$/.test(e.key)) {
          g.initialsChars[g.initialsPos] = e.key.toUpperCase().charCodeAt(0) - 65;
          if (g.initialsPos < 2) g.initialsPos++;
        }
        return;
      }
      if (g.phase === 'GAME_OVER') {
        if (e.key === 'Enter') { game.current = initState(el.width, el.height); }
        return;
      }
      if (g.phase === 'ROUND_WIN' || g.phase === 'ROUND_LOSE' || g.phase === 'VS_SCREEN') return;

      keys.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => { keys.current.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);

    // ─── GAME LOOP ───────────────────────────────────────────────
    const loop = () => {
      const g = game.current;
      if (!g) { raf.current = requestAnimationFrame(loop); return; }
      const ctx = el.getContext('2d');
      if (!ctx) { raf.current = requestAnimationFrame(loop); return; }
      const w = el.width, h = el.height;
      const k = keys.current, ta = touchActive.current;
      const pt = prevTouch.current;
      g.frame++;

      const pressed  = (id: string) => {
        switch (id) {
          case 'left':    return k.has('arrowleft')  || !!ta.left;
          case 'right':   return k.has('arrowright') || !!ta.right;
          case 'up':      return k.has('arrowup')    || !!ta.up;
          case 'punch':   return k.has('z')           || !!ta.punch;
          case 'kick':    return k.has('x')           || !!ta.kick;
          case 'special': return k.has('s')           || !!ta.special;
          default: return false;
        }
      };
      const justTouch = (id: string) => !!ta[id] && !pt[id];

      // Recalculate touch buttons
      if (showTouch.current) btnsRef.current = calcButtons(w, h, g.phase);

      // ─ Character Select ─
      if (g.phase === 'CHARACTER_SELECT') {
        if (showTouch.current) {
          if (justTouch('left'))  g.hovered = (g.hovered + 3) % 4;
          if (justTouch('right')) g.hovered = (g.hovered + 1) % 4;
          if (justTouch('punch')) {
            g.selected = g.hovered; sfx.select();
            g.phase = 'VS_SCREEN'; g.vsTimer = 0;
            startBoss(g, w, h);
          }
        }
        drawCharacterSelect(ctx, g, imgs.current, w, h);
        if (showTouch.current) drawButtons(ctx, btnsRef.current, ta);
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ VS Screen ─
      if (g.phase === 'VS_SCREEN') {
        g.vsTimer++;
        if (g.vsTimer > 180) { g.phase = 'FIGHTING'; g.phaseTimer = 0; }
        drawVsScreen(ctx, g, imgs.current, w, h);
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ Score Entry ─
      if (g.phase === 'SCORE_ENTRY') {
        if (showTouch.current) {
          if (justTouch('up'))    g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 1) % 26;
          if (justTouch('down'))  g.initialsChars[g.initialsPos] = (g.initialsChars[g.initialsPos] + 25) % 26;
          if (justTouch('left'))  g.initialsPos = Math.max(0, g.initialsPos - 1);
          if (justTouch('right')) g.initialsPos = Math.min(2, g.initialsPos + 1);
          if (justTouch('punch')) submitScore(g);
        }
        drawScoreEntry(ctx, g, w, h, btnsRef.current, ta, showTouch.current);
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ Game Over ─
      if (g.phase === 'GAME_OVER') {
        if (showTouch.current && justTouch('punch')) game.current = initState(w, h);
        drawGameOver(ctx, g, w, h, btnsRef.current, ta, showTouch.current);
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ Round Win / Lose ─
      if (g.phase === 'ROUND_WIN' || g.phase === 'ROUND_LOSE') {
        g.phaseTimer++;
        drawArena(ctx, g, imgs.current, w, h, [], {}, false);
        drawKO(ctx, g, w, h);
        if (g.phaseTimer > 130) {
          if (g.phase === 'ROUND_WIN') {
            if (g.bossesDefeated >= 3) {
              g.won = true; g.phase = 'SCORE_ENTRY';
            } else {
              g.phase = 'VS_SCREEN'; g.vsTimer = 0;
              startBoss(g, w, h);
            }
          } else {
            g.phase = 'SCORE_ENTRY';
          }
          g.phaseTimer = 0;
        }
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ Fighting ─
      const p = g.player, b = g.boss;
      g.roundTimer = Math.max(0, g.roundTimer - 1);
      g.phaseTimer++;

      // Time out
      if (g.roundTimer === 0) {
        if (p.health >= b.health) {
          g.score += Math.floor(p.health * 3) + g.bossesDefeated * 500;
          g.bossesDefeated++;
          g.phase = 'ROUND_WIN'; g.phaseTimer = 0; sfx.ko(); setTimeout(() => sfx.victory(), 500);
        } else {
          g.phase = 'ROUND_LOSE'; g.phaseTimer = 0; sfx.ko();
        }
        prevTouch.current = { ...ta };
        raf.current = requestAnimationFrame(loop); return;
      }

      // ─ Player input ─
      if (p.anim !== 'hit' && p.anim !== 'dead') {
        if (pressed('left')  && p.x > 40) { if (p.anim === 'idle' || p.anim === 'walk') { p.anim = 'walk'; p.facing = -1; } p.vx = -MOVE_SPD; }
        else if (pressed('right') && p.x < w - 40) { if (p.anim === 'idle' || p.anim === 'walk') { p.anim = 'walk'; p.facing = 1; } p.vx = MOVE_SPD; }
        else { p.vx = 0; if (p.anim === 'walk') p.anim = 'idle'; }

        if (pressed('up') && p.onGround) { p.vy = JUMP_V; p.onGround = false; p.anim = 'jump'; sfx.jump(); }

        if (p.anim === 'idle' || p.anim === 'walk' || p.anim === 'jump') {
          if (pressed('punch'))   { p.anim = 'punch';   p.animTimer = 0; sfx.punch(); }
          else if (pressed('kick'))    { p.anim = 'kick';    p.animTimer = 0; sfx.kick(); }
          else if (pressed('special') && p.special >= 100) { p.anim = 'special'; p.animTimer = 0; p.special = 0; sfx.special(); }
        }
      }

      // Auto-face opponent
      if (p.anim === 'idle' || p.anim === 'walk') p.facing = p.x < b.x ? 1 : -1;

      // Player physics
      if (!p.onGround) p.vy += GRAVITY;
      p.x += p.vx; p.y += p.vy;
      if (p.y >= g.groundY) { p.y = g.groundY; p.vy = 0; p.onGround = true; if (p.anim === 'jump') p.anim = 'idle'; }
      p.x = Math.max(30, Math.min(w - 30, p.x));

      // Player anim timers
      if (p.anim === 'punch' || p.anim === 'kick' || p.anim === 'special') {
        p.animTimer++;
        const dur = p.anim === 'punch' ? PUNCH_DUR : p.anim === 'kick' ? KICK_DUR : SPECIAL_DUR;
        if (p.animTimer === Math.floor(dur / 2)) tryAttack(p, b, p.anim, sfx);
        if (p.animTimer >= dur) { p.anim = p.onGround ? 'idle' : 'jump'; p.animTimer = 0; }
      }
      if (p.anim === 'hit') { p.animTimer++; if (p.animTimer >= HIT_DUR) { p.anim = p.onGround ? 'idle' : 'jump'; p.animTimer = 0; } }
      if (p.iframes > 0) p.iframes--;
      if (p.special < 100) p.special = Math.min(100, p.special + 0.15);

      // ─ Boss AI ─
      if (b.anim !== 'dead' && b.anim !== 'hit' && b.anim !== 'punch' && b.anim !== 'kick' && b.anim !== 'special') {
        const dx = p.x - b.x;
        b.facing = dx > 0 ? 1 : -1;
        const spd = BOSS_SPDS[g.bossIndex] ?? 2;
        if (Math.abs(dx) > PUNCH_RANGE - 10) {
          b.vx = b.facing * spd; b.anim = 'walk';
        } else {
          b.vx = 0; b.anim = 'idle';
          g.bossAttackTimer--;
          if (g.bossAttackTimer <= 0) {
            const r = Math.random();
            if (r < 0.48)      { b.anim = 'punch';   b.animTimer = 0; sfx.punch(); }
            else if (r < 0.82) { b.anim = 'kick';    b.animTimer = 0; sfx.kick(); }
            else if (b.special >= 100) { b.anim = 'special'; b.animTimer = 0; b.special = 0; sfx.special(); }
            else               { b.anim = 'punch';   b.animTimer = 0; sfx.punch(); }
            g.bossAttackTimer = rnd(BOSS_ATK_MIN, BOSS_ATK_MAX);
          }
        }
        if (b.special < 100) b.special = Math.min(100, b.special + 0.1);
      }

      // Boss physics
      if (!b.onGround) b.vy += GRAVITY;
      b.x += b.vx; b.y += b.vy;
      if (b.y >= g.groundY) { b.y = g.groundY; b.vy = 0; b.onGround = true; }
      b.x = Math.max(30, Math.min(w - 30, b.x));

      // Boss anim timers
      if (b.anim === 'punch' || b.anim === 'kick' || b.anim === 'special') {
        b.animTimer++;
        const dur = b.anim === 'punch' ? PUNCH_DUR : b.anim === 'kick' ? KICK_DUR : SPECIAL_DUR;
        if (b.animTimer === Math.floor(dur / 2)) tryAttack(b, p, b.anim, sfx);
        if (b.animTimer >= dur) { b.anim = b.onGround ? 'idle' : 'walk'; b.animTimer = 0; g.bossAttackTimer = rnd(BOSS_ATK_MIN, BOSS_ATK_MAX); }
      }
      if (b.anim === 'hit') { b.animTimer++; if (b.animTimer >= HIT_DUR) { b.anim = b.onGround ? 'idle' : 'walk'; b.animTimer = 0; } }
      if (b.iframes > 0) b.iframes--;

      // ─ Round end checks ─
      if (p.health <= 0 && p.anim !== 'dead') {
        p.anim = 'dead'; g.phase = 'ROUND_LOSE'; g.phaseTimer = 0; sfx.ko();
      } else if (b.health <= 0 && b.anim !== 'dead') {
        b.anim = 'dead';
        const timeLeft = g.roundTimer;
        g.score += SCORE_PER_BOSS_WIN + Math.floor(p.health * 3) + Math.floor((timeLeft / 60) * 5);
        g.bossesDefeated++;
        g.phase = 'ROUND_WIN'; g.phaseTimer = 0;
        sfx.ko(); setTimeout(() => sfx.victory(), 500);
      }

      drawArena(ctx, g, imgs.current, w, h, btnsRef.current, ta, showTouch.current);
      prevTouch.current = { ...ta };
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      sfx.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
      el.removeEventListener('touchstart',  updateTouch);
      el.removeEventListener('touchmove',   updateTouch);
      el.removeEventListener('touchend',    updateTouch);
      el.removeEventListener('touchcancel', updateTouch);
      document.body.style.overflow = prevOv;
    };
  }, [onClose]);

  return (
    <>
      {createPortal(
        <div data-tsc-fighter style={{ position: 'fixed', inset: 0, zIndex: 99999, background: BG, touchAction: 'none' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(20,18,19,0.75)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#d1d1c6', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >✕ EXIT</button>
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
