import angular from 'angular';
import '../loader-inline/loader-inline.scss';

/**
 * @name Loader Inline Ng
 * @category Angular Components
 * @framework Angular
 * @constructor
 * @description Wraps markup for loader-inline component.
 * @example
    <example name="Loader Inline Ng">
      <file name="index.html">
        <div ng-app="TestApp" ng-strict-di>
          <rg-loader-inline></rg-loader-inline>
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

angularModule.
  component('rgLoaderInline', {
    // eslint-disable-next-line import/no-commonjs
    template: require('./loader-inline-ng.html')
  });

export default angularModule.name;
