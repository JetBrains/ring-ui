/* @flow */
import TableSelection from '../table/selection';

import type {ItemType} from './types';

export default class Selection extends TableSelection {
  _buildData(data: ItemType[]): Set<ItemType> {
    return new Set(this._getDescendants(data));
  }

  _buildSelected(data: ItemType[], selected: ItemType[]): Set<ItemType> {
    const _selected = new Set(selected);

    [...data].forEach(item => {
      if (_selected.has(item)) {
        this._selectDescendants(item, _selected);
      }
    });

    return _selected;
  }

  _getDescendants(items: ItemType[]) {
    let result: ItemType[] = [];

    items.forEach(item => {
      result.push(item);
      result = [...result, ...this._getDescendants(this._getChildren(item))];
    });

    return result;
  }

  _getAncestors(item: ItemType) {
    let result: ItemType[] = [];

    const parent = [...this._data].find(it => this._getChildren(it).includes(item));
    if (parent) {
      result = [parent, ...this._getAncestors(parent)];
    }

    return result;
  }

  _selectDescendants(item: ItemType, selected: Set<ItemType>) {
    this._getDescendants(this._getChildren(item)).
      forEach(it => selected.add(it));
  }

  _deselectDescendants(item: ItemType, selected: Set<ItemType>) {
    this._getDescendants(this._getChildren(item)).
      forEach(it => selected.delete(it));
  }

  _selectAncestors(item: ItemType, selected: Set<ItemType>) {
    this._getAncestors(item).forEach(ancestor => {
      const groupIsSelected = this._getChildren(ancestor).
        filter(it => this._isItemSelectable(it)).
        every(it => selected.has(it));

      if (groupIsSelected) {
        selected.add(ancestor);
      }
    });
  }

  _deselectAncestors(item: ItemType, selected: Set<ItemType>) {
    this._getAncestors(item).forEach(it => selected.delete(it));
  }

  select(value: ItemType = this._focused) {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    this._selectDescendants(value, selected);
    this._selectAncestors(value, selected);

    return this.cloneWith({selected});
  }

  deselect(value: ItemType = this._focused) {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.delete(value);

    this._deselectDescendants(value, selected);
    this._deselectAncestors(value, selected);

    return this.cloneWith({selected});
  }
}
