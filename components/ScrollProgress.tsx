'use client';

/**
 * Thin progress bar at the top of the viewport.
 * Uses CSS animation-timeline: scroll() — pure CSS, zero JS.
 * Only renders on content detail pages (add manually).
 */
export function ScrollProgress() {
  return <div className="scroll-progress" />;
}
