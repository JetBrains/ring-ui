var filter = require('mout/array/filter');
/*global find:true*/
var find = require('mout/array/find');
var forEach = require('mout/array/forEach');
var indexOf = require('mout/array/indexOf');
var deepMixIn = require('mout/object/deepMixIn');

/**
 * Selection module, catches all selection and activation operations and triggers events
 */

var Selection = function (items, emitEvent) {
  this.items = items;
  this.emitEvent = emitEvent;
};

deepMixIn(Selection.prototype, {
  setItems: function (items) {
    this.items = items;
    this.emitEvent('rgTable:itemsChanged', items);
  },
  activateItem: function (item) {
    this.clearActivity();
    item.active = true;
    this.emitEvent('rgTable:activateItem', item, indexOf(this.items, item));
  },
  getActiveItem: function () {
    return find(this.items, function (item) {
      return item.active;
    });
  },
  getActiveItemIndex: function () {
    return indexOf(this.items, this.getActiveItem());
  },
  setActiveItemIndex: function (index) {
    var item = this.items[index];
    this.activateItem(item);
  },
  activateNextItem: function () {
    var index = indexOf(this.items, this.getActiveItem());
    if (index >= 0 && index < this.items.length - 1) {
      var newActiveItem = this.items[index + 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  },
  activatePreviousItem: function () {
    var activeItemIndex = indexOf(this.items, this.getActiveItem());
    if (activeItemIndex > 0 && activeItemIndex <= this.items.length - 1) {
      var newActiveItem = this.items[activeItemIndex - 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  },
  clearSelection: function () {
    forEach(this.items, function (item) {
      item.checked = false;
    });
  },
  clearActivity: function () {
    var activeItem = this.getActiveItem();
    if (activeItem) {
      activeItem.active = false;
    }
    this.emitEvent('rgTable:activateItem', null);
  },
  checkItem: function (item) {
    item.checked = true;
    this.triggerSelectionChanged(item);
  },
  uncheckItem: function (item) {
    item.checked = false;
    this.triggerSelectionChanged(item);
  },
  toggleCheck: function (item) {
    item.checked = !item.checked;
    this.triggerSelectionChanged(item);
  },
  triggerSelectionChanged: function (item) {
    this.emitEvent('rgTable:selectionChanged', item);
  },
  getCheckedItems: function () {
    return filter(this.items, function (item) {
      return item.checked;
    });
  }
});

module.exports = Selection;
