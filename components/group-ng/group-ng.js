/**
 * @name Group Ng
*/

import angular from 'angular';

import styles from '../group/group.css';

const angularModule = angular.module('Ring.group', []);

angularModule.component('rgGroup', {
  transclude: true,
  template: `<span ng-transclude class="${styles.group}"></span>`
});

export default angularModule.name;
