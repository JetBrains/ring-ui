import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';

/**
 * @name Template Ng
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
