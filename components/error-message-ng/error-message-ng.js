import angular from 'angular';

import IconNG from '../icon-ng/icon-ng';
import LinkNG from '../link-ng/link-ng';

import styles from '../error-message/error-message.css';

/**
 * @name Error Message Ng
 */

const angularModule = angular.module('Ring.error-message', [IconNG, LinkNG]);

angularModule.directive('rgErrorMessage', function rgErrorMessageDirective() {
  return {
    replace: true,
    transclude: true,
    template: `
<div class="${styles.errorMessage}" data-test="ring-error-message">

    <rg-icon class="${styles.icon}" glyph="{{icon}}" color="gray" size="64"></rg-icon>
    
    <div class="${styles.content}">
      <div class="${styles.title}">
        <span ng-if="code">{{ code }}:</span>
        {{ message }}
      </div>
      
      <div class="${styles.description}" ng-transclude></div>
      
      
       <div ng-if="links">
          <span ng-repeat="link in links">
            <rg-link ng-if="link.target" ng-href="{{link.href}}" target="{{link.target}}">{{link.text}}</rg-link><rg-link
            ng-if="!link.target" ng-href="{{link.href}}">{{link.text}}</rg-link>{{$last ? '' : ','}}
          </span>
        </div>
    </div>
</div>
    `,
    restrict: 'E',

    scope: {
      code: '@',
      message: '@',
      links: '=',
      icon: '@'
    }
  };
});

export default angularModule.name;
