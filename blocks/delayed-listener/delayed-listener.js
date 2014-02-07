define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils'
], function ($, View, Module) {
  'use strict';

  var $target,
    Config,
    listenDelay,
    delayedListener,
    timeoutHandler,
    lastPolledCaretPosition,
    lastTriggeredCaretPosition,
    lastPolledValue,
    lastTriggeredValue;

  var MODULE = 'delayed-listener';
  var LISTEN_DELAY = 250;

  var init = function (config) {
    $target = $(config.target);
    delayedListener = Module.get(MODULE);

    if (!$target instanceof $) {
      delayedListener.trigger('init:fail');
    }

    listenDelay = (config.listenDelay && !isNaN(config.listenDelay)) || LISTEN_DELAY;
    Config = config;

    $target.
      bind('focus',function () {
        startListen_();
      }).
      bind('blur', function () {
        stopListen_();
      });

    if ($target.is(':focus')) {
      startListen_();
    }

    delayedListener.trigger('init:done');

  };

  var startListen_ = function () {
    lastTriggeredCaretPosition = undefined;
    lastPolledCaretPosition = undefined;
    timeoutHandler = setInterval(pollCaretPosition_, listenDelay);
  };
  var stopListen_ = function () {
    if (timeoutHandler) {
      clearInterval(timeoutHandler);
    }
  };

  var pollCaretPosition_ = function () {
    var caret = $target.caret();
    var value = $target.val();

    // If caret position changed during the last tick
    //   Then save it and wait for the next tick
    //   Else trigger caret-move-event
    if (lastPolledCaretPosition !== caret || lastPolledValue !== value) {
      lastPolledCaretPosition = caret;
      lastPolledValue = value;
    } else if (value !== lastTriggeredValue) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      _onDelayedChange({value: value, caret: caret});
    } else if (caret !== lastTriggeredCaretPosition) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      _onDelayedCaretMove({value: value, caret: caret});
    }
  };

  var _onDelayedCaretMove = function(data) {
    if (Config.onDelayedCaretMove && typeof Config.onDelayedCaretMove === 'function') {
      Config.onDelayedCaretMove.call(null, data);
    }
    delayedListener.trigger('change:done', data);
  };

  var _onDelayedChange = function(data) {
    if (Config.onDelayedChange && typeof Config.onDelayedChange === 'function') {
      Config.onDelayedChange.call(null, data);
    }
    delayedListener.trigger('change:done', data);
  };

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    }
  });
});