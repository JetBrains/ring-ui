var deepMixIn = require('mout/object/deepMixIn');

/**
 * Class with default hotkey actions (e.g. select, clear selection, move up/down)
 * @param {Selection?} tableSelection selection associated with rg-table
 * (if tableSelection is not defined, use method setSelection to configure instance)
 */
var SelectionNavigateActions = function (tableSelection) {
  this._selection = tableSelection;
  this._addSelectionMode = null;
};

deepMixIn(SelectionNavigateActions.prototype, {
  setSelection: function (tableSelection) {
    this._selection = tableSelection;
  },

  moveUp: function () {
    if (!this._selection) {
      return false;
    }
    var activeItem = this._selection.activatePreviousItem();
    return !activeItem;
  },

  moveDown: function () {
    if (this._selection) {
      var activeItem = this._selection.activateNextItem();
      if (!activeItem) {
        this._selection.setActiveItemIndex(0);
      }
    }
    return false;
  },

  reset: function () {
    this._addSelectionMode = null;
    return !!this._selection;
  },

  selectUp: function () {
    if (!this._selection) {
      return false;
    }
    this._changeCheckedItemsArray();
    return this.moveUp();
  },

  selectDown: function () {
    if (!this._selection) {
      return false;
    }
    this._changeCheckedItemsArray();
    return this.moveDown();
  },

  selectCurrent: function () {
    if (!this._selection) {
      return false;
    }
    var activeItem = this._selection.getActiveItem();
    if (!activeItem) {
      return true;
    } else {
      this._selection.toggleCheck(activeItem);
      return false;
    }
  },

  clearSelection: function () {
    if (!this._selection) {
      return false;
    }
    var activeItem = this._selection.getActiveItem();

    if (activeItem && this._selection.items.length >= 0) {
      this._selection.clearSelection();
      return false;
    }

    if (!activeItem) {
      this._selection.setActiveItemIndex(0);
      return false;
    } else {
      this._selection.clearActivity();
      return true;
    }
  },

  _changeCheckedItemsArray: function () {
    if (!this._selection) {
      return false;
    }
    var activeItem = this._selection.getActiveItem();
    if (activeItem && !this._addSelectionMode) {
      this._addSelectionMode = activeItem.checked ? 'uncheckItem' : 'checkItem';
    }
    this._selection[this._addSelectionMode](activeItem);
  }
});

module.exports = SelectionNavigateActions;
