define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'popup/popup'
], function ($, View, Module) {
  'use strict';

  var MODULE = 'link-list';
  var COMPONENT_SELECTOR = '.ring-js-link-list';

  var popup = Module.get('popup');
  var $el;

  var create = function (data, config) {
    var wrapper = popup('create', config);

    dataSource(wrapper.target, data).then(function (data) {
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

  var dataSource = function ($target, data) {
    var dfd = $.Deferred();

    if (!data) {
      data = $target.data('ring-dropdown');
    }

    if ($.isArray(data)) {
      data = {items: data};
    }

    if (typeof data === 'string') {
      data = {html: data};
    }

    dfd.resolve(data);
    return dfd.promise();
  };

  $(document).delegate('*', 'click' + COMPONENT_SELECTOR, function (e) {
    var $target = $(e.currentTarget).closest(COMPONENT_SELECTOR);

    if ($target.length) {
      create(null, $target);
      e.stopPropagation();
    } else {
      remove();
    }
  });

  Module.add(MODULE, {
    create: {
      method: create,
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