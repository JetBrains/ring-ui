import TableSelection from '../table/selection';


export default class Selection extends TableSelection {
  _buildData(data) {
    return new Set(this._getDescendants(data));
  }

  _buildSelected(data, selected) {
    const _selected = new Set(selected);

    [...data].forEach(item => {
      if (_selected.has(item)) {
        this._selectDescendants(item, _selected);
      }
    });

    return _selected;
  }

  _getDescendants(items) {
    let result = [];

    items.forEach(item => {
      result.push(item);
      result = [...result, ...this._getDescendants(this._getChildren(item))];
    });

    return result;
  }

  _getAncestors(item) {
    let result = [];

    const parent = [...this._data].find(it => this._getChildren(it).includes(item));
    if (parent) {
      result = [parent, ...this._getAncestors(parent)];
    }

    return result;
  }

  _selectDescendants(item, selected) {
    this._getDescendants(this._getChildren(item)).
      forEach(it => selected.add(it));
  }

  _deselectDescendants(item, selected) {
    this._getDescendants(this._getChildren(item)).
      forEach(it => selected.delete(it));
  }

  _selectAncestors(item, selected) {
    this._getAncestors(item).forEach(ancestor => {
      const groupIsSelected = this._getChildren(ancestor).
        filter(it => this._isItemSelectable(it)).
        every(it => selected.has(it));

      if (groupIsSelected) {
        selected.add(ancestor);
      }
    });
  }

  _deselectAncestors(item, selected) {
    this._getAncestors(item).forEach(it => selected.delete(it));
  }

  select(value = this._focused) {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    this._selectDescendants(value, selected);
    this._selectAncestors(value, selected);

    return this.cloneWith({selected});
  }

  deselect(value = this._focused) {
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
