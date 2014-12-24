'use strict';
require('angular/angular');
require('angular-mocks/angular-mocks');
require('./dropdown-ng');

describe('DropdownNg', function () {

  var scope, directiveScope, element;

  beforeEach(window.module('Ring.dropdown'));

  /* global inject */
  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.options = [
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'}
    ];

    element = $compile('<button class="ring-btn" ring-dropdown options="options" on-item-select="onSelect" label-field="name"></button>')(scope);
    scope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('Should pass options', function () {
    expect(directiveScope.options).to.equal(scope.options);
  });

  it('Should render popup', function () {
    directiveScope.renderPopup(directiveScope.options);
    expect(directiveScope.popupMenuInstance).to.be.defined;
  });

  it('Should pass options to popup-menu', function () {
    directiveScope.renderPopup(directiveScope.options);
    expect(directiveScope.popupMenuInstance.props.data.length).to.equal(directiveScope.options.length);
  });

  it('Should convert options on passing to popup-menu', function () {
    scope.options.push({id:3, name: 'test3'});

    scope.$digest();

    expect(directiveScope.popupMenuInstance.props.data[0].label).to.equal(scope.options[0].name);
  });
});
