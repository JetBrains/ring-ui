define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'shortcuts/shortcuts',
  'popup/popup'
], function ($, View, Module) {
  'use strict';

  var $target,
    $el,
    popup = Module.get('popup'),
    actionList;

  var MODULE = 'action-list';
  var COMPONENT_SELECTOR = '.ring-js-action-list';

  var create = function (data, config) {
    var wrapper = popup('create', config);
    actionList = Module.get(MODULE);

    if (!$target instanceof $) {
      actionList.trigger('init:fail');
    }
    dataSource(wrapper.target, data).then(function (data) {
      if (config.data) {
        $.extend(data, config.data);
      }
      $el = $(View.render('action-list', data));
      wrapper.insertHTML(wrapper, $el);
    });

    actionList.trigger('init:done');

  };

  var dataSource = function (target, data) {
    var dfd = $.Deferred();

    if (!data) {
      data = target.data('action-list');
    }

    if ($.isArray(data)) {
      data = {items: data};
    }

    dfd.resolve(data);

    return dfd.promise();
  };

  $(document).delegate('*', 'click.ring-js-action-list', function (e) {
    var $target = $($(e.currentTarget).closest(COMPONENT_SELECTOR));

    if ($target.length) {
      create(null, {
        target: $target,
        data: {
          type: ['typed']
        }
      });
      return false;
    }

    e.stopPropagation();
  });

  Module.add(MODULE, {
    create: {
      method: create,
      override: true
    },
    dataSource: {
      method: dataSource,
      override: true
    }
  });
});