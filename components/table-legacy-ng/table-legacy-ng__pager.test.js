/*global inject*/
/*global angular*/
/* eslint-disable angular/no-angular-mock */

import 'angular';
import 'angular-mocks';
import TablePager from './table-legacy-ng__pager';

describe('Table Ng Pager', () => {
  let scope;
  let $compile;
  let element;
  let $location;

  function createPager(total, top, skip) {
    element = $compile(`<rg-legacy-table-pager total="${total}" top="${top}" skip="${skip}"></rg-legacy-table-pager>`)(scope);
    scope.$digest();
  }

  beforeEach(angular.mock.module(TablePager));

  beforeEach(inject($injector => {
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    const $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));

  afterEach(() => {
    scope.$destroy();
    $location.search('page', null);
    $location.search('top', null);
  });

  it('should render pager without any controls', () => {
    createPager(5, 10, 0);
    element[0].should.have.class('ng-hide');
  });

  it('should render pager without controls', () => {
    createPager(15, 10, 0);
    element[0].should.not.have.class('ng-hide');
  });

  it('should render pager with 2 pages', () => {
    createPager(15, 10, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(2);
  });

  it('should render pager with 5 pages', () => {
    createPager(25, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(5);
  });

  it('should render pager with 7 pages maximum', () => {
    createPager(100, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(7);
  });

  it('first page should be selected as default', () => {
    createPager(100, 5, 0);
    element[0].query('[anchor-id="table-pager-page"]:first-child').should.have.class('ring-button_active');
  });

  it('third page should be selected as default', () => {
    createPager(100, 5, 10);
    element[0].query('[anchor-id="table-pager-page"]:nth-child(3)').should.have.class('ring-button_active');
  });

  it('third page should be selected as default with optional search param', () => {
    $location.search('page', 3);
    createPager(100, 5, 0);
    element[0].query('[anchor-id="table-pager-page"]:nth-child(3)').should.have.class('ring-button_active');
  });

  it('change top by optional search param', () => {
    $location.search('top', 10);
    createPager(20, 5, 0);
    element[0].queryAll('[anchor-id="table-pager-page"]').should.have.length(2);
  });
});
