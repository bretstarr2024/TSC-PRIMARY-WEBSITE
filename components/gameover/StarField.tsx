'use client';

import { useEffect, useRef } from 'react';

/**
 * Canvas star field with mouse-reactive particles.
 * Stars drift away from the cursor (like the TSC homepage).
 */

const COLORS = ['#FF5910', '#73F5FF', '#E1FF00', '#ED0AD2', '#d1d1c6', '#d1d1c6', '#d1d1c6'];
const CONNECTION_DIST = 120;
const CONNECTION_ALPHA = 0.06;
const MOUSE_RADIUS = 200;
const MOUSE_FORCE = 60;

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
  // Mouse displacement (smoothed)
  dx: number;
  dy: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      const count = Math.min(Math.floor((w * h) / 3000), 400);
      stars = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          r: Math.random() * 1.8 + 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          twinkleSpeed: Math.random() * 2 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.1,
          dx: 0,
          dy: 0,
        });
      }
    }

    function draw(time: number) {
      const t = time / 1000;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx!.clearRect(0, 0, w, h);

      // Update positions
      for (const s of stars) {
        // Base drift
        const bx = s.baseX + Math.sin(t * s.driftX + s.twinkleOffset) * 20;
        const by = s.baseY + Math.cos(t * s.driftY + s.twinkleOffset) * 15;

        // Mouse repulsion
        const ddx = bx - mx;
        const ddy = by - my;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        let targetDx = 0;
        let targetDy = 0;
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          targetDx = (ddx / dist) * force;
          targetDy = (ddy / dist) * force;
        }

        // Smooth interpolation (spring back)
        s.dx += (targetDx - s.dx) * 0.08;
        s.dy += (targetDy - s.dy) * 0.08;

        s.x = bx + s.dx;
        s.y = by + s.dy;
      }

      // Connections
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const ddx = stars[i].x - stars[j].x;
          const ddy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < CONNECTION_DIST) {
            const alpha = CONNECTION_ALPHA * (1 - dist / CONNECTION_DIST);
            ctx!.strokeStyle = `rgba(209, 209, 198, ${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(stars[i].x, stars[i].y);
            ctx!.lineTo(stars[j].x, stars[j].y);
            ctx!.stroke();
          }
        }
      }

      // Stars
      for (const s of stars) {
        const twinkle = 0.4 + 0.6 * ((Math.sin(t * s.twinkleSpeed + s.twinkleOffset) + 1) / 2);
        ctx!.globalAlpha = twinkle;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.color;
        ctx!.fill();

        if (s.r > 1.2) {
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
          grad.addColorStop(0, s.color + '30');
          grad.addColorStop(1, 'transparent');
          ctx!.fillStyle = grad;
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[5]"
      style={{ pointerEvents: 'auto' }}
      aria-hidden="true"
    />
  );
}
