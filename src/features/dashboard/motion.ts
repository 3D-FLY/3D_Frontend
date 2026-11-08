/** Shared easing for dashboard entrance animations (soft, decelerating). */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Delay for the i-th item in a staggered entrance.
 * Capped so long lists don't make the last rows wait too long.
 */
export function staggerDelay(index: number, step = 0.06, cap = 10): number {
  return Math.min(index, cap) * step;
}
