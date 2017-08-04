/**
 * @name Group Ng
 * @category Legacy Angular Components
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

import angularComponentFactory from '../global/angular-component-factory';
import GroupNg from '../group/group';

export default angularComponentFactory(GroupNg, 'Group').name;
