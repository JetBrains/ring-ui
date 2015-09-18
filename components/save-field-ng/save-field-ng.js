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
                          class="ring-textarea ring-form__input ring-form__input_long"
                          ng-required="true"
                          ng-model="data.longText"></textarea>
              </rg-save-field>
            </div>
          </div>

          <div class="ring-form__group">
            <label class="ring-form__label">
              Textarea List Mode
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.longTextList"
                             multiline="list"
                             on-save="save">
                <textarea type="text"
                          name="myMultilineArea"
                          class="ring-textarea ring-form__input"
                          ng-model="data.longTextList"></textarea>
              </rg-save-field>
              <div class="ring-form__control__description">data.longTextList = {{data.longTextList}}</div>
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
             longText: null,
             longTextList: ['one', 'two', 'three']
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
    '$parse',
    function (RingMessageBundle, $timeout, $q, $parse) {
      var ESCAPE_KEY_CODE = 27;
      var ENTER_KEY_CODE = 13;
      var MULTI_LINE_SPLIT_PATTERN = /(\r\n|\n|\r)/gm;
      var MULTI_LINE_LIST_MODE = 'list';

      return {
        restrict: 'E',
        transclude: true,
        template: require('./save-field-ng.html'),
        scope: true,
        link: function (scope, iElem, iAttrs) {
          var multilineMode = iAttrs.multiline;
          scope.onSave = scope.$eval(iAttrs.onSave);
          var valueExpression = iAttrs.value;
          var getExpressionValue = $parse(valueExpression);
          var setExpressionValue = getExpressionValue.assign;

          function submitChanges() {
            var success = function () {
              scope.initial = getExpressionValue(scope);
              scope.saveFieldForm.$setPristine();

              scope.done = true;

              $timeout(function () {
                scope.done = false;
              }, 1000);
            };
            $q.when(scope.onSave()).then(success);
          }

          function escape() {
            setExpressionValue(scope, scope.initial ? scope.initial : '');
            scope.saveFieldForm.$setPristine();
            if (!scope.$$phase) { // eslint-disable-line angular/ng_no_private_call
              scope.$apply();
            }
          }

          function addMultilineProcessig(controlName) {
            var stopWatch = scope.$watch('saveFieldForm.' + controlName, function (control) {
              if (!control || !control.$formatters || !control.$parsers) {
                return;
              }
              control.$formatters.push(function (value) {
                if (!value) {
                  return value;
                }
                if (iAttrs.formatElement) {
                  value = value.map(function (element) {
                    return scope.formatElement({element: element});
                  });
                }
                return value.join('\n');
              });
              control.$parsers.push(function (value) {
                var array = value && value.split(MULTI_LINE_SPLIT_PATTERN) || [];
                var notEmpty = function (val) {
                  return val && val.trim() && val !== '\n';
                };
                array = array.filter(notEmpty);
                if (iAttrs.parseElement) {
                  array = array.map(function (element) {
                    return scope.parseElement({element: element.trim()});
                  });
                }
                return array;
              });

              stopWatch();
            });
          }

          function inputKey($event) {
            if ($event.keyCode === ESCAPE_KEY_CODE) {
              if (scope.saveFieldForm.$dirty) {
                escape();
              }
              $event.stopPropagation();
              $event.preventDefault();
              return;
            }
            if ($event.keyCode === ENTER_KEY_CODE && ($event.ctrlKey || $event.metaKey || !multilineMode)) {
              if (scope.saveFieldForm.$dirty && scope.saveFieldForm.$valid) {
                submitChanges();
              }
              $event.stopPropagation();
              $event.preventDefault();
            }
          };

          scope.$watch(valueExpression, function (value) {
            if (angular.isUndefined(value)) {
              return;
            }
            if (scope.saveFieldForm.$pristine) {
              scope.initial = value;
            } else if (scope.initial && angular.equals(scope.initial, value)) {
              escape();
            }
          }, true);

          var isTextarea = false;
          var inputNode = iElem[0].querySelector('input, .ring-save-field__input');
          if (!inputNode) {
            inputNode = iElem[0].querySelector('textarea');
            isTextarea = !!inputNode;
          }
          if (inputNode) {
            inputNode.addEventListener('keydown', inputKey);
            if (isTextarea) {
              if (!multilineMode) {
                multilineMode = true;
              } else if (inputNode.name && multilineMode === MULTI_LINE_LIST_MODE) {
                addMultilineProcessig(inputNode.name);
              }
            }
          }

          scope.wording = {
            save: RingMessageBundle.form_save(),
            saved: RingMessageBundle.form_saved()
          };
        }
      };
    }
  ]);
