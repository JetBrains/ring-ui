define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'popup/popup'
], function ($, View, Module, utils) {
  'use strict';

  var MODULE = 'link-list';
  var COMPONENT_SELECTOR = '.ring-js-link-list';

  var popup = Module.get('popup');
  var $body = $('body');
  var $el;

  var create = function (data) {
    var wrapper = popup('create', data);

    popup('remove');
    dataSource(wrapper.target, data).then(function (data) {
      var $el;
      if (data instanceof $ || utils.isNode(data)) {
        $el = data;
      }
      var $el = $(View.render('dropdown__items', data));
      wrapper.insertHTML(wrapper, $el);
    });
  };

  var remove = function () {
    if ($el) {
      $el.remove();
    }
    popup('remove');
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

  $(document).delegate('*', 'click.ring-dropdown', function (e) {
    var $target = $(e.currentTarget).closest(COMPONENT_SELECTOR);

    if ($target.length) {
      create($target);
      return false;
    }

    e.stopPropagation();
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