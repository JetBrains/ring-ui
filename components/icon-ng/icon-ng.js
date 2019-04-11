import angular from 'angular';
import 'dom4';

import {Color} from '../icon/icon__constants';
import TemplateNg from '../template-ng/template-ng';
import styles from '../icon/icon.css';

import stylesOverride from './icon-ng.css';

/**
 * @name Icon Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Provides an Angular wrapper for Icon.
 * @example
    <example name="Icon Ng">
      <file name="index.html">
        <div ng-app="TestApp" ng-strict-di ng-controller="testCtrl">
          <rg-icon glyph="{{icon}}"></rg-icon>
          <rg-icon glyph="{{icon}}" color="MAGENTA"></rg-icon>
          <rg-icon glyph="{{icon}}" color="{{'BLUE'}}" loading="true"></rg-icon>
        </div>
      </file>
    <file name="index.js" webpack="true">
      import angular from 'angular';
      import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';
      import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';
      import {CheckmarkIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon';

      angular.module('TestApp', [ButtonNG, IconNG]).controller('testCtrl', function($scope) {
        $scope.icon = CheckmarkIcon;
        $scope.error = WarningIcon;
      });
    </file>
  </example>
 */

const angularModule = angular.module('Ring.icon', [TemplateNg]);
const BASE64_PREFIX = 'data:image/svg+xml;base64,';

angularModule.directive('rgIcon', function rgIconDirective() {
  return {
    restrict: 'E',
    scope: {
      glyph: '@',
      loading: '=?',
      color: '@?',
      size: '@?',
      height: '@?',
      width: '@?'
    },
    template: `<span class="${stylesOverride.glyphNg}" rg-template="normalizedGlyph" ng-style="style"></span>`,
    controller: $scope => {
      function decodeBase64IfNeeded(glyph) {
        // This hack allows passing SVG content as string from angular templates like
        // <rg-icon glyph="data:image/svg+xml;base64,PHN2ZyB4bWx...></rg-icon>
        const isEncoded = glyph.indexOf(BASE64_PREFIX) === 0;
        return isEncoded ? window.atob(glyph.replace(BASE64_PREFIX, '')) : glyph;
      }

      $scope.$watch('glyph', value => {
        if (!value) {
          return;
        }
        $scope.normalizedGlyph = decodeBase64IfNeeded(value);
      });
    },
    link: function link(scope, iElement, iAttrs) {
      iAttrs.$addClass('ring-icon'); // TODO: We keep this class for now for compatibility reasons (styles overrides)
      iAttrs.$addClass(styles.icon);

      scope.$watch('loading', value => {
        if (value) {
          iAttrs.$addClass(styles.loading);
        } else {
          iAttrs.$removeClass(styles.loading);
        }
      });

      scope.$watch(() => scope.color && Color[scope.color] && styles[Color[scope.color]],
        (colorClass, prevColorClass) => {
          if (colorClass) {
            iAttrs.$addClass(colorClass);

            // Remove previous class, but don't remove initial one
            if (prevColorClass && prevColorClass !== colorClass) {
              iAttrs.$removeClass(prevColorClass);
            }
          }
        }
      );

      scope.$watchGroup(['size', 'width', 'height'], ([size, width, height]) => {
        if (size && !width && !height) {
          const sizeString = `${size}px`;
          scope.style = {
            width: sizeString,
            height: sizeString
          };
          return;
        }

        scope.style = {};
        if (width) {
          scope.style.width = `${width}px`;
        }
        if (height) {
          scope.style.height = `${height}px`;
        }
      });
    }
  };
});

export default angularModule.name;
