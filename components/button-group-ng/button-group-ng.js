import angular from 'angular';
import 'dom4';

import {getStyles} from '../global/dom';
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
          <rg-button>Button 1</rg-button>
          <rg-button>Button 2</rg-button>
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

const CLASSNAME_FIRST = styles.first;
const CLASSNAME_LAST = styles.last;

const angularModule = angular.module('Ring.button-group', []);

function rgButtonGroup() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      const children = Array.from(element.children);

      element.classList.add(styles.buttonGroup);

      // For $watchCollection it should be Array, not jQuery collection
      $scope.$watchCollection(
        () => children.filter(node => getStyles(node).display !== 'none'),
        (newVisible, oldVisible) => {
          element.classList.toggle('ng-hide', !newVisible.length);

          if (oldVisible && oldVisible.length) {
            oldVisible[0].classList.remove(CLASSNAME_FIRST);
            oldVisible[oldVisible.length - 1].classList.remove(CLASSNAME_LAST);
          }

          if (newVisible && newVisible.length) {
            newVisible[0].classList.add(CLASSNAME_FIRST);
            newVisible[newVisible.length - 1].classList.add(CLASSNAME_LAST);
          }
        }
      );
    }
  };
}

angularModule.directive('rgButtonGroup', rgButtonGroup);

export default angularModule.name;
