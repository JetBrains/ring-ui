import {Inject} from 'angular-es6';

import './<%= paramCaseNameSuffix %>.scss';

/**
 * @name <%= titleCaseName %>
 * @category Angular Components
 * @framework Angular
 * @constructor
 * @description TODO add <%= titleCaseName %> description
 * @example
    <example name="<%= paramCaseNameSuffix %>">
      <file name="index.html">
        <div id="<%= paramCaseName %>" ng-app="TestApp" ng-controller="testCtrl">
          <<%= ngDirectiveTagName%> name="{{name}} ({{clicks}} clicks)" ng-click="clicks = clicks + 1"></<%= ngDirectiveTagName%>>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import <%= pascalCaseName %> from  'ring-ui/components/<%= paramCaseNameSuffix %>/<%= paramCaseNameSuffix %>';

        angular.module('TestApp', [<%= pascalCaseName %>]).controller('testCtrl', $scope => {
          $scope.name = '<%= titleCaseName %>';
          $scope.clicks = 0;
        });
      </file>
  </example>
 */

/* global angular: false */
const angularModule = angular.module('Ring.<%= paramCaseName %>', []);

class <%= ngDirectiveName %>Controller extends Inject {
  static $inject = ['$scope', '$element', '$attrs', '$compile'];

  constructor(...args) {
    super(...args);

    const {$attrs, $compile, $element, $scope} = this.$inject;
  }
}

function <%= ngDirectiveName %>Directive() {
  return {
    restrict: 'E',
    scope: {},
    controller: <%= ngDirectiveName %>Controller,
    bindToController: {
      name: '@'
    },
    template: require('./<%= paramCaseNameSuffix %>.html'),
    controllerAs: 'ctrl'
  };
}

angularModule.directive('<%= ngDirectiveName %>', <%= ngDirectiveName %>Directive);

export default angularModule.name;
