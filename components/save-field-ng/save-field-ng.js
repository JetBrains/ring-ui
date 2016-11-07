/**
 * @name Save Field Ng
 * @category Angular Components
 * @description Allows to create forms where some fields have their own Save buttons.
 * @example-file ./save-field-ng__examples.html
 */

/* global angular: false */
import 'dom4';
import '../form/form.scss';
import '../button/button.scss';
import '../save-field-ng/save-field-ng.scss';

import '../loader-inline/loader-inline';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';
import Form from '../form-ng/form-ng';
import Shortcuts from '../shortcuts-ng/shortcuts-ng';
import Button from '../button-ng/button-ng';
import PromisedClick from '../promised-click-ng/promised-click-ng';

import 'dom4';

const angularModule = angular.module('Ring.save-field', [
  MessageBundle,

  /**
   * for error-bubble
   */
  Form,
  Shortcuts,
  Button,
  PromisedClick
]);

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
       * Custom transclude is needed to place the error bubble right after the
       * input controller, not after <span ng-transclude></span> which wraps the input.
       * Relative positioning of the error bubble depends on that.
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
          return false;
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

        return onsave.
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

      function addMultilineProcessing(controlName) {
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
          addMultilineProcessing(inputNode.name);
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
        // 1) Bindings are already disabled by this time, so replacing scope.value = ... has no effect
        // 2) We can't use scope.value.someField because we don't know anything about scope.value, it's passed from the outside
        // 3) Probably we can use controllerAs to add one more object layer (ctrl.value) so the JS linking would work
        // but errorBubble works with scope only, so a large refactoring of rgSaveField and other components is needed.
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
