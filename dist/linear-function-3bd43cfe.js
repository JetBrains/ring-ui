function linearFunction(x0, y0, a) {
  return {
    y: function y(x) {
      return +y0 + (x - x0) * a;
    },
    x: function x(y) {
      return +x0 + (y - y0) / a;
    }
  };
}
function interpolateLinear(x0, x1, phase) {
  return linearFunction(x0, x0, phase).y(x1);
}

export { interpolateLinear as i, linearFunction as l };
