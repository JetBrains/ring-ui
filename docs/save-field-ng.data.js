window.source = {
  "title": "Save Field Ng",
  "url": "save-field-ng.html",
  "type": "js",
  "content": "/**\n * @name Save Field Ng\n * @category Legacy Angular\n * @description Allows to create forms where some fields have their own Save buttons.\n * @example-file ./save-field-ng.examples.html\n */\nimport angular from 'angular';\nimport 'dom4';\nimport '../form/form.scss';\nimport '../save-field-ng/save-field-ng.scss';\n\nimport '../loader-inline/loader-inline';\nimport ButtonSet from '../button-set-ng/button-set-ng';\nimport MessageBundle from '../message-bundle-ng/message-bundle-ng';\nimport Form from '../form-ng/form-ng';\nimport Shortcuts from '../shortcuts-ng/shortcuts-ng';\nimport Button from '../button-ng/button-ng';\nimport PromisedClick from '../promised-click-ng/promised-click-ng';\n\nconst angularModule = angular.module('Ring.save-field', [\n  MessageBundle,\n\n  /**\n   * for error-bubble\n   */\n  Form,\n  Shortcuts,\n  Button,\n  ButtonSet,\n  PromisedClick\n]);\n\nangularModule.constant('rgSaveFieldShortcutsMode', {\n  id: 'ring-save-field',\n  shortcuts: [\n    {\n      key: 'ctrl+enter',\n      action: 'comboSubmit'\n    },\n    {\n      key: 'enter',\n      action: 'submit'\n    },\n    {\n      key: 'esc',\n      action: 'cancel'\n    },\n    {\n      key: 'up',\n      action: 'noop'\n    },\n    {\n      key: 'down',\n      action: 'noop'\n    }\n  ]\n});\n\nangularModule.directive(\n  'rgSaveField',\n  function rgSaveFieldDirective(RingMessageBundle, $timeout, $q, $compile, $parse) {\n    const MULTI_LINE_SPLIT_PATTERN = /(\\r\\n|\\n|\\r)/gm;\n    const MULTI_LINE_LIST_MODE = 'list';\n    const CUSTOM_ERROR_ID = 'customError';\n    const ERROR_DESCRIPTION = 'error_description';\n    const ERROR_DEVELOPER_MSG = 'error_developer_message';\n\n    return {\n      require: 'rgSaveField',\n      transclude: true,\n      template: require('./save-field-ng.html'),\n      scope: {\n        api: '=?',\n        value: '=',\n        workingValue: '=',\n        onSave: '&',\n        afterSave: '&?',\n        validate: '&?',\n        parseElement: '&?',\n        formatElement: '&?',\n        multiline: '@'\n      },\n      link: function link(scope, iElem, iAttrs, ctrl) {\n        const placeholder = angular.element(\n          iElem[0].querySelector('.ring-save-field__transclude-placeholder')\n        );\n        $compile(\n          angular.element('<div rg-error-bubble=\"saveFieldForm\"></div>')\n        )(scope, errorBubble => {\n          placeholder.append(errorBubble);\n        });\n\n        const customError = {\n          message: ''\n        };\n\n        let blurTimeout = null;\n        let isTextarea = false;\n\n        const draftMode = iAttrs.workingValue;\n        const valueField = draftMode ? 'workingValue' : 'value';\n\n        function submitChanges() {\n          if (\n            !scope.saveFieldForm.$valid ||\n            scope.loading ||\n            angular.equals(scope.initial, scope[valueField])\n          ) {\n            return false;\n          }\n\n          function afterSaveCall() {\n            return $q.when(scope.afterSave({\n              value: scope[valueField]\n            }));\n          }\n\n          function success() {\n            scope.initial = angular.copy(scope[valueField]);\n            scope.saveFieldForm.$setPristine();\n\n            scope.done = true;\n\n            if (draftMode) {\n              scope.value = scope.workingValue;\n            }\n\n            $timeout(() => {\n              scope.done = false;\n            }, 1000); //eslint-disable-line no-magic-numbers\n\n            if (scope.afterSave) {\n              if (draftMode) {\n                return $timeout(afterSaveCall); // we need digest to sync value before calling after save\n              } else {\n                return afterSaveCall();\n              }\n            }\n\n            return undefined;\n          }\n\n          function error(err) {\n            let message;\n            if (typeof err === 'string') {\n              message = err;\n            } else if (typeof err === 'object') {\n              const errorData = err.data || err;\n              message = errorData[ERROR_DESCRIPTION] || errorData[ERROR_DEVELOPER_MSG];\n            }\n\n            customError.message = message;\n            scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, false, customError);\n          }\n\n          scope.cancelBlur();\n\n          scope.loading = true;\n\n          let onsave = ctrl.getSave();\n          if (onsave) {\n            onsave = $q.when(onsave(scope[valueField]));\n          } else {\n            onsave = $q.when(scope.onSave({\n              value: scope[valueField]\n            }));\n          }\n\n          return onsave.\n            then(success, error).\n            then(() => {\n              scope.loading = false;\n            });\n        }\n\n        function resetValue() {\n          if (scope.loading) {\n            return;\n          }\n\n          scope.$evalAsync(() => {\n            scope[valueField] = scope.initial ? scope.initial : '';\n            scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, true, customError);\n            scope.saveFieldForm.$setPristine();\n          });\n        }\n\n        function addMultilineProcessing(controlName) {\n          const stopWatch = scope.$watch(`saveFieldForm.${controlName}`, control => {\n            if (!control || !control.$formatters || !control.$parsers) {\n              return;\n            }\n\n            control.$formatters.push(value => {\n              if (!value) {\n                return value;\n              }\n\n              let formattedValue;\n              if (iAttrs.formatElement) {\n                formattedValue = value.map(element => scope.formatElement({element}));\n              } else {\n                formattedValue = value;\n              }\n\n              return formattedValue.join('\\n');\n            });\n\n            control.$parsers.push(value => {\n              let array = value && value.split(MULTI_LINE_SPLIT_PATTERN) || [];\n\n              function notEmpty(val) {\n                return val && val.trim() && val !== '\\n';\n              }\n\n              array = array.filter(notEmpty);\n\n              if (iAttrs.parseElement) {\n                array = array.map(element => scope.parseElement({element: element.trim()}));\n              }\n\n              return array;\n            });\n\n            stopWatch();\n          });\n        }\n\n        scope.cancelBlur = () => {\n          $timeout(() => {\n            if (blurTimeout) {\n              $timeout.cancel(blurTimeout);\n              blurTimeout = null;\n            }\n          // eslint-disable-next-line no-magic-numbers\n          }, 10);\n        };\n\n        if (draftMode) {\n          scope.$watch('value', value => {\n            scope.workingValue = angular.copy(value);\n            scope.initial = value;\n          });\n        }\n\n        scope.$watch(valueField, value => {\n          let promise = null;\n          if (scope.saveFieldForm.$pristine) {\n            scope.initial = value;\n          } else if (scope.initial && angular.equals(scope.initial, value)) {\n            resetValue();\n          } else if (scope.validate) {\n            promise = scope.validate({\n              value\n            });\n          }\n\n          $q.when(promise).\n            then(error => {\n              if (error) {\n                return $q.reject(error);\n              } else {\n                customError.message = '';\n                scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, true, customError);\n\n                return undefined;\n              }\n            }).\n            catch(error => {\n              customError.message = error;\n              scope.saveFieldForm.$setValidity(CUSTOM_ERROR_ID, false, customError);\n            });\n        });\n\n        let inputNode = iElem[0].querySelector('input, .ring-save-field__input');\n\n        if (!inputNode) {\n          inputNode = iElem[0].querySelector('textarea');\n          isTextarea = !!inputNode;\n        }\n\n        if (inputNode) {\n          inputNode.classList.add('ring-js-shortcuts');\n\n          inputNode.addEventListener('focus', () => {\n            scope.$evalAsync(() => {\n              scope.focus = true;\n            });\n          });\n\n          inputNode.addEventListener('blur', () => {\n            scope.$evalAsync(() => {\n              scope.focus = false;\n            });\n          });\n\n          if (isTextarea && scope.multiline === MULTI_LINE_LIST_MODE) {\n            addMultilineProcessing(inputNode.name);\n          }\n        }\n\n        scope.wording = {\n          save: RingMessageBundle.form_save(),\n          saved: RingMessageBundle.form_saved(),\n          cancel: RingMessageBundle.form_cancel()\n        };\n\n        scope.keyMap = {\n          comboSubmit: e => {\n            if (isTextarea) {\n              e.preventDefault();\n              submitChanges();\n            }\n          },\n          submit: e => {\n            if (!isTextarea) {\n              e.preventDefault();\n              submitChanges();\n            }\n          },\n          cancel: resetValue,\n          noop: angular.noop\n        };\n\n        scope.api = {\n          save: submitChanges,\n          cancel: resetValue\n        };\n\n        scope.submitChanges = ctrl.submitChanges = submitChanges;\n\n        scope.cancelChanges = ctrl.cancelChanges = resetValue;\n\n        scope.focus = false;\n\n        scope.$on('$destroy', () => {\n          // 1) Bindings are already disabled by this time, so replacing scope.value = ... has no effect\n          // 2) We can't use scope.value.someField because we don't know anything about scope.value, it's passed from the outside\n          // 3) Probably we can use controllerAs to add one more object layer (ctrl.value) so the JS linking would work\n          // but errorBubble works with scope only, so a large refactoring of rgSaveField and other components is needed.\n          // This is the simplest solution:\n          if (iAttrs.value) {\n            $parse(iAttrs.value).assign(scope.$parent, scope.initial);\n          }\n        });\n      },\n      controller() {\n        let onSave = null;\n\n        this.setSave = cb => {\n          onSave = cb;\n        };\n\n        this.getSave = () => onSave;\n      }\n    };\n  }\n);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Save Field Ng",
      "url": "examples/save-field-ng/save-field-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.saveField\" ng-strict-di rg-shortcuts-app>\n  <div class=\"ring-form\" ng-controller=\"SaveFieldDemoCtrl\">\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Input\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.email\"\n          on-save=\"save()\">\n          <rg-input type=\"text\"\n            size=\"M\"\n            ng-required=\"true\"\n            ng-pattern=\"/^[a-zA-Z][a-zA-Z0-9-_\\.]*[@][a-zA-Z0-9-_\\.]+$/\"\n            ng-model=\"data.email\">\n        </rg-save-field>\n        <div class=\"ring-form__control__description\">Enter valid email</div>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Input\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.email\" working-value=\"data.emailWorkingValue\"\n          on-save=\"save()\">\n          <rg-input type=\"text\"\n            size=\"M\"\n            ng-required=\"true\"\n            ng-pattern=\"/^[a-zA-Z][a-zA-Z0-9-_\\.]*[@][a-zA-Z0-9-_\\.]+$/\"\n            ng-model=\"data.emailWorkingValue\">\n        </rg-save-field>\n        <div class=\"ring-form__control__description\">value: {{data.email}}  working-value: {{data.emailWorkingValue}}</div>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Textarea\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.longText\"\n          on-save=\"save()\">\n            <rg-input type=\"text\"\n              size=\"M\"\n              multiline=\"true\"\n              ng-required=\"true\"\n              ng-model=\"data.longText\"></rg-input>\n        </rg-save-field>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Textarea List Mode\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.longTextList\"\n          multiline=\"list\"\n          on-save=\"save()\">\n            <rg-input type=\"text\"\n              size=\"M\"\n              multiline=\"true\"\n              name=\"myMultilineArea\"\n              ng-model=\"data.longTextList\"></rg-input>\n        </rg-save-field>\n        <div class=\"ring-form__control__description\">data.longTextList =\n          {{data.longTextList}}\n        </div>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Number\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.num\"\n          on-save=\"save()\">\n          <rg-input type=\"number\"\n            max=\"10\"\n            size=\"XS\"\n            ng-model=\"data.num\">\n        </rg-save-field>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Rejected Save\n      </label>\n\n      <div class=\"ring-form__control\">\n        <rg-save-field value=\"data.someText\"\n          on-save=\"invalidSave(value)\">\n          <rg-input type=\"text\"\n            size=\"M\"\n            ng-model=\"data.someText\">\n        </rg-save-field>\n      </div>\n    </div>\n\n    <div class=\"ring-form__group\">\n      <label class=\"ring-form__label\">\n        Query Assist\n      </label>\n\n      <div class=\"ring-form__control\">\n        data.query={{data.query}}\n        <rg-save-field value=\"data.query\"\n          on-save=\"save(value)\">\n          <rg-query-assist\n            class=\"ring-input-size_l\"\n            x-data-source=\"queryAssistSource\"\n            query=\"data.query\"\n            on-apply=\"save\"\n            on-change=\"updateQueryAssistValue\"\n            placeholder=\"placeholder\"\n            hint=\"'Press ⇥ to complete first item'\"\n            hint-on-selection=\"'Press ↩ to complete selected item'\"></rg-query-assist>\n        </rg-save-field>\n        <div class=\"ring-form__control__description\">Currently there is a\n          bug with \"escape\" shortcut\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport InputNG from '@jetbrains/ring-ui/components/input-ng/input-ng';\nimport SaveFieldNG from '@jetbrains/ring-ui/components/save-field-ng/save-field-ng';\nimport QueryAssistNG from '@jetbrains/ring-ui/components/query-assist-ng/query-assist-ng';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nangular.module('Example.saveField', [SaveFieldNG, QueryAssistNG, InputNG]).\n  config(['shortcutsProvider', 'rgSaveFieldShortcutsMode', function (shortcutsProvider, rgSaveFieldShortcutsMode) {\n    shortcutsProvider.mode({\n      id: 'ring-shortcuts',\n      shortcuts: []\n    });\n    shortcutsProvider.mode(rgSaveFieldShortcutsMode);\n  }]).\n  controller('SaveFieldDemoCtrl', function ($scope, $q, $http) {\n    $scope.data = {\n      email: 'aa',\n      longText: null,\n      longTextList: ['one', 'two', 'three'],\n      num: 10,\n      someText: 'some text',\n      query: 'login: guest'\n    };\n\n    var defer = $q.defer();\n    defer.resolve();\n    $scope.save = function () {\n      console.log('data = ', $scope.data);\n      return defer.promise;\n    };\n\n    $scope.invalidSave = function (currentValue) {\n      if (currentValue.length < 7) {\n        return $q.reject('Length of the string must be greater than 7! >> ' + currentValue);\n      } else {\n        return true;\n      }\n    };\n\n    $scope.queryAssistSource = function ({query, caret, omitSuggestions}) {\n      var config = {\n        params: {\n          fields: 'query,caret,styleRanges' + (omitSuggestions ? '' : ',suggestions'),\n          query: query,\n          caret: caret\n        }\n      };\n\n      return $http.get(hubConfig.serverUri + '/api/rest/users/queryAssist', config).\n        then(function (data) {\n          return data.data;\n        });\n    };\n\n    $scope.updateQueryAssistValue = function ({query}) {\n      $scope.data.query = query;\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Allows to create forms where some fields have their own Save buttons.",
  "attrs": {
    "name": "Save Field Ng",
    "category": "Legacy Angular",
    "description": "Allows to create forms where some fields have their own Save buttons.",
    "example-file": "./save-field-ng.examples.html"
  }
};