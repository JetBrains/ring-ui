/**
 * Schedules a timeout and returns a function that cancels it.
 *
 * Useful from React effects.
 */
export function setTimeoutWithCleanup(callback: () => void, delay: number = 0): () => void {
  let timerId: number | null = window.setTimeout(() => {
    callback();
    timerId = null;
  }, delay);

  return () => {
    if (timerId != null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };
}

/**
 * Schedules an animation frame and returns a function that cancels it.
 *
 * Useful from React effects.
 */
export function requestAnimationFrameWithCleanup(callback: () => void): () => void {
  let rafId: number | null = requestAnimationFrame(() => {
    callback();
    rafId = null;
  });

  return () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
