import {clamp} from '../utils/utils';

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;
const PERCENT_FACTOR = 100;

/**
 * Converts progress value to percentage
 *
 * @param {number} value The progress task value
 * @param {number} max The maximum value
 * @return {number} The progress task value in percent
 */
export const toPercent = (value: number, max: number): string => {
  return `${clamp((value * PERCENT_FACTOR) / max, PERCENT_MIN, PERCENT_MAX)}%`;
};
