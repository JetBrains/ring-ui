define(['jquery', 'global/global__views', 'global/global__modules', 'global/global__events'], function ($, View, Module, events) {
  'use strict';
  var ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action',
    ACTIVE_CLASS = 'active',
    DROPDOWN_MIN_RIGHT_MARGIN = 8,
    DROPDOWN_BORDER_WIDTH = 2;

  var $global = $(window),
    $body,
    $popup,
    previousTarget;


  /**
   *  @param config Object
   *    target - DOM element, jQuery, jQuery selector
   *    top - optional
   *    left - optional
   *    width - optional
   */
  var create = function (config) {
    var $target = $(config),
      popup = Module.get('popup'),
      currentTarget,
      sameTarget;

    if (!$target.length) {
      throw new Error('Popup: target is undefined');
    }

    if (!$body) {
      $body = $('body');
    }


    currentTarget = $target.get(0);
    sameTarget = (currentTarget && previousTarget === currentTarget);

    remove();
    if (sameTarget) {
      popup.trigger('show:fail');
      return true;
    }


    previousTarget = currentTarget;

    $popup = $(View.render('popup'));

    $popup.appendTo($body);

    /**
     * @ToDo Extract method
     */


    $popup
      .css(_getAbsCoords($target))
      // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
    /**
     * @ToDo Extract method
     */
      .delegate(ITEM_ACTION_SELECTOR, 'mouseenter.ring-dropdown', function (e) {
        var $target = $(e.currentTarget);

        if ($target.is(events.HOVER_SELECTOR)) {
          events.domEventHandler(e);
        }

        $target
          .addClass(ACTIVE_CLASS)
          .siblings()
          .removeClass(ACTIVE_CLASS);
      });

    popup.trigger('show:done');
    $popup.on('DOMChange', function(e) {
      $(e.target).css(_getAbsCoords($target));
    });
    return $popup;
  };

  var remove = function () {
    if ($popup) {
      $popup.remove();
      $popup = null;

      previousTarget = null;

      Module.get('dropdown').trigger('hide:done');
      return true;
    } else {
      Module.get('dropdown').trigger('hide:fail');
      return false;
    }
  };

  var _getAbsCoords = function ($target) {
    var params,
      config = {};
    if (previousTarget) {
      params = $target.offset();
      var targetWidth = $target.width();

      var dropdownWidth = $popup.width();

      // Right alignment
      if (params.left + dropdownWidth > $global.width() - DROPDOWN_MIN_RIGHT_MARGIN) {
        params.left += targetWidth - dropdownWidth;
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
    return params;
  };

  // Remove on resize
  $global.resize(remove);
  // Public methods
  Module.add('popup', {
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