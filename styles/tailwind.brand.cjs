/**
 * TSC Brand Colors for Tailwind CSS
 *
 * Usage: Merge these colors into your tailwind.config.js theme.extend.colors
 *
 * Example:
 *   const brandColors = require('./tailwind.brand.cjs');
 *   module.exports = {
 *     theme: {
 *       extend: {
 *         colors: brandColors,
 *       },
 *     },
 *   };
 */

module.exports = {
  // Primary
  'atomic-tangerine': '#FF5910',
  'heart-of-darkness': '#141213',

  // Secondary
  'neon-cactus': '#E1FF00',
  'tidal-wave': '#73F5FF',
  'fing-peachy': '#FFBDAE',
  'sprinkles': '#ED0AD2',
  'moody-sprinkles': '#b2079e',

  // Tertiary
  'hot-sauce': '#BD3A00',
  'jurassic-fern': '#6B920D',
  'hurricane-sky': '#088BA0',
  'hurricane-dark': '#066271',

  // Domain Palette (hue-diverse, dark-theme optimized)
  'cosmic-grape': '#7C3AED',
  'neon-flamingo': '#EC4899',
  'cherry-bomb': '#DC2626',
  'gold-rush': '#D97706',

  // Neutrals
  'shroomy': '#d1d1c6',
  'shroomy-light': '#F1F1EE',
  'greige': '#6D6D69',

  // Brand aliases (for semantic usage)
  brand: {
    primary: '#FF5910',      // Atomic Tangerine
    dark: '#141213',         // Heart of Darkness
    accent: '#FF5910',       // Atomic Tangerine
    highlight: '#E1FF00',    // Neon Cactus
  },
};
