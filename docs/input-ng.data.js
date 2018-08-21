window.source = {
  "title": "Input Ng",
  "url": "input-ng.html",
  "type": "js",
  "content": "/**\n * @name Input Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @constructor\n * @description Text input fields of varying size.\n * @example-file ./input-ng.examples.html\n */\nimport angular from 'angular';\nimport classNames from 'classnames';\nimport CloseIcon from '@jetbrains/icons/close.svg';\n\nimport RingAngularComponent from '../global/ring-angular-component';\nimport styles from '../input/input.css';\nimport Theme from '../global/theme';\n\nimport styleOverrides from './input-ng.css';\n\nconst angularModule = angular.module('Ring.input', []);\n\nclass RingInputComponent extends RingAngularComponent {\n  static $inject = ['$element'];\n\n  static require = {\n    ngModelCtrl: '?ngModel'\n  };\n\n  static bindings = {\n    name: '@',\n    required: '@',\n    ngMinlength: '@',\n    ngMaxlength: '@',\n    placeholder: '@',\n    ngModel: '<',\n    onChange: '&',\n    label: '@',\n    hint: '@',\n    size: '@',\n    theme: '@',\n    disabled: '@',\n    active: '<',\n    error: '@',\n    empty: '<',\n    clearable: '<',\n    borderless: '<',\n    multiline: '<'\n  };\n\n  $onInit() {\n    if (!this.ngModelCtrl) {\n      return;\n    }\n\n    this.ngModelCtrl.$render = () => {\n      this.value = this.ngModelCtrl.$viewValue;\n    };\n  }\n\n  onInputChange() {\n    if (!this.ngModelCtrl) {\n      return;\n    }\n    this.ngModelCtrl.$setViewValue(this.value);\n  }\n\n  stretch(el) {\n    if (!el) {\n      return;\n    }\n    el.style.height = `${el.scrollHeight}px`;\n  }\n\n  onKeyUp() {\n    if (!this.inputNode) {\n      this.inputNode = this.$inject.$element[0].querySelector('[data-test=\"ring-input\"]');\n    }\n\n    if (this.multiline && this.inputNode.scrollHeight > this.inputNode.clientHeight) {\n      this.stretch(this.inputNode);\n    }\n  }\n\n  getContainerClasses() {\n    return classNames(\n      styles.container,\n      styles[this.theme || Theme.LIGHT],\n      this.size ? [styles[`size${this.size}`]] : null,\n      {\n        [styles.active]: this.active,\n        [styles.error]: this.error != null,\n        [styles.empty]: !this.value,\n        [styles.noLabel]: !this.label,\n        [styles.clearable]: this.clearable,\n        [styles.borderless]: this.borderless\n      }\n    );\n  }\n\n  static template = `\n<div \n  data-test=\"ring-input-container\"\n  ng-class=\"$ctrl.getContainerClasses()\"\n>\n  <input \n    type=\"text\"\n    data-test=\"ring-input\"\n    class=\"${styles.input}\"\n    name=\"{{$ctrl.name}}\"\n    ng-if=\"!$ctrl.multiline\"\n    placeholder=\"{{$ctrl.placeholder}}\"\n    ng-model=\"$ctrl.value\"\n    ng-required=\"$ctrl.required\"\n    ng-disabled=\"$ctrl.disabled\"\n    ng-minlength=\"$ctrl.ngMinlength\"\n    ng-maxlength=\"$ctrl.ngMaxlength\"\n    ng-change=\"$ctrl.onInputChange()\"\n    ng-keyup=\"$ctrl.onKeyUp()\"\n  />\n  \n  <textarea\n    data-test=\"ring-input\"\n    ng-if=\"$ctrl.multiline\"\n    class=\"${styles.input}\"\n    rows=\"1\"\n    name=\"{{$ctrl.name}}\"\n    placeholder=\"{{$ctrl.placeholder}}\"\n    ng-model=\"$ctrl.value\"\n    ng-required=\"$ctrl.required\"\n    ng-disabled=\"$ctrl.disabled\"\n    ng-minlength=\"$ctrl.ngMinlength\"\n    ng-maxlength=\"$ctrl.ngMaxlength\"\n    ng-change=\"$ctrl.onInputChange()\"\n    ng-keyup=\"$ctrl.onKeyUp()\"\n  ></textarea>\n  \n  <rg-button\n    ng-if=\"$ctrl.clearable\"\n    data-test=\"ring-input-clear\"\n    class=\"${styles.clear}\"\n    icon=\"${CloseIcon}\"\n    icon-size=\"14\"\n  ></rg-button>\n  \n  <label\n    ng-if=\"!$ctrl.borderless\"\n    class=\"${styles.label}\"\n  >{{$ctrl.label}}</label>\n  \n  <div ng-if=\"!$ctrl.borderless\" class=\"${styles.underline}\"></div>\n  <div ng-if=\"!$ctrl.borderless\" class=\"${styles.focusUnderline}\"></div>\n  <div ng-if=\"!$ctrl.borderless\" class=\"${styles.errorUnderline}\"></div>\n  <div ng-if=\"!$ctrl.borderless && $ctrl.error\" class=\"${styles.errorText} ${styleOverrides.errorText}\">{{$ctrl.error}}</div>\n</div>\n  `;\n}\n\nangularModule.component('rgInput', RingInputComponent);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Input NG",
      "url": "examples/input-ng/input-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n}\n\n:global(.inputs) {\n  display: flex;\n  flex-flow: column wrap;\n  max-height: 100vh;\n  margin-top: 8px;\n\n\n  & rg-input {\n    margin: 0 16px;\n  }\n}\n\ndiv:global(.dark) {\n  background: #000;\n  margin-left: 0;\n  padding-left: 16px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div\n  class=\"inputs\"\n  data-test=\"inputs\"\n  ng-app=\"Example.input\"\n  ng-controller=\"InputTestCtrl as ctrl\"\n  ng-strict-di\n>\n  <rg-input\n    size=\"M\"\n    label=\"Type something\"\n  ></rg-input>\n\n  <rg-input\n    name=\"login\"\n    size=\"M\"\n    label=\"Label and hint\"\n    placeholder=\"Hint\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Label and value\"\n    size=\"M\"\n    ng-model=\"ctrl.inputModel\"\n  ></rg-input>\n\n  <rg-input\n    placeholder=\"Hint\"\n    size=\"M\"\n    ng-model=\"ctrl.inputModel\"\n    borderless=\"true\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Active input\"\n    active=\"true\"\n    size=\"M\"\n    ng-model=\"ctrl.inputModel\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Disabled input\"\n    data-disabled=\"true\"\n    size=\"M\"\n    ng-model=\"ctrl.inputModel\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Invalid input\"\n    size=\"M\"\n    error=\"Error description that wraps over lines because of being really long\"\n    ng-model=\"ctrl.inputModel\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Short input\"\n    size=\"S\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Long input\"\n    size=\"L\"\n  ></rg-input>\n\n  <rg-input\n    label=\"Autogrowing textarea\"\n    size=\"M\"\n    multiline=\"true\"\n  ></rg-input>\n\n  <div class=\"dark\">\n    <rg-input\n      label=\"Input on dark background\"\n      placeholder=\"Hint on dark background\"\n      theme=\"dark\"\n    ></rg-input>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingInput from '@jetbrains/ring-ui/components/input-ng/input-ng';\n\nconst exampleModule = angular.module('Example.input', [RingInput]).\n  controller('InputTestCtrl', function controller() {\n    const ctrl = this;\n\n    ctrl.inputModel = 'Default value';\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Text input fields of varying size.",
  "attrs": {
    "name": "Input Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "constructor": "",
    "description": "Text input fields of varying size.",
    "example-file": "./input-ng.examples.html"
  }
};