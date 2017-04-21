import '../loader-inline/loader-inline.scss';

/**
 * @name Loader Inline Ng
 * @category Angular Components
 * @framework Angular
 * @constructor
 * @description Wraps markup for loader-inline component
 * @example
    <example name="loader-inline-ng">
      <file name="index.html">
        <div ng-app="TestApp">
          <rg-loader-inline></rg-loader-inline>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import LoaderInline from  'ring-ui/components/loader-inline-ng/loader-inline-ng';

        angular.module('TestApp', [LoaderInline]);
      </file>
  </example>
 */

/* global angular: false */
const angularModule = angular.module('Ring.loader-inline', []);

angularModule.
  component('rgLoaderInline', {
    // eslint-disable-next-line import/no-commonjs
    template: require('./loader-inline-ng.html')
  });

export default angularModule.name;
