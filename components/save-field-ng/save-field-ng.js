/**
 * @name Save Field Ng
 */
import angular from 'angular';
import 'dom4';
import '../form/form.scss';
import './save-field-ng.scss';

import '../loader-inline/loader-inline';
import ButtonSet from '../button-set-ng/button-set-ng';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';
import Form from '../form-ng/form-ng';
import Shortcuts from '../shortcuts-ng/shortcuts-ng';
import Button from '../button-ng/button-ng';
import PromisedClick from '../promised-click-ng/promised-click-ng';

const angularModule = angular.module('Ring.save-field', [
  MessageBundle,

  /**
   * for error-bubble
   */
  Form,
  Shortcuts,
  Button,
  ButtonSet,
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

angularModule.directive(
  'rgSaveField',
  function rgSaveFieldDirective(RingMessageBundle, $timeout, $q, $compile, $parse) {
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
        api: '=?',
        value: '=',
        workingValue: '=',
        onSave: '&',
        afterSave: '&?',
        validate: '&?',
        parseElement: '&?',
        formatElement: '&?',
        multiline: '@'
      },
      link: function link(scope, iElem, iAttrs, ctrl) {
        const placeholder = angular.element(
          iElem[0].querySelector('.ring-save-field__transclude-placeholder')
        );
        $compile(
          angular.element('<div rg-error-bubble="saveFieldForm"></div>')
        )(scope, errorBubble => {
          placeholder.append(errorBubble);
        });

        const customError = {
          message: ''
        };

        let blurTimeout = null;
        let isTextarea = false;

        const draftMode = iAttrs.workingValue;
        const valueField = draftMode ? 'workingValue' : 'value';

        function submitChanges() {
          if (
            !scope.saveFieldForm.$valid ||
            scope.loading ||
            angular.equals(scope.initial, scope[valueField])
          ) {
            return false;
          }

          function afterSaveCall() {
            return $q.when(scope.afterSave({
              value: scope[valueField]
            }));
          }

          function success() {
            scope.initial = angular.copy(scope[valueField]);
            scope.saveFieldForm.$setPristine();

            scope.done = true;

            if (draftMode) {
              scope.value = scope.workingValue;
            }

            $timeout(() => {
              scope.done = false;
            }, 1000); //eslint-disable-line no-magic-numbers

            if (scope.afterSave) {
              if (draftMode) {
                return $timeout(afterSaveCall); // we need digest to sync value before calling after save
              } else {
                return afterSaveCall();
              }
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
            onsave = $q.when(onsave(scope[valueField]));
          } else {
            onsave = $q.when(scope.onSave({
              value: scope[valueField]
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
            scope[valueField] = scope.initial ? scope.initial : '';
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
          // eslint-disable-next-line no-magic-numbers
          }, 10);
        };

        if (draftMode) {
          scope.$watch('value', value => {
            scope.workingValue = angular.copy(value);
            scope.initial = value;
          });
        }

        scope.$watch(valueField, value => {
          let promise = null;
          if (scope.saveFieldForm.$pristine) {
            scope.initial = value;
          } else if (scope.initial && angular.equals(scope.initial, value)) {
            resetValue();
          } else if (scope.validate) {
            promise = scope.validate({
              value
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
        });

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
          saved: RingMessageBundle.form_saved(),
          cancel: RingMessageBundle.form_cancel()
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

        scope.api = {
          save: submitChanges,
          cancel: resetValue
        };

        scope.submitChanges = ctrl.submitChanges = submitChanges;

        scope.cancelChanges = ctrl.cancelChanges = resetValue;

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
  }
);

export default angularModule.name;
