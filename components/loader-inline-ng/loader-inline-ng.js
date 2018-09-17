import angular from 'angular';

import styles from '../loader-inline/loader-inline.css';
import injectStyles from '../loader-inline/inject-styles';
import Theme from '../global/theme';

/**
 * @name Loader Inline Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @framework Angular
 * @constructor
 * @description Wraps markup for loader-inline component.
 * @example
    <example name="Loader Inline Ng">
      <file name="index.html">
        <div ng-app="TestApp" ng-strict-di>
           <div>
             <span>some text on top</span>
             <div>before <rg-loader-inline></rg-loader-inline> Some text after</div>
             <div>some text under loader</div>
           </div>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import LoaderInline from  '@jetbrains/ring-ui/components/loader-inline-ng/loader-inline-ng';

        angular.module('TestApp', [LoaderInline]);
      </file>
  </example>
 */


const angularModule = angular.module('Ring.loader-inline', []);

class LoaderController {
  $onInit() {
    injectStyles();

    this.theme = this.theme || Theme.LIGHT;
  }

  getThemeClass = () => `${styles.loader}_${this.theme}`;
}

angularModule.
  component('rgLoaderInline', {
    bindings: {
      theme: '@?'
    },
    template: `<div data-test="ring-loader-inline-ng" class="${styles.loader}" ng-class="$ctrl.getThemeClass()"></div>`,
    controller: LoaderController
  });

export default angularModule.name;
