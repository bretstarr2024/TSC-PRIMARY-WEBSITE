'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * Canvas Tetris pieces falling and stacking at the bottom of the hero.
 * Pieces fall from top, stack on each side of center, then break apart on command.
 */

const COLORS = ['#FF5910', '#FF3333', '#BD3A00', '#e04800', '#7C3AED', '#73F5FF', '#E1FF00'];

// Classic Tetris piece shapes (each is a list of [row, col] offsets)
const SHAPES = [
  [[0,0],[0,1],[1,0],[1,1]],       // O
  [[0,0],[0,1],[0,2],[0,3]],       // I
  [[0,0],[1,0],[1,1],[1,2]],       // J
  [[0,2],[1,0],[1,1],[1,2]],       // L
  [[0,0],[0,1],[1,1],[1,2]],       // S
  [[0,1],[0,2],[1,0],[1,1]],       // Z
  [[0,1],[1,0],[1,1],[1,2]],       // T
];

const CELL = 22;
const GAP = 2;

interface FallingPiece {
  shape: number[][];
  color: string;
  x: number;         // px from left
  y: number;         // current px from top
  targetY: number;   // landing Y
  speed: number;     // px per frame
  landed: boolean;
  landedAt: number;  // timestamp of landing
  // Break physics
  breaking: boolean;
  blocks: { x: number; y: number; vx: number; vy: number; rot: number; rotV: number }[];
}

export interface TetrisBackgroundHandle {
  breakApart: () => void;
}

export const TetrisBackground = forwardRef<TetrisBackgroundHandle>(function TetrisBackground(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<FallingPiece[]>([]);
  const breakingRef = useRef(false);
  const breakTimeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    breakApart() {
      breakingRef.current = true;
      breakTimeRef.current = performance.now();
      for (const piece of piecesRef.current) {
        piece.breaking = true;
        piece.blocks = piece.shape.map(([r, c]) => ({
          x: piece.x + c * (CELL + GAP),
          y: piece.landed ? piece.targetY + r * (CELL + GAP) : piece.y + r * (CELL + GAP),
          vx: (Math.random() - 0.5) * 4,
          vy: -(Math.random() * 3 + 1),
          rot: 0,
          rotV: (Math.random() - 0.5) * 0.15,
        }));
      }
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
    let spawnTimer = 0;
    const SPAWN_INTERVAL = 600; // ms between new pieces
    let lastTime = 0;
    // Track stacking heights for left and right zones
    const stackHeights: { left: number; right: number } = { left: 0, right: 0 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnPiece() {
      if (breakingRef.current) return;
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const pieceW = Math.max(...shape.map(([, c]) => c)) * (CELL + GAP) + CELL;
      const pieceH = (Math.max(...shape.map(([r]) => r)) + 1) * (CELL + GAP);

      // Decide left or right side
      const side = stackHeights.left <= stackHeights.right ? 'left' : 'right';
      const centerX = w / 2;
      const margin = 60; // gap from center text area

      let x: number;
      if (side === 'left') {
        // Random position in left zone
        const zoneLeft = Math.max(20, centerX - 500);
        const zoneRight = centerX - margin;
        x = zoneLeft + Math.random() * Math.max(0, zoneRight - zoneLeft - pieceW);
      } else {
        const zoneLeft = centerX + margin;
        const zoneRight = Math.min(w - 20, centerX + 500);
        x = zoneLeft + Math.random() * Math.max(0, zoneRight - zoneLeft - pieceW);
      }

      // Stack from bottom
      const currentStack = side === 'left' ? stackHeights.left : stackHeights.right;
      const targetY = h - currentStack - pieceH - 10;

      // Update stack height
      if (side === 'left') {
        stackHeights.left += pieceH;
      } else {
        stackHeights.right += pieceH;
      }

      // Cap stack height so it doesn't go above ~60% of screen
      const maxStack = h * 0.55;
      if (stackHeights.left > maxStack) stackHeights.left = pieceH;
      if (stackHeights.right > maxStack) stackHeights.right = pieceH;

      piecesRef.current.push({
        shape,
        color,
        x,
        y: -pieceH - Math.random() * 100,
        targetY: Math.max(targetY, h * 0.35),
        speed: 1.5 + Math.random() * 2,
        landed: false,
        landedAt: 0,
        breaking: false,
        blocks: [],
      });
    }

    function draw(time: number) {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      ctx!.clearRect(0, 0, w, h);

      // Spawn new pieces
      if (!breakingRef.current) {
        spawnTimer += dt;
        if (spawnTimer >= SPAWN_INTERVAL) {
          spawnTimer -= SPAWN_INTERVAL;
          spawnPiece();
        }
      }

      // Draw and update pieces
      const gravity = 0.15;
      const toRemove: number[] = [];

      for (let pi = 0; pi < piecesRef.current.length; pi++) {
        const piece = piecesRef.current[pi];

        if (piece.breaking) {
          // Physics for individual blocks
          let allOffscreen = true;
          for (const block of piece.blocks) {
            block.vy += gravity;
            block.x += block.vx;
            block.y += block.vy;
            block.rot += block.rotV;

            if (block.y < h + 100) allOffscreen = false;

            ctx!.save();
            ctx!.translate(block.x + CELL / 2, block.y + CELL / 2);
            ctx!.rotate(block.rot);
            ctx!.globalAlpha = Math.max(0, 1 - (block.y - h * 0.5) / (h * 0.8));
            ctx!.fillStyle = piece.color;
            ctx!.fillRect(-CELL / 2, -CELL / 2, CELL, CELL);
            // Inner highlight
            ctx!.fillStyle = 'rgba(255,255,255,0.15)';
            ctx!.fillRect(-CELL / 2 + 2, -CELL / 2 + 2, CELL - 8, CELL - 8);
            ctx!.restore();
          }
          if (allOffscreen) toRemove.push(pi);
        } else {
          // Falling / landed
          if (!piece.landed) {
            piece.y += piece.speed;
            if (piece.y >= piece.targetY) {
              piece.y = piece.targetY;
              piece.landed = true;
              piece.landedAt = time;
            }
          }

          // Draw piece
          const alpha = piece.landed ? 0.7 : 0.5;
          ctx!.globalAlpha = alpha;
          for (const [r, c] of piece.shape) {
            const bx = piece.x + c * (CELL + GAP);
            const by = piece.y + r * (CELL + GAP);
            ctx!.fillStyle = piece.color;
            ctx!.fillRect(bx, by, CELL, CELL);
            // Inner highlight
            ctx!.fillStyle = 'rgba(255,255,255,0.12)';
            ctx!.fillRect(bx + 2, by + 2, CELL - 8, CELL - 8);
          }
          ctx!.globalAlpha = 1;
        }
      }

      // Remove off-screen broken pieces
      for (let i = toRemove.length - 1; i >= 0; i--) {
        piecesRef.current.splice(toRemove[i], 1);
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
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
});
