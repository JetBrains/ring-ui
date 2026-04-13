// Animate via a fragment of an ascending sine wave

// eslint-disable-next-line prettier/prettier, no-magic-numbers
const xFrom = -0.5 * Math.PI / 2;
const xTo = Math.PI / 2;
const yFrom = Math.sin(xFrom);
const yTo = Math.sin(xTo);

export function animateDate(
  initial: number | Date,
  target: number | Date,
  onUpdate: (date: Date) => void,
  // eslint-disable-next-line no-magic-numbers
  durationMs = 120,
) {
  let requestId: number | null = null;
  const startTime = performance.now();

  function frame(now: number) {
    const durationFraction = (now - startTime) / durationMs;
    // eslint-disable-next-line no-magic-numbers
    if (durationFraction >= 0.97) {
      onUpdate(new Date(target));
      requestId = null;
      return;
    }

    const x = xFrom + (xTo - xFrom) * durationFraction;
    const y = Math.sin(x);
    const yFraction = (y - yFrom) / (yTo - yFrom);
    const value = Number(initial) + (Number(target) - Number(initial)) * yFraction;
    onUpdate(new Date(value));

    requestId = requestAnimationFrame(frame);
  }

  requestId = requestAnimationFrame(frame);

  return () => {
    if (requestId != null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };
}
