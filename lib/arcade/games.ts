export const GAME_LABELS: Record<string, string> = {
  asteroids:         'Asteroids',
  frogger:           'Frogger',
  breakout:          'Breakout',
  tron:              'Tron',
  pong:              'Pong',
  snake:             'Serpent Arena',
  invaders:          'Space Invaders',
  galaga:            'Galaga',
  pacman:            'Pac-Man',
  'missile-command': 'Missile Command',
};

/**
 * Score normalization scales for the aggregate leaderboard.
 *
 * Each value is the "target ceiling" for a strong session in that game.
 * Raw scores are capped at this value then scaled to 0–1000 normalized points.
 * This prevents high-ceiling games (Galaga, Asteroids) from dominating the
 * aggregate total over low-ceiling games (Frogger, Tron).
 *
 * Per-game leaderboards always show raw scores — normalization only
 * applies when summing across games.
 */
export const GAME_SCORE_SCALE: Record<string, number> = {
  asteroids:         15000,  // small asteroids = 100 pts, stacks fast
  galaga:            20000,  // boss capture return alone = 10,000 pts
  pacman:            10000,  // ghost chains + fruit + dots
  snake:              8000,  // wave bonuses multiply rapidly
  invaders:           8000,  // 30 invaders × 30 pts + UFO patterns
  'missile-command':  8000,  // level multiplier on wave completion bonuses
  breakout:           5000,  // row value × columns × levels
  pong:               3000,  // rally multiplier + set bonuses
  tron:               2000,  // 100 × level per kill
  frogger:            1000,  // 10 × level per completion, inherently low ceiling
};

/**
 * Normalize a raw game score to a 0–1000 scale.
 * Scores above the ceiling are capped at 1000, not penalized.
 */
export function normalizeScore(game: string, rawScore: number): number {
  const scale = GAME_SCORE_SCALE[game] ?? 5000;
  return Math.min(1000, Math.round((rawScore / scale) * 1000));
}
