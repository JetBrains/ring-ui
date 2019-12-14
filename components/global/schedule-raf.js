export default function scheduleRAF(trailingCall) {
  let scheduledCb;
  let RAF;
  let trailingCallScheduled = false;

  function doSchedule() {
    RAF = window.requestAnimationFrame(() => {
      scheduledCb();
      if (trailingCallScheduled) {
        trailingCallScheduled = false;
        doSchedule();
      } else {
        RAF = null;
        scheduledCb = null;
      }
    });
  }

  return function schedule(cb) {
    scheduledCb = cb;
    if (!RAF) {
      doSchedule();
    } else if (trailingCall) {
      trailingCallScheduled = true;
    }
  };
}
