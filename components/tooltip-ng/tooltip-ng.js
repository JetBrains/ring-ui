var Popup = require('popup/popup');
require('./tooltip-ng.scss');

/**
 * @name Tooltip Ng
 * @description Directive for tooltips in angular apps
 * @example
<example name="tooltip-ng">
  <file name="index.html">
    <div class="tooltip-example" ng-app='tooltip-test'>
      Some text that needs explanation
      <span ng-controller="testController" rg-tooltip="'Test message'"
          react-static="Icon" react-glyph="helpIcon" react-size="16" react-class="'ring-tooltip-ng__hint-icon'"></span>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('./foo.scss');
    require('icon/source/help.svg');
    require('angular/angular.min.js');
    require('react-ng/react-ng')({
      Icon: require('icon/icon')
    });
    require('tooltip-ng/tooltip-ng');

    angular.module('tooltip-test', ['Ring.react-ng', 'Ring.tooltip']).
      controller('testController', function($scope) {
        $scope.helpIcon = require('icon/source/help.svg');
      });
  </file>
  <file name="foo.scss">
    @import 'global/global';

    .tooltip-example {
      margin: $ring-unit*2;
    }
  </file>
</example>
*/

var OPEN_CLASS = 'ring-tooltip-ng_open';

/*global angular*/
angular.module('Ring.tooltip', [])
  .directive('rgTooltip', function ($parse, RgTooltipPopup) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var element = iElement[0];

        var popupWrapper = new RgTooltipPopup(element, $parse(iAttrs['rgTooltip'])(scope));

        element.addEventListener('mouseover', function () {
          popupWrapper.displayTooltip();
          iElement.addClass(OPEN_CLASS);
        });
        element.addEventListener('mouseout', function () {
          popupWrapper.hideTooltip();
          iElement.removeClass(OPEN_CLASS);
        });
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
          className: 'ring-tooltip-ng',
          cutEdge: false,
          onClose: function (evt) {
            //RG-643 Don't close tooltip when clicking by element with opened tooltip
            if (evt && element.contains(evt.target)) {
              return false;
            }
          }
        }, template));
      };

      this.hideTooltip = function () {
        this.popup.close();
        this.popup = null;
      };
    };
  });
