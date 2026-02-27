// OG Image constants — badge labels, colors, font size breakpoints

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const COLORS = {
  background: '#141213',        // Heart of Darkness
  text: '#FFFFFF',
  textMuted: '#d1d1c6',         // Shroomy
  textGreige: '#6D6D69',        // Greige
  atomicTangerine: '#FF5910',
  neonCactus: '#E1FF00',
  tidalWave: '#73F5FF',
  sprinkles: '#ED0AD2',
  fingPeachy: '#FFBDAE',
  cosmicGrape: '#7C3AED',
  goldRush: '#D97706',
  hurricaneSky: '#088BA0',
  neonFlamingo: '#EC4899',
} as const;

export interface BadgeConfig {
  label: string;
  color: string;
}

export const OG_BADGES: Record<string, BadgeConfig> = {
  homepage:         { label: 'GAME OVER',    color: COLORS.atomicTangerine },
  services:         { label: 'SERVICES',     color: COLORS.atomicTangerine },
  service:          { label: 'SERVICE',      color: COLORS.atomicTangerine },
  verticals:        { label: 'VERTICALS',    color: COLORS.sprinkles },
  vertical:         { label: 'VERTICAL',     color: COLORS.sprinkles },
  about:            { label: 'ABOUT',        color: COLORS.tidalWave },
  pricing:          { label: 'PRICING',      color: COLORS.neonCactus },
  contact:          { label: 'CONTINUE?',    color: COLORS.tidalWave },
  careers:          { label: 'CAREERS',       color: COLORS.fingPeachy },
  book:             { label: 'BOOK A CALL',  color: COLORS.neonCactus },
  work:             { label: 'WORK',         color: COLORS.cosmicGrape },
  insights:         { label: 'INSIGHTS',     color: COLORS.atomicTangerine },
  blog:             { label: 'BLOG',         color: COLORS.atomicTangerine },
  faq:              { label: 'FAQ',          color: COLORS.neonCactus },
  glossary:         { label: 'GLOSSARY',     color: COLORS.tidalWave },
  comparison:       { label: 'VS',           color: COLORS.sprinkles },
  'expert-qa':      { label: 'EXPERT Q&A',   color: COLORS.fingPeachy },
  news:             { label: 'NEWS',         color: COLORS.hurricaneSky },
  'case-study':     { label: 'CASE STUDY',   color: COLORS.cosmicGrape },
  'industry-brief': { label: 'BRIEF',        color: COLORS.goldRush },
  tool:             { label: 'TOOL',         color: COLORS.neonFlamingo },
  video:            { label: 'VIDEO',        color: COLORS.hurricaneSky },
  infographic:      { label: 'INFOGRAPHIC',  color: COLORS.neonFlamingo },
} as const;

/** Auto-scale title font size based on character count */
export function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len < 30) return 36;
  if (len < 60) return 28;
  if (len < 90) return 22;
  return 18;
}

/** Truncate title for OG image display */
export function truncateTitle(title: string, max = 120): string {
  if (title.length <= max) return title;
  return title.slice(0, max - 1).trimEnd() + '\u2026';
}
