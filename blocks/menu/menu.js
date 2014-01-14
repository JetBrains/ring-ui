define([
  'jquery',
  'global/global__modules',
  'global/global__views',
  'global/global__utils',
  'dropdown/dropdown',
  'font-icon/font-icon'
], function($, Module, View, utils) {
  'use strict';

  var ACTIVE_CLASS = 'ring-menu__item_active';
  var ACTIVE_SELECTOR =  '.' + ACTIVE_CLASS;

  var currentActivePath = '';
  var module = 'menu';

  var getActivePath = function(label, side) {
    var parts = label.split('.');

    if (parts.length === 1) {
      parts.unshift(side || 'left');
    }
    parts.push('active');

    return parts;
  };

  var getActivateSelector = function(parts) {
    var parentElem = parts[0] === 'left' ?  'i' : 'right';

    return '.ring-menu__' + parentElem + ' > .ring-menu__id_' + parts[1];
  };

  var sortByOrder = function(a, b) {
    return a.order - b.order;
  };

  // Turn order value into elements order
  var processItems = function(obj, name) {
    var items = [];
    var orderedItems = [];
    var item;

    for (var id in obj) {
      item = obj[id];

      if (item == null) {
        continue;
      }

      item.key = id;

      // Save current active path
      if (item.active) {
        currentActivePath = getActivePath(id, name).join('.');
      }

      if (item.order) {
        orderedItems.push(item);
      } else {
        items.push(item);
      }
    }

    if (orderedItems.length) {
      items = orderedItems
        .sort(sortByOrder)
        .concat(items);
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
    var parts = getActivePath(label);
    var path = parts.join('.');

    if (currentActivePath === path) {
      utils.log('Menu: trying to set active already active item "' + path + '"');
      return null;
    }

    var update = ['view', path, 1];

    if (currentActivePath) {
      update.push(currentActivePath, 0);
    }

    Module.get(module).update.apply(module, update);
    currentActivePath = path;

    $(ACTIVE_SELECTOR).removeClass(ACTIVE_CLASS);
    $(getActivateSelector(parts)).addClass(ACTIVE_CLASS);
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
    hide: View.hide.bind(View, module),
    show: View.show.bind(View, module),
    setActive: setActive
  });
});
