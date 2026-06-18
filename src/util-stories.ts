/* eslint-disable no-magic-numbers */
export const hideAddonsPanelParam = 'hideAddonsPanel';

export function createRandom(seed: bigint): {
  /**
   * Fractional in [0, 1)
   */
  (): number;
  /**
   * Integer in [0, to)
   */
  (to: number): number;
  /**
   * Integer in [from, to)
   */
  (from: number, to: number): number;
  /**
   * Date in [from, to)
   */
  (from: Date, to: Date): Date;
  /**
   * Up to random n items (in random order) from the array
   */
  <T>(array: T[], n: number): T[];
  /**
   * Random item from the array
   */
  <T>(array: T[]): T;
} {
  const u64Mask = 2n ** 64n - 1n;
  const u64Range = 2n ** 64n;
  const scrambleConst = 2685821657736338717n;

  let x = seed & u64Mask;
  if (!x) throw new Error('Seed must be non-zero');

  function nextFractional() {
    x ^= x >> 12n;
    x ^= (x << 25n) & u64Mask;
    x ^= x >> 27n;

    const scrambled = (x * scrambleConst) & u64Mask;
    return Number(scrambled) / Number(u64Range);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]): any => {
    if (!args.length) {
      return nextFractional();
    }

    if (args.length === 1) {
      const [a] = args;
      if (typeof a === 'number') {
        return Math.floor(nextFractional() * a);
      }
      if (Array.isArray(a)) {
        return a[Math.floor(nextFractional() * a.length)];
      }
    }

    if (args.length === 2) {
      const [a, b] = args;

      let fromNum: number | undefined;
      let toNum: number | undefined;
      let isDate = false;

      if (typeof a === 'number' && typeof b === 'number') {
        fromNum = a;
        toNum = b;
      }

      if (a instanceof Date && b instanceof Date) {
        fromNum = a.getTime();
        toNum = b.getTime();
        isDate = true;
      }

      if (fromNum != null && toNum != null && fromNum < toNum) {
        const r = Math.floor(nextFractional() * (toNum - fromNum)) + fromNum;
        return isDate ? new Date(r) : r;
      }

      if (Array.isArray(a) && typeof b === 'number') {
        const indices = Array.from({length: a.length}, (_, i) => i);
        const result: unknown[] = [];
        for (let _ = 0; _ < b && indices.length; _++) {
          const i = Math.floor(nextFractional() * indices.length);
          result.push(a[indices[i]]);
          indices.splice(i, 1);
        }
        return result;
      }
    }

    throw new Error(`Bad args: ${JSON.stringify(args)}`);
  };
}
