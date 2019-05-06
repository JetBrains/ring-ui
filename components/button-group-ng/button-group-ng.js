import angular from 'angular';

import classNames from 'classnames';
import 'dom4';

import styles from '../button-group/button-group.css';

import {buttonGroup} from './button-group-ng.css';

/**
 * @name Button Group Ng
 */

const angularModule = angular.module('Ring.button-group', []);
const buttonGroupClasses = classNames(styles.buttonGroup, buttonGroup);

function rgButtonGroup() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      element.classList.add(...buttonGroupClasses.split(' '));
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
