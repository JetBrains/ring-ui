import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';
import styles from '../footer/footer.css';
import {copyright} from '../footer/footer';

/**
 * @name Footer Ng
 */


const angularModule = angular.module('Ring.footer', []);

class rgFooterComponent extends RingAngularComponent {
  styles = styles;

  static transclude = {
    left: '?rgFooterLeft',
    center: '?rgFooterCenter',
    right: '?rgFooterRight'
  };

  static template = require('./footer-ng.html');
}

class rgFooterLineComponent extends RingAngularComponent {
  static transclude = true;

  static template = `<div class="${styles.line}" ng-transclude></div>`;
}

class rgFooterCopyrightComponent extends RingAngularComponent {
  static template = '<span>{{:: $ctrl.copyrightYears}} {{:: $ctrl.companyName}}</span>';

  static bindings = {
    year: '@',
    companyName: '@'
  };

  $onInit() {
    this.copyrightYears = copyright(this.year);
  }
}

angularModule.component('rgFooter', rgFooterComponent);
angularModule.component('rgFooterLine', rgFooterLineComponent);
angularModule.component('rgFooterCopyright', rgFooterCopyrightComponent);

export default angularModule.name;
