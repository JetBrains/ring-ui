define(['jquery',  'global/global__modules', 'global/global__views', 'dropdown/dropdown', 'font-icon/font-icon'], function($, Module, View) {
  'use strict';

  var activePath = '';
  var module = 'menu';

  var getActivePath = function(label, part) {
    if (label.indexOf('.') === -1) {
      label = ('left.' || part) + label;
    }
    label += '.active';

    return label;
  };

  // Turn order value into elements order
  var processItems = function(obj, name) {
    var items = [];
    var orderedItems = [];
    var item;

    for (var id in obj) {
      item = obj[id];

      // Save current active path
      if (item.active) {
        activePath = getActivePath(id, name);
      }

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
      data.left = processItems(data.left, 'left');
    }

    if (data.right) {
      data.right = processItems(data.right, 'right');
    }

    return data;
  };

  var setActive = function(label) {
    label = getActivePath(label);

    if (activePath === label) {
      // TODO logging
      return null;
    }

    var update = [module, label, 1];

    if (activePath) {
      update.push(activePath, 0);
    }

    activePath = label;

    View.update.apply(View, update);
  };

  var defaultElement = function() {
    return Module.has('header') ? '.ring-header' : 'body';
  };

  var defaultMethod = function() {
    return Module.has('header') ? 'after' : 'prepend';
  };

  Module.add(module, {
    init: function(data, element, method) {
      return View.init(module, element || defaultElement(), method || defaultMethod(), process, data);
    },
    update: View.update.bind(View, module),
    setActive: setActive
  });
});
