import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';

/**
 * @name Template Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @example
    <example name="Template Ng">
      <file name="index.html">
        <div ng-app="Example.template-ng" ng-strict-di>
          <rg-template template="'<input/>'"></rg-template>
        </div>
      </file>
      <file name="index.js" webpack="true">
        import angular from 'angular';
        import '@jetbrains/ring-ui/components/template-ng/template-ng';

        angular
        .module('Example.template-ng', ['Ring.template']);
      </file>
    </example>

    <example name="Template Ng #2">
      <file name="index.html">
        <div ng-app="Example.template-ng" ng-strict-di>
          <rg-template template="template" ng-controller="ExampleCtrl"></rg-template>
        </div>
      </file>
      <file name="index.js" webpack="true">
        import angular from 'angular';
        import TemplateNG from '@jetbrains/ring-ui/components/template-ng/template-ng';

        angular
        .module('Example.template-ng', [TemplateNG])
        .controller('ExampleCtrl', function ($scope) {
          $scope.template = '<button>button</button>';
        });
      </file>
    </example>
*/

const angularModule = angular.module('Ring.template', []);

class RgTemplateController extends RingAngularComponent {
  static $inject = ['$scope', '$element', '$attrs', '$compile'];

  currentScope = null;

  constructor(...args) {
    super(...args);

    const {$scope, $attrs} = this.$inject;
    $scope.$watch($attrs.rgTemplate || $attrs.template, this.render);
  }

  render = template => {
    const {$scope, $element, $compile} = this.$inject;

    this.cleanup();

    this.currentScope = $scope.$new();

    this.currentScope.$evalAsync(() => {
      $element.html(template);
      this.addInnerClass();
      $compile($element.contents())(this.currentScope);
    });
  };

  addInnerClass = () => {
    const {rgTemplateClass} = this.$inject.$attrs;
    if (rgTemplateClass) {
      this.$inject.$element.contents().addClass(rgTemplateClass);
    }
  }

  cleanup() {
    if (this.currentScope) {
      this.currentScope.$destroy();
      this.currentScope = null;
    }
  }
}

angularModule.directive('rgTemplate', function rgTemplateDirective() {
  return {
    controller: RgTemplateController
  };
});

export default angularModule.name;
