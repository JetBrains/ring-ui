define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'popup/_popup.hbs'
], function ($, View, Module) {
  'use strict';

  var CONTAINER_SELECTOR = '.ring-dropdown__i',
    MENU_ITEM_SELECTOR = '.ring-menu__item',
    TOGGLE_SELECTOR = '.ring-dropdown-toggle',
    WRAPPER_HOVER_CLASS = 'ring-js-hover',
    $global = $(window),
    $body = $('body'),
    $popup,
    DROPDOWN_MIN_RIGHT_MARGIN = 8,
    DROPDOWN_BORDER_WIDTH = 2,
    MODULE = 'popup';

  /**
   *
   * @param config
   * @returns { el: popup jQuery element, getPos: func for position }
   */
  var init = function (config) {
    var $target = $(config.target);

    if (!$target) {
      Module.get(MODULE).trigger('show:fail');
      return false;
    }

    if ($body && !$body.length) {
      $body = $('body');
    }

    remove();
    $popup = $(View.render(MODULE, config)).
      hover(function () {
        $(this).addClass(WRAPPER_HOVER_CLASS);
      },
      function () {
        $(this).removeClass(WRAPPER_HOVER_CLASS);
      });

    return {
      target: $target,
      el: $popup,
      getPos: _getPosition.bind(null, $target, $popup, config),
      insertHTML: insertHTML,
      appendHTML: appendHTML,
      updatePos: updatePos,
      showLoader: showLoader
    };
  };

  var remove = function (onScroll) {
    if ($popup) {
      if (onScroll && $popup.hasClass(WRAPPER_HOVER_CLASS)) {
        return false;
      }
      $popup.remove();
      $popup = null;

      Module.get(MODULE).trigger('hide:done');
    } else {
      Module.get(MODULE).trigger('hide:fail');
    }
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
    } else if (dropdownWidth < targetWidth || config.limitWidth) {
      params.width = targetWidth - DROPDOWN_BORDER_WIDTH;
    }
    return params;
  };

  var insertHTML = function ($el) {
    $body.append(this.el);
    return this.el.
      find(CONTAINER_SELECTOR).
      html($el).
      parent().
      css(this.getPos());
  };

  var showLoader = function () {
    if (!$.contains(document, this.el[0])) {
      $body.append(this.el).find(CONTAINER_SELECTOR).
        parent().
        css(this.getPos());
    }
  };

  var appendHTML = function ($el) {
    if (!$.contains(document, this.el[0])) {
      $body.append(this.el).find(CONTAINER_SELECTOR).empty();
    }
    return this.el.
      find(CONTAINER_SELECTOR).
      empty().
      append($el).
      parent().
      css(this.getPos());
  };

  var updatePos = function() {
    return this.el.css(this.getPos());
  };

  // Remove on resize / scroll
  $global.
    resize(remove).
    scroll(function () {
      remove(true);
    });


  // Public methods
  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    remove: {
      method: remove,
      override: true
    }
  });
});