/*global inject*/
/*global angular*/
/* eslint-disable angular/no-angular-mock */

import 'angular';
import 'angular-mocks';
import './table-ng__pager';

describe('TableNg Pager', function () {
  let scope;
  let $compile;
  let element;
  let $location;

  function createPager(total, top, skip) {
    element = $compile('<rg-table-pager total="' + total + '" top="' + top + '" skip="' + skip + '"></rg-table-pager>')(scope);
    scope.$digest();
  }

  beforeEach(angular.mock.module('Ring.table.pager'));

  beforeEach(inject(function ($injector) {
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    const $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));

  afterEach(function () {
    scope.$destroy();
    $location.search('page', null);
    $location.search('top', null);
  });

  it('should render pager without any controls', function () {
    createPager(5, 10, 0);
    element[0].should.have.class('ng-hide');
  });

  it('should render pager without controls', function () {
    createPager(15, 10, 0);
    element[0].should.not.have.class('ng-hide');
  });

  it('should render pager with 2 pages', function () {
    createPager(15, 10, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(2);
  });

  it('should render pager with 5 pages', function () {
    createPager(25, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(5);
  });

  it('should render pager with 7 pages maximum', function () {
    createPager(100, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(7);
  });

  it('first page should be selected as default', function () {
    createPager(100, 5, 0);
    element[0].query('[anchor-id="table-pager-page"]:first-child').should.have.class('ring-btn_active');
  });

  it('third page should be selected as default', function () {
    createPager(100, 5, 10);
    element[0].query('[anchor-id="table-pager-page"]:nth-child(3)').should.have.class('ring-btn_active');
  });

  it('third page should be selected as default with optional search param', function () {
    $location.search('page', 3);
    createPager(100, 5, 0);
    element[0].query('[anchor-id="table-pager-page"]:nth-child(3)').should.have.class('ring-btn_active');
  });

  it('change top by optional search param', function () {
    $location.search('top', 10);
    createPager(20, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(2);
  });
});
