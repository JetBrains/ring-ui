/**
 * Converts progress value to percentage
 * @param {number} value The progress task value
 * @param {number} max The maximum value
 * @return {number} The progress task value in percent
 */
export const toPercent = (value: number, max: number): number => {
  const HUNDRED_PERCENT = 100;
  const percents = Math.max((value * HUNDRED_PERCENT) / max, 0);
  return percents > HUNDRED_PERCENT ? HUNDRED_PERCENT : percents;
};
