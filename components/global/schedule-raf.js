export default function scheduleRAF() {
  let scheduledCb;
  let RAF;
  return function schedule(cb) {
    scheduledCb = cb;
    if (!RAF) {
      RAF = window.requestAnimationFrame(() => {
        scheduledCb();
        RAF = null;
        scheduledCb = null;
      });
    }
  };
}
