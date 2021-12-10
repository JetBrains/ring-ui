import angular from 'angular';

import styles from '../loader-inline/loader-inline.css';
import injectStyles from '../loader-inline/inject-styles';
import Theme from '../global/theme';

/**
 * @name Loader Inline Ng
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
