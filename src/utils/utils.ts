/**
 * Clamps a number to the range [min, max].
 *
 * @param value Number to clamp
 * @param min Lower bound
 * @param max Upper bound
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
