/**
 * @name Group Ng
 * @category Angular Components
 * @framework Angular
 * @description Provides an Angular wrapper for Group.
 * @example
  <example name="rgGroup">
    <file type="html">
      <div ng-app="Example.group" ng-controller="ExampleCtrl as ctrl">
        <rg-group>
          <rg-button>First item</rg-button>
          <rg-button>Second item</rg-button>
        </rg-group>
      </div>
    </file>

    <file type="js">
      import 'angular/angular';
      import ButtonNg from 'ring-ui/components/button-ng/button-ng';
      import GroupNg from 'ring-ui/components/group-ng/group-ng';

      angular.module('Example.group', [ButtonNg, GroupNg]).
        controller('ExampleCtrl', angular.noop);
    </file>
  </example>
*/

import angularComponentFactory from '../global/angular-component-factory';
import GroupNg from '../group/group';

export default angularComponentFactory(GroupNg, 'Group').name;
