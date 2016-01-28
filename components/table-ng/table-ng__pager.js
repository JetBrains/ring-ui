/*global angular*/
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

const module = angular.module('Ring.table.pager', [MessageBundle]);
module.directive('rgTablePager', ['$location', 'RingMessageBundle', function ($location, RingMessageBundle) {
  return {
    restrict: 'E',
    template: require('./table-ng__pager.html'),
    scope: {
      skip: '=',
      top: '=',
      total: '=',
      onPageChange: '&'
    },
    replace: true,
    link: function (scope, element, attrs) {
      const defaultMaxPagesToShow = 7;
      scope.maxPages = attrs.maxPages || defaultMaxPagesToShow;
      scope.selectedPageNum = 1;

      if (scope.maxPages % 2 === 0) {
        scope.maxPages++;
      }

      scope.nextPageText = RingMessageBundle.next_page();
      scope.previousPageText = RingMessageBundle.previous_page();
      scope.firstPageText = RingMessageBundle.first_page();
      scope.lastPageText = RingMessageBundle.last_page();

      let openPageAfterInit = $location.search().page || (Math.floor(scope.skip / scope.top) + 1);

      scope.calculatePageClass = function (pageNum) {
        const condition = pageNum === scope.selectedPageNum;
        return {
          'ring-button_light-blue': condition,
          'ring-button_active': condition,
          'ring-button_upper': condition
        };
      };

      scope.getTopOptionLabel = function (itemsPerPage) {
        return itemsPerPage + ' ' + RingMessageBundle.items_per_page();
      };

      scope.loadPage = function (pageNum, firstLoad) {
        pageNum = parseInt(pageNum, 10);
        if (pageNum < 1) {
          pageNum = 1;
        } else if (pageNum > scope.totalPages) {
          pageNum = scope.totalPages;
        }

        scope.selectedPageNum = pageNum;

        scope.onPageChange({
          pageNum: scope.selectedPageNum,
          itemsPerPage: scope.top,
          firstLoad: firstLoad
        });

        $location.search('page', pageNum);
      };

      scope.topChange = function (newItemsPerPage) {
        scope.top = newItemsPerPage;
        $location.search('top', newItemsPerPage);
        scope.loadPage(1);
      };

      scope.$watchGroup(['skip', 'total', 'top'], function () {
        scope.show = false;
        const top = $location.search().top || +scope.top;
        const total = scope.total;
        const skip = scope.skip;

        scope.top = top;
        scope.topOptions = [20, 50, 100];

        if (total !== undefined && skip !== undefined && top !== undefined) {
          if (total > 0 && total > top) {
            scope.totalPages = Math.ceil(total / top);
            scope.show = true;
            scope.itemsPerPage = top;

            if (scope.selectedPageNum > scope.totalPages) {
              scope.loadPage(scope.totalPages);
              return;
            }

            scope.startPage = 1;

            if (scope.maxPages < scope.totalPages) {
              scope.endPage = scope.maxPages;
              scope.sideBySidePages = (scope.maxPages - 1) / 2;
              const freeSpaceLeft = (scope.selectedPageNum - 1) - scope.sideBySidePages;
              const freeSpaceRight = scope.totalPages - (scope.selectedPageNum + scope.sideBySidePages);

              if (freeSpaceLeft > 0) {
                scope.startPage = freeSpaceLeft + 1 + (freeSpaceRight < 0 ? freeSpaceRight : 0);
                scope.endPage = scope.startPage + scope.maxPages - 1;
              } else {
                scope.endPage = scope.selectedPageNum + scope.sideBySidePages + (freeSpaceLeft < 0 ? freeSpaceLeft * -1 : 0);
              }
            } else {
              scope.endPage = scope.totalPages;
            }

            scope.pages = [];
            for (let i = scope.startPage; i <= scope.endPage; i++) {
              scope.pages.push(i);
            }

            if (openPageAfterInit) {
              scope.selectedPageNum = +openPageAfterInit;
              scope.loadPage(openPageAfterInit, true);
              openPageAfterInit = null;
            }
          }
        }
      });
    }
  };
}]);

export default module.name;
