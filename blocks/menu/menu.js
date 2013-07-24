define(['jquery',  'global/global__modules', 'global/global__views'], function($, Module, View) {
  'use strict';

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

  Module.add('menu', {
    'init': function(data) {

      View.update('menu', process(data));
    }
  });

});
