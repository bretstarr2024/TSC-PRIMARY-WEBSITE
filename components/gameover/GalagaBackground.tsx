'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * Authentic Galaga-style background with a massive pixel-art explosion reveal.
 * On explode(): all game elements freeze, a huge blocky pixel explosion erupts
 * from center screen (white/gray core, cyan + red debris), expands outward,
 * then scatters to reveal "NEW GAME?" behind it. Game layer fades away.
 */

const ALIEN_COLORS = ['#FF5910', '#E1FF00', '#73F5FF', '#ED0AD2', '#FF3333', '#7C3AED'];
const BULLET_COLOR = '#E1FF00';
const SHIP_COLOR = '#73F5FF';

// Formation config — 4 rows to clear the hero text
const FORM_COLS = 10;
const FORM_ROWS = 4;
const FORM_SPACING_X = 48;
const FORM_SPACING_Y = 36;
const FORM_TOP_OFFSET = 55;

type AlienState = 'entering' | 'formation' | 'diving' | 'returning' | 'dead';
type Phase = 'normal' | 'bigBoom' | 'fadeOut' | 'done';

interface Alien {
  x: number;
  y: number;
  formX: number;
  formY: number;
  w: number;
  h: number;
  color: string;
  state: AlienState;
  row: number;
  col: number;
  divePoints: { x: number; y: number }[];
  diveT: number;
  diveSpeed: number;
  enterT: number;
  enterStartTime: number;
  frame: number;
  frameTimer: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  isEnemy: boolean;
}

// Small round particles for normal alien kill explosions
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string;
  alpha: number; life: number;
}

// Big square pixel blocks for the massive reveal explosion
interface PixelBlock {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rot: number;
  rotV: number;
  // Phase: expand from center, then scatter
  phase: 'expand' | 'scatter';
  targetX: number;
  targetY: number;
  expandT: number;
  expandSpeed: number;
}

interface Ship {
  x: number;
  y: number;
  lastShot: number;
  targetX: number;
}

export interface GalagaBackgroundHandle {
  explode: () => void;
}

function bezierPoint(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export const GalagaBackground = forwardRef<GalagaBackgroundHandle>(function GalagaBackground(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phaseRef = useRef<Phase>('normal');
  const fadeAlphaRef = useRef(1);
  const formOffsetXRef = useRef(0);
  const formBobTRef = useRef(0);
  const boomStartRef = useRef(0);
  const triggerExplodeRef = useRef(false);

  useImperativeHandle(ref, () => ({
    explode() {
      triggerExplodeRef.current = true;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;
    const aliens: Alien[] = [];
    const bullets: Bullet[] = [];
    const particles: Particle[] = [];
    const pixelBlocks: PixelBlock[] = [];
    const ships: Ship[] = [];
    let time0 = 0;
    let lastDiveTime = 0;
    const DIVE_INTERVAL = 1800;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      ships.length = 0;
      const shipY = h - 50;
      ships.push({ x: w * 0.25, y: shipY, lastShot: 0, targetX: w * 0.25 });
      ships.push({ x: w * 0.5, y: shipY, lastShot: 0, targetX: w * 0.5 });
      ships.push({ x: w * 0.75, y: shipY, lastShot: 0, targetX: w * 0.75 });

      const formStartX = (w - (FORM_COLS - 1) * FORM_SPACING_X) / 2;
      for (const a of aliens) {
        a.formX = formStartX + a.col * FORM_SPACING_X;
        a.formY = FORM_TOP_OFFSET + a.row * FORM_SPACING_Y;
      }
    }

    function initFormation() {
      aliens.length = 0;
      const formStartX = (w - (FORM_COLS - 1) * FORM_SPACING_X) / 2;

      for (let row = 0; row < FORM_ROWS; row++) {
        for (let col = 0; col < FORM_COLS; col++) {
          const formX = formStartX + col * FORM_SPACING_X;
          const formY = FORM_TOP_OFFSET + row * FORM_SPACING_Y;
          const color = ALIEN_COLORS[(row * 2 + Math.floor(col / 3)) % ALIEN_COLORS.length];
          const enterDelay = (row * FORM_COLS + col) * 80;

          aliens.push({
            x: (row + col) % 2 === 0 ? -40 : w + 40,
            y: -40,
            formX,
            formY,
            w: 24,
            h: 18,
            color,
            state: 'entering',
            row,
            col,
            divePoints: [],
            diveT: 0,
            diveSpeed: 0,
            enterT: 0,
            enterStartTime: enterDelay,
            frame: 0,
            frameTimer: 0,
          });
        }
      }
    }

    function drawShip(x: number, y: number) {
      ctx!.fillStyle = SHIP_COLOR;
      ctx!.fillRect(x - 2, y, 4, 12);
      ctx!.fillRect(x - 10, y + 6, 20, 4);
      ctx!.fillRect(x - 1, y - 4, 2, 4);
      ctx!.fillStyle = '#E1FF00';
      ctx!.fillRect(x - 1, y + 2, 2, 2);
      ctx!.fillStyle = SHIP_COLOR + '60';
      ctx!.fillRect(x - 12, y + 8, 4, 2);
      ctx!.fillRect(x + 8, y + 8, 4, 2);
      ctx!.fillStyle = '#FF5910';
      ctx!.fillRect(x - 1, y + 12, 2, 2 + Math.random() * 2);
    }

    function drawAlien(a: Alien) {
      const s = 3;
      const wingSpread = a.frame % 2 === 0 ? 0 : 1;
      ctx!.fillStyle = a.color;
      ctx!.fillRect(a.x - 3 * s, a.y - 2 * s, s, s);
      ctx!.fillRect(a.x + 2 * s, a.y - 2 * s, s, s);
      ctx!.fillRect(a.x - 2 * s, a.y - s, 4 * s, s);
      ctx!.fillRect(a.x - 3 * s, a.y, 6 * s, s);
      ctx!.fillRect(a.x - (4 + wingSpread) * s / 2, a.y + s, 2 * s, s);
      ctx!.fillRect(a.x - s, a.y + s, 2 * s, s);
      ctx!.fillRect(a.x + (2 + wingSpread) * s / 2, a.y + s, 2 * s, s);
      ctx!.fillRect(a.x - 3 * s, a.y + 2 * s, s, s);
      ctx!.fillRect(a.x - s, a.y + 2 * s, s, s);
      ctx!.fillRect(a.x + s, a.y + 2 * s, s, s);
      ctx!.fillRect(a.x + 3 * s, a.y + 2 * s, s, s);
      ctx!.fillStyle = a.color + '15';
      ctx!.beginPath();
      ctx!.arc(a.x, a.y + 3 * s, 12, 0, Math.PI * 2);
      ctx!.fill();
    }

    function startDive(alien: Alien) {
      alien.state = 'diving';
      alien.diveT = 0;
      alien.diveSpeed = 0.008 + Math.random() * 0.006;
      const tx = ships.length > 0 ? ships[Math.floor(Math.random() * ships.length)].x : w / 2;
      const midX = alien.x + (tx > alien.x ? 1 : -1) * (80 + Math.random() * 120);
      const loopY = alien.y + 80 + Math.random() * 100;
      alien.divePoints = [
        { x: alien.x, y: alien.y },
        { x: midX, y: loopY },
        { x: tx, y: h * 0.6 },
        { x: tx + (Math.random() - 0.5) * 60, y: h + 40 },
      ];
    }

    function spawnSmallExplosion(x: number, y: number, color: string) {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
        const speed = 1 + Math.random() * 2.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.5 + Math.random() * 2,
          color,
          alpha: 1,
          life: 40,
        });
      }
    }

    // ═══════════════════════════════════════════════
    // MASSIVE PIXEL EXPLOSION — like the reference GIF
    // Originates from each ship position (ships blow up)
    // Big blocky squares: white/gray core, cyan + red debris
    // ═══════════════════════════════════════════════
    function spawnShipExplosion(sx: number, sy: number) {
      const coreColors = ['#ffffff', '#ffffff', '#e0e0e0', '#c0c0c0', '#d8d8d8'];
      const accentColors = ['#73F5FF', '#73F5FF', '#00e5ff', '#FF3333', '#FF5910'];

      // Dense core — big white/gray blocks
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 50;
        const targetDist = 80 + Math.random() * 200;
        const size = 8 + Math.random() * 22;
        const color = coreColors[Math.floor(Math.random() * coreColors.length)];
        const life = 80 + Math.random() * 40;

        pixelBlocks.push({
          x: sx, y: sy, vx: 0, vy: 0, size, color, alpha: 1,
          life, maxLife: life, rot: 0,
          rotV: (Math.random() - 0.5) * 0.08,
          phase: 'expand',
          targetX: sx + Math.cos(angle) * (dist + targetDist),
          targetY: sy + Math.sin(angle) * (dist + targetDist),
          expandT: 0,
          expandSpeed: 0.03 + Math.random() * 0.03,
        });
      }

      // Mid layer — mixed blocks
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const targetDist = 120 + Math.random() * 300;
        const size = 6 + Math.random() * 16;
        const useAccent = Math.random() < 0.4;
        const color = useAccent
          ? accentColors[Math.floor(Math.random() * accentColors.length)]
          : coreColors[Math.floor(Math.random() * coreColors.length)];
        const life = 70 + Math.random() * 50;

        pixelBlocks.push({
          x: sx, y: sy, vx: 0, vy: 0, size, color, alpha: 1,
          life, maxLife: life, rot: 0,
          rotV: (Math.random() - 0.5) * 0.12,
          phase: 'expand',
          targetX: sx + Math.cos(angle) * targetDist,
          targetY: sy + Math.sin(angle) * targetDist,
          expandT: 0,
          expandSpeed: 0.02 + Math.random() * 0.025,
        });
      }

      // Outer shrapnel — small cyan + red debris
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const targetDist = 200 + Math.random() * Math.max(w, h) * 0.4;
        const size = 4 + Math.random() * 10;
        const color = accentColors[Math.floor(Math.random() * accentColors.length)];
        const life = 90 + Math.random() * 40;

        pixelBlocks.push({
          x: sx, y: sy, vx: 0, vy: 0, size, color, alpha: 1,
          life, maxLife: life, rot: Math.random() * Math.PI,
          rotV: (Math.random() - 0.5) * 0.2,
          phase: 'expand',
          targetX: sx + Math.cos(angle) * targetDist,
          targetY: sy + Math.sin(angle) * targetDist,
          expandT: 0,
          expandSpeed: 0.015 + Math.random() * 0.02,
        });
      }

      // Radial streaks
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.3;
        const targetDist = 250 + Math.random() * Math.max(w, h) * 0.35;
        const isAccent = Math.random() < 0.3;
        const color = isAccent
          ? (Math.random() < 0.5 ? '#73F5FF' : '#FF3333')
          : '#ffffff';
        const life = 50 + Math.random() * 30;

        pixelBlocks.push({
          x: sx, y: sy, vx: 0, vy: 0,
          size: 3 + Math.random() * 4, color, alpha: 1,
          life, maxLife: life, rot: angle, rotV: 0,
          phase: 'expand',
          targetX: sx + Math.cos(angle) * targetDist,
          targetY: sy + Math.sin(angle) * targetDist,
          expandT: 0,
          expandSpeed: 0.04 + Math.random() * 0.03,
        });
      }
    }

    function spawnMassivePixelExplosion() {
      pixelBlocks.length = 0;
      // Explode each ship
      for (const ship of ships) {
        spawnShipExplosion(ship.x, ship.y);
      }
    }

    function draw(time: number) {
      if (!time0) {
        time0 = time;
        initFormation();
      }
      const t = time - time0;
      const phase = phaseRef.current;

      // Check for explode trigger
      if (triggerExplodeRef.current && phase === 'normal') {
        triggerExplodeRef.current = false;
        phaseRef.current = 'bigBoom';
        boomStartRef.current = time;

        // Clear bullets
        bullets.length = 0;

        // Ships blow up — spawn massive pixel explosions at each ship
        spawnMassivePixelExplosion();
        // Ships are gone (they just exploded)
        ships.length = 0;
      }

      if (phase === 'done') {
        ctx!.clearRect(0, 0, w, h);
        return;
      }

      ctx!.clearRect(0, 0, w, h);

      const fadeAlpha = fadeAlphaRef.current;

      // Fade out phase
      if (phase === 'fadeOut') {
        fadeAlphaRef.current = Math.max(0, fadeAlphaRef.current - 0.02);
        if (fadeAlphaRef.current <= 0) {
          phaseRef.current = 'done';
          animId = requestAnimationFrame(draw);
          return;
        }
      }

      // Formation sway
      if (phase === 'normal') {
        formBobTRef.current += 0.0008;
        formOffsetXRef.current = Math.sin(formBobTRef.current * Math.PI * 2) * 40;
      }
      const formOff = formOffsetXRef.current;

      // ──── UPDATE ALIENS (only in normal phase) ────
      if (phase === 'normal') {
        for (const a of aliens) {
          if (a.state === 'dead') continue;

          a.frameTimer += 1;
          if (a.frameTimer > 15) {
            a.frame = (a.frame + 1) % 2;
            a.frameTimer = 0;
          }

          if (a.state === 'entering') {
            if (t > a.enterStartTime) {
              a.enterT += 0.025;
              if (a.enterT >= 1) {
                a.state = 'formation';
                a.x = a.formX + formOff;
                a.y = a.formY;
              } else {
                const ease = a.enterT < 0.5
                  ? 2 * a.enterT * a.enterT
                  : 1 - Math.pow(-2 * a.enterT + 2, 2) / 2;
                const startX = (a.row + a.col) % 2 === 0 ? -40 : w + 40;
                const loopX = a.formX + (startX < w / 2 ? 100 : -100) * Math.sin(ease * Math.PI);
                const loopY = a.formY - 60 * Math.sin(ease * Math.PI);
                a.x = startX + (loopX - startX) * ease + formOff * ease;
                a.y = -40 + (loopY - (-40)) * ease;
              }
            }
          } else if (a.state === 'formation') {
            a.x = a.formX + formOff;
            a.y = a.formY + Math.sin(t * 0.002 + a.col * 0.3) * 3;
          } else if (a.state === 'diving') {
            a.diveT += a.diveSpeed;
            if (a.diveT >= 1) {
              a.state = 'returning';
              a.enterT = 0;
            } else {
              const p = a.divePoints;
              a.x = bezierPoint(p[0].x, p[1].x, p[2].x, p[3].x, a.diveT);
              a.y = bezierPoint(p[0].y, p[1].y, p[2].y, p[3].y, a.diveT);
              if (a.diveT > 0.2 && a.diveT < 0.7 && Math.random() < 0.008) {
                const nearShip = ships[Math.floor(Math.random() * ships.length)];
                if (nearShip) {
                  const dx = nearShip.x - a.x;
                  const dy = nearShip.y - a.y;
                  const d = Math.sqrt(dx * dx + dy * dy);
                  if (d > 1) {
                    bullets.push({ x: a.x, y: a.y + 10, vx: (dx / d) * 3, vy: (dy / d) * 3, alive: true, isEnemy: true });
                  }
                }
              }
            }
          } else if (a.state === 'returning') {
            a.enterT += 0.02;
            if (a.enterT >= 1) {
              a.state = 'formation';
              a.x = a.formX + formOff;
              a.y = a.formY;
            } else {
              const ease = a.enterT < 0.5
                ? 2 * a.enterT * a.enterT
                : 1 - Math.pow(-2 * a.enterT + 2, 2) / 2;
              const startX = a.x;
              a.x = startX + (a.formX + formOff - startX) * ease;
              a.y = -30 + (a.formY - (-30)) * ease;
            }
          }
        }

        // Dive attacks
        if (t - lastDiveTime > DIVE_INTERVAL) {
          lastDiveTime = t;
          const available = aliens.filter(a => a.state === 'formation');
          const count = Math.min(1 + Math.floor(Math.random() * 3), available.length);
          for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * available.length);
            startDive(available[idx]);
            available.splice(idx, 1);
          }
        }

        // Ship shooting
        for (const ship of ships) {
          const divingAliens = aliens.filter(a => a.state === 'diving' && a.y > h * 0.3);
          if (divingAliens.length > 0) {
            let nearest = divingAliens[0];
            let nearDist = Math.abs(nearest.x - ship.x);
            for (const da of divingAliens) {
              const d = Math.abs(da.x - ship.x);
              if (d < nearDist) { nearDist = d; nearest = da; }
            }
            ship.targetX = nearest.x;
          }
          ship.x += (ship.targetX - ship.x) * 0.015;

          if (t - ship.lastShot > 500 + Math.random() * 300) {
            const above = aliens.filter(a => a.state !== 'dead' && a.y < ship.y);
            if (above.length > 0) {
              bullets.push({ x: ship.x, y: ship.y - 6, vx: 0, vy: -5, alive: true, isEnemy: false });
              ship.lastShot = t;
            }
          }
        }
      }

      // ──── DRAW ALIENS (normal + bigBoom — they witness the ships explode) ────
      if (phase === 'normal' || phase === 'bigBoom') {
        for (const a of aliens) {
          if (a.state === 'dead') continue;
          ctx!.globalAlpha = fadeAlpha * 0.75;
          drawAlien(a);
        }
      }

      // ──── UPDATE & DRAW BULLETS (normal only) ────
      if (phase === 'normal') {
        for (const b of bullets) {
          if (!b.alive) continue;
          b.x += b.vx;
          b.y += b.vy;
          if (b.y < -10 || b.y > h + 10 || b.x < -10 || b.x > w + 10) {
            b.alive = false;
            continue;
          }

          if (b.isEnemy) {
            ctx!.fillStyle = '#FF3333';
            ctx!.globalAlpha = fadeAlpha * 0.8;
            ctx!.fillRect(b.x - 1, b.y, 2, 6);
            ctx!.globalAlpha = fadeAlpha * 0.3;
            ctx!.fillRect(b.x - 2, b.y - 1, 4, 8);
          } else {
            ctx!.fillStyle = BULLET_COLOR;
            ctx!.globalAlpha = fadeAlpha * 0.9;
            ctx!.fillRect(b.x - 1, b.y, 2, 8);
            ctx!.globalAlpha = fadeAlpha * 0.4;
            ctx!.fillRect(b.x - 2, b.y - 2, 4, 12);
          }

          if (!b.isEnemy) {
            for (const a of aliens) {
              if (a.state === 'dead') continue;
              if (Math.abs(b.x - a.x) < a.w / 2 + 4 && Math.abs(b.y - a.y) < a.h / 2 + 4) {
                a.state = 'dead';
                b.alive = false;
                spawnSmallExplosion(a.x, a.y, a.color);
                break;
              }
            }
          }
        }

        // Clean up dead bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          if (!bullets[i].alive) bullets.splice(i, 1);
        }
      }

      // ──── DRAW SMALL PARTICLES ────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.98;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / 40);
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.globalAlpha = p.alpha * fadeAlpha;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ──── DRAW SHIPS (normal only) ────
      if (phase === 'normal') {
        ctx!.globalAlpha = fadeAlpha * 0.75;
        for (const ship of ships) {
          drawShip(ship.x, ship.y);
        }
      }

      // ──── BIG BOOM — massive pixel explosion ────
      if (phase === 'bigBoom' || phase === 'fadeOut') {
        const boomElapsed = time - boomStartRef.current;

        // Initial white flash (first 200ms)
        if (boomElapsed < 200) {
          const flashP = boomElapsed / 200;
          ctx!.globalAlpha = (1 - flashP) * 0.6;
          ctx!.fillStyle = '#ffffff';
          ctx!.fillRect(0, 0, w, h);
        }

        // Update and draw pixel blocks
        let allDone = true;
        for (let i = pixelBlocks.length - 1; i >= 0; i--) {
          const pb = pixelBlocks[i];

          if (pb.phase === 'expand') {
            // Ease out toward target position
            pb.expandT += pb.expandSpeed;
            if (pb.expandT >= 1) {
              pb.expandT = 1;
              pb.phase = 'scatter';
              // Give scatter velocity outward from center
              const dx = pb.x - w / 2;
              const dy = pb.y - h / 2;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              pb.vx = (dx / dist) * (1 + Math.random() * 2);
              pb.vy = (dy / dist) * (1 + Math.random() * 2) + Math.random() * 0.5;
            }
            // Ease-out interpolation
            const ease = 1 - Math.pow(1 - pb.expandT, 3);
            pb.x = w / 2 + (pb.targetX - w / 2) * ease;
            pb.y = h / 2 + (pb.targetY - h / 2) * ease;
          } else {
            // Scatter: drift outward, fade, apply gravity
            pb.x += pb.vx;
            pb.y += pb.vy;
            pb.vy += 0.03;
            pb.vx *= 0.995;
          }

          pb.rot += pb.rotV;
          pb.life -= 1;

          // Fade: hold full alpha for first 40%, then fade
          const lifeRatio = pb.life / pb.maxLife;
          if (lifeRatio < 0.6) {
            pb.alpha = lifeRatio / 0.6;
          } else {
            pb.alpha = 1;
          }

          if (pb.life <= 0) {
            pixelBlocks.splice(i, 1);
            continue;
          }

          allDone = false;

          // Draw the pixel block as a rotated square
          ctx!.save();
          ctx!.translate(pb.x, pb.y);
          ctx!.rotate(pb.rot);
          ctx!.globalAlpha = pb.alpha * fadeAlpha;
          ctx!.fillStyle = pb.color;
          ctx!.fillRect(-pb.size / 2, -pb.size / 2, pb.size, pb.size);
          // Inner highlight for depth
          if (pb.size > 10) {
            ctx!.fillStyle = 'rgba(255,255,255,0.2)';
            ctx!.fillRect(-pb.size / 2 + 2, -pb.size / 2 + 2, pb.size - 6, pb.size - 6);
          }
          ctx!.restore();
        }

        // When all pixel blocks are gone, start fade
        if (allDone && phase === 'bigBoom') {
          phaseRef.current = 'fadeOut';
          fadeAlphaRef.current = 0.3; // already mostly transparent
        }
      }

      ctx!.globalAlpha = 1;

      // ──── RESPAWN (normal only) ────
      if (phase === 'normal') {
        const deadCount = aliens.filter(a => a.state === 'dead').length;
        if (deadCount > FORM_COLS * 2) {
          for (const a of aliens) {
            if (a.state === 'dead') {
              a.state = 'entering';
              a.enterT = 0;
              a.enterStartTime = t + Math.random() * 800;
              a.x = Math.random() < 0.5 ? -40 : w + 40;
              a.y = -40;
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.65 }}
      aria-hidden="true"
    />
  );
});
