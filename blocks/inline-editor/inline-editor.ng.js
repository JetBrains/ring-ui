(function () {
  "use strict";

  angular.module("Ring.inline-editor", []).
  /**
   * <inline-editor ng-model="entity.field" on-apply="onApply(value)"></inline-editor>
   *
   * Content editable based inline editor.
   * Starts editing on text dblclick or pencil button click.
   * Applies changes on Enter / Ctrl+Enter or blur.
   * Cancels changes on Esc.
   * On apply invokes value of on-apply attribute.
   * If multiline attribute is true
   */
    directive("inlineEditor", [function () {
      return {
        restrict: "E",
        scope: {
          onApply: "&",
          isMultiLine: "&multiline",
          placeholder: "&",
          ngDisabled: "="
        },
        templateUrl: "inline-editor/inline-editor.ng.html",
        controller: ["$scope", function ($scope) {
          var ctrl = this;
          var input, ngModelCtrl;

          ctrl.setNgModelCtrl = function (ctrl) {
            ngModelCtrl = ctrl;

            ngModelCtrl.$render = function () {
              input.text(ngModelCtrl.$viewValue);
            };
          };

          ctrl.registerInput = function (iElement) {
            input = iElement;
          };

          $scope.editMode = false;
          $scope.isEmpty = function () {
            return !ngModelCtrl.$viewValue;
          };

          $scope.setEditMode = function (value) {
            $scope.editMode = value;
            if (value) {
              input.attr("contenteditable", value);
              if ($scope.isMultiLine()) {
                input.css("display", "block");
              }
              if (!ngModelCtrl.$viewValue) {
                // We can't put a focus to an empty html. So we
                // 1. Add empty char
                // 2. Put the focus
                // ...
                input.html("&#8203;");
              }
              input.focus();
              input.caret(-1);
              if (!ngModelCtrl.$viewValue) {
                // ...
                // 3. Remove the empty char
                input.html("");
              }
            } else {
              if ($scope.isMultiLine()) {
                input.css("display", "inline");
              }
              input.removeAttr("contenteditable");
            }
          };

          $scope.apply = function () {
            if ($scope.editMode) {
              // Use .html() to avoid line-breaks eating that is done by .text()
              var value = input.html().trim()
                .replace(/<br\s*\/*>/ig, "\n") // replace single line-breaks
                .replace(/(<(p|div))/ig, "\n$1") // add a line break before all div and p tags
                .replace(/(<([^>]+)>)/ig, "");

              ngModelCtrl.$setViewValue(value);
              $scope.setEditMode(false);
              $scope.onApply({value: value});
            }
          };

          $scope.reset = function () {
            input.text(ngModelCtrl.$viewValue);
            $scope.setEditMode(false);
          };

          $scope.inputKey = function ($event) {
            if ($scope.editMode) {
              if ($event.keyCode === 27) {
                // Esc
                $scope.reset();
                $event.stopPropagation();
                $event.preventDefault();
              } else if ($event.keyCode === 13 && ($event.ctrlKey || $event.metaKey || !$scope.isMultiLine())) {
                // Enter
                $scope.apply();
                $event.stopPropagation();
                $event.preventDefault();
              }
            }
          };
        }],
        require: ["ngModel", "inlineEditor"],
        link: function (scope, iElement, iAttrs, ctrls) {
          var ngModelCtrl = ctrls[0];
          var inlineEditorCtrl = ctrls[1];
          inlineEditorCtrl.setNgModelCtrl(ngModelCtrl);
        }
      };
    }]).
    directive("ringInlineEditorInput", [function () {
      return {
        restrict: "C",
        require: "^inlineEditor",
        link: function (scope, iElement, iAttrs, inlineEditorCtrl) {
          inlineEditorCtrl.registerInput(iElement);
        }
      };
    }]);
})();