define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'popup/popup',
  'shortcuts/shortcuts'
], function ($, View, Module) {
  'use strict';

  var MODULE = 'dropdown-menu',
    COMPONENT_SELECTOR = '.ring-js-dropdown-menu',
    popup = Module.get('popup'),
    shortcuts = Module.get('shortcuts'),
    $el;

  var init = function (config) {
    var linkList = Module.get(MODULE),
      wrapper;

    if (!config) {
      linkList.trigger('init:fail');
      return false;
    }

    if (!config.items && config.target) {
      var domData = $(config.target).data(MODULE);
      if ($.isArray(domData)) {
        domData = {items: domData};
      }
      $.extend(config, domData);
    }

    if (!config.target || !(config.target instanceof $)) {
      return $(View.render('dropdown__items', config));
    }

    shortcuts('bindList', {
      scope: MODULE
    }, {
      'esc': function () {
        remove();
      }
    });

    shortcuts('pushScope', MODULE);

    $.extend(config, {type: 'menu'});
    wrapper = popup('init', config);

    dataSource(config).then(function (data) {
      $el = $(View.render('dropdown__items', data));
      wrapper.insertHTML($el);
    });

    return $el;
  };

  var remove = function () {
    if ($el) {
      $el.remove();
      $el = null;
      shortcuts('popScope', MODULE);
      popup('remove');
    }
  };

  var dataSource = function (data) {
    var dfd = $.Deferred();

    dfd.resolve(data);

    return dfd.promise();
  };

  $(document).delegate('*', 'click' + COMPONENT_SELECTOR, function (e) {
    var $target = $(e.currentTarget).closest(COMPONENT_SELECTOR);

    if ($target.length) {
      init({
        target: $target
      });
      e.stopPropagation();
    } else {
      remove();
    }
  });

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    remove: {
      method: remove,
      override: true
    },
    dataSource: {
      method: dataSource,
      override: true
    }
  });
});