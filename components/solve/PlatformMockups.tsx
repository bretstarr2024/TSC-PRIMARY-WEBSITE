'use client';

import { motion, useReducedMotion } from 'framer-motion';

/* ─── Shared browser chrome ─── */
function BrowserFrame({
  url,
  accentColor,
  children,
}: {
  url: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-[#0f0f0f] border border-white/5 text-[10px] text-greige font-mono truncate max-w-[200px]">
            {url}
          </div>
        </div>
        <div className="w-12" />
      </div>
      {/* Viewport */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0e0e0e]">
        {/* CRT scanlines */}
        <div className="absolute inset-0 crt-scanlines opacity-[0.04] z-20 pointer-events-none" />
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, ${accentColor}08 0%, transparent 60%)`,
          }}
        />
        {children}
      </div>
    </div>
  );
}

/* ─── Animated bar chart ─── */
function AnimBar({
  height,
  color,
  delay,
}: {
  height: string;
  color: string;
  delay: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="w-full rounded-t-sm"
      style={{ backgroundColor: color, height }}
      initial={{ scaleY: 0, transformOrigin: 'bottom' }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
    />
  );
}

/* ─── Animated progress ring ─── */
function ProgressRing({
  pct,
  color,
  size = 48,
  delay = 0,
}: {
  pct: number;
  color: string;
  size?: number;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: 1.2, delay, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize={size * 0.22}
        fontWeight="800"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ─── Typing cursor ─── */
function TypeCursor() {
  return (
    <motion.span
      className="inline-block w-[2px] h-3 bg-white ml-0.5"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. GTM KERNEL — Dashboard mockup
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function KernelMockup() {
  const reducedMotion = useReducedMotion();

  const domains = [
    { name: 'Brand Identity', pct: 92, color: '#FF5910' },
    { name: 'Message Identity', pct: 87, color: '#FF5910' },
    { name: 'ICP & Buyer', pct: 78, color: '#73F5FF' },
    { name: 'Competitive', pct: 95, color: '#E1FF00' },
    { name: 'Demand States', pct: 64, color: '#ED0AD2' },
  ];

  return (
    <BrowserFrame url="••••••••••" accentColor="#FF5910">
      <div className="p-4 md:p-5 h-full flex flex-col gap-3 text-[10px]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-white">GTM Kernel</span>
            <span className="px-1.5 py-0.5 rounded bg-atomic-tangerine/20 text-atomic-tangerine text-[8px] font-bold uppercase">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-greige">Acme Corp</span>
            <span className="w-5 h-5 rounded-full bg-atomic-tangerine/30" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-[1fr_140px] gap-3 min-h-0">
          {/* Left — domain cards */}
          <div className="space-y-2 overflow-hidden">
            {/* Health score */}
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
            >
              <ProgressRing pct={81} color="#FF5910" size={42} delay={0.4} />
              <div>
                <p className="text-white font-bold text-[11px]">Kernel Health</p>
                <p className="text-greige">162 of 200 fields complete</p>
              </div>
            </motion.div>

            {/* Domain rows */}
            {domains.map((d, i) => (
              <motion.div
                key={d.name}
                className="flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02]"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.3 + i * 0.08, duration: 0.4 }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-white flex-1 truncate">{d.name}</span>
                <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.pct}%` }}
                    viewport={{ once: true }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.5 + i * 0.1 }}
                  />
                </div>
                <span className="text-greige w-6 text-right">{d.pct}%</span>
              </motion.div>
            ))}
          </div>

          {/* Right — actions panel */}
          <div className="space-y-2 overflow-hidden">
            <p className="text-greige font-bold uppercase tracking-wider text-[8px] mb-1">
              Recommended
            </p>
            {['Run Research', 'Complete Buyer', 'Gen Battlecard', 'Review Triggers'].map((action, i) => (
              <motion.div
                key={action}
                className="p-2 rounded-md border border-atomic-tangerine/20 bg-atomic-tangerine/5 text-[9px] text-white cursor-default"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.6 + i * 0.1, duration: 0.4 }}
              >
                {action} &rarr;
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. INTELLIGENCE ENGINE — Query analysis mockup
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function IntelligenceMockup() {
  const reducedMotion = useReducedMotion();

  const queries = [
    { q: 'best HR software for midmarket', intent: 'Evaluation', vol: '2.4K', score: 92, color: '#73F5FF' },
    { q: 'how to reduce employee turnover', intent: 'Awareness', vol: '8.1K', score: 78, color: '#E1FF00' },
    { q: 'applicant tracking system pricing', intent: 'Buying', vol: '1.2K', score: 96, color: '#FF5910' },
    { q: 'talent acquisition vs recruiting', intent: 'Research', vol: '3.7K', score: 65, color: '#ED0AD2' },
  ];

  return (
    <BrowserFrame url="••••••••••" accentColor="#73F5FF">
      <div className="p-4 md:p-5 h-full flex flex-col gap-3 text-[10px]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-white">Intelligence Engine</span>
            <span className="px-1.5 py-0.5 rounded bg-tidal-wave/20 text-tidal-wave text-[8px] font-bold uppercase">
              Scanning
            </span>
          </div>
          <span className="text-greige">1,247 queries tracked</span>
        </div>

        {/* Search bar */}
        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-tidal-wave/30 bg-white/[0.02]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.4 }}
        >
          <svg className="w-3 h-3 text-tidal-wave" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-white/50">Analyze buyer queries...</span>
          <TypeCursor />
        </motion.div>

        {/* Results grid */}
        <div className="flex-1 grid grid-cols-[1fr_100px] gap-3 min-h-0">
          {/* Query list */}
          <div className="space-y-1.5 overflow-hidden">
            {queries.map((q, i) => (
              <motion.div
                key={q.q}
                className="flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02]"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.4 + i * 0.1, duration: 0.4 }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: q.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{q.q}</p>
                  <p className="text-greige">{q.intent} &middot; {q.vol}/mo</p>
                </div>
                <div className="text-right">
                  <span className="font-bold" style={{ color: q.color }}>{q.score}</span>
                  <p className="text-greige text-[8px]">score</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mini chart */}
          <div className="flex flex-col justify-end">
            <p className="text-greige font-bold uppercase tracking-wider text-[8px] mb-2">
              Opportunity
            </p>
            <div className="flex items-end gap-1 h-20">
              {[45, 62, 38, 78, 55, 90, 72].map((h, i) => (
                <AnimBar key={i} height={`${h}%`} color="#73F5FF" delay={0.6 + i * 0.08} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. CONTENT ENGINE — Production pipeline mockup
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function ContentMockup() {
  const reducedMotion = useReducedMotion();

  const pipeline = [
    { title: 'Why ATS pricing models are broken', type: 'Blog', status: 'Published', color: '#28c840' },
    { title: 'HCM vs HRIS comparison guide', type: 'Comparison', status: 'Generating', color: '#E1FF00' },
    { title: 'Employee retention ROI calculator', type: 'Tool', status: 'In Queue', color: '#73F5FF' },
    { title: 'Talent acquisition FAQ collection', type: 'FAQ', status: 'Review', color: '#FF5910' },
  ];

  const stats = [
    { label: 'Published', value: '143', color: '#28c840' },
    { label: 'This Week', value: '12', color: '#73F5FF' },
    { label: 'Voice Score', value: '94', color: '#FF5910' },
  ];

  return (
    <BrowserFrame url="••••••••••" accentColor="#E1FF00">
      <div className="p-4 md:p-5 h-full flex flex-col gap-3 text-[10px]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-white">Content Engine</span>
            <span className="px-1.5 py-0.5 rounded bg-neon-cactus/20 text-neon-cactus text-[8px] font-bold uppercase">
              Producing
            </span>
          </div>
          <div className="flex gap-3">
            {stats.map((s) => (
              <div key={s.label} className="text-right">
                <span className="font-bold text-[11px]" style={{ color: s.color }}>{s.value}</span>
                <p className="text-greige text-[8px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline items */}
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {pipeline.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.3 + i * 0.1, duration: 0.4 }}
            >
              <span
                className="w-1.5 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate font-medium">{item.title}</p>
                <p className="text-greige">{item.type}</p>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border"
                style={{
                  color: item.color,
                  borderColor: `${item.color}44`,
                  backgroundColor: `${item.color}0A`,
                }}
              >
                {item.status}
              </span>
              {item.status === 'Generating' && (
                <motion.div
                  className="w-10 h-1 rounded-full bg-white/5 overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    animate={reducedMotion ? { width: '65%' } : { width: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom bar — content type distribution */}
        <div>
          <p className="text-greige font-bold uppercase tracking-wider text-[8px] mb-1.5">
            Content Mix
          </p>
          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
            {[
              { w: '30%', c: '#FF5910' },
              { w: '20%', c: '#73F5FF' },
              { w: '15%', c: '#E1FF00' },
              { w: '12%', c: '#ED0AD2' },
              { w: '10%', c: '#FFBDAE' },
              { w: '13%', c: '#28c840' },
            ].map((seg, i) => (
              <motion.div
                key={i}
                className="h-full"
                style={{ backgroundColor: seg.c, width: seg.w }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.8 + i * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
