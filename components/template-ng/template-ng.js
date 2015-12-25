/* global angular */
const module = angular.module('Ring.template', []);

class rgTemplateController {
  constructor($scope, $element, $parse, $compile) {
    this.$scope = $scope;
    this.$parse = $parse;
    this.$compile = $compile;
    this.element = $element[0];

    $scope.$watch(() => this.buildTemplate(), ::this.render);
  }

  buildTemplate() {
    const rawTemplate = this.element.getAttribute('template');
    this.template = '';

    if (rawTemplate) {
      this.template = this.$parse(rawTemplate)(this.$scope);
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
