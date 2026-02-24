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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

// Measure car widths (text + padding for hood/windshield/bumper)
function measurePill(ctx: CanvasRenderingContext2D, label: string, pillH: number): number {
  ctx.font = `bold ${pillH * 0.34}px Inter, system-ui, sans-serif`;
  return ctx.measureText(label).width + pillH * 2;
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
  const gap = pillH * 4.5 + Math.random() * pillH * 3;

  for (let i = 0; i < clientSubset.length; i++) {
    const label = clientSubset[i];
    const w = measurePill(ctx, label, pillH);
    pills.push({ x, w, label });
    x += w + gap;
    if (x > canvasW * 3) break;
  }

  return { y: laneY, speed, dir, pills, color };
}

// Draw a side-view car with client name
function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string, label: string, dir: 1 | -1,
) {
  const r = Math.min(6, h * 0.15);

  // Car body fill
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = hexToRgba(color, 0.12);
  ctx.fill();

  // Hood + windshield (clipped to body shape)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  // Hood / bumper section
  const hoodW = Math.max(8, w * 0.1);
  ctx.fillStyle = hexToRgba(color, 0.28);
  if (dir === 1) {
    ctx.fillRect(x + w - hoodW, y, hoodW, h);
  } else {
    ctx.fillRect(x, y, hoodW, h);
  }

  // Windshield
  const winH = h * 0.42;
  const winW = Math.min(w * 0.18, 30);
  const winY = y + (h - winH) / 2;
  const winX = dir === 1 ? x + w - hoodW - winW - 4 : x + hoodW + 4;
  ctx.fillStyle = 'rgba(115, 245, 255, 0.07)';
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(winX, winY, winW, winH);

  ctx.restore();

  // Body outline
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.strokeStyle = hexToRgba(color, 0.45);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wheels (semicircles at bottom edge)
  const wheelR = Math.max(3, h * 0.15);
  const wheelY2 = y + h;
  const fwX = dir === 1 ? x + w * 0.78 : x + w * 0.22;
  const rwX = dir === 1 ? x + w * 0.22 : x + w * 0.78;

  for (const wx of [fwX, rwX]) {
    ctx.beginPath();
    ctx.arc(wx, wheelY2, wheelR, Math.PI, 0);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(wx, wheelY2, wheelR * 0.5, Math.PI, 0);
    ctx.fillStyle = '#555';
    ctx.fill();
  }

  // Headlights (front)
  const hlR = Math.max(1.5, h * 0.06);
  const hlX = dir === 1 ? x + w - 2 : x + 2;
  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(hlX, y + h * 0.28, hlR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(hlX, y + h * 0.72, hlR, 0, Math.PI * 2);
  ctx.fill();

  // Taillights (rear)
  const tlR = hlR * 0.8;
  const tlX = dir === 1 ? x + 3 : x + w - 3;
  ctx.fillStyle = '#FF4444';
  ctx.beginPath();
  ctx.arc(tlX, y + h * 0.28, tlR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tlX, y + h * 0.72, tlR, 0, Math.PI * 2);
  ctx.fill();

  // Client name
  ctx.fillStyle = SHROOMY;
  ctx.font = `bold ${h * 0.34}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
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

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const NUM_LANES = 5;
    const laneH = h / (NUM_LANES + 2); // +2 for top/bottom safe zones
    const pillH = Math.min(laneH * 0.55, 38);

    const lanes: Lane[] = [];
    const baseSpeed = 0.35;

    for (let i = 0; i < NUM_LANES; i++) {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const speed = baseSpeed + Math.random() * 0.25 + i * 0.08;
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
      started: false,
      touchActive: false,
    };
  }, []);

  // Get player Y from lane — center of the lane strip
  // Layout: bottom safe (lane 0) → 5 traffic lanes (1-5) → top safe (lane 6)
  // Each strip is laneH tall, so center of strip p = h - laneH * (p + 0.5)
  const getPlayerY = useCallback((g: GameState, h: number): number => {
    if (g.playerLane === 0) return h - g.laneH * 0.5;
    if (g.playerLane >= 6) return g.laneH * 0.5;
    return h - g.laneH * (g.playerLane + 0.5);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    if (parent) {
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    }

    // Load Ocho
    const img = new Image();
    img.src = '/images/ocho-color.png';
    ochoImg.current = img;

    initGame();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    function loop() {
      const g = gameRef.current;
      if (!g || !ctx || !canvas) return;

      const dprLoop = window.devicePixelRatio || 1;
      const w = canvas.width / dprLoop;
      const h = canvas.height / dprLoop;

      // --- Update ---
      // Always drift pills (even on start screen for visual backdrop)
      for (const lane of g.lanes) {
        const speedMult = g.started ? 1 + (g.level - 1) * 0.08 : 0.5;
        for (const pill of lane.pills) {
          pill.x += lane.speed * lane.dir * speedMult;
        }
        // Wrap with spacing awareness to prevent overlap
        for (const pill of lane.pills) {
          if (lane.dir === 1 && pill.x > w + 100) {
            let minX = 0;
            for (const p of lane.pills) {
              if (p !== pill && p.x < minX) minX = p.x;
            }
            pill.x = minX - pill.w - g.pillH * 3 - Math.random() * g.pillH * 2;
          } else if (lane.dir === -1 && pill.x + pill.w < -100) {
            let maxR = w;
            for (const p of lane.pills) {
              if (p !== pill) {
                const right = p.x + p.w;
                if (right > maxR) maxR = right;
              }
            }
            pill.x = maxR + g.pillH * 3 + Math.random() * g.pillH * 2;
          }
        }
      }

      if (g.started && !g.over) {
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
            lane.speed += 0.06;
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

      // Draw cars
      for (const lane of g.lanes) {
        for (const pill of lane.pills) {
          const px = pill.x;
          const py = lane.y + (g.laneH - g.pillH) / 2;
          drawCar(ctx, px, py, pill.w, g.pillH, lane.color, pill.label, lane.dir);
        }
      }

      // Draw player (Ocho) — only when game has started
      if (g.started) {
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

      // Start screen
      if (!g.started) {
        ctx.fillStyle = 'rgba(20,18,19,0.75)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Ocho icon
        const iconSize = Math.min(64, w * 0.08);
        if (ochoImg.current && ochoImg.current.complete && ochoImg.current.naturalWidth > 0) {
          ctx.shadowColor = SPRINKLES;
          ctx.shadowBlur = 20;
          ctx.drawImage(ochoImg.current, w / 2 - iconSize / 2, h / 2 - 100 - iconSize / 2, iconSize, iconSize);
          ctx.shadowBlur = 0;
        }

        // Title
        ctx.fillStyle = TANGERINE;
        ctx.font = `bold ${Math.min(44, w * 0.055)}px Inter, system-ui, sans-serif`;
        ctx.fillText('CLIENT FROGGER', w / 2, h / 2 - 20);

        // Instructions
        ctx.fillStyle = SHROOMY;
        ctx.font = `${Math.min(16, w * 0.02)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Navigate Ocho through the client traffic', w / 2, h / 2 + 20);
        ctx.fillText('Arrow keys or WASD to move', w / 2, h / 2 + 44);

        // Call to action (pulsing)
        const pulse = 0.6 + Math.sin(Date.now() * 0.004) * 0.4;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = CACTUS;
        ctx.font = `bold ${Math.min(20, w * 0.025)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Press any key or tap to start', w / 2, h / 2 + 84);
        ctx.globalAlpha = 1;

        // ESC hint
        ctx.fillStyle = GREIGE;
        ctx.font = `${Math.min(13, w * 0.016)}px Inter, system-ui, sans-serif`;
        ctx.fillText('ESC to exit', w / 2, h / 2 + 116);
      }

      // Touch controls (if touch active)
      if (g.touchActive && !g.over && g.started) {
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

      if (!g.started) {
        g.started = true;
        return;
      }

      if (g.over) {
        if (e.key === 'Enter') initGame();
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const dprK = window.devicePixelRatio || 1;
      const w = canvas.width / dprK;
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

      if (!g.started) {
        g.started = true;
        return;
      }

      if (g.over) {
        initGame();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const dprT = window.devicePixelRatio || 1;
      const logW = canvas.width / dprT;
      const logH = canvas.height / dprT;

      for (let i = 0; i < e.touches.length; i++) {
        // Map touch to logical (CSS) coordinates to match drawTouchControls
        const tx = (e.touches[i].clientX - rect.left) * (logW / rect.width);
        const ty = (e.touches[i].clientY - rect.top) * (logH / rect.height);

        const btnSize = 52;
        const pad = 20;
        const cx = logW - pad - btnSize * 1.5;
        const cy = logH - pad - btnSize * 1.5;
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
            else if (btn.action === 'right') g.playerX = Math.min(logW - step, g.playerX + step);
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
