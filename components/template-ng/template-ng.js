/* global angular */
const module = angular.module('Ring.template', []);

class rgTemplateController {
  constructor($scope, $element, $attrs, $parse, $compile) {
    this.$scope = $scope;
    this.$parse = $parse;
    this.$compile = $compile;
    this.element = $element[0];

    $scope.$watch(() => this.buildTemplate(), ::this.render);
  }

  buildTemplate() {
    const attr = this.element.getAttribute('template');
    this.template = '';

    if (attr) {
      this.template = this.$parse(attr)(this.$scope);
    }

    return this.template;
  }

  render() {
    this.element.innerHTML = this.template;
    if (this.template) {
      this.$compile(this.element.childNodes)(this.$scope);
    }
  }
}

function rgTemplateDirective() {
  return {
    restrict: 'E',
    controller: rgTemplateController
  };
}

module.directive('rgTemplate', rgTemplateDirective);

export default module.name;
