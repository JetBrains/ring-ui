/* global angular */
const module = angular.module('Ring.template', []);

/**
 * @name Template Ng
 * @example
  <example name="Template Ng">
    <file name="index.html">
      <div ng-app="Example.template-ng">
        <rg-template template="'<input/>'"></rg-template>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
      require('ring-ui/components/template-ng/template-ng');

      angular
      .module('Example.template-ng', ['Ring.template']);
    </file>
  </example>

  <example name="Template Ng 2">
    <file name="index.html">
      <div ng-app="Example.template-ng">
        <rg-template template="template" ng-controller="ExampleCtrl"></rg-template>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
      require('ring-ui/components/template-ng/template-ng');

      angular
      .module('Example.template-ng', ['Ring.template'])
      .controller('ExampleCtrl', function ($scope) {
        $scope.template = '<button>button</button>';
      });
    </file>
  </example>
*/

class rgTemplateController {
  constructor($scope, $element, $parse, $compile) {
    this.$scope = $scope;
    this.$parse = $parse;
    this.$compile = $compile;
    this.element = $element[0];

    $scope.$watch(() => this.buildTemplate(), ::this.render);
  }

  buildTemplate() {
    const element = this.element;
    let rawTemplate;

    if (element.tagName === 'RG-TEMPLATE') {
      rawTemplate = element.getAttribute('template');
    } else {
      rawTemplate = element.getAttribute('rg-template');
    }

    this.template = '';

    if (rawTemplate) {
      this.template = this.$parse(rawTemplate)(this.$scope);
    }

    return this.template;
  }

  render() {
    const $element = angular.element(this.element);

    if (this.template) {
      const nodes = this.$compile(this.template)(this.$scope);
      $element.append(nodes);
    } else {
      $element.empty();
    }
  }
}

function rgTemplateDirective() {
  return {
    controller: rgTemplateController
  };
}

module.directive('rgTemplate', rgTemplateDirective);

export default module.name;
