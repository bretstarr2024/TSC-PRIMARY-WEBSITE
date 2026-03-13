'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient Q*bert-style isometric pyramid with a character hopping between cubes.
 * Positioned off-center (bottom-right) so it doesn't compete with hero text.
 */

interface Cube {
  row: number;
  col: number;
  cx: number;
  cy: number;
  activated: boolean;
}

const CUBE_W = 56;
const HALF_W = CUBE_W / 2;
const HALF_H = CUBE_W / 4;
const DEPTH = CUBE_W / 3;
const ROWS = 6;

const INACTIVE_TOP = '#1e1e50';
const INACTIVE_LEFT = '#151540';
const INACTIVE_RIGHT = '#0e0e30';
const ACTIVE_TOP = '#FF5910';
const ACTIVE_LEFT = '#BD3A00';
const ACTIVE_RIGHT = '#7a2200';
const QBERT_COLOR = '#FF5910';
const QBERT_EYE = '#ffffff';

function drawIsoCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  top: string,
  left: string,
  right: string,
) {
  // Top face
  ctx.beginPath();
  ctx.moveTo(cx, cy - HALF_H);
  ctx.lineTo(cx + HALF_W, cy);
  ctx.lineTo(cx, cy + HALF_H);
  ctx.lineTo(cx - HALF_W, cy);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(cx - HALF_W, cy);
  ctx.lineTo(cx, cy + HALF_H);
  ctx.lineTo(cx, cy + HALF_H + DEPTH);
  ctx.lineTo(cx - HALF_W, cy + DEPTH);
  ctx.closePath();
  ctx.fillStyle = left;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(cx + HALF_W, cy);
  ctx.lineTo(cx, cy + HALF_H);
  ctx.lineTo(cx, cy + HALF_H + DEPTH);
  ctx.lineTo(cx + HALF_W, cy + DEPTH);
  ctx.closePath();
  ctx.fillStyle = right;
  ctx.fill();
}

function drawQbert(ctx: CanvasRenderingContext2D, x: number, y: number, jumpY: number) {
  const bx = x;
  const by = y - 20 - jumpY;
  const r = 12;

  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = QBERT_COLOR;
  ctx.fill();

  // Snout
  ctx.beginPath();
  ctx.moveTo(bx, by - 2);
  ctx.lineTo(bx - 9, by - 16);
  ctx.lineTo(bx + 2, by - 7);
  ctx.closePath();
  ctx.fillStyle = QBERT_COLOR;
  ctx.fill();

  // Eyes
  ctx.beginPath();
  ctx.arc(bx - 4, by - 4, 3, 0, Math.PI * 2);
  ctx.fillStyle = QBERT_EYE;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx + 4, by - 4, 3, 0, Math.PI * 2);
  ctx.fillStyle = QBERT_EYE;
  ctx.fill();

  // Pupils
  ctx.beginPath();
  ctx.arc(bx - 3, by - 4, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx + 5, by - 4, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();

  // Feet
  ctx.beginPath();
  ctx.ellipse(bx - 6, by + r - 1 + jumpY * 0.3, 5, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#e04800';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bx + 6, by + r - 1 + jumpY * 0.3, 5, 2.5, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#e04800';
  ctx.fill();
}

export function QbertBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let cubes: Cube[] = [];
    let qbertPos = { row: 0, col: 0 };
    let hopStart = 0;
    const HOP_INTERVAL = 1100;
    const HOP_DURATION = 320;
    let hopFrom = { cx: 0, cy: 0 };
    let hopTo = { cx: 0, cy: 0 };
    let hopping = false;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPyramid(rect.width, rect.height);
    }

    function buildPyramid(w: number, h: number) {
      cubes = [];
      const rowH = HALF_H * 2 + DEPTH * 0.75;

      // Right pyramid
      const rightX = w * 0.78;
      const rightY = h * 0.28;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= r; c++) {
          const cx = rightX + (c - r / 2) * CUBE_W;
          const cy = rightY + r * rowH;
          cubes.push({ row: r, col: c, cx, cy, activated: false });
        }
      }

      // Left pyramid (mirrored, offset rows so Q*bert hops across both)
      const leftX = w * 0.22;
      const leftY = h * 0.32;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= r; c++) {
          const cx = leftX + (c - r / 2) * CUBE_W;
          const cy = leftY + r * rowH;
          cubes.push({ row: r + ROWS, col: c, cx, cy, activated: false });
        }
      }
    }

    function getCube(row: number, col: number) {
      return cubes.find((c) => c.row === row && c.col === col);
    }

    function getNeighbors(row: number, col: number) {
      const neighbors: { row: number; col: number }[] = [];
      // Determine which pyramid we're in
      const inRight = row < ROWS;
      const base = inRight ? 0 : ROWS;
      const localRow = row - base;
      const maxRow = ROWS;

      if (localRow + 1 < maxRow) neighbors.push({ row: base + localRow + 1, col });
      if (localRow + 1 < maxRow) neighbors.push({ row: base + localRow + 1, col: col + 1 });
      if (localRow > 0 && col > 0) neighbors.push({ row: base + localRow - 1, col: col - 1 });
      if (localRow > 0 && col <= localRow - 1) neighbors.push({ row: base + localRow - 1, col });

      // At bottom of either pyramid, allow jumping to top of the other
      if (localRow === maxRow - 1) {
        const otherBase = inRight ? ROWS : 0;
        neighbors.push({ row: otherBase, col: 0 });
      }

      return neighbors;
    }

    function startHop(time: number) {
      const neighbors = getNeighbors(qbertPos.row, qbertPos.col);
      if (neighbors.length === 0) return;
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const from = getCube(qbertPos.row, qbertPos.col);
      const to = getCube(next.row, next.col);
      if (!from || !to) return;

      hopFrom = { cx: from.cx, cy: from.cy };
      hopTo = { cx: to.cx, cy: to.cy };
      hopping = true;
      hopStart = time;
      qbertPos = next;
      to.activated = true;

      if (cubes.every((c) => c.activated)) {
        setTimeout(() => {
          cubes.forEach((c) => (c.activated = false));
          qbertPos = { row: 0, col: 0 };
        }, 1500);
      }
    }

    let lastHop = 0;

    function draw(time: number) {
      const rect = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);

      for (const cube of cubes) {
        const [t, l, r] = cube.activated
          ? [ACTIVE_TOP, ACTIVE_LEFT, ACTIVE_RIGHT]
          : [INACTIVE_TOP, INACTIVE_LEFT, INACTIVE_RIGHT];
        drawIsoCube(ctx!, cube.cx, cube.cy, t, l, r);
      }

      if (!hopping && time - lastHop > HOP_INTERVAL) {
        startHop(time);
        lastHop = time;
      }

      let qx: number, qy: number, jumpY = 0;
      if (hopping) {
        const elapsed = time - hopStart;
        const t = Math.min(elapsed / HOP_DURATION, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        qx = hopFrom.cx + (hopTo.cx - hopFrom.cx) * ease;
        qy = hopFrom.cy + (hopTo.cy - hopFrom.cy) * ease;
        jumpY = Math.sin(t * Math.PI) * 28;
        if (t >= 1) hopping = false;
      } else {
        const current = getCube(qbertPos.row, qbertPos.col);
        qx = current?.cx ?? 0;
        qy = current?.cy ?? 0;
      }

      drawQbert(ctx!, qx, qy, jumpY);
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
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
