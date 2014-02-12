define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'shortcuts/shortcuts',
  'popup/popup'
], function ($, View, Module, events) {
  'use strict';

  var $target,
    $el,
    items,
    popup = Module.get('popup'),
    shortcuts = Module.get('shortcuts'),
    actionList;

  var MODULE = 'action-list',
    COMPONENT_SELECTOR = '.ring-js-action-list',
    ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action',
    ACTIVE_CLASS = 'active',
    ACTIVE_SELECTOR = '.active';

  var create = function (data, config) {
    if(data.type) {
      config.data =  { type: data.type };
    }
    var wrapper = popup('create', config);
    actionList = Module.get(MODULE);

    shortcuts('pushScope', MODULE);

    if (!$target instanceof $) {
      actionList.trigger('init:fail');
    }
    dataSource(wrapper.target, data).then(function (data) {
      if (config.data) {
        $.extend(data, config.data);
      }
      items = data.items;
      $el = $(View.render('action-list', data));

      wrapper.insertHTML(wrapper, $el);


    });

    actionList.trigger('init:done');

    $el.bind('mouseenter', function (e) {
      events.domEventHandler(e);

      $(e.currentTarget)
        .addClass(ACTIVE_CLASS)
        .siblings()
        .removeClass(ACTIVE_CLASS);
    });

    return $el;
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

  var remove = function () {
    if ($el) {
      $el.remove();
    }
    popup('remove');
  };

  var action_ = function () {
    var $active = $el.parent().find(ACTIVE_SELECTOR);

    if ($active.length) {
      actionList.trigger('action', (items[$el.parent().find(ITEM_ACTION_SELECTOR).index($active)] || false));
      return false;
    } else {
      return true;
    }
  };

  var navigate_ = function (e, key) {
    var up = (key === 'up'),
      $active = $el.parent().find(ITEM_ACTION_SELECTOR + ACTIVE_SELECTOR),
      $next = $active[up ? 'prev' : 'next'](ITEM_ACTION_SELECTOR);

    $active.removeClass(ACTIVE_CLASS);

    if ($next.length) {
      $next.addClass(ACTIVE_CLASS);
    } else {
      $el.parent().find(ITEM_ACTION_SELECTOR)[up ? 'last' : 'first']().addClass(ACTIVE_CLASS);
    }

    return false;
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
    } else {
      shortcuts('popScope', MODULE);
    }

    e.stopPropagation();
  });

  shortcuts('bindList', {
    scope: MODULE
  }, {
    'esc': remove,
    'enter': action_,
    'tab': action_,
    'up': navigate_,
    'down': navigate_
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