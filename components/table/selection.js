export default class Selection {
  _data = []
  _selected = new Set()
  _focused = undefined

  constructor({data, selected, focused} = {}) {
    if (data) {
      this._data = data;
    }

    if (selected) {
      this._selected = new Set(selected);
    }

    if (focused) {
      this._focused = focused;
    }
  }

  cloneWith({data = this._data, selected = this._selected, focused = this._focused}) {
    return new this.constructor({data, selected, focused});
  }

  getFocus() {
    return this._focused;
  }

  setFocus(value) {
    return this.cloneWith({focused: value});
  }

  resetFocus() {
    return this.cloneWith({focused: undefined});
  }

  get size() {
    return this._selected.size;
  }

  has(value) {
    return this._selected.has(value);
  }

  add(value) {
    const selected = new Set(this._selected);
    selected.add(value);
    return this.cloneWith({selected});
  }

  delete(value) {
    const selected = new Set(this._selected);
    selected.delete(value);

    return this.cloneWith({selected});
  }

  toggle(value) {
    const selected = new Set(this._selected);

    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }

    return this.cloneWith({selected});
  }

  getActive() {
    if (this._selected.size) {
      return new Set(this._selected);
    } else if (this._focused) {
      return new Set([this._focused]);
    } else {
      return new Set();
    }
  }
}
