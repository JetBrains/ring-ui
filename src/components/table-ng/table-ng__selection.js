
var filter = require('mout/array/filter');
var forEach = require('mout/array/forEach');

/*global angular*/

angular.module('Ring.table.selection', [])
  .factory('TableSelection', [function () {

    var Selection = function (items) {
      this.items = items;
    };

    angular.extend(Selection.prototype, {
      setItems: function (items) {
        this.items = items;
      },
      activateItem: function (item) {
        this.clearActivity();
        item.active = true;
      },
      getActiveItem: function () {
        return filter(this.items, function (item) {
          return item.active;
        });
      },
      clearActivity: function () {
        var activeItems = this.getActiveItem();
        forEach(activeItems, function (item) {
          item.active = false;
        });
      },
      getCheckedItems: function () {
        return filter(this.items, function (item) {
          return item.checked;
        });
      }
    });

    return Selection;

  }]);
