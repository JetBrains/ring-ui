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
        link: function (scope, iElement) {
          var delayedListener = ring('delayed-listener');

          delayedListener('init', {
            target: $(iElement),
            listenDelay: scope.listenDelayed,
            onDelayedChange: function (data) {
              scope.onDelayedChange(data.value, data.caret);
            },
            onDelayedCaretMove: function (data) {
              scope.onDelayedCaretMove(data.value, data.caret);
            }
          });
        }
      };
    });
}());
