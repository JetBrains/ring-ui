import angular from 'angular';

import 'dom4';
import {createElement} from 'react';
import {render} from 'react-dom';
import classNames from 'classnames';

import Popup from '../popup/popup';

import './tooltip-ng.scss';

/**
 * @name Tooltip Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Provides an Angular wrapper for Tooltip.
 * @example
    <example name="Tooltip Ng">
      <file name="index.html">
        <div class="tooltip-example" ng-app="tooltip-test" ng-strict-di>
          <div ng-controller="testController">
            Some text that needs an explanation
            <rg-icon glyph="{{warningIcon}}" rg-tooltip="'Test message'"></rg-icon>
            <rg-icon glyph="{{warningIcon}}" rg-tooltip="{{testMessageWithQuote}}"></rg-icon>
            <rg-icon glyph="{{warningIcon}}" rg-tooltip="{{someUndefinedValue}}"></rg-icon>
          </div>
        </div>
      </file>

      <file name="index.js" webpack="true">
        import angular from 'angular';
        import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';
        import TooltipNG from '@jetbrains/ring-ui/components/tooltip-ng/tooltip-ng';
        import {WarningIcon} from '@jetbrains/ring-ui/components/icon';

        angular.module('tooltip-test', [IconNG, TooltipNG]).controller('testController', ($scope) => {
          $scope.warningIcon = WarningIcon;
          $scope.testMessageWithQuote = 'It\'s a message with a single quotation mark';
        });
      </file>

      <file name="index.css">
        :global(.tooltip-example) {
          margin: 16px;
        }
      </file>
    </example>
*/

const OPEN_CLASS = 'ring-tooltip-ng_open';


const name = angular.module('Ring.tooltip', []);

name.directive('rgTooltip', function rgTooltipDirective(RgTooltipPopup) {
  return {
    restrict: 'A',

    link: function link(scope, iElement, iAttrs) {
      const element = iElement[0];
      const getTooltipText = () => {
        try {
          return scope.$eval(iAttrs.rgTooltip);
        } catch (err) {
          return iAttrs.rgTooltip;
        }
      };
      const popupWrapper = new RgTooltipPopup(element, getTooltipText);

      element.addEventListener('mouseover', () => {
        popupWrapper.displayTooltip(iAttrs.rgTooltipClass);
        element.classList.add(OPEN_CLASS);
      });

      element.addEventListener('mouseout', () => {
        popupWrapper.hideTooltip();
        element.classList.remove(OPEN_CLASS);
      });
    }
  };
});

name.factory('RgTooltipPopup', function RgTooltipPopupDirective() {
  // eslint-disable-next-line func-names
  return function (anchorElement, textGetter) {
    this.wrapperElement = document.createElement('span');

    this.defaultProps = {
      anchorElement,
      maxHeight: 400,
      attached: false,
      dontCloseOnAnchorClick: true
    };

    this.renderPopup = props => {
      this.popup = render(
        createElement(Popup, {
          ...this.defaultProps,
          ...props
        }, this.text),
        this.wrapperElement
      );
    };

    this.displayTooltip = customClass => {
      const text = textGetter();
      if (!text) {
        return;
      }

      this.text = text;

      const className = classNames({
        'ring-tooltip-ng': true
      }, customClass);

      this.renderPopup({
        hidden: false,
        className
      });
    };

    this.hideTooltip = () => {
      this.renderPopup({
        hidden: true
      });
    };
  };
});

export default name.name;
