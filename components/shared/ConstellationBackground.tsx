'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type ConstellationPage =
  | 'services'
  | 'examples'
  | 'verticals'
  | 'insights'
  | 'about'
  | 'working-together';

interface StarPoint { x: number; y: number; }

interface Config {
  label: string;         // constellation name
  accent: string;        // hex node/edge color
  glow1: string;         // "r,g,b" primary blob
  glow2: string;         // "r,g,b" secondary blob
  stars: StarPoint[];    // 0–1 normalized canvas coords
  edges: [number, number][];
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

interface BgStar {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

function genBgStars(count: number): BgStar[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0062,
    vy: (Math.random() - 0.5) * 0.0042,
    size: 0.28 + Math.random() * 0.88,
    opacity: 0.06 + Math.random() * 0.22,
    twinkleOffset: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.25 + Math.random() * 0.75,
  }));
}

// ── Real constellation configs ───────────────────────────────────────────────
// Star positions are normalized (0–1) to canvas space, constellation placed
// right-of-center so hero text on the left breathes freely.

const CONFIGS: Record<ConstellationPage, Config> = {

  // ORION — Services
  // The hunter: commands the field, full offensive capability, nothing held back.
  // Distinctive: belt of three, two shoulders, two feet.
  services: {
    label: 'Orion',
    accent: '#E1FF00',
    glow1: '225,255,0',
    glow2: '255,89,16',
    stars: [
      { x: 0.718, y: 0.188 }, // 0 Meissa (head)
      { x: 0.632, y: 0.335 }, // 1 Betelgeuse (L shoulder)
      { x: 0.798, y: 0.315 }, // 2 Bellatrix (R shoulder)
      { x: 0.655, y: 0.490 }, // 3 Alnitak (L belt)
      { x: 0.718, y: 0.478 }, // 4 Alnilam (C belt)
      { x: 0.781, y: 0.465 }, // 5 Mintaka (R belt)
      { x: 0.648, y: 0.695 }, // 6 Saiph (L foot)
      { x: 0.812, y: 0.702 }, // 7 Rigel (R foot)
    ],
    edges: [
      [0,1],[0,2],             // head to shoulders
      [1,3],[2,5],             // shoulders to belt
      [3,4],[4,5],             // belt
      [3,6],[5,7],             // belt to feet
      [6,7],                   // base
    ],
  },

  // LEO — Examples
  // The lion: pride, strength, proven results that roar.
  // Distinctive: sickle (mane/head) + hindquarters triangle, Regulus at heart.
  examples: {
    label: 'Leo',
    accent: '#FF5910',
    glow1: '255,89,16',
    glow2: '237,10,210',
    stars: [
      { x: 0.600, y: 0.622 }, // 0 Regulus (heart, brightest)
      { x: 0.640, y: 0.482 }, // 1 η Leo
      { x: 0.688, y: 0.412 }, // 2 γ Leo (Algieba)
      { x: 0.738, y: 0.378 }, // 3 ζ Leo
      { x: 0.790, y: 0.418 }, // 4 μ Leo
      { x: 0.842, y: 0.468 }, // 5 ε Leo
      { x: 0.818, y: 0.558 }, // 6 δ Leo (Zosma)
      { x: 0.910, y: 0.510 }, // 7 β Leo (Denebola, tail)
      { x: 0.862, y: 0.635 }, // 8 θ Leo
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,4],[4,5], // sickle (mane)
      [5,6],[6,7],[7,8],[8,6],        // hindquarters triangle
      [0,8],                          // belly
    ],
  },

  // SAGITTARIUS TEAPOT — Verticals
  // The archer: targeting diverse markets, aiming true.
  // Distinctive: the iconic teapot asterism — spout left, handle right.
  verticals: {
    label: 'Sagittarius',
    accent: '#73F5FF',
    glow1: '115,245,255',
    glow2: '8,139,160',
    stars: [
      { x: 0.548, y: 0.468 }, // 0 Alnasl γ² Sgr (spout tip)
      { x: 0.605, y: 0.380 }, // 1 δ Sgr
      { x: 0.695, y: 0.308 }, // 2 λ Sgr Kaus Borealis (lid)
      { x: 0.668, y: 0.502 }, // 3 ε Sgr Kaus Australis (base L)
      { x: 0.748, y: 0.470 }, // 4 ζ Sgr Ascella (base R)
      { x: 0.848, y: 0.322 }, // 5 σ Sgr Nunki (upper R)
      { x: 0.872, y: 0.430 }, // 6 τ Sgr (handle)
      { x: 0.888, y: 0.522 }, // 7 φ Sgr (handle tip)
    ],
    edges: [
      [0,1],[1,2],             // spout to lid
      [2,5],                   // lid top
      [0,3],[3,4],[4,5],       // body outline
      [4,6],[5,6],[6,7],       // handle
    ],
  },

  // AQUARIUS — Insights
  // The water bearer: knowledge flows outward, clarity through data.
  // Distinctive: Y-shaped water jar asterism + radiating streams.
  insights: {
    label: 'Aquarius',
    accent: '#E1FF00',
    glow1: '225,255,0',
    glow2: '115,245,255',
    stars: [
      { x: 0.618, y: 0.320 }, // 0 Sadalsuud β Aqr (brightest)
      { x: 0.718, y: 0.340 }, // 1 Sadalmelik α Aqr
      { x: 0.668, y: 0.438 }, // 2 γ Aqr Sadachbia (jar L)
      { x: 0.705, y: 0.460 }, // 3 ζ Aqr (jar center)
      { x: 0.748, y: 0.438 }, // 4 η Aqr (jar R)
      { x: 0.788, y: 0.510 }, // 5 δ Aqr Skat
      { x: 0.638, y: 0.622 }, // 6 ε Aqr Albali (stream L)
      { x: 0.812, y: 0.642 }, // 7 λ Aqr (stream R)
    ],
    edges: [
      [0,1],                   // shoulders
      [0,2],[1,4],             // to jar
      [2,3],[3,4],             // jar
      [1,5],[5,7],             // right chain (water R)
      [3,6],                   // water flowing L
    ],
  },

  // CASSIOPEIA — About
  // The queen: enduring legacy, royal authority since 1999.
  // Distinctive: iconic W / M shape — five stars, unmistakable.
  about: {
    label: 'Cassiopeia',
    accent: '#FF5910',
    glow1: '255,89,16',
    glow2: '225,255,0',
    stars: [
      { x: 0.552, y: 0.458 }, // 0 Caph β Cas
      { x: 0.625, y: 0.398 }, // 1 Schedar α Cas
      { x: 0.705, y: 0.472 }, // 2 Gamma γ Cas
      { x: 0.788, y: 0.382 }, // 3 Ruchbah δ Cas
      { x: 0.870, y: 0.432 }, // 4 Segin ε Cas
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,4], // the W
    ],
  },

  // GEMINI — Working Together
  // The twins: partnership personified, two as one, the original collaboration.
  // Distinctive: two parallel chains from twin heads (Castor + Pollux).
  'working-together': {
    label: 'Gemini',
    accent: '#73F5FF',
    glow1: '115,245,255',
    glow2: '100,120,200',
    stars: [
      { x: 0.682, y: 0.220 }, // 0 Castor α Gem (twin L)
      { x: 0.765, y: 0.258 }, // 1 Pollux β Gem (twin R, brighter)
      { x: 0.645, y: 0.365 }, // 2 ε Gem (Castor chain)
      { x: 0.708, y: 0.385 }, // 3 δ Gem Wasat
      { x: 0.622, y: 0.495 }, // 4 ζ Gem Mekbuda
      { x: 0.772, y: 0.450 }, // 5 γ Gem Alhena
      { x: 0.595, y: 0.598 }, // 6 η Gem
      { x: 0.572, y: 0.692 }, // 7 μ Gem Tejat (Castor foot)
      { x: 0.738, y: 0.550 }, // 8 ξ Gem
      { x: 0.752, y: 0.652 }, // 9 ν Gem (Pollux foot)
    ],
    edges: [
      [0,1],                   // twins' heads
      [0,2],[2,4],[4,6],[6,7], // Castor chain
      [1,3],[3,5],[3,8],[8,9], // Pollux chain
      [2,3],[4,5],             // cross-bars (shoulders/hips)
    ],
  },
};

// Cursor must come within this many screen pixels to reveal a star
const REVEAL_RADIUS = 185;

// ── Component ────────────────────────────────────────────────────────────────

export function ConstellationBackground({ page }: { page: ConstellationPage }) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgStarsRef = useRef<BgStar[]>([]);
  const revealRef = useRef<Float32Array>(new Float32Array(0));
  const stateRef = useRef({
    mouseX: -9999,
    mouseY: -9999,
    time: 0,
    visible: true,
    rafId: 0,
    reduced: false,
    frameCount: 0,
    canvasRect: null as DOMRect | null,
  });

  const reducedMotion = useReducedMotion();
  const config = CONFIGS[page];

  // Defer mount to idle time to avoid blocking main thread
  useEffect(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 110 : 210;
    bgStarsRef.current = genBgStars(count);
    revealRef.current = new Float32Array(config.stars.length).fill(0);

    const cb = () => setMounted(true);
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(cb, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(id);
    }
    const id = setTimeout(cb, 120);
    return () => clearTimeout(id);
  }, [config.stars.length]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = stateRef.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bgStars = bgStarsRef.current;
    const reveal = revealRef.current;
    const cStars = config.stars;
    const edges = config.edges;
    const [acR, acG, acB] = hexToRgb(config.accent);

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      s.canvasRect = rect;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const onMouse = (e: MouseEvent) => { s.mouseX = e.clientX; s.mouseY = e.clientY; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) { s.mouseX = t.clientX; s.mouseY = t.clientY; }
    };
    const onResize = () => resize();

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    resize();

    const observer = new IntersectionObserver(
      ([entry]) => { s.visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    let lastTs = 0;

    function frame(ts: number) {
      s.rafId = requestAnimationFrame(frame);
      if (!s.visible || !canvas || !ctx) return;

      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      s.time += dt;
      s.frameCount++;

      // Refresh canvas rect every ~1s (not every frame — getBCR is cheap but no need to spam)
      if (s.frameCount % 60 === 0) {
        s.canvasRect = canvas.getBoundingClientRect();
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      // ── Update per-star reveal factor ──
      // Each constellation star starts indistinguishable from background stars.
      // As the cursor approaches, it lights up in the accent color with connecting lines.
      if (s.canvasRect && !s.reduced) {
        const rLeft = s.canvasRect.left;
        const rTop  = s.canvasRect.top;
        for (let i = 0; i < cStars.length; i++) {
          const sx = cStars[i].x * W + rLeft;
          const sy = cStars[i].y * H + rTop;
          const dx = s.mouseX - sx;
          const dy = s.mouseY - sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const target = Math.max(0, 1 - dist / REVEAL_RADIUS);
          // Smooth lerp toward target — reveals quickly, fades slowly
          const lf = target > reveal[i] ? 0.10 : 0.045;
          reveal[i] += (target - reveal[i]) * lf;
        }
      }

      // ── Drift background stars ──
      if (!s.reduced) {
        for (const star of bgStars) {
          // Global oscillation makes the entire field breathe/drift together
          // like the homepage particle sphere rotation
          const fieldX = Math.sin(s.time * 0.18) * 0.0014;
          const fieldY = Math.cos(s.time * 0.13) * 0.0008;
          star.x += (star.vx + fieldX) * dt;
          star.y += (star.vy + fieldY) * dt;
          if (star.x < -0.01) star.x += 1.02;
          if (star.x > 1.01) star.x -= 1.02;
          if (star.y < -0.01) star.y += 1.02;
          if (star.y > 1.01) star.y -= 1.02;
        }
      }

      ctx.clearRect(0, 0, W, H);

      // ── Background star field ──
      for (const star of bgStars) {
        const tw = s.reduced ? 0 : Math.sin(s.time * star.twinkleSpeed + star.twinkleOffset) * 0.10;
        const op = Math.max(0.04, star.opacity + tw);
        ctx.beginPath();
        ctx.arc(star.x * W, star.y * H, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`;
        ctx.fill();
      }

      // ── Constellation edges — appear as cursor reveals both endpoint stars ──
      for (const [a, b] of edges) {
        const ra = reveal[a];
        const rb = reveal[b];
        const er = Math.min(ra, rb);
        if (er < 0.02) continue;

        const op = (er * 0.75).toFixed(2);
        ctx.strokeStyle = `rgba(${acR},${acG},${acB},${op})`;
        ctx.lineWidth = 0.65 + er * 0.6;
        ctx.beginPath();
        ctx.moveTo(cStars[a].x * W, cStars[a].y * H);
        ctx.lineTo(cStars[b].x * W, cStars[b].y * H);
        ctx.stroke();
      }

      // ── Constellation stars — blend from invisible-in-field to bright accent ──
      for (let i = 0; i < cStars.length; i++) {
        const rv = reveal[i];
        const x = cStars[i].x * W;
        const y = cStars[i].y * H;

        // At rv=0: looks exactly like a background star (dim, white, small)
        // At rv=1: bright accent dot with halo
        const size    = 0.55 + rv * 2.05;
        const opacity = 0.14 + rv * 0.78;

        // Interpolate color: white → accent
        const r = Math.round(255 + (acR - 255) * rv);
        const g = Math.round(255 + (acG - 255) * rv);
        const b = Math.round(255 + (acB - 255) * rv);

        if (rv > 0.06) {
          ctx.shadowColor = config.accent;
          ctx.shadowBlur  = rv * 16;
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity.toFixed(2)})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    s.rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [mounted, config]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* ── Primary nebula blob — upper-right, large atmospheric glow ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '-20%',
          right: '-8%',
          width: 680,
          height: 680,
          background: `radial-gradient(circle, rgba(${config.glow1},0.22) 0%, rgba(${config.glow1},0.06) 55%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.08, 1],
          opacity: [0.65, 1, 0.65],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Secondary accent blob — center-right, smaller, offset color ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '18%',
          right: '4%',
          width: 420,
          height: 420,
          background: `radial-gradient(circle, rgba(${config.glow2},0.16) 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.12, 1],
          opacity: [0.45, 0.78, 0.45],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />

      {/* ── Tertiary ambient — bottom right, very subtle ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: '-5%',
          right: '15%',
          width: 320,
          height: 320,
          background: `radial-gradient(circle, rgba(${config.glow1},0.08) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* ── Star field canvas with constellation reveal ── */}
      {mounted && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
}
