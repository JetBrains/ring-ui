/**
 * Class with default hotkeys navigation actions (e.g. select, clear selection, move up/down)
 * @param {Selection?} tableSelection selection, assosiated with rg-table
 * (if tableSelection is not defined, use method setSelection to configure instance)
 */
var SelectionNavigateActions = function(tableSelection) {
  this._selection = tableSelection;
  this._addSelectionMode = null;
};

SelectionNavigateActions.prototype.setSelection = function(tableSelection) {
  this._selection = tableSelection;
};

SelectionNavigateActions.prototype.moveUp = function () {
  if (!this._selection) {
    return false;
  }
  var activeItem = this._selection.activatePreviousItem();
  return !activeItem;
};

SelectionNavigateActions.prototype.moveDown = function() {
  if (this._selection) {
    var activeItem = this._selection.activateNextItem();
    if (!activeItem) {
      this._selection.setActiveItemIndex(0);
    }
  }
  return false;
};

SelectionNavigateActions.prototype.reset = function () {
  this._addSelectionMode = null;
  return !!this._selection;
};

SelectionNavigateActions.prototype.selectUp = function () {
  if (!this._selection) {
    return false;
  }
  this._changeCheckedItemsArray();
  return this.moveUp();
};

SelectionNavigateActions.prototype.selectDown = function () {
  if (!this._selection) {
    return false;
  }
  this._changeCheckedItemsArray();
  return this.moveDown();
};

SelectionNavigateActions.prototype.selectCurrent = function () {
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
};

SelectionNavigateActions.prototype.clearSelection = function () {
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
};

SelectionNavigateActions.prototype._changeCheckedItemsArray = function() {
  if (!this._selection) {
    return false;
  }
  var activeItem = this._selection.getActiveItem();
  if (activeItem && !this._addSelectionMode) {
    this._addSelectionMode = activeItem.checked ? 'uncheckItem' : 'checkItem';
  }
  this._selection[this._addSelectionMode](activeItem);
};

module.exports = SelectionNavigateActions;
