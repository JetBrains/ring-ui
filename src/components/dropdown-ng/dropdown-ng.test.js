'use strict';
require('angular/angular');
require('angular-mocks/angular-mocks');
require('./dropdown-ng');

describe('DropdownNg', function () {

  var scope, directiveScope, element, itemsMock;

  beforeEach(window.module('Ring.dropdown'));

  /* global inject */
  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    itemsMock = [
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'}
    ];
    scope.items = itemsMock;

    element = $compile('<button class="ring-btn" ring-dropdown items="items" on-item-select="onSelect" label-field="name"></button>')(scope);
    scope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('should pass items', function () {
    expect(directiveScope.items).to.equal(scope.items);
  });

  it('should render popup', function () {
    directiveScope.renderPopup(directiveScope.items);
    expect(directiveScope.popupMenuInstance).to.be.defined;
  });

  it('should pass items to popup-menu', function () {
    directiveScope.renderPopup(directiveScope.items);
    expect(directiveScope.popupMenuInstance.props.data.length).to.equal(directiveScope.items.length);
  });

  it('should convert items on passing to popup-menu', function () {
    scope.items.push({id:3, name: 'test3'});

    scope.$digest();

    expect(directiveScope.popupMenuInstance.props.data[0].label).to.equal(scope.items[0].name);
  });

  it('should defer popup render until items is loaded', inject(function($q) {
    scope.items = $q.defer();
    scope.$digest();
    expect(directiveScope.popupMenuInstance).not.to.be.defined;

    scope.items.resolve(itemsMock);
    scope.$digest();

    expect(directiveScope.popupMenuInstance).to.be.defined;
  }));
});
