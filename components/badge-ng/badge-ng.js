/**
 * @name Badge Ng
 * @category Legacy Angular
 * @framework Angular
 * @tags Ring UI Language
 * @description Provides an Angular wrapper for Badge.
 * @example
  <example name="Badge Ng">
    <file type="html">
      <div ng-app="Example.badge" ng-strict-di>
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
      import angular from 'angular';
      import BadgeNg from '@jetbrains/ring-ui/components/badge-ng/badge-ng';
      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';

      angular.module('Example.badge', [BadgeNg, GroupNg]);
    </file>
  </example>
*/

import angularComponentFactory from '../global/angular-component-factory';
import BadgeNg from '../badge/badge';

export default angularComponentFactory(BadgeNg, 'Badge').name;
