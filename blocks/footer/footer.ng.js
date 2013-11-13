(function () {
  'use strict';

  /**
   *   <div id="hub-footer" footer="gray">
   *     <footer-cell col="left" row="0"
   *                  label="Ring" url="http://www.jetbrains.com/ring"></footer-cell>
   *     <footer-cell col="left" row="0"
   *                  label="by JetBrains"></footer-cell>
   *     <footer-cell col="left" row="1"
   *                  label="0.1"></footer-cell>
   *
   *
   *     <footer-cell col="center" row="0"
   *                  copyright="2000" label="JetBrains" middot="1"></footer-cell>
   *     <footer-cell col="center" row="0"
   *                  label="All rights reserved"></footer-cell>
   *
   *
   *     <footer-cell col="right" row="0"
   *                  label="Feedback"
   *                  url="https://jetpass.myjetbrains.com/youtrack/newIssue?project=JPS&clearDraft=true"></footer-cell>
   *   </div>
   */
  angular.module('Ring.footer', []).
    directive('footer', [function () {
      return {
        restrict: 'AE',
        scope: {
          'type': '@footer'
        },
        controller: ['$scope', function ($scope) {
          var ctrl = this;
          $scope.footer = {
            'type': $scope.type,
            'left': [],
            'center': [],
            'right': []
          };
          ctrl.addColumn = function (sideName, column) {
            $scope.footer[sideName] = column;
          };
          ctrl.addCell = function (sideName, rowIndex, cell) {
            var column = $scope.footer[sideName];
            column[rowIndex] = column[rowIndex] || [];
            column[rowIndex].push(cell);
          };
        }],
        link: function (scope, iElement) {
          ring('footer', 'init')(scope.footer, iElement, 'replace');
        }
      };
    }]).
    directive('footerCell', [function () {
      return {
        require: '^footer',
        restrict: 'AE',
        scope: {
          'sideName': '@col',
          'rowIndex': '@row',
          'url': '@url',
          'label': '@label',
          'middot': '@middot',
          'copyright': '@copyright',
          'title': '@title'
        },
        link: function (scope, iElement, iAttrs, footerCtrl) {
          footerCtrl.addCell(scope.sideName, scope.rowIndex || 0, {
            'url': scope.url,
            'label': scope.label,
            'middot': scope.middot !== undefined,
            'copyright': scope.copyright,
            'title': scope.title
          });
        }
      };
    }]);
}());
