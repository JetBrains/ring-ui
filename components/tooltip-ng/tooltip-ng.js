var Popup = require('popup/popup');
require('./tooltip-ng.scss');

/**
 * @name tooltip-ng
 * @description Directive for tooltips in angular apps
 * @example
<example name="tooltip-ng">
  <file name="index.html">
    <div ng-app='Ring.tooltip'>
      <div rg-tooltip="'Test message'"
          react-static="Icon" react-glyph="'help'" react-size="32"></div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('react-ng/react-ng')({
      Icon: require('icon/icon')
    });
    require('tooltip-ng/tooltip-ng');
  </file>
</example>
*/

/*global angular*/
angular.module('Ring.tooltip', ['Ring.react-ng'])
  .directive('rgTooltip', function ($parse, RgTooltipPopup) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var element = iElement[0];

        var popupWrapper = new RgTooltipPopup(element, $parse(iAttrs['rgTooltip'])(scope));

        element.addEventListener('mouseover', popupWrapper.displayTooltip.bind(popupWrapper));
        element.addEventListener('mouseout', popupWrapper.hideTooltip.bind(popupWrapper));
      }
    };
  })
  .factory('RgTooltipPopup', function () {
    return function (element, template) {
      this.popup = null;

      this.displayTooltip = function () {
        this.popup = this.popup || Popup.renderComponent(new Popup({
          anchorElement: element,
          maxHeight: 400,
          className: 'tooltip-ng',
          cutEdge: false
        }, template));
      };

      this.hideTooltip = function () {
        this.popup.close();
        this.popup = null;
      };
    };
  });
