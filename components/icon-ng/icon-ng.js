import angular from 'angular';
import 'dom4';

import {Color} from '../icon/icon__constants';
import TemplateNg from '../template-ng/template-ng';
import styles from '../icon/icon.css';

/**
 * @name Icon Ng
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
    template: `<span class="${styles.icon}" rg-template="normalizedGlyph" rg-template-class="${styles.glyph}"></span>`,
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
        const svgNode = iElement[0].querySelector('svg');

        if (size && !width && !height) {
          const sizeString = `${size}px`;
          const style = `width: ${sizeString}; height: ${sizeString};`;
          svgNode.setAttribute('style', style);
          return;
        }

        if (width) {
          svgNode.setAttribute('style', `width: ${width}px;`);
        }
        if (height) {
          svgNode.setAttribute('style', `height: ${height}px;`);
        }
      });
    }
  };
});

export default angularModule.name;
