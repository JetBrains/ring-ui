/*global inject*/
/*global angular*/

require('angular');
require('angular-mocks');
require('./table-ng__pager');
var $ = require('jquery');

describe('TableNg Pager', function () {
  var scope;
  var $compile;
  var element;
  var $location;

  function createPager(total, top, skip) {
    element = $compile('<rg-table-pager total="' + total + '" top="' + top + '" skip="' + skip + '"></rg-table-pager>')(scope);
    scope.$digest();
  }

  beforeEach(angular.mock.module('Ring.table.pager'));

  beforeEach(inject(function ($injector) {
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));

  afterEach(function () {
    scope.$destroy();
    $location.search('page', null);
    $location.search('top', null);
  });

  it('should render pager without any controls', function () {
    createPager(5, 10, 0);
    expect($(element).hasClass('ng-hide')).to.be.true;
  });

  it('should render pager without controls', function () {
    createPager(15, 10, 0);
    expect($(element).hasClass('ng-hide')).to.be.false;
  });

  it('should render pager with 2 pages', function () {
    createPager(15, 10, 0);
    expect($(element).find('[anchor-id="table-pager-page"]').length).to.be.equal(2);
  });

  it('should render pager with 5 pages', function () {
    createPager(25, 5, 0);
    expect($(element).find('[anchor-id="table-pager-page"]').length).to.be.equal(5);
  });

  it('should render pager with 7 pages maximum', function () {
    createPager(100, 5, 0);
    expect($(element).find('[anchor-id="table-pager-page"]').length).to.be.equal(7);
  });

  it('first page should be selected as default', function () {
    createPager(100, 5, 0);
    expect($(element).find('[anchor-id="table-pager-page"]:first-child').hasClass('ring-btn_active')).to.be.true;
  });

  it('third page should be selected as default', function () {
    createPager(100, 5, 10);
    expect($(element).find('[anchor-id="table-pager-page"]:nth-child(3)').hasClass('ring-btn_active')).to.be.true;
  });

  it('third page should be selected as default with optional search param', function () {
    $location.search('page', 3);
    createPager(100, 5, 0);
    expect($(element).find('[anchor-id="table-pager-page"]:nth-child(3)').hasClass('ring-btn_active')).to.be.true;
  });

  it('change top by optional search param', function () {
    $location.search('top', 10);
    createPager(20, 5, 0);
    expect($(element).find('[anchor-id="table-pager-page"]').length).to.be.equal(2);
  });
});
