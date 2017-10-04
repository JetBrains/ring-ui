/* @flow */
import TableSelection from '../table/selection';

import type {ItemType} from './types';

export default class Selection extends TableSelection {
  _buildData(data: ItemType[]): Set<ItemType> {
    const items: Set<ItemType> = new Set();

    data.forEach(group => {
      items.add(group);
      group.items.forEach(item => {
        items.add(item);
      });
    });

    return items;
  }

  select(value: ItemType = this._focused) {
    if (!value) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    if (value.type === 'group') {
      value.items.forEach(item => {
        selected.add(item);
      });
    } else {
      const group = this._rawData.find(it => it.items.includes(value));
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

    if (value.type === 'group') {
      value.items.forEach(item => {
        selected.delete(item);
      });
    } else {
      const group = this._rawData.find(it => it.items.includes(value));
      selected.delete(group);
    }

    return this.cloneWith({selected});
  }
}
