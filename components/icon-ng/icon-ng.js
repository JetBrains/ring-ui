import angular from 'angular';
import 'dom4';

import {resolveRelativeURL} from '../global/url';
import {Color, Size} from '../icon/icon__constants';
import styles from '../icon/icon.css';

/**
 * @name Icon Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Provides an Angular wrapper for Icon.
 * @example
    <example name="Icon Ng">
      <file name="index.html">
        <div ng-app="TestApp" ng-strict-di ng-controller="testCtrl">
          <rg-icon glyph="{{icon}}" size="14"></rg-icon>
          <rg-icon glyph="{{icon}}"></rg-icon>
          <rg-icon glyph="{{icon}}" color="MAGENTA"></rg-icon>
          <rg-icon glyph="{{icon}}" color="{{'BLUE'}}" loading="true"></rg-icon>
          <rg-icon glyph="{{icon}}" size="64"></rg-icon>
          <rg-icon glyph="{{error}}" height="80" width="100"></rg-icon>
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

const angularModule = angular.module('Ring.icon', []);
const DEFAULT_SIZE = Size.Size32;

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
    template: (tElem, tAttrs) => {
      const isSprite = tAttrs.glyph[0] === '#';

      if (isSprite) {
        return `
<svg
  class="${styles.glyph}"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  ng-style="style"
>
  <use ng-href="{{glyphPath}}" xlink:href=""></use>
</svg>`;
      }

      return tAttrs.glyph;
    },
    controller: $scope => {
      $scope.$watch('glyph', value => {
        $scope.glyphPath = resolveRelativeURL(value);
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
        if (!width && !height) {
          const sizeString = `${size || DEFAULT_SIZE}px`;
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
