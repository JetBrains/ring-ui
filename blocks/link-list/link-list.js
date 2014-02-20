define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__utils',
  'popup/popup'
], function ($, View, Module, utils) {
  'use strict';

  var MODULE = 'link-list',
    COMPONENT_SELECTOR = '.ring-js-link-list',
    popup = Module.get('popup'),
    $el;

  var init = function (config) {
    var linkList = Module.get(MODULE),
      wrapper;

    if (!config) {
      utils.log('Action-list: params missing');
      linkList.trigger('init:fail');
      return false;
    }

    if (!config.items && config.target) {
      $.extend(config, $(config.target).data(MODULE));
    }

    if (!config.target || !(config.target instanceof $)) {
      return $(View.render('dropdown__items', config));
    }

    wrapper = popup('init', config);

    dataSource(config).then(function (data) {
      $el = $(View.render('dropdown__items', data));
      wrapper.insertHTML(wrapper, $el);
    });

    return $el;
  };

  var remove = function () {
    if ($el) {
      $el.remove();
      $el = null;
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
        target:$target
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