export default class Selection extends Set {
  _listeners = {
    change: new Set()
  }

  add(value) {
    if (!this.has(value)) {
      super.add(value);
      this._dispatch('change');
    }
    return this;
  }

  delete(value) {
    if (this.has(value)) {
      super.delete(value);
      this._dispatch('change');
      return true;
    } else {
      return false;
    }
  }

  clear() {
    if (this.size) {
      super.clear();
      this._dispatch('change');
    }
  }

  addGroup(group) {
    const newItems = group.filter(item => !this.has(item));
    newItems.forEach(item => super.add(item));
    if (newItems.length) {
      this._dispatch('change');
    }
    return this;
  }

  deleteGroup(group) {
    const existingItems = group.filter(item => this.has(item));
    existingItems.forEach(item => super.delete(item));
    if (existingItems.length) {
      this._dispatch('change');
      return true;
    } else {
      return false;
    }
  }

  on(name, listener) {
    const listeners = this._listeners[name];
    if (listeners) {
      listeners.add(listener);
    }
  }

  off(name, listener) {
    const listeners = this._listeners[name];
    if (listeners) {
      listeners.delete(listener);
    }
  }

  _dispatch(name, ...rest) {
    const listeners = this._listeners[name];
    if (listeners) {
      listeners.forEach(listener => listener(...rest));
    }
  }
}
