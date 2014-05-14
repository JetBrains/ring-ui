define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'jquery-caret'
], function ($, View, Module) {
  'use strict';

  var MODULE = 'delayed-listener';
  var LISTEN_DELAY = 250;

  var init = function (config) {
    var $target = $(config.target);

    var position = {
      lastPolledCaretPosition: {},
      lastTriggeredCaretPosition: {},
      lastPolledValue: {},
      lastTriggeredValue: {}
    };

    var timeoutHandler;

    if (!$target instanceof $) {
      Module.get(MODULE).trigger('init:fail');
    }

    var listenDelay = (config.listenDelay && !isNaN(config.listenDelay)) || LISTEN_DELAY;

    var startListen_ = function () {
      position.lastTriggeredCaretPosition = undefined;
      position.lastPolledCaretPosition = undefined;
      timeoutHandler = setInterval(pollCaretPosition_, listenDelay);
    };

    var stopListen_ = function (timeoutHandler) {
      if (timeoutHandler) {
        clearInterval(timeoutHandler);
      }
    };

    $target.
      bind('focus.' + MODULE, function () {
        startListen_();
        Module.get(MODULE).trigger('focus-change focusin', true);
      }).
      bind('blur. ' + MODULE, function () {
        stopListen_(timeoutHandler);
        Module.get(MODULE).trigger('focus-change focusout', false);
      });

    if ($target.is(':focus')) {
      Module.get(MODULE).trigger('focus-change focusin', true);
      startListen_();
    }

    var pollCaretPosition_ = function () {
      if (!$target.is(':focus')) {
        stopListen_(timeoutHandler);
        return false;
      }
      var caret = $target.caret();
      var value = $target.val() || $target.text();

      // If caret position changed during the last tick
      //   Then save it and wait for the next tick
      //   Else trigger caret-move-event
      if (position.lastPolledCaretPosition !== caret || position.lastPolledValue !== value) {
        position.lastPolledCaretPosition = caret;
        position.lastPolledValue = value;
      } else if (value !== position.lastTriggeredValue) {
        position.lastTriggeredCaretPosition = caret;
        position.lastTriggeredValue = value;
        _onDelayedChange({value: value, caret: caret});
      } else if (caret !== position.lastTriggeredCaretPosition) {
        position.lastTriggeredCaretPosition = caret;
        position.lastTriggeredValue = value;
        _onDelayedCaretMove({value: value, caret: caret});
      }
    };

    var _onDelayedCaretMove = function (data) {
      if (config.onDelayedCaretMove && typeof config.onDelayedCaretMove === 'function') {
        config.onDelayedCaretMove.call(null, data);
      }
      Module.get(MODULE).trigger('change:done', data);
    };

    var _onDelayedChange = function (data) {
      if (config.onDelayedChange && typeof config.onDelayedChange === 'function') {
        config.onDelayedChange.call(null, data);
      }
      Module.get(MODULE).trigger('change:done', data);
    };

    return {
      destroy: function () {
        $target.off(MODULE);
      }
    };
  };

  var placeCaret = function (el) {
    if (!el[0]) {
      return;
    }

    el.focus();

    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      var range = document.createRange();
      range.selectNodeContents(el[0]);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== 'undefined') {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el[0]);
      textRange.collapse(false);
      textRange.select();
    }
  };

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    placeCaret: {
      method: placeCaret,
      override: true
    }
  });
});