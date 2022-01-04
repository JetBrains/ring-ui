import angular from 'angular';

import styles from '../loader-inline/loader-inline.css';

/**
 * @name Loader Inline Ng
 */


const angularModule = angular.module('Ring.loader-inline', []);

angularModule.
  component('rgLoaderInline', {
    template: `<div data-test="ring-loader-inline-ng" class="${styles.loader}"></div>`
  });

export default angularModule.name;
