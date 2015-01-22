
var $ = require('jquery');

var Selection = function (onSelectionChanged) {
  this.items = {};
  this.size = 0;
  this.onSelectionChanged = onSelectionChanged;
};

$.extend(Selection.prototype, {
  setItem: function (index, item, value) {
    if (value && !this.items[index]) {
      this.size++;
      this.items[index] = item;
      this.onSelectionChanged();
    } else if (!value && this.items[index]) {
      this.size--;
      delete this.items[index];
      this.onSelectionChanged();
    }
  },
  clear: function () {
    if (this.size === 0) {
      return;
    }
    this.each(function (index, item) {
      if (item && item.checked) {
        item.checked = false;
      }
    });
    this.items = {};
    this.size = 0;
    this.onSelectionChanged();
  },
  isEmpty: function () {
    return this.size === 0;
  },
  each: function (fn) {
    $.each(this.items, fn);
  },
  some: function (fn) {
    return this.getAll().some(fn);
  },
  getAll: function () {
    var allItems = [];
    this.each(function (index, item) {
      allItems.push(item);
    });
    return allItems;
  },
  first: function () {
    for (var index in this.items) {
      if (this.items.hasOwnProperty(index)) {
        return this.items[index];
      }
    }
  }
});

module.exports = Selection;
