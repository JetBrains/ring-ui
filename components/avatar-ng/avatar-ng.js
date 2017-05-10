/**
 * @name Avatar Ng
 * @category Angular Components
 * @framework Angular
 * @description Provides an Angular wrapper for Avatar
 * @example
 <example name="AvatarNg">
   <file name="index.html">
      <div ng-app="test" ng-strict-di ng-controller="testCtrl as $ctrl">
        <rg-avatar size="$ctrl.AvatarSize.Size32" url="$ctrl.avatarUrl"></rg-avatar>
      </div>
   </file>

   <file name="index.js" webpack="true">
    import angular from 'angular';
    import hubConfig from 'ring-ui/site/hub-config';
    import {Size as AvatarSize} from 'ring-ui/components/avatar/avatar';
    import AvatarNg from 'ring-ui/components/avatar-ng/avatar-ng';

    angular.module('test', [AvatarNg]).controller('testCtrl', function () {
      this.AvatarSize = AvatarSize;
      this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;
    });
   </file>
 </example>
 */
import angularComponentFactory from '../global/angular-component-factory';
import Avatar from '../avatar/avatar';

export default angularComponentFactory(Avatar, 'Avatar').name;
