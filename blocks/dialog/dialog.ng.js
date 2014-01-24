(function () {
  'use strict';
  var shortcuts = ring('shortcuts');
  var DIALOG_KEY_SCOPE = 'dialog';

  angular.module('Ring.dialog', []).
    directive('dialog', [function () {
      return {
        'restrict': 'AE',
        'scope': true,
        'replace': true,
        'templateUrl': 'dialog/dialog.ng.html',
        'controller': ['$scope', 'dialog', function ($scope, dialog) {
          $scope.close = function () {
            dialog.hide();
          };
          $scope.action = function (button) {
            var dontClose = false;
            if (button.action) {
              dontClose = button.action($scope.data, button, function (errorMessage) {
                $scope.error = errorMessage;
              }) === false;
            }
            if (!dontClose && (button.close !== false)) {
              dialog.hide();
            }
          };
          this.setTitle = function (title) {
            $scope.title = title;
          };
          dialog.register($scope);

          shortcuts('bindList', {scope: DIALOG_KEY_SCOPE}, {
            'esc': function() {
              $scope.close();
              $scope.$apply();
            },
            'enter': function() {
              $scope.buttons.every(function(button) {
                if (button['default'] && $scope.dialogForm.$valid) {
                  $scope.action(button);
                  $scope.$apply();
                  return false;
                }
              });
            }
          });
        }],
        // Focus first input
        'link': function (scope, iElement) {
          scope.$on('$includeContentLoaded', function() {
            iElement.find(':input,[contentEditable=true]').first().focus();
          });
        }
      };
    }]).
    directive('dialogTitle', [function () {
      return {
        'require': '^dialog',
        'link': function (scope, iElement, iAttrs, dialogCtrl) {
          dialogCtrl.setTitle(iAttrs.dialogTitle);
        }
      };
    }]).
    service('dialog', [function () {
      var dialogScope;
      return {
        /**
         * Shows dialog.
         * @param config Object with following fields: <ul>
         *   <li>title — [required String] title of the dialog</li>
         *   <li>content — [required String] path to an angularJS template that will be rendered as a body of the dialog</li>
         *   <li>data — [optional Object, default {}] an object that is copied to the scope of the dialog content under the name 'data'</li>
         *   <li>buttons — [required Array] collection of objects representing buttons in the footer of the dialog.
         *   Following fields are available for every button: <ul>
         *     <li>label — [required String] a text on a button</li>
         *     <li>default — [optional Boolean, default false] if true then button is highlighted as default and acts on Enter key press</li>
         *     <li>close — [optional Boolean, default true] if true then click on the button closes the dialog unless action of the button returned false</li>
         *     <li>action — [optional function(data, button, errorCallback(errorMessage))] is executed on button click. If returns false then window shouldn't be closed</li>
         *     <li>Also any field may be added to the button and later read in action function</li>
         *   </ul></li>
         * </ul>
         *
         */
        'show': function (config) {
          if (!dialogScope) {
            console.error('No dialog directive is found');
            return;
          }

          // Clear dialog errors
          dialogScope.error = null;
          if (dialogScope.dialogForm) {
            dialogScope.dialogForm.$setPristine();
          }

          if (config) {
            dialogScope.title = config.title;
            dialogScope.buttons = config.buttons;
            dialogScope.data = config.data || {};
            dialogScope.content = config.content;
          }

          shortcuts('setModalScope', DIALOG_KEY_SCOPE);
          dialogScope.active = true;
        },
        /**
         * Hides dialog
         */
        'hide': function () {
          if (dialogScope) {
            dialogScope.active = false;
            dialogScope.content = '';

            if (shortcuts('getModalScope') === DIALOG_KEY_SCOPE) {
              shortcuts('setModalScope');
            }
          }
        },
        'register': function (scope) {
          dialogScope = scope;
        }
      };
    }]);
})();