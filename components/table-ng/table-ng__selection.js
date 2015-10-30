import 'core-js/modules/es6.array.find';
import deepMixIn from 'mout/object/deepMixIn';

/**
 * Selection module, catches all selection and activation operations and triggers events
 */

function Selection(items, emitEvent) {
  this.items = items;
  this.emitEvent = emitEvent;
}

deepMixIn(Selection.prototype, {
  setItems: function (items) {
    this.items = items;
    this.emitEvent('rgTable:itemsChanged', items);
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
    const item = this.items[index];
    this.activateItem(item);
  },

  activateNextItem: function () {
    const index = this.items.indexOf(this.getActiveItem());
    if (index >= 0 && index < this.items.length - 1) {
      const newActiveItem = this.items[index + 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  },

  activatePreviousItem: function () {
    const activeItemIndex = this.items.indexOf(this.getActiveItem());
    if (activeItemIndex > 0 && activeItemIndex <= this.items.length - 1) {
      const newActiveItem = this.items[activeItemIndex - 1];
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
    const activeItem = this.getActiveItem();
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
