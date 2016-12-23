export default class Selection {
  _selected = new Set()
  _focused = undefined

  constructor({selected, focused} = {}) {
    if (selected) {
      this._selected = new Set(selected);
    }

    if (focused) {
      this._focused = focused;
    }
  }

  getFocus() {
    return this._focused;
  }

  setFocus(value) {
    return new this.constructor({selected: this._selected, focused: value});
  }

  get size() {
    return this._selected.size;
  }

  has(value) {
    return this._selected.has(value);
  }

  add(value) {
    const focused = this._focused;
    const selected = new Set(this._selected);

    selected.add(value);

    return new this.constructor({selected, focused});
  }

  delete(value) {
    const focused = this._focused;
    const selected = new Set(this._selected);

    selected.delete(value);

    return new this.constructor({selected, focused});
  }

  toggle(value) {
    const focused = this._focused;
    const selected = new Set(this._selected);

    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }

    return new this.constructor({selected, focused});
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
