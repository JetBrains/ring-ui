/* global angular: false */

require('form/form.scss');
require('button/button.scss');
require('save-field-ng/save-field-ng.scss');

require('message-bundle-ng/message-bundle-ng');
require('form-ng/form-ng');

angular.module('Ring.save-field', [
  'Ring.message-bundle',

/**
 * for error-bubble
 */
  'Ring.form'
])

/**
 * @name Save Field Ng
 * @description Directive: Wrapper with save button for inputs
 * @example
 * <example name="rgSaveField">
     <file name="index.html">
     <div ng-app="Example.saveField">
        <div class="ring-form" ng-controller="SaveFieldDemoCtrl">

          <div class="ring-form__group">
            <label class="ring-form__label">
              Input
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.email"
                             on-save="save">
                <input type="text"
                       class="ring-input"
                       ng-required="true"
                       ng-pattern="/^[a-zA-Z][a-zA-Z0-9-_\.]*[@][a-zA-Z0-9-_\.]+$/"
                       ng-model="data.email">
              </rg-save-field>
              <div class="ring-form__control__description">Enter valid email</div>
            </div>
          </div>

          <div class="ring-form__group">
            <label class="ring-form__label">
              Textarea
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.longText"
                             on-save="save">
                <textarea type="text"
                          class="ring-textarea ring-form__input_long"
                          ng-required="true"
                          ng-model="data.longText"></textarea>
              </rg-save-field>
            </div>
          </div>

        </div>
     </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('save-field-ng/save-field-ng');
       require('textarea/textarea.scss');

       angular.module('Example.saveField', ['Ring.save-field'])
         .controller('SaveFieldDemoCtrl', function($scope, $q) {
           $scope.data = {
             email: 'aa',
             longText: null
           };

           var defer = $q.defer();
           defer.resolve();
           $scope.save = function() {
             console.log('data = ', $scope.data);
             return defer.promise;
           };
       });
     </file>
 </example>
 */

  .directive('rgSaveField', [
    'RingMessageBundle',
    '$timeout',
    '$q',
    function (RingMessageBundle, $timeout, $q) {
      var ESCAPE_KEY_CODE = 27;
      var ENTER_KEY_CODE = 13;

      function setValueByPropertyName(obj, variableName, value) {
        var nameItems = variableName.split('.');
        var variable = obj;
        for (var i = 0; i < nameItems.length; ++i) {
          if (i < nameItems.length - 1) {
            if (angular.isObject(variable) && nameItems[i] in variable) {
              variable = variable[nameItems[i]];
            } else {
              break;
            }
          } else {
            variable[nameItems[i]] = value;
          }
        }
      }

      function getValueByPropertyName(obj, propertyName) {
        var nameItems = propertyName.split('.');
        var variable = obj;
        for (var i = 0; i < nameItems.length; ++i) {
          if (angular.isObject(variable) && nameItems[i] in variable) {
            variable = variable[nameItems[i]];
          } else {
            return undefined;
          }
        }
        return variable;
      }

      return {
        restrict: 'E',
        transclude: true,
        template: require('./save-field-ng.html'),
        scope: true,
        link: function (scope, iElem, iAttrs, ctrl, transcludeFn) {
          //TODO: support flag multilineMode for hub
          //var multilineMode = iAttrs.multilineMode;
          scope.onSave = scope.$eval(iAttrs.onSave);
          var valueExpression = iAttrs.value;
          scope.$parent.$watch(valueExpression, function (value) {
            if (angular.isDefined(value) && scope.saveFieldForm.$pristine) {
              scope.initial = value;
            }
          }, true);

          var success = function () {
            scope.initial = getValueByPropertyName(scope.$parent, valueExpression);
            scope.saveFieldForm.$setPristine();

            scope.done = true;

            $timeout(function () {
              scope.done = false;
            }, 1000);
          };

          scope.changed = function () {
            $q.when(scope.onSave()).then(success);
          };

          var inputKey = function ($event) {
            if ($event.keyCode === ESCAPE_KEY_CODE) {
              // Esc
              if (scope.saveFieldForm.$dirty) {
                setValueByPropertyName(scope.$parent, valueExpression, scope.initial);
                scope.saveFieldForm.$setPristine();
                scope.$parent.$apply();
              }
              $event.stopPropagation();
              $event.preventDefault();
              return;
            }
            //TODO: in multiline mode Enter should work without ctrl or meta
            if ($event.keyCode === ENTER_KEY_CODE && ($event.ctrlKey || $event.metaKey)) {
              // Enter
              if (scope.saveFieldForm.$dirty && scope.saveFieldForm.$valid) {
                scope.changed();
              }
              $event.stopPropagation();
              $event.preventDefault();
            }
          };

          transcludeFn(scope, function (clone) {
            angular.forEach(clone, function (node) {
              if (node.tagName) {
                var tagName = node.tagName.toLowerCase();
                if (tagName === 'textarea' || tagName === 'input'
                  || angular.element(node).hasClass('ring-save-field__input')) {
                  var nodeElem = angular.element(node);
                  nodeElem.bind('keydown', inputKey);
                }
              }
            });
            //TODO: why does it return nothing in example (but is working in youtrack)?
            //var placeholder = iElem.find('.ring-save-field__content');
            var placeholder = angular.element(iElem.children()[0]).children()[0];
            angular.element(placeholder).append(clone);
          });

          scope.wording = {
            save: RingMessageBundle.form_save(),
            saved: RingMessageBundle.form_saved()
          };
        }
      };
    }
  ]);
