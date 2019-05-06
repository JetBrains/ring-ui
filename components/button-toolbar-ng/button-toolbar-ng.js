import angular from 'angular';
import 'dom4';

import styles from '../button-toolbar/button-toolbar.css';

/**
 * @name Button Toolbar Ng
 */

const angularModule = angular.module('Ring.button-toolbar', []);

function rgButtonToolbar() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      element.classList.add(...styles.buttonToolbar.split(' '));
    }
  };
}

angularModule.directive('rgButtonToolbar', rgButtonToolbar);

export default angularModule.name;
