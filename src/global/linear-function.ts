export interface LinearFunction {
  y(x: number): number;
  x(y: number): number;
}

export default function linearFunction(x0: number, y0: number, a: number): LinearFunction {
  return {
    y(x) {
      return +y0 + (x - x0) * a;
    },

    x(y) {
      return +x0 + (y - y0) / a;
    },
  };
}

export function interpolateLinear(x0: number, x1: number, phase: number) {
  return linearFunction(x0, x0, phase).y(x1);
}
