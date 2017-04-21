/* @flow */
/* global $Keys: false */
export default class Selection<T: {}> {
  _data: T[] = [];
  _selected: Set<T> = new Set();
  _focused: T;
  _key: string = 'id';

  constructor({data, selected, focused, key}: {data?: T[], selected?: Set<T>, focused?: T | null, key?: $Keys<T>} = {}) {
    if (data) {
      this._data = data;
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

  cloneWith({data, selected, focused}: {data?: T[], selected?: Set<T>, focused?: T | null}): Selection<T> {
    /* eslint-disable no-shadow */
    const cloneSelected = data => new Set(data.filter(item => [...this._selected].some(it => item[this._key] === it[this._key])));
    const cloneFocus = data => data.filter(item => this._focused && item[this._key] === this._focused[this._key])[0];
    const newFocused = focused === undefined ? this._focused : focused;
    /* eslint-enable no-shadow */

    return new this.constructor({
      data: data || this._data,
      selected: (data && !selected) ? cloneSelected(data) : selected || this._selected,
      focused: (data && !focused) ? cloneFocus(data) : newFocused
    });
  }

  focus(value: any): Selection<T> {
    return this.cloneWith({focused: value});
  }

  moveUp(): Selection<T> | void {
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

  moveDown(): Selection<T> | void {
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

  select(value: any = this._focused): Selection<T> {
    if (value) {
      const selected = new Set(this._selected);
      selected.add(value);
      return this.cloneWith({selected});
    } else {
      return this;
    }
  }

  deselect(value: any = this._focused): Selection<T> {
    if (value) {
      const selected = new Set(this._selected);
      selected.delete(value);
      return this.cloneWith({selected});
    } else {
      return this;
    }
  }

  toggleSelection(value: any = this._focused): Selection<T> {
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

  selectAll(): Selection<T> {
    return this.cloneWith({selected: new Set(this._data)});
  }

  resetFocus(): Selection<T> {
    return this.cloneWith({focused: null});
  }

  resetSelection(): Selection<T> {
    return this.cloneWith({selected: new Set()});
  }

  reset(): Selection<T> {
    return this.resetFocus().resetSelection();
  }

  isFocused(value: any): boolean {
    return this._focused === value;
  }

  isSelected(value: any): boolean {
    return this._selected.has(value);
  }

  getFocused(): any {
    return this._focused;
  }

  getSelected(): Set<any> {
    return new Set(this._selected);
  }

  getActive(): Set<any> {
    if (this._selected.size) {
      return new Set(this._selected);
    } else if (this._focused) {
      return new Set([this._focused]);
    } else {
      return new Set();
    }
  }
}
