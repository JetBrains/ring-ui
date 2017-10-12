/* @flow */
import TableSelection from '../table/selection';

import type {ItemType} from './types';

export default class Selection extends TableSelection {
  _itemsTraversal(items: ItemType[]) {
    let result: ItemType[] = [];

    items.forEach(item => {
      result.push(item);
      result = [...result, ...this._itemsTraversal(this._getChildren(item))];
    });

    return result;
  }

  _buildData(data: ItemType[]): Set<ItemType> {
    return new Set(this._itemsTraversal(data));
  }

  select(value: ItemType = this._focused) {
    if (!value) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    this._itemsTraversal(this._getChildren(value)).forEach(item => {
      selected.add(item);
    });

    const group = this._rawData.find(it => this._getChildren(it).includes(value));
    if (group) {
      const groupIsSelected = this._getChildren(group).
        filter(it => this._isItemSelectable(it)).
        every(it => selected.has(it));

      if (groupIsSelected) {
        selected.add(group);
      }
    }

    return this.cloneWith({selected});
  }

  deselect(value: ItemType = this._focused) {
    if (!value) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.delete(value);

    this._itemsTraversal(this._getChildren(value)).forEach(item => {
      selected.delete(item);
    });

    const group = this._rawData.find(it => this._getChildren(it).includes(value));
    if (group) {
      selected.delete(group);
    }

    return this.cloneWith({selected});
  }
}
