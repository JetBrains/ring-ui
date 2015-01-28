
var filter = require('mout/array/filter');
var find = require('mout/array/find');
var forEach = require('mout/array/forEach');
var indexOf = require('mout/array/indexOf');

/*global angular*/

angular.module('Ring.table.selection', [])
  .factory('TableSelection', [function () {

    var Selection = function (items, emitEvent) {
      this.items = items;
      this.emitEvent = emitEvent;
    };

    angular.extend(Selection.prototype, {
      setItems: function (items) {
        this.items = items;
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
        if (index >= 0 && index < this.items.length-1){
          this.activateItem(this.items[index+1]);
        } else {
          this.activateItem(this.items[0]);
        }
      },
      activatePreviousItem: function () {
        var activeItemIndex = indexOf(this.items, this.getActiveItem());
        if (activeItemIndex > 0 && activeItemIndex <= this.items.length-1){
          this.activateItem(this.items[activeItemIndex-1]);
        } else {
          this.activateItem(this.items[this.items.length-1]);
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
      triggerSelectionChanged: function (item) {
        this.emitEvent('rgTable:selectionChanged', item);
      },
      getCheckedItems: function () {
        return filter(this.items, function (item) {
          return item.checked;
        });
      }
    });

    return Selection;

  }]);
