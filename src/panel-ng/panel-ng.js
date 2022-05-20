/**
 * @name Panel Ng
 */
import angular from 'angular';

import styles from '../panel/panel.css';
import {addClasses} from '../global/dom';


const angularModule = angular.module('Ring.panel', []);

angularModule.directive('rgPanel', function rgEqualValueDirective() {
  return {
    link: function link(scope, iElement) {
      addClasses(iElement[0].classList, styles.panel);
    }
  };
});

export default angularModule.name;
