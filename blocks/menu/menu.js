define(['jquery',  'global/global__modules', 'global/global__views', 'dropdown/dropdown', 'font-icon/font-icon'], function($, Module, View) {
  'use strict';

  // Turn order value into elements order
  var processItems = function(obj) {
    var items = [];
    var orderedItems = [];
    var item;

    for (var id in obj) {
      item = obj[id];

      if (item.order) {
        delete item.order;
        orderedItems.push(item);
      } else {
        items.push(item);
      }
    }

    if (orderedItems.length) {
      orderedItems.sort(function(a, b) {
        return a.order - b.order;
      });

      items = orderedItems.concat(items);
    }

    return items;
  };

  var process = function(data) {
    if (data.left) {
      data.left = processItems(data.left);
    }

    if (data.right) {
      data.right = processItems(data.right);
    }

    return data;
  };

  var module = 'menu';

  Module.add(module, {
    init: View.init.bind(View, module, process),
    update: View.update.bind(View, module, process),
    setActive: function() {}
  });

});
