export default function linearFunction(x0, y0, a) {
  return {
    y(x) {
      return +y0 + (x - x0) * a;
    },

    x(y) {
      return +x0 + (y - y0) / a;
    }
  };
}

export function interpolateLinear(x0, x1, phase) {
  return linearFunction(x0, x0, phase).y(x1);
}

