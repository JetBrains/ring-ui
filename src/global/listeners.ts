// PM = payload map
export type Handler<PM extends Record<string, [unknown, unknown]>, E extends keyof PM> = (
  data: PM[E][0],
) => PM[E][1] | Promise<PM[E][1]>;

export default class Listeners<PM extends Record<string, [unknown, unknown]> = Record<string, [void, unknown]>> {
  _all = new Map<keyof PM, Set<Handler<PM, keyof PM>>>();

  trigger<E extends keyof PM>(...[event, data]: PM[E][0] extends void ? [E] : [E, PM[E][0]]): Promise<PM[E][1][]> {
    const handlers = this._all.get(event);

    if (handlers) {
      return Promise.all([...handlers].map(fn => fn(data)));
    }

    return Promise.resolve([]);
  }

  add<E extends keyof PM>(event: E, handler: Handler<PM, E>) {
    let handlers = this._all.get(event) as Set<Handler<PM, E>> | undefined;

    if (!handlers) {
      handlers = new Set();
      this._all.set(event, handlers as Set<never>);
    }

    handlers.add(handler);
  }

  remove<E extends keyof PM>(event: E, handler: Handler<PM, E>) {
    const handlers = this._all.get(event) as Set<Handler<PM, E>> | undefined;

    if (handlers) {
      handlers.delete(handler);
    }
  }

  removeAll() {
    this._all = new Map();
  }
}
