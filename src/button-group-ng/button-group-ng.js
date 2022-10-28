import angular from 'angular';

import classNames from 'classnames';

import styles from '../button-group/button-group.css';

import ngStyles from './button-group-ng.css';

/**
 * @name Button Group Ng
 */

const angularModule = angular.module('Ring.button-group', []);
const buttonGroupClasses = classNames(styles.buttonGroup, ngStyles.buttonGroup);

function rgButtonGroup() {
  return {
    restrict: 'A',
    link: function link($scope, iElement, attrs) {
      const element = iElement[0];
      if (attrs.split) {
        element.classList.add(...styles.split.split(' '));
      } else {
        element.classList.add(...buttonGroupClasses.split(' '));
      }
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
