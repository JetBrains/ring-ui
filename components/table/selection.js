export default class Selection {
  _data = []
  _selected = new Set()
  _focused = null

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

  focus(value) {
    return this.cloneWith({focused: value});
  }

  moveUp() {
    const {_focused: focused, _data: data} = this;

    if (!focused) {
      return this.cloneWith({focused: data[data.length - 1]});
    }

    const nextItem = data[data.indexOf(focused) - 1];
    if (nextItem) {
      return this.cloneWith({focused: nextItem});
    }

    return undefined;
  }

  moveDown() {
    const {_focused: focused, _data: data} = this;

    if (!focused) {
      return this.cloneWith({focused: data[0]});
    }

    const nextItem = data[data.indexOf(focused) + 1];
    if (nextItem) {
      return this.cloneWith({focused: nextItem});
    }

    return undefined;
  }

  select(value = this._focused) {
    if (value) {
      const selected = new Set(this._selected);
      selected.add(value);
      return this.cloneWith({selected});
    } else {
      return this;
    }
  }

  deselect(value = this._focused) {
    if (value) {
      const selected = new Set(this._selected);
      selected.delete(value);
      return this.cloneWith({selected});
    } else {
      return this;
    }
  }

  toggleSelection(value = this._focused) {
    if (value) {
      const selected = new Set(this._selected);

      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }

      return this.cloneWith({selected});
    } else {
      return this;
    }
  }

  selectAll() {
    return this.cloneWith({selected: new Set(this._data)});
  }

  resetFocus() {
    return this.cloneWith({focused: null});
  }

  resetSelection() {
    return this.cloneWith({selected: new Set()});
  }

  reset() {
    return this.resetFocus().resetSelection();
  }

  isFocused(value) {
    return this._focused === value;
  }

  isSelected(value) {
    return this._selected.has(value);
  }

  getFocused() {
    return this._focused;
  }

  getSelected() {
    return new Set(this._selected);
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
