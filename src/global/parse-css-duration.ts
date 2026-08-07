/**
 * Parses a CSS duration string (e.g., "500ms", "2s") and returns the duration in milliseconds.
 * Returns the `defaultVal` if the input string is not a valid CSS duration.
 */
export function parseCssDuration(duration: string, defaultVal = 0): number {
  const match = duration.match(/(\d+(\.\d+)?)(s|ms)/);
  if (!match) return defaultVal;
  const value = parseFloat(match[1]);
  const unit = match[3];
  // eslint-disable-next-line no-magic-numbers
  return unit === 's' ? value * 1000 : value;
}
