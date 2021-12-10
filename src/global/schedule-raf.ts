export default function scheduleRAF(trailingCall?: boolean) {
  let scheduledCb: (() => void) | null;
  let RAF: number | null;
  let trailingCallScheduled = false;

  function doSchedule() {
    RAF = window.requestAnimationFrame(() => {
      scheduledCb?.();
      if (trailingCallScheduled) {
        trailingCallScheduled = false;
        doSchedule();
      } else {
        RAF = null;
        scheduledCb = null;
      }
    });
  }

  return function schedule(cb: () => void) {
    scheduledCb = cb;
    if (!RAF) {
      doSchedule();
    } else if (trailingCall) {
      trailingCallScheduled = true;
    }
  };
}
