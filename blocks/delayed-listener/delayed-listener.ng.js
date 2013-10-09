(function () {
    'use strict';

    /**
     * <input type="text" listen-delayed="250"
     *      on-delayed-caret-move="onCaretMove(value,caret)"
     *      on-delayed-change="onValueChange(value,caret)">
     */
    angular.module('Ring.delayed-listener', []).
        directive('listenDelayed', function () {
            return {
                scope: {
                    listenDelayed: '@listenDelayed',
                    onDelayedCaretMove: '&onDelayedCaretMove',
                    onDelayedChange: '&onDelayedChange'
                },
                link: function (scope, iElement, iAttrs) {
                    var timeoutHandler;
                    var lastPolledCaretPosition;
                    var lastTriggeredCaretPosition;
                    var lastPolledValue;
                    var lastTriggeredValue;
                    var pollCaretPosition = function () {
                        var caret = iElement.caret();
                        var value = iElement.val();

                        // If caret position changed during the last tick
                        //   Then save it and wait for the next tick
                        //   Else trigger caret-move-event
                        if (lastPolledCaretPosition !== caret || lastPolledValue !== value) {
                            lastPolledCaretPosition = caret;
                            lastPolledValue = value;
                        } else if (value !== lastTriggeredValue) {
                            lastTriggeredCaretPosition = caret;
                            lastTriggeredValue = value;
                            scope.onDelayedChange({value: value, caret: caret});
                        } else if (caret !== lastTriggeredCaretPosition) {
                            lastTriggeredCaretPosition = caret;
                            lastTriggeredValue = value;
                            scope.onDelayedCaretMove({value: value, caret: caret});
                        }
                    };
                    var startListen = function () {
                        lastTriggeredCaretPosition = undefined;
                        lastPolledCaretPosition = undefined;
                        timeoutHandler = setInterval(pollCaretPosition, scope.listenDelayed || 250);
                    };
                    var stopListen = function () {
                        if (timeoutHandler) {
                            clearInterval(timeoutHandler);
                        }
                    };

                    iElement.bind('focus', function () {
                        startListen();
                    });
                    iElement.bind('blur', function () {
                        stopListen();
                    });
                    if (iElement.is(':focus')) {
                        startListen();
                    }
                }
            };
        });
}());
