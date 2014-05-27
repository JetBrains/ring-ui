define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'shortcuts/shortcuts',
  'popup/popup',
  'action-list/_action-list.hbs',
  'dropdown/_dropdown__class.hbs',
  'dropdown/_dropdown__items.hbs',
  'dropdown/_dropdown__content.hbs',
  'dropdown/_dropdown__separator.hbs'
], function ($, View, Module, events) {
  'use strict';

  var popup = Module.get('popup'),
    shortcuts = Module.get('shortcuts'),
    uid = 0;

  var MODULE = 'action-list',
    COMPONENT_SELECTOR = '.ring-js-action-list',
    CONTAINER_SELECTOR = '.ring-dropdown_' + MODULE,
    ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action',
    ACTIVE_CLASS = 'active',
    ACTIVE_SELECTOR = '.active';


//  config = {
//    target:DOM,
//    type: [...,...]
//    items: [...]
//    focusTarget bool
//  }
  var init = function (config) {
    var wrapper,
      $el,
      items,
      isActive,
      actionList = Module.get(MODULE);

    var action_ = function () {
      if ($el === null) {
        return false;
      }
      var $active = $el.parent().find(ACTIVE_SELECTOR);

      if ($active.length) {
        var data = $active.data(events.EVENT_DATA_ATTR);

        actionList.trigger('check_' + uid, data && data[0] && data[0].data);

        return false;
      } else {
        return true;
      }
    };

    var getSelectedItemData = function () {
      if ($el === null) {
        return;
      }

      var data = $el.parent().find(ACTIVE_SELECTOR).data(events.EVENT_DATA_ATTR);

      return data && data[0] && data[0].data && data[0].data.data;
    };

    var navigate_ = function (e, key) {
      if ($el === null || isActive && !isActive()) {
        return false;
      }
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

    if (!config) {
      actionList.trigger('init:fail');
      return false;
    }

    if (config.dataSource && typeof config.dataSource === 'function') {
      dataSource = config.dataSource;
    }

    if (!config.items && config.target) {
      $.extend(config, $(config.target).data(MODULE));
    }

    if (config.type && $.isArray(config.type) && config.type.indexOf(MODULE) === -1) {
      config.type.push(MODULE);
    }

    if (config.isActive && typeof config.isActive === 'function') {
      isActive = config.isActive;
    }

    var keys;

    if (config.overrideNavigation) {
      keys = {};
    } else {
      keys = {
        'enter': action_,
        'up': navigate_,
        'down': navigate_
      };
    }
    uid += 1;
    shortcuts('bindList', {
      scope: MODULE
    }, keys);

    shortcuts('pushScope', MODULE);

    actionList.on('check_' + uid, function (data, evt) {
      remove();

      if (!data.error) {
        actionList.trigger('change_' + uid, data, evt);
      }
    });

    if (!config.target || !(config.target instanceof $)) {
      var renderData = $.extend(true, {}, config);

      $.each(renderData.items, function (index, item) {
        var itemData = $.extend(true, {}, item);

        if (!item.hasOwnProperty('action')) {
          item.action = true;
        }

        if (item.event !== false) {
          item.event = item.event || [];
          if (item.event instanceof Array === false) {
            item.event = [item.event];
          }
          item.event = [
            {
              'name': 'action-list:check_' + actionList('getUID'),
              'data': itemData
            }
          ];
        } else {
          item.action = false;
        }
      });

      actionList.trigger('show', config.items);
      $el = $(View.render('action-list', renderData));
      actionList.trigger('init:done_' + uid, $el);
      return $el;
    }
    wrapper = popup('init', config);

    dataSource(config).then(function (data) {
      var renderData = $.extend(true, {}, data);

      items = data.items;

      $.each(renderData.items, function (index, item) {
        var itemData = $.extend(true, {}, item);

        if (!item.hasOwnProperty('action')) {
          item.action = true;
        }

        if (item.event !== false && item.error !== true) {
          item.event = item.event || [];
          item.event.push({
            'name': 'action-list:check_' + actionList('getUID'),
            'data': itemData
          });
        } else {
          item.action = false;
        }

        if (item.error) {
          item.className = (item.className || '') + ' ring-dropdown__item_error';
        }
      });
      $el = $(View.render('action-list', renderData));
      actionList.trigger('show', renderData.items);
      wrapper.insertHTML($el);
      actionList.trigger('init:done_' + uid, $el);
    });

    $el.bind('mouseenter', function (e) {
      events.domEventHandler(e);

      $(e.currentTarget)
        .addClass(ACTIVE_CLASS)
        .siblings()
        .removeClass(ACTIVE_CLASS);
    });

    return {
      popup: wrapper,
      el: $el,
      getSelectedItemData: getSelectedItemData,
      setActive: function () {
        shortcuts('pushScope', MODULE);
      },
      getActiveItem: function () {
        var itemIndex;

        $.each($el, function () {
          if($(this).hasClass('active')) {
            itemIndex = $(this).index();
          }
        });

        return items[itemIndex] || null;
      },
      setActiveItem: function (index) {
        $el.removeClass('active');
        $($el[index]).addClass('active');
      }
    };
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
        target: $target,
        type: ['typed']
      });
      e.stopPropagation();
    } else {
      remove();
    }
  });

  var remove = function () {
    if ($(CONTAINER_SELECTOR).length) {
      shortcuts('spliceScope', MODULE);
      popup('remove');

      return true;
    }
  };

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
    },
    getUID: {
      method: function () {
        return uid;
      },
      override: true
    }
  });
});