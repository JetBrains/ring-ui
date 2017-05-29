export default class Selection {
  _rawData = []
  _data = new Set()
  _selected = new Set()
  _focused = null
  _key = 'id'

  constructor({data, selected, focused, key} = {}) {
    if (data) {
      this._rawData = data;
      this._data = this._buildData(data);
    }

    if (selected) {
      this._selected = new Set(selected);
    }

    if (focused) {
      this._focused = focused;
    }

    if (key) {
      this._key = key;
    }
  }

  _buildData(data) {
    return new Set(data);
  }

  cloneWith({data, selected, focused}) {
    const cloneSelected = () => new Set(data.filter(
      item => [...this._selected].some(it => item[this._key] === it[this._key])
    ));
    const cloneFocus = () => data.filter(
      item => this._focused && item[this._key] === this._focused[this._key]
    )[0];
    const newFocused = focused === undefined ? this._focused : focused;

    return new this.constructor({
      data: data || this._rawData,
      selected: (data && !selected) ? cloneSelected() : selected || this._selected,
      focused: (data && !focused) ? cloneFocus() : newFocused
    });
  }

  focus(value) {
    return this.cloneWith({focused: value});
  }

  moveUp() {
    const {_focused: focused, _data} = this;
    const data = [..._data];

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
    const {_focused: focused, _data} = this;
    const data = [..._data];

    if (!focused) {
      return this.cloneWith({focused: data[0]});
    }

    const nextItem = data[data.indexOf(focused) + 1];
    if (nextItem) {
      return this.cloneWith({focused: nextItem});
    }

    return undefined;
  }

  moveStart() {
    const data = [...this._data];

    if (data.length) {
      return this.cloneWith({focused: data[0]});
    }

    return undefined;
  }

  moveEnd() {
    const data = [...this._data];

    if (data.length) {
      return this.cloneWith({focused: data.pop()});
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
    return this.cloneWith({selected: [...this._data]});
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
