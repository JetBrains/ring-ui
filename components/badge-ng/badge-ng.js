/**
 * @name Badge Ng
 * @category Angular Components
 * @framework Angular
 * @description Provides an Angular wrapper for Badge.
 * @example
  <example name="rgBadge">
    <file type="html">
      <div ng-app="Example.badge" ng-controller="ExampleCtrl as ctrl">
        <rg-group>
          <rg-badge>simple</rg-badge>
          <rg-badge gray="true">gray</rg-badge>
          <rg-badge valid="true">valid</rg-badge>
          <rg-badge invalid="true">invalid</rg-badge>
          <rg-badge disabled="true">disabled</rg-badge>
        </rg-group>
      </div>
    </file>

    <file type="js">
      import 'angular/angular';
      import BadgeNg from 'ring-ui/components/badge-ng/badge-ng';
      import GroupNg from 'ring-ui/components/group-ng/group-ng';

      angular.module('Example.badge', [BadgeNg, GroupNg]).
        controller('ExampleCtrl', angular.noop);
    </file>
  </example>
*/

import angularComponentFactory from '../global/angular-component-factory';
import BadgeNg from '../badge/badge';
export default angularComponentFactory(BadgeNg, 'Badge').name;
