(function () {
  "use strict";

  angular.module("Ring.focus", []).
    directive("focusBind", ["$parse", function ($parse) {
      return {
        link: function (scope, iElement, iAttrs) {
          var focusModel = $parse(iAttrs.focusBind);

          function focusSetter(value) {
            return function () {
              if (focusModel(scope) !== value && typeof focusModel.assign === "function") {
                if (scope.$root.$$phase) {
                  focusModel.assign(scope, value);
                } else {
                  scope.$apply(function () {
                    focusModel.assign(scope, value);
                  });
                }
              }
            };
          }

          iElement.bind("focus", focusSetter(true));
          iElement.bind("blur", focusSetter(false));

          scope.$watch(iAttrs.focusBind, function (value) {
            if (value !== undefined && value !== iElement.is(":focus")) {
              if (value) {
                iElement.focus();
              } else {
                iElement.blur();
              }
            }
          });
        }
      };
    }]);
})();