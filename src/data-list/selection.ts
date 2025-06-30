import TableSelection, {CloneWithConfig, SelectionItem, TableSelectionConfig} from '../table/selection';

interface DataListSelectionConfig<T extends SelectionItem> extends TableSelectionConfig<T> {
  partialSelected?: Set<T> | undefined;
}

interface DataListCloneWithConfig<T> extends CloneWithConfig<T> {
  partialSelected?: Set<T> | undefined;
}

export default class Selection<T extends SelectionItem> extends TableSelection<T> {
  protected _partialSelected: Set<T>;

  constructor({partialSelected = new Set(), ...props}: DataListSelectionConfig<T>) {
    super(props);
    this._partialSelected = partialSelected;
  }

  protected _buildData(data: T[]) {
    return new Set(this._getDescendants(data));
  }

  protected _buildSelected(data: Set<T>, selected: Set<T>) {
    const _selected = new Set(selected);

    [...data].forEach(item => {
      if (_selected.has(item)) {
        this._selectDescendants(item, _selected, this._partialSelected);
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

  private _selectDescendants(item: T, selected: Set<T>, partialSelected: Set<T>) {
    this._getDescendants(this._getChildren(item)).forEach(it => {
      selected.add(it);
      partialSelected.delete(it);
    });
  }

  private _deselectDescendants(item: T, selected: Set<T>, partialSelected: Set<T>) {
    this._getDescendants(this._getChildren(item)).forEach(it => {
      selected.delete(it);
      partialSelected.delete(it);
    });
  }

  private _selectAncestors(item: T, selected: Set<T>, partialSelected: Set<T>) {
    this._getAncestors(item).forEach(ancestor => {
      const groupIsSelected = this._getChildren(ancestor)
        .filter(it => this._isItemSelectable(it))
        .every(it => selected.has(it));
      const groupIsPartialSelected = this._getChildren(ancestor)
        .filter(it => this._isItemSelectable(it))
        .some(it => selected.has(it) || partialSelected.has(it));

      if (groupIsSelected) {
        selected.add(ancestor);
        partialSelected.delete(ancestor);
      } else if (groupIsPartialSelected) {
        partialSelected.add(ancestor);
      }
    });
  }

  private _deselectAncestors(item: T, selected: Set<T>, partialSelected: Set<T>) {
    this._getAncestors(item).forEach(ancestor => {
      const groupIsPartialSelected = this._getChildren(ancestor)
        .filter(it => this._isItemSelectable(it))
        .filter(it => it !== item)
        .some(it => selected.has(it) || partialSelected.has(it));

      if (groupIsPartialSelected) {
        partialSelected.add(ancestor);
      } else {
        partialSelected.delete(ancestor);
      }
      selected.delete(ancestor);
    });
  }

  select(value = this._focused): Selection<T> {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    const partialSelected = new Set(this._partialSelected);
    selected.add(value);
    partialSelected.delete(value);

    this._selectDescendants(value, selected, partialSelected);
    this._selectAncestors(value, selected, partialSelected);

    return this.cloneWith({selected, partialSelected});
  }

  isPartialSelected(value: T | null): boolean {
    return value != null && this._partialSelected.has(value);
  }

  focus(value: T | null | undefined) {
    return super.focus(value) as Selection<T>;
  }

  resetSelection() {
    return super.resetSelection() as Selection<T>;
  }

  cloneWith({partialSelected = this._partialSelected, ...rest}: DataListCloneWithConfig<T>): Selection<T> {
    const parentClone = super.cloneWith(rest) as Selection<T>;

    return new (this.constructor as typeof Selection)({
      data: parentClone._rawData,
      selected: parentClone._selected,
      focused: parentClone._focused,
      getKey: parentClone._getKey,
      getChildren: parentClone._getChildren,
      isItemSelectable: parentClone._isItemSelectable,
      partialSelected,
    });
  }

  deselect(value = this._focused) {
    if (!value || !this._isItemSelectable(value)) {
      return this;
    }

    const selected = new Set(this._selected);
    const partialSelected = new Set(this._partialSelected);
    selected.delete(value);
    partialSelected.delete(value);

    this._deselectDescendants(value, selected, partialSelected);
    this._deselectAncestors(value, selected, partialSelected);

    return this.cloneWith({selected, partialSelected});
  }
}
