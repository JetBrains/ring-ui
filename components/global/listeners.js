export default class Listeners {
  constructor() {
    this.removeAll();
  }

  trigger(event, data) {
    const handlers = this._all.get(event);

    if (handlers) {
      return Promise.all([...handlers].map(fn => fn(data)));
    }

    return Promise.resolve();
  }

  add(event, handler) {
    let handlers = this._all.get(event);

    if (!handlers) {
      handlers = new Set();
      this._all.set(event, handlers);
    }

    handlers.add(handler);
  }

  remove(event, handler) {
    const handlers = this._all.get(event);

    if (handlers) {
      handlers.delete(handler);
    }
  }

  removeAll() {
    this._all = new Map();
  }
}
