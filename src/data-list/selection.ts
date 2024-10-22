import TableSelection, {CloneWithConfig, SelectionItem} from '../table/selection';

export default class Selection<T extends SelectionItem> extends TableSelection<T> {
  protected _buildData(data: T[]) {
    return new Set(this._getDescendants(data));
  }

  protected _buildSelected(data: Set<T>, selected: Set<T>) {
    const _selected = new Set(selected);

    [...data].forEach(item => {
      if (_selected.has(item)) {
        this._selectDescendants(item, _selected);
      }
    });

    return _selected;
  }

  private _getDescendants(items: readonly T[]) {
    let result: T[] = [];

    items.forEach(item => {
      result.push(item);
      result = [...result, ...this._getDescendants(this._getChildren(item))];
    });

    return result;
  }

  private _getAncestors(item: T) {
    let result: T[] = [];

    const parent = [...this._data].find(it => this._getChildren(it).includes(item));
    if (parent) {
      result = [parent, ...this._getAncestors(parent)];
    }

    return result;
  }

  private _selectDescendants(item: T, selected: Set<T>) {
    this._getDescendants(this._getChildren(item)).forEach(it => selected.add(it));
  }

  private _deselectDescendants(item: T, selected: Set<T>) {
    this._getDescendants(this._getChildren(item)).forEach(it => selected.delete(it));
  }

  private _selectAncestors(item: T, selected: Set<T>) {
    this._getAncestors(item).forEach(ancestor => {
      const groupIsSelected = this._getChildren(ancestor)
        .filter(it => this._isItemSelectable(it))
        .every(it => selected.has(it));

      if (groupIsSelected) {
        selected.add(ancestor);
      }
    });
  }

  private _deselectAncestors(item: T, selected: Set<T>) {
    this._getAncestors(item).forEach(it => selected.delete(it));
  }

  select(value = this._focused): Selection<T> {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    selected.add(value);

    this._selectDescendants(value, selected);
    this._selectAncestors(value, selected);

    return this.cloneWith({selected});
  }

  focus(value: T | null | undefined) {
    return super.focus(value) as Selection<T>;
  }

  resetSelection() {
    return super.resetSelection() as Selection<T>;
  }

  cloneWith(config: CloneWithConfig<T>): Selection<T> {
    return super.cloneWith(config) as Selection<T>;
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
