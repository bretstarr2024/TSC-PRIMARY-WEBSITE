'use client';

import { useRef, useEffect, useCallback } from 'react';

// --- Client data for obstacles ---
const allClients = [
  'ADP', 'Oracle', 'SAP', 'ServiceNow', 'Thomson Reuters',
  'Bank of America', 'Equifax', 'Korn Ferry', 'Willis Towers Watson',
  'Aon', 'Randstad', 'Lyft', 'Zendesk', 'John Wiley & Sons',
  'Infor', 'Ceridian', 'Kronos', 'Ultimate Software', 'Paychex',
  'Insperity', 'Alight Solutions', 'Workhuman', 'O.C. Tanner',
  'PlanSource', 'Indeed', 'SeatGeek', 'ZipRecruiter', 'CareerBuilder',
  'iCIMS', 'Jobvite', 'HireVue', 'SmartRecruiters', 'Greenhouse',
  'Checkr', 'HireRight', 'Coursera', 'Udemy', 'MasterClass',
  'Degreed', 'Instructure', 'Gusto', 'SoFi', 'Fitbit', 'Headspace',
  'Medallia', 'Culture Amp', 'Virgin Pulse', 'Bright Horizons',
  'Multiverse', 'DailyPay', 'Cornerstone OnDemand', 'Bitwarden',
];

// Brand colors
const TANGERINE = '#FF5910';
const CACTUS = '#E1FF00';
const TIDAL = '#73F5FF';
const SPRINKLES = '#ED0AD2';
const SHROOMY = '#d1d1c6';
const GREIGE = '#6D6D69';
const BG = '#141213';

const LANE_COLORS = [TANGERINE, TIDAL, SPRINKLES, CACTUS, TANGERINE];

interface Pill {
  x: number;
  w: number;
  label: string;
}

interface Lane {
  y: number;
  speed: number;
  dir: 1 | -1;
  pills: Pill[];
  color: string;
}

interface GameState {
  lanes: Lane[];
  playerX: number;
  playerLane: number; // 0 = bottom safe zone, 1-5 = lanes, 6 = top goal
  lives: number;
  score: number;
  level: number;
  over: boolean;
  won: boolean;
  respawning: number;
  shake: number;
  laneH: number;
  pillH: number;
  started: boolean;
  touchActive: boolean;
}

// Measure pill widths
function measurePill(ctx: CanvasRenderingContext2D, label: string, pillH: number): number {
  ctx.font = `${pillH * 0.38}px Inter, system-ui, sans-serif`;
  return ctx.measureText(label).width + pillH * 1.2;
}

// Build lane pills
function buildLane(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  laneH: number,
  pillH: number,
  speed: number,
  dir: 1 | -1,
  color: string,
  laneY: number,
  clientSubset: string[],
): Lane {
  const pills: Pill[] = [];
  let x = dir === 1 ? -canvasW * 0.3 : 0;
  const gap = pillH * 1.8 + Math.random() * pillH * 1.2;

  for (let i = 0; i < clientSubset.length; i++) {
    const label = clientSubset[i];
    const w = measurePill(ctx, label, pillH);
    pills.push({ x, w, label });
    x += w + gap;
    if (x > canvasW * 3) break;
  }

  return { y: laneY, speed, dir, pills, color };
}

export function FroggerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const ochoImg = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const NUM_LANES = 5;
    const laneH = h / (NUM_LANES + 2); // +2 for top/bottom safe zones
    const pillH = Math.min(laneH * 0.55, 38);

    const lanes: Lane[] = [];
    const baseSpeed = 1.2;

    for (let i = 0; i < NUM_LANES; i++) {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const speed = baseSpeed + Math.random() * 0.8 + i * 0.15;
      const laneY = h - laneH * (i + 1) - laneH; // bottom safe zone offset
      const start = (i * 10) % allClients.length;
      const subset = [...allClients.slice(start), ...allClients.slice(0, start)];
      lanes.push(buildLane(ctx, w, laneH, pillH, speed, dir, LANE_COLORS[i % LANE_COLORS.length], laneY, subset));
    }

    gameRef.current = {
      lanes,
      playerX: w / 2,
      playerLane: 0,
      lives: 3,
      score: 0,
      level: 1,
      over: false,
      won: false,
      respawning: 0,
      shake: 0,
      laneH,
      pillH,
      started: true,
      touchActive: false,
    };
  }, []);

  // Get player Y from lane
  const getPlayerY = useCallback((g: GameState, h: number): number => {
    if (g.playerLane === 0) return h - g.laneH * 0.5;
    if (g.playerLane >= 6) return g.laneH * 0.5;
    return h - g.laneH * (g.playerLane + 1) - g.laneH + g.laneH * 0.5;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // Load Ocho
    const img = new Image();
    img.src = '/images/ocho-color.png';
    ochoImg.current = img;

    initGame();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function loop() {
      const g = gameRef.current;
      if (!g || !ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;

      // --- Update ---
      if (!g.over) {
        // Move pills & wrap
        for (const lane of g.lanes) {
          const speedMult = 1 + (g.level - 1) * 0.15;
          for (const pill of lane.pills) {
            pill.x += lane.speed * lane.dir * speedMult;
          }
          // Wrap pills
          for (const pill of lane.pills) {
            if (lane.dir === 1 && pill.x > w + 100) {
              pill.x = -pill.w - 80 - Math.random() * 200;
            } else if (lane.dir === -1 && pill.x + pill.w < -100) {
              pill.x = w + 80 + Math.random() * 200;
            }
          }
        }

        // Collision check
        if (g.respawning > 0) {
          g.respawning--;
        } else if (g.playerLane >= 1 && g.playerLane <= 5) {
          const lane = g.lanes[g.playerLane - 1];
          const py = getPlayerY(g, h);
          const playerSize = g.laneH * 0.35;
          const px = g.playerX;

          for (const pill of lane.pills) {
            const pillTop = lane.y + (g.laneH - g.pillH) / 2;
            const pillBot = pillTop + g.pillH;
            const pillL = pill.x;
            const pillR = pill.x + pill.w;

            if (
              px + playerSize * 0.4 > pillL &&
              px - playerSize * 0.4 < pillR &&
              py + playerSize * 0.4 > pillTop &&
              py - playerSize * 0.4 < pillBot
            ) {
              g.lives--;
              g.shake = 12;
              if (g.lives <= 0) {
                g.over = true;
              } else {
                g.playerLane = 0;
                g.playerX = w / 2;
                g.respawning = 60;
              }
              break;
            }
          }
        }

        // Win check — reached top
        if (g.playerLane >= 6) {
          g.score += 10 * g.level;
          g.level++;
          g.playerLane = 0;
          g.playerX = w / 2;
          // Speed up existing lanes
          for (const lane of g.lanes) {
            lane.speed += 0.2;
          }
        }
      }

      // Shake decay
      if (g.shake > 0) {
        g.shake *= g.over ? 0.85 : 0.9;
        if (g.shake < 0.3) g.shake = 0;
      }

      // --- Draw ---
      ctx.save();
      if (g.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * g.shake * 2,
          (Math.random() - 0.5) * g.shake * 2,
        );
      }

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      // Safe zones
      const safeAlpha = 0.04;
      ctx.fillStyle = `rgba(225, 255, 0, ${safeAlpha})`;
      ctx.fillRect(0, h - g.laneH, w, g.laneH); // bottom
      ctx.fillRect(0, 0, w, g.laneH); // top

      // Goal text
      ctx.fillStyle = CACTUS;
      ctx.globalAlpha = 0.3;
      ctx.font = `bold ${g.laneH * 0.25}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SAFE ZONE', w / 2, g.laneH * 0.6);
      ctx.globalAlpha = 1;

      // Start zone text
      ctx.fillStyle = CACTUS;
      ctx.globalAlpha = 0.3;
      ctx.fillText('START', w / 2, h - g.laneH * 0.4);
      ctx.globalAlpha = 1;

      // Lane dividers
      for (let i = 0; i <= 5; i++) {
        const ly = h - g.laneH * (i + 1);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(w, ly);
        ctx.stroke();
      }

      // Draw pills
      for (const lane of g.lanes) {
        for (const pill of lane.pills) {
          const px = pill.x;
          const py = lane.y + (g.laneH - g.pillH) / 2;
          const pw = pill.w;
          const ph = g.pillH;
          const radius = ph / 2;

          // Pill shape
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, radius);
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fill();
          ctx.strokeStyle = `${lane.color}33`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Label
          ctx.fillStyle = SHROOMY;
          ctx.font = `${g.pillH * 0.38}px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pill.label, px + pw / 2, py + ph / 2);
        }
      }

      // Draw player (Ocho)
      const py = getPlayerY(g, h);
      const playerSize = g.laneH * 0.45;
      const blinkOn = g.respawning === 0 || Math.floor(g.respawning / 4) % 2 === 0;

      if (blinkOn) {
        if (ochoImg.current && ochoImg.current.complete && ochoImg.current.naturalWidth > 0) {
          // Glow
          ctx.shadowColor = SPRINKLES;
          ctx.shadowBlur = 18;
          ctx.drawImage(
            ochoImg.current,
            g.playerX - playerSize / 2,
            py - playerSize / 2,
            playerSize,
            playerSize,
          );
          ctx.shadowBlur = 0;
        } else {
          // Fallback circle
          ctx.fillStyle = SPRINKLES;
          ctx.beginPath();
          ctx.arc(g.playerX, py, playerSize / 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HUD
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Score
      ctx.fillStyle = CACTUS;
      ctx.font = `bold ${Math.min(20, w * 0.025)}px Inter, system-ui, sans-serif`;
      ctx.fillText(`SCORE: ${g.score}`, 16, 16);

      // Level
      ctx.fillStyle = TIDAL;
      ctx.fillText(`LEVEL ${g.level}`, 16, 42);

      // Lives
      ctx.textAlign = 'right';
      ctx.fillStyle = TANGERINE;
      for (let i = 0; i < g.lives; i++) {
        ctx.fillText('♥', w - 16 - i * 24, 16);
      }

      // Game over
      if (g.over) {
        ctx.fillStyle = 'rgba(20,18,19,0.8)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = TANGERINE;
        ctx.font = `bold ${Math.min(48, w * 0.06)}px Inter, system-ui, sans-serif`;
        ctx.fillText('GAME OVER', w / 2, h / 2 - 40);

        ctx.fillStyle = CACTUS;
        ctx.font = `bold ${Math.min(28, w * 0.035)}px Inter, system-ui, sans-serif`;
        ctx.fillText(`Score: ${g.score}  |  Level ${g.level}`, w / 2, h / 2 + 10);

        ctx.fillStyle = SHROOMY;
        ctx.font = `${Math.min(16, w * 0.02)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Press ENTER to play again  |  ESC to exit', w / 2, h / 2 + 50);
      }

      // Touch controls (if touch active)
      if (g.touchActive && !g.over) {
        drawTouchControls(ctx, w, h);
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animRef.current);
  }, [initGame, getPlayerY]);

  // Touch controls drawing
  function drawTouchControls(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const btnSize = 52;
    const pad = 20;
    const cx = w - pad - btnSize * 1.5;
    const cy = h - pad - btnSize * 1.5;

    const buttons = [
      { label: '▲', x: cx, y: cy - btnSize - 8 },       // up
      { label: '▼', x: cx, y: cy + btnSize + 8 },       // down
      { label: '◀', x: cx - btnSize - 8, y: cy },       // left
      { label: '▶', x: cx + btnSize + 8, y: cy },       // right
    ];

    for (const btn of buttons) {
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, btnSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `${btnSize * 0.4}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x, btn.y);
    }
  }

  // Keyboard input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const g = gameRef.current;
      if (!g) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (g.over) {
        if (e.key === 'Enter') initGame();
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const step = g.laneH * 0.7;

      keysRef.current.add(e.key);

      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        if (g.playerLane < 6) g.playerLane++;
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        if (g.playerLane > 0) g.playerLane--;
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        g.playerX = Math.max(step, g.playerX - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        g.playerX = Math.min(w - step, g.playerX + step);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClose, initGame]);

  // Touch input
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function handleTouch(e: TouchEvent) {
      e.preventDefault();
      const g = gameRef.current;
      if (!g || !canvas) return;

      g.touchActive = true;

      if (g.over) {
        initGame();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = canvas.width;
      const h = canvas.height;
      const scaleX = w / rect.width;
      const scaleY = h / rect.height;

      for (let i = 0; i < e.touches.length; i++) {
        const tx = (e.touches[i].clientX - rect.left) * scaleX;
        const ty = (e.touches[i].clientY - rect.top) * scaleY;

        const btnSize = 52;
        const pad = 20;
        const cx = w - pad - btnSize * 1.5;
        const cy = h - pad - btnSize * 1.5;
        const step = g.laneH * 0.7;

        const buttons = [
          { action: 'up', x: cx, y: cy - btnSize - 8 },
          { action: 'down', x: cx, y: cy + btnSize + 8 },
          { action: 'left', x: cx - btnSize - 8, y: cy },
          { action: 'right', x: cx + btnSize + 8, y: cy },
        ];

        for (const btn of buttons) {
          const dist = Math.hypot(tx - btn.x, ty - btn.y);
          if (dist < btnSize * 0.7) {
            if (btn.action === 'up' && g.playerLane < 6) g.playerLane++;
            else if (btn.action === 'down' && g.playerLane > 0) g.playerLane--;
            else if (btn.action === 'left') g.playerX = Math.max(step, g.playerX - step);
            else if (btn.action === 'right') g.playerX = Math.min(w - step, g.playerX + step);
          }
        }
      }
    }

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    return () => canvas.removeEventListener('touchstart', handleTouch);
  }, [initGame]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-30"
      style={{ touchAction: 'none' }}
    />
  );
}
