function scheduleRAF(trailingCall) {
  var scheduledCb;
  var RAF;
  var trailingCallScheduled = false;

  function doSchedule() {
    RAF = window.requestAnimationFrame(function () {
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

export { scheduleRAF as s };
