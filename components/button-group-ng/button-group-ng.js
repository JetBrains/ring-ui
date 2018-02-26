import angular from 'angular';
import 'dom4';

import styles from '../button-group/button-group.css';

/**
 * @name Button Group Ng
 * @tags Ring UI Language
 * @category Legacy Angular
 * @description Provides an Angular wrapper for Button Group.
 * @example
   <example name="Button Group Ng">
    <file name="index.html">
      <div ng-app="test" ng-strict-di>
        <div rg-button-group>
          <span rg-button-group-caption>Side</span>
          <rg-button>Left</rg-button>
          <rg-button>Right</rg-button>
        </div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';
      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';

      angular.module('test', [ButtonNg, ButtonGroupNg]);
    </file>
   </example>
 */

const angularModule = angular.module('Ring.button-group', []);

function rgButtonGroup() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      element.classList.add(...styles.buttonGroup.split(' '));
    }
  };
}

function rgButtonGroupCaption() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      element.classList.add(...styles.caption.split(' '));
    }
  };
}

angularModule.directive('rgButtonGroup', rgButtonGroup);
angularModule.directive('rgButtonGroupCaption', rgButtonGroupCaption);

export default angularModule.name;
