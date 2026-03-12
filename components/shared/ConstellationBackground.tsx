'use client';

import { useRef, useEffect, useState } from 'react';

export type ConstellationPage =
  | 'services'
  | 'examples'
  | 'verticals'
  | 'insights'
  | 'about'
  | 'working-together';

interface StarPoint { x: number; y: number; }

interface Config {
  accent: string;
  glowX: number; // % for radial-gradient x
  glowY: number; // % for radial-gradient y
  stars: StarPoint[]; // 0–1 normalized canvas coords
  edges: [number, number][];
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function genBgStars(count: number) {
  const stars: { x: number; y: number; size: number; opacity: number; twinkleOffset: number; twinkleSpeed: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.3 + Math.random() * 1.0,
      opacity: 0.08 + Math.random() * 0.28,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.3 + Math.random() * 0.8,
    });
  }
  return stars;
}

// ── Per-page constellation configs ──────────────────────────────────────────

const CONFIGS: Record<ConstellationPage, Config> = {

  // SERVICES — compass rose: navigation, direction, strategy
  // 8-pointed star radiating from center, center-right placement
  services: {
    accent: '#E1FF00',
    glowX: 74, glowY: 16,
    stars: [
      { x: 0.720, y: 0.500 }, // 0 center
      { x: 0.720, y: 0.270 }, // 1 N
      { x: 0.878, y: 0.343 }, // 2 NE
      { x: 0.912, y: 0.500 }, // 3 E
      { x: 0.878, y: 0.657 }, // 4 SE
      { x: 0.720, y: 0.730 }, // 5 S
      { x: 0.562, y: 0.657 }, // 6 SW
      { x: 0.528, y: 0.500 }, // 7 W
      { x: 0.562, y: 0.343 }, // 8 NW
    ],
    edges: [
      [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
      [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,1],
    ],
  },

  // EXAMPLES — crown: achievement, reputation, excellence
  // 3 peaks + 2 valleys + base line, right-of-center
  examples: {
    accent: '#FF5910',
    glowX: 70, glowY: 10,
    stars: [
      { x: 0.545, y: 0.670 }, // 0 base L
      { x: 0.605, y: 0.445 }, // 1 peak L
      { x: 0.668, y: 0.572 }, // 2 valley L
      { x: 0.725, y: 0.330 }, // 3 center peak (tallest)
      { x: 0.782, y: 0.572 }, // 4 valley R
      { x: 0.845, y: 0.445 }, // 5 peak R
      { x: 0.905, y: 0.670 }, // 6 base R
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],
    ],
  },

  // VERTICALS — grid matrix: market segmentation, structure, categories
  // 3×3 grid of nodes
  verticals: {
    accent: '#73F5FF',
    glowX: 76, glowY: 20,
    stars: [
      { x: 0.578, y: 0.318 }, { x: 0.720, y: 0.318 }, { x: 0.862, y: 0.318 }, // row 0
      { x: 0.578, y: 0.500 }, { x: 0.720, y: 0.500 }, { x: 0.862, y: 0.500 }, // row 1
      { x: 0.578, y: 0.682 }, { x: 0.720, y: 0.682 }, { x: 0.862, y: 0.682 }, // row 2
    ],
    edges: [
      [0,1],[1,2],[3,4],[4,5],[6,7],[7,8], // horizontals
      [0,3],[3,6],[1,4],[4,7],[2,5],[5,8], // verticals
    ],
  },

  // INSIGHTS — eye/lens: clarity, vision, perception
  // Outer ellipse + iris spokes
  insights: {
    accent: '#E1FF00',
    glowX: 80, glowY: 25,
    stars: [
      { x: 0.545, y: 0.500 }, // 0 left corner
      { x: 0.606, y: 0.362 }, // 1 upper L
      { x: 0.720, y: 0.318 }, // 2 top
      { x: 0.834, y: 0.362 }, // 3 upper R
      { x: 0.895, y: 0.500 }, // 4 right corner
      { x: 0.834, y: 0.638 }, // 5 lower R
      { x: 0.720, y: 0.682 }, // 6 bottom
      { x: 0.606, y: 0.638 }, // 7 lower L
      { x: 0.720, y: 0.500 }, // 8 iris
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0], // eye outline
      [8,2],[8,4],[8,6],[8,0],                          // iris spokes
    ],
  },

  // ABOUT — 5-pointed star: identity, The Starr Conspiracy, legacy
  // Classic star, outer R≈0.19, inner r≈0.075
  about: {
    accent: '#FF5910',
    glowX: 68, glowY: 10,
    stars: [
      // outer
      { x: 0.720, y: 0.310 }, // 0 top      (-90°)
      { x: 0.881, y: 0.428 }, // 1 upper R  (-18°)
      { x: 0.820, y: 0.621 }, // 2 lower R  (+54°)
      { x: 0.620, y: 0.621 }, // 3 lower L  (+126°)
      { x: 0.559, y: 0.428 }, // 4 upper L  (+198°)
      // inner
      { x: 0.760, y: 0.428 }, // 5 inner top-R  (-54°)
      { x: 0.791, y: 0.524 }, // 6 inner R       (+18°)
      { x: 0.720, y: 0.574 }, // 7 inner bottom  (+90°)
      { x: 0.649, y: 0.524 }, // 8 inner L       (+162°)
      { x: 0.680, y: 0.428 }, // 9 inner top-L   (+234°)
    ],
    edges: [
      [0,5],[5,1],[1,6],[6,2],[2,7],[7,3],[3,8],[8,4],[4,9],[9,0],
    ],
  },

  // WORKING TOGETHER — two clusters bridged: partnership, collaboration, integration
  // Left 3-node cluster + bridge + right 3-node cluster
  'working-together': {
    accent: '#73F5FF',
    glowX: 65, glowY: 28,
    stars: [
      // Left cluster
      { x: 0.558, y: 0.345 }, // 0
      { x: 0.498, y: 0.500 }, // 1
      { x: 0.558, y: 0.655 }, // 2
      // Bridge
      { x: 0.645, y: 0.428 }, // 3
      { x: 0.720, y: 0.500 }, // 4 center
      { x: 0.795, y: 0.428 }, // 5
      // Right cluster
      { x: 0.882, y: 0.345 }, // 6
      { x: 0.942, y: 0.500 }, // 7
      { x: 0.882, y: 0.655 }, // 8
    ],
    edges: [
      [0,1],[1,2],[0,2],   // left cluster
      [0,3],[2,3],         // left → bridge
      [3,4],[4,5],         // bridge
      [5,6],[5,8],         // bridge → right
      [6,7],[7,8],[6,8],   // right cluster
    ],
  },
};

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  page: ConstellationPage;
}

export function ConstellationBackground({ page }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const stateRef = useRef({
    mouse: { x: 0, y: 0 },
    damped: { x: 0, y: 0 },
    time: 0,
    visible: true,
    rafId: 0,
    reduced: false,
  });
  const bgStarsRef = useRef<ReturnType<typeof genBgStars>>([]);

  const config = CONFIGS[page];

  // Defer mount to idle time — avoid blocking main thread
  useEffect(() => {
    bgStarsRef.current = genBgStars(
      typeof window !== 'undefined' && window.innerWidth < 768 ? 90 : 160
    );
    const cb = () => setMounted(true);
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(cb, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(id);
    }
    const id = setTimeout(cb, 120);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = stateRef.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bgStars = bgStarsRef.current;
    const accentRgb = hexToRgb(config.accent);

    // Size canvas to container, accounting for DPR
    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const onMouse = (e: MouseEvent) => {
      s.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      s.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => resize();

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    resize();

    // Pause RAF when off-screen
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

      // Smooth mouse with lerp
      const lf = s.reduced ? 1 : 0.055;
      s.damped.x += (s.mouse.x - s.damped.x) * lf;
      s.damped.y += (s.mouse.y - s.damped.y) * lf;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.clearRect(0, 0, W, H);

      const mx = s.damped.x;
      const my = s.damped.y;

      // Parallax: bg stars shift more, constellation shifts less
      const bgOX = s.reduced ? 0 : mx * 20;
      const bgOY = s.reduced ? 0 : my * 12;
      const cOX  = s.reduced ? 0 : mx * 9;
      const cOY  = s.reduced ? 0 : my * 5;

      // ── Background star field ──
      for (const star of bgStars) {
        const tw = s.reduced ? 0 : Math.sin(s.time * star.twinkleSpeed + star.twinkleOffset) * 0.12;
        const op = Math.max(0, star.opacity + tw);
        ctx.beginPath();
        ctx.arc(star.x * W + bgOX, star.y * H + bgOY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`;
        ctx.fill();
      }

      // ── Constellation edges ──
      const pulse = s.reduced ? 0.5 : 0.5 + 0.5 * Math.sin(s.time * 0.8);
      const edgeOp = 0.16 + pulse * 0.08;

      ctx.strokeStyle = `rgba(${accentRgb},${edgeOp.toFixed(2)})`;
      ctx.lineWidth = 0.75;

      for (const [a, b] of config.edges) {
        const sa = config.stars[a];
        const sb = config.stars[b];
        ctx.beginPath();
        ctx.moveTo(sa.x * W + cOX, sa.y * H + cOY);
        ctx.lineTo(sb.x * W + cOX, sb.y * H + cOY);
        ctx.stroke();
      }

      // ── Constellation nodes ──
      const nodePulse = s.reduced ? 0.5 : 0.5 + 0.5 * Math.sin(s.time * 1.4);
      const nodeR = 1.6 + nodePulse * 0.65;

      ctx.shadowColor = config.accent;
      ctx.shadowBlur = 5 + nodePulse * 6;

      for (const star of config.stars) {
        ctx.beginPath();
        ctx.arc(star.x * W + cOX, star.y * H + cOY, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb},0.88)`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    }

    s.rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [mounted, config]);

  const accentRgb = hexToRgb(config.accent);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {/* Off-center cinematic glow — CSS only, renders on server */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 48% 42% at ${config.glowX}% ${config.glowY}%, rgba(${accentRgb},0.11) 0%, transparent 70%)`,
        }}
      />
      {/* Constellation canvas — deferred until idle */}
      {mounted && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
}
