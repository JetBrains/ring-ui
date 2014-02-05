define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils'
], function ($, View, Module, events, utils) {
  'use strict';

  var ROOT_SELECTOR = '.ring-dropdown';
  var MENU_ITEM_SELECTOR = '.ring-menu__item';
  var TOGGLE_SELECTOR = '.ring-dropdown-toggle';

  var $global = $(window);
  var $body = $('body');
  var $popup;

  var DROPDOWN_MIN_RIGHT_MARGIN = 8;
  var DROPDOWN_BORDER_WIDTH = 2;
  var MODULE = 'popup';

  /**
   *
   * @param config
   * @returns { el: popup jQuery element, getPos: func for position }
   */
  var create = function (config) {
    var $target = _setTarget(config);
    var dropdown = Module.get(MODULE);

    if (!$target) {
      dropdown.trigger('show:fail');
      return false;
    }

    remove();
    $popup = $(View.render(MODULE, ''));

    return {
      target: $target,
      el: $popup,
      getPos: _getPosition.bind(null, $target, $popup, config),
      insertHTML: insertHTML
    };
  };

  var remove = function () {
    if ($popup) {
      $popup.remove();
      $popup = null;

      Module.get(MODULE).trigger('hide:done');
    } else {
      Module.get(MODULE).trigger('hide:fail');
    }
  };

  /**
   * Get target element from config object
   * @param config
   * @returns jQuery element of target
   */
  var _setTarget = function (config) {
    var target;
    if (typeof config === 'object' && !(config instanceof $) && !utils.isNode(config)) {
      target = config.target;
    } else {
      target = config;
    }

    if (utils.isNode(target) || typeof target === 'string') {
      target = $(target);
    }
    return target;
  };

  /**
   * @param $target target DOM element
   * @param $popup jQuery popup element
   * @param config Optional css coords {top:X, left: Y}
   * @returns {Objetct} css coords
   */
  var _getPosition = function ($target, $popup, config) {
    var params,
      menuToggle,
      targetToggle,
      targetCenter,
      targetWidth,
      dropdownWidth,
      dropdownCenter;

    targetToggle = $target.is(TOGGLE_SELECTOR);
    if (targetToggle && $target.prev().is(MENU_ITEM_SELECTOR)) {
      menuToggle = true;
      $target = $target.prev();
    }

    params = $target.offset();
    targetCenter = params.left + $target.outerWidth() / 2;
    targetWidth = $target.outerWidth();

    dropdownWidth = $popup.width();
    dropdownCenter = dropdownWidth / 2;

    // Right aligment
    if (params.left + dropdownWidth > $global.width() - DROPDOWN_MIN_RIGHT_MARGIN) {
      params.left += targetWidth - dropdownWidth;

      // Center aligment on toggle without menu item
    } else if (targetCenter >= dropdownCenter && targetToggle && !menuToggle) {
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
    return params;
  };

  var insertHTML = function (wrapper, $el) {
    $body.append(wrapper.el);
    return wrapper.el.
      html($el).
      css(wrapper.getPos());
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate('*', 'click.ring-dropdown', function (e) {
    /**
     * @desc Close popup by click on non-popup child
     */
    if (!$(e.currentTarget).closest(ROOT_SELECTOR).length) {
      remove();
    }
    e.stopPropagation();
  });

  // Remove on resize
  $global.resize(remove);

  // Public methods
  Module.add(MODULE, {
    create: {
      method: create,
      override: true
    },
    remove: {
      method: remove,
      override: true
    }
  });
});