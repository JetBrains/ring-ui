import 'dom4';
import {createElement} from 'react';
import classNames from 'classnames';
import Popup from '../popup/popup';
import './tooltip-ng.scss';

/**
 * @name Tooltip Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Tooltip.
 * @example
<example name="Tooltip Ng">
  <file name="index.html">
    <div class="tooltip-example" ng-app="tooltip-test">
      <div ng-controller="testController">
        Some text that needs an explanation
        <span rg-tooltip="'Test message'"
              react-static="Icon" react-glyph="icon" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
        <span rg-tooltip="{{testMessageWithQuote}}"
              react-static="Icon" react-glyph="icon" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
      </div>
    </div>
  </file>

  <file name="index.js" webpack="true">
    require('angular');
    require('ring-ui/components/react-ng/react-ng')({
      Icon: require('ring-ui/components/icon/icon')
    });
    require('ring-ui/components/tooltip-ng/tooltip-ng');

    angular.module('tooltip-test', ['Ring.react-ng', 'Ring.tooltip']).controller('testController', ($scope) => {
      $scope.icon = require('jetbrains-icons/help.svg');
      $scope.testMessageWithQuote = 'It\'s a message with a single quotation mark';
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
const name = angular.module('Ring.tooltip', []);

name.directive('rgTooltip', RgTooltipPopup => ({
  restrict: 'A',

  link(scope, iElement, iAttrs) {
    const element = iElement[0];
    const getTooltipText = () => {
      try {
        return scope.$eval(iAttrs.rgTooltip);
      } catch (err) {
        return iAttrs.rgTooltip;
      }
    };
    const popupWrapper = new RgTooltipPopup(element, getTooltipText());

    element.addEventListener('mouseover', () => {
      popupWrapper.displayTooltip(iAttrs.rgTooltipClass);
      element.classList.add(OPEN_CLASS);
    });

    element.addEventListener('mouseout', () => {
      popupWrapper.hideTooltip();
      element.classList.remove(OPEN_CLASS);
    });
  }
}));

name.factory('RgTooltipPopup', () => function (element, template) {
  this.popup = null;

  this.displayTooltip = customClass => {
    const classes = classNames({
      'ring-tooltip-ng': true
    }, customClass);

    this.popup = this.popup || Popup.renderPopup(createElement(Popup, {
      anchorElement: element,
      maxHeight: 400,
      className: classes,
      cutEdge: false,
      onClose: evt => {
        //RG-643 Don't close tooltip when clicking by element with opened tooltip
        if (evt && element.contains(evt.target)) {
          return false;
        }

        return undefined;
      }
    }, template));
  };

  this.hideTooltip = () => {
    this.popup.close();
    this.popup = null;
  };
});

export default name.name;
