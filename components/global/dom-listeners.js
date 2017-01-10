export default class Listeners {
  _all = new Set();

  add(el, event, handler, useCapture) {
    el.addEventListener(event, handler, useCapture);
    const dispatchFn = () => el.removeEventListener(event, handler, useCapture);
    this._all.add(dispatchFn);
    return dispatchFn;
  }

  remove(fn) {
    fn();
    this._all.delete(fn);
  }

  removeAll() {
    this._all.forEach(fn => this.remove(fn));
  }
}
