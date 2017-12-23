export default class Selection {
  constructor({
    data = [],
    selected = new Set(),
    focused = null,
    getKey = item => item.id,
    getChildren = () => [],
    isItemSelectable = () => true
  } = {}) {
    this._rawData = data;
    this._getChildren = getChildren;

    this._data = this._buildData(data);

    this._selected = selected;
    this._focused = focused;
    this._getKey = getKey;
    this._isItemSelectable = isItemSelectable;
  }

  _buildData(data) {
    return new Set(data);
  }

  _buildSelected(data, selected) {
    return new Set(selected);
  }

  cloneWith({data, selected, focused}) {
    const newData = data || this._rawData;

    let newSelected;
    if (data && !selected) {
      newSelected = new Set([...this._buildData(newData)].
        filter(item => [...this._selected].some(it => this._getKey(item) === this._getKey(it))));
      newSelected = this._buildSelected(this._buildData(newData), newSelected);
    } else if (selected) {
      newSelected = selected;
    } else {
      newSelected = this._selected;
    }
    newSelected = new Set([...newSelected].filter(item => this._isItemSelectable(item)));

    const cloneFocus = () => [...this._buildData(data)].filter(
      item => this._focused && this._getKey(item) === this._getKey(this._focused)
    )[0];

    const newFocused = focused === undefined ? this._focused : focused;

    return new this.constructor({
      data: newData,
      selected: newSelected,
      focused: (data && !focused) ? cloneFocus() : newFocused,
      getKey: this._getKey,
      getChildren: this._getChildren,
      isItemSelectable: this._isItemSelectable
    });
  }

  focus(value) {
    return this.cloneWith({focused: value});
  }

  moveUp() {
    const focused = this._focused;
    const data = [...this._data];

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
    const focused = this._focused;
    const data = [...this._data];

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
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);
    return this.cloneWith({selected});
  }

  deselect(value = this._focused) {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.delete(value);
    return this.cloneWith({selected});
  }

  toggleSelection(value = this._focused) {
    if (this.isSelected(value)) {
      return this.deselect(value);
    } else {
      return this.select(value);
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
