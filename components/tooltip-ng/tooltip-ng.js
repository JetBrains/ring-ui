import 'dom4';
import {createElement} from 'react';
import {render} from 'react-dom';
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
                  react-static="Icon" react-glyph="iconHelp" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
            <span rg-tooltip="{{testMessageWithQuote}}"
                  react-static="Icon" react-glyph="iconHelp" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
            <span rg-tooltip="{{someUndefinedValue}}"
                  react-static="Icon" react-glyph="iconInfo" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
          </div>
        </div>
      </file>

      <file name="index.js" webpack="true">
        import 'angular';
        import registerComponents from 'ring-ui/components/react-ng/react-ng';
        import Icon from 'ring-ui/components/icon/icon';
        import 'ring-ui/components/tooltip-ng/tooltip-ng';
        import iconHelp from 'jetbrains-icons/help.svg';
        import iconInfo from 'jetbrains-icons/info.svg';

        registerComponents({Icon});

        angular.module('tooltip-test', ['Ring.react-ng', 'Ring.tooltip']).controller('testController', ($scope) => {
          $scope.iconHelp = iconHelp;
          $scope.iconInfo = iconInfo;
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
}));

name.factory('RgTooltipPopup', () => function (anchorElement, textGetter) {
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
});

export default name.name;
