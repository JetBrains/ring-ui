import RingAngularComponent from '../global/ring-angular-component';
import styles from '../footer/footer.css';
import {copyright} from '../footer/footer';

/**
 * @name Footer Ng
 * @category Angular Components
 * @framework Angular
 * @constructor
 * @description Renders applicatoin's footer
 * @example
    <example name="footer-ng">
      <file name="index.html">
        <div id="footer" ng-app="TestApp" ng-strict-di>
          <rg-footer>
            <rg-footer-left>
              <rg-footer-line>Left</rg-footer-line>
              <rg-footer-line>Build 1.0.0 1234</rg-footer-line>
            </rg-footer-left>
            <rg-footer-center>
              <rg-footer-line>
                <rg-footer-copyright year="2000" company-name="JetBrains"></rg-footer-copyright>
              </rg-footer-line>
              <rg-footer-line><a class="ring-link">License agreement</a></rg-footer-line>
            </rg-footer-center>
            <rg-footer-right>
              <rg-footer-line>Right</rg-footer-line>
            </rg-footer-right>
          </rg-footer>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import Footer from 'ring-ui/components/footer-ng/footer-ng';
        import 'ring-ui/components/link/link.scss';

        angular.module('TestApp', [Footer]);
      </file>
  </example>
 */

/* global angular: false */
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
  static template = '<span>{{:: $ctrl.copyrightYears}} {{:: $ctrl.companyName}} · All rights reserved</span>';

  static bindings = {
    year: '@',
    companyName: '@'
  }

  constructor(...args) {
    super(...args);
    this.copyrightYears = copyright(this.year);
  }
}

angularModule.component('rgFooter', rgFooterComponent);
angularModule.component('rgFooterLine', rgFooterLineComponent);
angularModule.component('rgFooterCopyright', rgFooterCopyrightComponent);

export default angularModule.name;
