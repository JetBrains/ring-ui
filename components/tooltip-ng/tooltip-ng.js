import {createElement} from 'react';
import Popup from '../popup/popup';
import './tooltip-ng.scss';

/**
 * @name Tooltip Ng
 * @description Directive for tooltips in angular apps
 * @example
<example name="tooltip-ng">
  <file name="index.html">
    <div class="tooltip-example" ng-app="tooltip-test">
      Some text that needs explanation
      <span ng-controller="testController" rg-tooltip="'Test message'"
          react-static="Icon" react-glyph="icon" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
    </div>
  </file>

  <file name="index.js" webpack="true">
    require('./index.scss');
    require('angular');
    require('ring-ui/components/react-ng/react-ng')({
      Icon: require('ring-ui/components/icon/icon')
    });
    require('ring-ui/components/tooltip-ng/tooltip-ng');

    angular.module('tooltip-test', ['Ring.react-ng', 'Ring.tooltip']).controller('testController', ($scope) => {
      $scope.icon = require('jetbrains-icons/help.svg');
    });
  </file>

  <file name="index.scss">
    .tooltip-example {
      margin: 16px;
    }
  </file>
</example>
*/

const OPEN_CLASS = 'ring-tooltip-ng_open';

/*global angular*/
let ringTooltipModule = angular.module('Ring.tooltip', []);

ringTooltipModule.directive('rgTooltip', function ($parse, RgTooltipPopup) {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      let element = iElement[0];
      let popupWrapper = new RgTooltipPopup(element, $parse(iAttrs.rgTooltip)(scope));

      element.addEventListener('mouseover', () => {
        popupWrapper.displayTooltip();
        element.classList.add(OPEN_CLASS);
      });

      element.addEventListener('mouseout', () => {
        popupWrapper.hideTooltip();
        element.classList.remove(OPEN_CLASS);
      });
    }
  };
});

ringTooltipModule.factory('RgTooltipPopup', function () {
  return function (element, template) {
    this.popup = null;

    this.displayTooltip = () => {
      this.popup = this.popup || Popup.renderPopup(createElement(Popup, {
        anchorElement: element,
        maxHeight: 400,
        className: 'ring-tooltip-ng',
        cutEdge: false,
        onClose: evt => {
          //RG-643 Don't close tooltip when clicking by element with opened tooltip
          if (evt && element.contains(evt.target)) {
            return false;
          }
        }
      }, template));
    };

    this.hideTooltip = () => {
      this.popup.close();
      this.popup = null;
    };
  };
});
