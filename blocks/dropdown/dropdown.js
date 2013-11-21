define(['jquery', 'global/global__views', 'global/global__modules', 'global/global__utils'], function($, View, Module, utils) {
  'use strict';

  var COMPONENT_SELECTOR = '.ring-js-dropdown';
  var TOGGLE_SELECTOR = '.ring-dropdown-toggle';
  var ITEM_SELECTOR = '.ring-menu__item';
  var INNER_SELECTOR = '.ring-dropdown__i';
  var BOUND_CLASS = 'ring-dropdown_bound';

  var $global = $(window);
  var $body;
  var $dropdown;
  var previousTarget;

  var MIN_RIGHT_PADDING = 8;

  var create = function(data, config) {
    var $target;
    var dropdown = Module.get('dropdown');

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
      $dropdown = $(View.render('dropdown', ''));

      $dropdown.find(INNER_SELECTOR).append(data);
    } else {

      if (typeof data === 'object' && !data.html) {
        data = {items: data};
      }

      if (typeof data === 'string') {
        data = {html: data};
      }

      $dropdown = $(View.render('dropdown', data));
    }

    if (!$body) {
      $body = $('body');
    }

    $dropdown.appendTo($body);

    var params;
    var targetInput = 'input' in config ? config.input : $target && $target.is(':input');

    if (previousTarget) {
      var menuToggle;
      var targetToggle = $target.is(TOGGLE_SELECTOR);
      if (targetToggle && $target.prev().is(ITEM_SELECTOR)) {
        menuToggle = true;
        $target = $target.prev();
      }

      params = $target.offset();
      var targetCenter = params.left + $target.outerWidth() / 2;
      var targetWidth = targetInput ? $target.outerWidth() : $target.width();

      var dropdownWidth = $dropdown.width();
      var dropdownCenter = dropdownWidth / 2;

      // Right aligment
      if (params.left + dropdownWidth > $global.width() - MIN_RIGHT_PADDING) {
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
        params.width = targetWidth;
      }

    } else {
      params = config;
    }

    $dropdown.css(params);

    if (targetInput || $target.attr('contenteditable')) {
      $dropdown.addClass(BOUND_CLASS);
    }

    dropdown.trigger('show:done');
    return false;
  };

  var remove = function() {
    if ($dropdown) {
      $dropdown.remove();
      $dropdown = null;

      previousTarget = null;

      Module.get('dropdown').trigger('hide:done');
      return true;
    } else {
      Module.get('dropdown').trigger('hide:fail');
      return false;
    }
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate('*','click.ring.dropdown', function(e) {
    return create(null, $(e.currentTarget).closest(COMPONENT_SELECTOR));
  });

  // Remove on resize
  $global.resize(remove);

  // Public methods
  Module.add('dropdown', {
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