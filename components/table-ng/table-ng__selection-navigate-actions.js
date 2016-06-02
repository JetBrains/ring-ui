/**
 * Class with default hotkey actions (e.g. select, clear selection, move up/down)
 * @param {Selection?} tableSelection selection associated with rg-table
 * (if tableSelection is not defined, use method setSelection to configure instance)
 */
export default class SelectionNavigateActions {
  constructor(tableSelection) {
    this._selection = tableSelection;
    this._addSelectionMode = null;
  }

  setSelection(tableSelection) {
    this._selection = tableSelection;
  }

  moveUp() {
    if (!this._selection) {
      return false;
    }
    const activeItem = this._selection.activatePreviousItem();

    if (activeItem && activeItem.unselectable) {
      return this.moveUp();
    }

    return !activeItem;
  }

  moveDown() {
    if (this._selection) {
      const activeItem = this._selection.activateNextItem();
      if (!activeItem) {
        this._selection.setActiveItemIndex(0);
      } else if (activeItem.unselectable) {
        return this.moveDown();
      }
    }
    return false;
  }

  reset() {
    this._addSelectionMode = null;
    return !!this._selection;
  }

  selectUp() {
    if (!this._selection) {
      return false;
    }
    this._changeCheckedItemsArray();
    return this.moveUp();
  }

  selectDown() {
    if (!this._selection) {
      return false;
    }
    this._changeCheckedItemsArray();
    return this.moveDown();
  }

  selectCurrent() {
    if (!this._selection) {
      return false;
    }
    const activeItem = this._selection.getActiveItem();
    if (!activeItem) {
      return true;
    } else {
      this._selection.toggleCheck(activeItem);
      return false;
    }
  }

  clearSelection() {
    if (!this._selection) {
      return false;
    }
    const activeItem = this._selection.getActiveItem();

    if (activeItem) {
      if (this._selection.getCheckedItems().length > 0) {
        this._selection.clearSelection();
        return false;
      }

      this._selection.clearActivity();
    }

    return true;
  }

  _changeCheckedItemsArray() {
    if (!this._selection) {
      return false;
    }
    const activeItem = this._selection.getActiveItem();
    if (activeItem && !this._addSelectionMode) {
      this._addSelectionMode = activeItem.checked ? 'uncheckItem' : 'checkItem';
    }
    this._selection[this._addSelectionMode](activeItem);

    return undefined;
  }
}
