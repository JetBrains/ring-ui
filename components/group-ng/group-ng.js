/**
 * @name Group Ng
 * @category Legacy Angular
 * @framework Angular
 * @description Provides an Angular wrapper for Group.
 * @example
  <example name="Group Ng">
    <file type="html">
      <div ng-app="Example.group" ng-strict-di ng-controller="ExampleCtrl as ctrl">
        <rg-group>
          <rg-button>First item</rg-button>
          <rg-button>Second item</rg-button>
        </rg-group>
      </div>
    </file>

    <file type="js">
      import angular from 'angular';
      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';
      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';

      angular.module('Example.group', [ButtonNg, GroupNg]).
        controller('ExampleCtrl', angular.noop);
    </file>
  </example>
*/

import angular from 'angular';

import styles from '../group/group.css';

const angularModule = angular.module('Ring.group', []);

angularModule.component('rgGroup', {
  transclude: true,
  template: `<span ng-transclude class="${styles.group}"></span>`
});

export default angularModule.name;
