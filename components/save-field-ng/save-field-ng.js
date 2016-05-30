/* global angular: false */

import '../form/form.scss';
import '../button/button.scss';
import '../save-field-ng/save-field-ng.scss';

import '../loader-inline/loader-inline';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';
import Form from '../form-ng/form-ng';
import Shortcuts from '../shortcuts-ng/shortcuts-ng';
import Button from '../button-ng/button-ng';

import 'dom4';

const angularModule = angular.module('Ring.save-field', [
  MessageBundle,

  /**
   * for error-bubble
   */
  Form,
  Shortcuts,
  Button
]);

/**
 * @name Save Field Ng
 * @description Directive: Wrapper with save button for inputs
 * @example
 * <example name="rgSaveField">
     <file name="index.html">
     <div ng-app="Example.saveField" rg-shortcuts-app>
        <div class="ring-form" ng-controller="SaveFieldDemoCtrl">

          <div class="ring-form__group">
            <label class="ring-form__label">
              Input
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.email"
                             on-save="save()">
                <input type="text"
                       class="ring-input ring-input-size_md"
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
                             on-save="save()">
                <textarea type="text"
                          class="ring-input ring-input-size_l"
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
                             on-save="save()">
                <textarea type="text"
                          name="myMultilineArea"
                          class="ring-input ring-input-size_md"
                          ng-model="data.longTextList"></textarea>
              </rg-save-field>
              <div class="ring-form__control__description">data.longTextList = {{data.longTextList}}</div>
            </div>
          </div>

          <div class="ring-form__group">
            <label class="ring-form__label">
              Number
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.num"
                             on-save="save()">
                <input type="number"
                       max="10"
                       class="ring-input ring-input-size_xs"
                       ng-model="data.num">
              </rg-save-field>
            </div>
          </div>

          <div class="ring-form__group">
            <label class="ring-form__label">
              Rejected Save
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.someText"
                             on-save="invalidSave(value)">
                  <input type="text"
                         class="ring-input ring-input-size_md"
                         ng-model="data.someText">
              </rg-save-field>
            </div>
          </div>

          <div class="ring-form__group">
            <label class="ring-form__label">
              Query Assist
            </label>

            <div class="ring-form__control">
              <rg-save-field value="data.query"
                             on-save="save(value)">
                <div react="QueryAssist"
                     class="ring-input-size_l"
                     x-data-source="queryAssistSource(query, caret, omitSuggestions)"
                     ng-model="data.query"
                     placeholder="{{ placeholder }}"
                     hint="{{ 'Press ⇥ to complete first item' }}"
                     hint-on-selection="{{ 'Press ↩ to complete selected item' }}"></div>
              </rg-save-field>
              <div class="ring-form__control__description">Currently there is a bug with "escape" shortcut</div>
            </div>
          </div>
        </div>

     </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/save-field-ng/save-field-ng');
       require('ring-ui/components/input-size/input-size.scss');
       require('ring-ui/components/react-ng/react-ng')({
        QueryAssist: require('ring-ui/components/query-assist/query-assist'),
        LoaderInline: require('ring-ui/components/loader-inline/loader-inline')
       });

       angular.module('Example.saveField', ['Ring.save-field', 'Ring.react-ng'])
         .config(['shortcutsProvider', 'rgSaveFieldShortcutsMode', function(shortcutsProvider, rgSaveFieldShortcutsMode) {
           shortcutsProvider.mode({
             id: 'ring-shortcuts',
             shortcuts: []
           });
           shortcutsProvider.mode(rgSaveFieldShortcutsMode);
         }])
         .controller('SaveFieldDemoCtrl', function($scope, $q, $http) {
           $scope.data = {
             email: 'aa',
             longText: null,
             longTextList: ['one', 'two', 'three'],
             num: 10,
             someText: 'some text',
             query: 'login: guest'
           };

           var defer = $q.defer();
           defer.resolve();
           $scope.save = function() {
             console.log('data = ', $scope.data);
             return defer.promise;
           };

           $scope.invalidSave = function(currentValue) {
             if (currentValue.length < 7) {
               return $q.reject('Length of the string must be greater than 7! >> ' + currentValue);
             } else {
               return true;
             }
           };

           var hubConfig = require('ring-ui/site/hub-config');
           $scope.queryAssistSource = function(query, caret, omitSuggestions) {
             var config = {
               params: {
                 fields: 'query,caret,styleRanges' + (omitSuggestions ? '' : ',suggestions'),
                 query: query,
                 caret: caret
               }
             };

             return $http.get(hubConfig.serverUri + '/api/rest/users/queryAssist', config).
               then(function(data) {
                 return data.data;
               });
           };
       });
     </file>
 </example>
 */

angularModule.constant('rgSaveFieldShortcutsMode', {
  id: 'ring-save-field',
  shortcuts: [
    {
      key: 'ctrl+enter',
      action: 'comboSubmit'
    },
    {
      key: 'enter',
      action: 'submit'
    },
    {
      key: 'esc',
      action: 'cancel'
    },
    {
      key: 'up',
      action: 'noop'
    },
    {
      key: 'down',
      action: 'noop'
    }
  ]
});

angularModule.directive('rgSaveField', (RingMessageBundle, $timeout, $q, $compile, $parse) => {
  const MULTI_LINE_SPLIT_PATTERN = /(\r\n|\n|\r)/gm;
  const MULTI_LINE_LIST_MODE = 'list';
  const CUSTOM_ERROR_ID = 'customError';
  const ERROR_DESCRIPTION = 'error_description';
  const ERROR_DEVELOPER_MSG = 'error_developer_message';

  return {
    require: 'rgSaveField',
    transclude: true,
    template: require('./save-field-ng.html'),
    scope: {
      value: '=',
      onSave: '&',
      afterSave: '&?',
      validate: '&?',
      parseElement: '&?',
      formatElement: '&?',
      multiline: '@'
    },
    link(scope, iElem, iAttrs, ctrl, transclude) {

      /**
       * Custom transclude is needed to place error-bubble directly after input controller (not after <span ng-transclude></span> which wrappes input).
       * Otherwise class ring-error-bubble will be incorrect positioned (css style selector .ring-ctrl-<size> ~ .ring-error-bubble)
       */
      transclude(scope, () => {
        const placeholder = angular.element(iElem[0].querySelector('.ring-save-field__transclude-placeholder'));
        $compile(angular.element('<div rg-error-bubble="saveFieldForm"></div>'))(scope, errorBubble => {
          placeholder.append(errorBubble);
        });
      });

      const customError = {
        message: ''
      };

      let blurTimeout = null;
      let isTextarea = false;

      function submitChanges() {
        if (!scope.saveFieldForm.$valid || scope.loading || angular.equals(scope.initial, scope.value)) {
          return;
        }

        function success() {
          scope.initial = angular.copy(scope.value);
          scope.saveFieldForm.$setPristine();

          scope.done = true;

          $timeout(() => {
            scope.done = false;
          }, 1000);

          if (scope.afterSave) {
            return $q.when(scope.afterSave({
              value: scope.value
            }));
          }

          return undefined;
        }

        function error(err) {
          let message;
          if (typeof err === 'string') {
            message = err;
          } else if (typeof err === 'object') {
            const errorData = err.data || err;
            message = errorData[ERROR_DESCRIPTION] || errorData[ERROR_DEVELOPER_MSG];
          }

          customError.message = message;
          scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, false, customError);
        }

        scope.cancelBlur();

        scope.loading = true;

        let onsave = ctrl.getSave();
        if (onsave) {
          onsave = $q.when(onsave(scope.value));
        } else {
          onsave = $q.when(scope.onSave({
            value: scope.value
          }));
        }

        onsave.
          then(success, error).
          then(() => {
            scope.loading = false;
          });
      }

      function resetValue() {
        if (scope.loading) {
          return;
        }

        scope.$evalAsync(() => {
          scope.value = scope.initial ? scope.initial : '';
          scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, true, customError);
          scope.saveFieldForm.$setPristine();
        });
      }

      function addMultilineProcessig(controlName) {
        const stopWatch = scope.$watch(`saveFieldForm.${controlName}`, control => {
          if (!control || !control.$formatters || !control.$parsers) {
            return;
          }

          control.$formatters.push(value => {
            if (!value) {
              return value;
            }

            let formattedValue;
            if (iAttrs.formatElement) {
              formattedValue = value.map(element => scope.formatElement({element}));
            } else {
              formattedValue = value;
            }

            return formattedValue.join('\n');
          });

          control.$parsers.push(value => {
            let array = value && value.split(MULTI_LINE_SPLIT_PATTERN) || [];

            function notEmpty(val) {
              return val && val.trim() && val !== '\n';
            }

            array = array.filter(notEmpty);

            if (iAttrs.parseElement) {
              array = array.map(element => scope.parseElement({element: element.trim()}));
            }

            return array;
          });

          stopWatch();
        });
      }

      scope.cancelBlur = () => {
        $timeout(() => {
          if (blurTimeout) {
            $timeout.cancel(blurTimeout);
            blurTimeout = null;
          }
        }, 10);
      };

      scope.$watch('value', value => {
        let promise = null;
        if (scope.saveFieldForm.$pristine) {
          scope.initial = value;
        } else if (scope.initial && angular.equals(scope.initial, value)) {
          resetValue();
        } else if (scope.validate) {
          promise = scope.validate({
            value: scope.value
          });
        }

        $q.when(promise).
          then(error => {
            if (error) {
              return $q.reject(error);
            } else {
              customError.message = '';
              scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, true, customError);

              return undefined;
            }
          }).
          catch(error => {
            customError.message = error;
            scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, false, customError);
          });
      }, true);

      let inputNode = iElem[0].querySelector('input, .ring-save-field__input');

      if (!inputNode) {
        inputNode = iElem[0].querySelector('textarea');
        isTextarea = !!inputNode;
      }

      if (inputNode) {
        inputNode.classList.add('ring-js-shortcuts');

        inputNode.addEventListener('focus', () => {
          scope.$evalAsync(() => {
            scope.focus = true;
          });
        });

        inputNode.addEventListener('blur', () => {
          scope.$evalAsync(() => {
            scope.focus = false;
          });
        });

        if (isTextarea && scope.multiline === MULTI_LINE_LIST_MODE) {
          addMultilineProcessig(inputNode.name);
        }
      }

      scope.wording = {
        save: RingMessageBundle.form_save(),
        saved: RingMessageBundle.form_saved()
      };

      scope.keyMap = {
        comboSubmit: e => {
          if (isTextarea) {
            e.preventDefault();
            submitChanges();
          }
        },
        submit: e => {
          if (!isTextarea) {
            e.preventDefault();
            submitChanges();
          }
        },
        cancel: resetValue,
        noop: angular.noop
      };

      scope.submitChanges = submitChanges;

      scope.focus = false;

      scope.$on('$destroy', () => {
        // 1) Bindings already disabled at this moment, so replacing scope.value = ... have no effect
        // 2) We can't use scope.value.someField because we don't know anything about scope.value, it's passed from outside
        // 3) Probably we can use controllerAs to add one more object layer (ctrl.value) so the JS linking would work
        // but errorBuble works with scope only, so there would be a big refactoring at rgSaveField and other components
        // This is the simplest solution:
        if (iAttrs.value) {
          $parse(iAttrs.value).assign(scope.$parent, scope.initial);
        }
      });
    },
    controller() {
      let onSave = null;

      this.setSave = cb => {
        onSave = cb;
      };

      this.getSave = () => onSave;
    }
  };
});

export default angularModule.name;
