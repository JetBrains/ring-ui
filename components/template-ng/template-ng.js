/* global angular */
import {Inject} from 'angular-es6';

const angularModule = angular.module('Ring.template', []);

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

class rgTemplateController extends Inject {
  static $inject = ['$scope', '$element', '$attrs', '$compile'];

  currentScope = null;

  constructor(...args) {
    super(...args);

    const {$scope, $attrs} = this.$inject;
    $scope.$watch($attrs.rgTemplate || $attrs.template, ::this.render);
  }

  render(template) {
    const {$scope, $element, $compile} = this.$inject;

    this.cleanup();

    this.currentScope = $scope.$new();

    this.currentScope.$evalAsync(() => {
      $element.html(template);
      $compile($element.contents())(this.currentScope);
    });
  }

  cleanup() {
    if (this.currentScope) {
      this.currentScope.$destroy();
      this.currentScope = null;
    }
  }
}

angularModule.directive('rgTemplate', () => ({
  controller: rgTemplateController
}));

export default angularModule.name;
