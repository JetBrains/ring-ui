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
              <rg-save-field item="data"
                             field="email"
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
              <rg-save-field item="data"
                             field="longText"
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
             email: null,
             longText: null
           };

           var defer = $q.defer();
           defer.resolve();
           $scope.save = function(item, field) {
             console.log('Result', item[field]);
             return defer.promise;
           };
       });
     </file>
 </example>
 */

  .directive('rgSaveField', [
    'RingMessageBundle',
    '$timeout',
    function (RingMessageBundle, $timeout) {
      return {
        restrict: 'E',
        transclude: true,
        template: require('./save-field-ng.html'),
        scope: true,
        link: function (scope, iElem, iAttrs, ctrl, transcludeFn) {
          //TODO: support flag multilineMode for hub
          //var multilineMode = iAttrs.multilineMode;
          scope.field = iAttrs.field;
          scope.onSave = scope.$eval(iAttrs.onSave);
          scope.$watch(iAttrs.item, function (value) {
            scope.item = value;
            scope.initial = (value && value.hasOwnProperty(scope.field)) ? value[scope.field] : undefined;
          });

          scope.$watch('item.' + scope.field, function (newValue) {
            /**
             * Update initial value if field has been changed outside form.input (e.g. new value from rest)
             */
            if (angular.isDefined(newValue) && angular.isUndefined(scope.initial)) {
              scope.initial = newValue;
            }
          });

          var success = function () {
            scope.initial = scope.item[scope.field];
            scope.autoSaveWrapperForm.$setPristine();

            scope.done = true;

            $timeout(function () {
              scope.done = false;
            }, 1000);
          };

          scope.changed = function () {
            var saveResult = scope.onSave(scope.item, scope.field);
            if (saveResult && saveResult.then) {
              saveResult.then(success);
            }
          };

          var inputKey = function ($event) {
            if ($event.keyCode === 27) {
              // Esc
              if (scope.autoSaveWrapperForm.$dirty) {
                scope.item[scope.field] = scope.initial;
                scope.autoSaveWrapperForm.$setPristine();
                scope.$apply();
              }
              $event.stopPropagation();
              $event.preventDefault();
            } else if ($event.keyCode === 13 && ($event.ctrlKey || $event.metaKey || !scope.isMultiLine())) {
              // Enter
              if (scope.autoSaveWrapperForm.$dirty && scope.autoSaveWrapperForm.$valid) {
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
                if (tagName === 'textarea' || tagName === 'input') {
                  var nodeElem = angular.element(node);
                  nodeElem.bind('keydown', inputKey);
                }
              }
            });
            //todo: why does it returns nothing in example (but is working in youtrack)?
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
