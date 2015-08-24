require('babel/polyfill');
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
  },

  activateItem: function (item) {
    this.clearActivity();
    item.active = true;
    this.emitEvent('rgTable:activateItem', item, this.items.indexOf(item));
  },

  getActiveItem: function () {
    if (!this.items) {
      return undefined;
    }

    return this.items.find(function (item) {
      return item.active;
    });
  },

  getActiveItemIndex: function () {
    return this.items.indexOf(this.getActiveItem());
  },

  setActiveItemIndex: function (index) {
    var item = this.items[index];
    this.activateItem(item);
  },

  activateNextItem: function () {
    var index = this.items.indexOf(this.getActiveItem());
    if (index >= 0 && index < this.items.length - 1) {
      var newActiveItem = this.items[index + 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  },

  activatePreviousItem: function () {
    var activeItemIndex = this.items.indexOf(this.getActiveItem());
    if (activeItemIndex > 0 && activeItemIndex <= this.items.length - 1) {
      var newActiveItem = this.items[activeItemIndex - 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  },

  clearSelection: function () {
    this.items.forEach(function (item) {
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
    if (item) {
      item.checked = true;
      this.triggerSelectionChanged(item);
    }
  },

  uncheckItem: function (item) {
    if (item) {
      item.checked = false;
      this.triggerSelectionChanged(item);
    }
  },

  toggleCheck: function (item) {
    item.checked = !item.checked;
    this.triggerSelectionChanged(item);
  },

  triggerSelectionChanged: function (item) {
    this.emitEvent('rgTable:selectionChanged', item);
  },

  getCheckedItems: function () {
    return this.items.filter(function (item) {
      return item.checked;
    });
  }
});

module.exports = Selection;
