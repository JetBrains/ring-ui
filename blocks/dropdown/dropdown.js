define([
  'jquery',
  'keymage',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils'
], function($, keymage, View, Module, events, utils) {
  'use strict';

  var COMPONENT_SELECTOR = '.ring-js-dropdown';
  var TOGGLE_SELECTOR = '.ring-dropdown-toggle';
  var ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action';
  var MENU_ITEM_SELECTOR = '.ring-menu__item';
  var INNER_SELECTOR = '.ring-dropdown__i';

  var ACTIVE_CLASS = 'active';
  var ACTIVE_SELECTOR = '.active';

  var $global = $(window);
  var $body;
  var $dropdown;
  var previousTarget;

  var DROPDOWN_MIN_RIGHT_MARGIN = 8;
  var DROPDOWN_BORDER_WIDTH = 2;

  var MODULE = 'dropdown';
  var KEYMAGE_PARAMS = {
    preventDefault: true
  };

  var create = function(data, config) {
    var $target;
    var dropdown = Module.get(MODULE);

    if (typeof config === 'object' && !(config instanceof $) && !utils.isNode(config)) {
      $target = config.target;
    } else {
      $target = config;
      config = {};
    }

    if (utils.isNode($target) || typeof $target === 'string') {
      $target = $($target);
    }

    var currentTarget = $target && $target[0];
    var sameTarget = (currentTarget && previousTarget === currentTarget);

    if (!data) {
      data = $target.data('ring-dropdown');
    }

    remove();

    if (!data || sameTarget || !$target && (!config.left || !config.top)) {
      dropdown.trigger('show:fail');
      return true;
    }

    previousTarget = currentTarget;

    if (data instanceof $ || utils.isNode(data)) {
      $dropdown = $(View.render(MODULE, ''));

      $dropdown.find(INNER_SELECTOR).append(data);
    } else {

      if ($.isArray(data)) {
        data = {items: data};
      }

      if (typeof data === 'string') {
        data = {html: data};
      }

      $dropdown = $(View.render(MODULE, data));
    }

    if (!$body) {
      $body = $('body');
    }

    $dropdown.appendTo($body);

    var params;
    var targetInput = typeof data === 'object' && ($.isArray(data.type) && $.inArray(data.type, 'bound') || data.type === 'bound');

    if (previousTarget) {
      var menuToggle;
      var targetToggle = $target.is(TOGGLE_SELECTOR);
      if (targetToggle && $target.prev().is(MENU_ITEM_SELECTOR)) {
        menuToggle = true;
        $target = $target.prev();
      }

      params = $target.offset();
      var targetCenter = params.left + $target.outerWidth() / 2;
      var targetWidth = targetInput ? $target.outerWidth() : $target.width();

      var dropdownWidth = $dropdown.width();
      var dropdownCenter = dropdownWidth / 2;

      // Right aligment
      if (params.left + dropdownWidth > $global.width() - DROPDOWN_MIN_RIGHT_MARGIN) {
        params.left += targetWidth - dropdownWidth;

      // Center aligment on toggle without menu item
      } else if(targetCenter >= dropdownCenter && targetToggle && !menuToggle) {
        params.left = targetCenter - dropdownCenter;
      }

      params.top += $target.outerHeight();

      if (typeof config.left === 'number') {
        params.left = config.left;
      }

      if (typeof config.top === 'number') {
        params.top = config.top;
      }

      if (config.width) {
        params.width = config.width;
      } else if (dropdownWidth < targetWidth) {
        params.width = targetWidth - DROPDOWN_BORDER_WIDTH;
      }

    } else {
      params = config;
    }

    $dropdown
      .css(params)
      // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
      .delegate(ITEM_ACTION_SELECTOR,'mouseenter.ring-dropdown', function(e) {
        var $target = $(e.currentTarget);

        if ($target.is(events.HOVER_SELECTOR)) {
          events.domEventHandler(e);
        }

        $target
          .addClass(ACTIVE_CLASS)
          .siblings()
          .removeClass(ACTIVE_CLASS);
      });

    dropdown.trigger('show:done');
    keymage.pushScope(MODULE);

    return false;
  };

  var remove = function() {
    if ($dropdown) {
      $dropdown.remove();
      $dropdown = null;

      previousTarget = null;

      Module.get(MODULE).trigger('hide:done');
      keymage.popScope(MODULE);

      return true;
    } else {
      Module.get(MODULE).trigger('hide:fail');
      return false;
    }
  };

  var navigate = function(up) {
    var $active = $dropdown.find(ACTIVE_SELECTOR);
    var $next = $active[up ? 'prev' : 'next']();

    $active.removeClass(ACTIVE_CLASS);

    if ($next.length) {
      $next.addClass(ACTIVE_CLASS);
    } else {
      $dropdown.find(ITEM_ACTION_SELECTOR)[up ? 'last' : 'first']().addClass(ACTIVE_CLASS);
    }
  };

  var action = function() {
    $dropdown.find(ACTIVE_SELECTOR).click();
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate('*','click.ring-dropdown', function(e) {
    var $target = $(e.currentTarget).closest(COMPONENT_SELECTOR);

    if ($target.length) {
      return create(null, $target);
    } else {
      remove();
    }
  });

  // Remove on resize
  $global.resize(remove);

  // Bind keys
  keymage(MODULE, 'esc', remove);
  keymage(MODULE, 'enter', action);
  keymage(MODULE, 'up', navigate.bind(null, true), KEYMAGE_PARAMS);
  keymage(MODULE, 'down', navigate.bind(null, false), KEYMAGE_PARAMS);


  // Public methods
  Module.add(MODULE, {
    show: {
      method: create,
      override: true
    },
    hide: {
      method: remove,
      override: true
    }
  });
});