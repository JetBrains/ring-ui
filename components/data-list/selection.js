/* @flow */
import TableSelection from '../table/selection';

import type {ItemType} from './types';

export default class Selection extends TableSelection {
  _getItems(items) {
    let result: ItemType[] = [];

    items.forEach(item => {
      result.push(item);

      if (item.items) {
        result = [...result, ...this._getItems(item.items)];
      }
    });

    return result;
  }

  _buildData(data: ItemType[]): Set<ItemType> {
    return new Set(this._getItems(data));
  }

  select(value: ItemType = this._focused) {
    if (!value) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    if (value.items) {
      value.items.forEach(item => {
        selected.add(item);
      });
    }

    const group = this._rawData.find(it => it.items && it.items.includes(value));
    if (group) {
      const groupIsSelected = group.items.
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

    if (value.items) {
      value.items.forEach(item => {
        selected.delete(item);
      });
    }

    const group = this._rawData.find(it => it.items && it.items.includes(value));
    if (group) {
      selected.delete(group);
    }

    return this.cloneWith({selected});
  }
}
