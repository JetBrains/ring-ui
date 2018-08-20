window.source = {
  "title": "Tooltip Ng",
  "url": "tooltip-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport 'dom4';\nimport {createElement} from 'react';\nimport {render} from 'react-dom';\nimport classNames from 'classnames';\n\nimport Popup from '../popup/popup';\n\nimport './tooltip-ng.scss';\n\n/**\n * @name Tooltip Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Tooltip.\n * @example\n    <example name=\"Tooltip Ng\">\n      <file name=\"index.html\">\n        <div class=\"tooltip-example\" ng-app=\"tooltip-test\" ng-strict-di>\n          <div ng-controller=\"testController\">\n            Some text that needs an explanation\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"'Test message'\"></rg-icon>\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{testMessageWithQuote}}\"></rg-icon>\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{someUndefinedValue}}\"></rg-icon>\n          </div>\n        </div>\n      </file>\n\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';\n        import TooltipNG from '@jetbrains/ring-ui/components/tooltip-ng/tooltip-ng';\n        import {WarningIcon} from '@jetbrains/ring-ui/components/icon';\n\n        angular.module('tooltip-test', [IconNG, TooltipNG]).controller('testController', ($scope) => {\n          $scope.warningIcon = WarningIcon;\n          $scope.testMessageWithQuote = 'It\\'s a message with a single quotation mark';\n        });\n      </file>\n\n      <file name=\"index.css\">\n        :global(.tooltip-example) {\n          margin: 16px;\n        }\n      </file>\n    </example>\n*/\n\nconst OPEN_CLASS = 'ring-tooltip-ng_open';\n\n\nconst name = angular.module('Ring.tooltip', []);\n\nname.directive('rgTooltip', function rgTooltipDirective(RgTooltipPopup) {\n  return {\n    restrict: 'A',\n\n    link: function link(scope, iElement, iAttrs) {\n      const element = iElement[0];\n      const getTooltipText = () => {\n        try {\n          return scope.$eval(iAttrs.rgTooltip);\n        } catch (err) {\n          return iAttrs.rgTooltip;\n        }\n      };\n      const popupWrapper = new RgTooltipPopup(element, getTooltipText);\n\n      element.addEventListener('mouseover', () => {\n        popupWrapper.displayTooltip(iAttrs.rgTooltipClass);\n        element.classList.add(OPEN_CLASS);\n      });\n\n      element.addEventListener('mouseout', () => {\n        popupWrapper.hideTooltip();\n        element.classList.remove(OPEN_CLASS);\n      });\n    }\n  };\n});\n\nname.factory('RgTooltipPopup', function RgTooltipPopupDirective() {\n  // eslint-disable-next-line func-names\n  return function (anchorElement, textGetter) {\n    this.wrapperElement = document.createElement('span');\n\n    this.defaultProps = {\n      anchorElement,\n      maxHeight: 400,\n      attached: false,\n      dontCloseOnAnchorClick: true\n    };\n\n    this.renderPopup = props => {\n      this.popup = render(\n        createElement(Popup, {\n          ...this.defaultProps,\n          ...props\n        }, this.text),\n        this.wrapperElement\n      );\n    };\n\n    this.displayTooltip = customClass => {\n      const text = textGetter();\n      if (!text) {\n        return;\n      }\n\n      this.text = text;\n\n      const className = classNames({\n        'ring-tooltip-ng': true\n      }, customClass);\n\n      this.renderPopup({\n        hidden: false,\n        className\n      });\n    };\n\n    this.hideTooltip = () => {\n      this.renderPopup({\n        hidden: true\n      });\n    };\n  };\n});\n\nexport default name.name;\n",
  "examples": [
    {
      "name": "Tooltip Ng",
      "url": "examples/tooltip-ng/tooltip-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div class=\"tooltip-example\" ng-app=\"tooltip-test\" ng-strict-di>\n  <div ng-controller=\"testController\">\n    Some text that needs an explanation\n    <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"'Test message'\"></rg-icon>\n    <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{testMessageWithQuote}}\"></rg-icon>\n    <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{someUndefinedValue}}\"></rg-icon>\n  </div>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';\nimport TooltipNG from '@jetbrains/ring-ui/components/tooltip-ng/tooltip-ng';\nimport {WarningIcon} from '@jetbrains/ring-ui/components/icon';\n\nangular.module('tooltip-test', [IconNG, TooltipNG]).controller('testController', ($scope) => {\n  $scope.warningIcon = WarningIcon;\n  $scope.testMessageWithQuote = 'It\\'s a message with a single quotation mark';\n});\n      ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.tooltip-example) {\n  margin: 16px;\n}\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Tooltip.",
  "attrs": {
    "name": "Tooltip Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Tooltip.",
    "example": "    <example name=\"Tooltip Ng\">\n      <file name=\"index.html\">\n        <div class=\"tooltip-example\" ng-app=\"tooltip-test\" ng-strict-di>\n          <div ng-controller=\"testController\">\n            Some text that needs an explanation\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"'Test message'\"></rg-icon>\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{testMessageWithQuote}}\"></rg-icon>\n            <rg-icon glyph=\"{{warningIcon}}\" size=\"16\" rg-tooltip=\"{{someUndefinedValue}}\"></rg-icon>\n          </div>\n        </div>\n      </file>\n\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';\n        import TooltipNG from '@jetbrains/ring-ui/components/tooltip-ng/tooltip-ng';\n        import {WarningIcon} from '@jetbrains/ring-ui/components/icon';\n\n        angular.module('tooltip-test', [IconNG, TooltipNG]).controller('testController', ($scope) => {\n          $scope.warningIcon = WarningIcon;\n          $scope.testMessageWithQuote = 'It\\'s a message with a single quotation mark';\n        });\n      </file>\n\n      <file name=\"index.css\">\n        :global(.tooltip-example) {\n          margin: 16px;\n        }\n      </file>\n    </example>"
  }
};