export default function scheduleRAF(trailingCall) {
  let scheduledCb;
  let RAF;
  return function schedule(cb) {
    scheduledCb = cb;
    if (!RAF || trailingCall) {
      cancelAnimationFrame(RAF);
      RAF = window.requestAnimationFrame(() => {
        scheduledCb();
        RAF = null;
        scheduledCb = null;
      });
    }
  };
}
