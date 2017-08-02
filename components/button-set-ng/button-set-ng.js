/**
 * @name Button Set Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Button Set.
 * @example
   <example name="Button Set Ng">
    <file name="index.html">
      <div ng-app="TestApp" ng-strict-di>
        <rg-button-set>
          <rg-button>Button 1</rg-button>
          <rg-button>Button 2</rg-button>
          <rg-button>Button 3</rg-button>
        </rg-button-set>
      </div>
    </file>
    <file name="index.js" webpack="true">
     import angular from 'angular';
     import ButtonSetNG from '@jetbrains/ring-ui/components/button-set-ng/button-set-ng';
     import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';
     angular.module('TestApp', [ButtonNG, ButtonSetNG]);
    </file>
   </example>
 */
import angular from 'angular';

const angularModule = angular.module('Ring.button-set', []);

function rgButtonSet() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    transclude: true,
    template: require('./button-set-ng.html')
  };
}

angularModule.directive('rgButtonSet', rgButtonSet);

export default angularModule.name;
