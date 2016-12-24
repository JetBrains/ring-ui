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
