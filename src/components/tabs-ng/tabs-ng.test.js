'use strict';
require('angular/angular');
require('angular-route/angular-route');
require('angular-mocks/angular-mocks');
require('./tabs-ng');
var $ = require('jquery');

describe('TabsNg', function () {

  var $rootScope;
  var $compile;
  var $controller;

  beforeEach(window.module('Ring.tabs'));

  /* global inject */
  beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $controller = _$controller_;
  }));

  describe('DOM', function () {
    it('Empty tabs', function () {
      var element = $compile(
        '<div><ring-tabs>' +
        '</ring-tabs></div>'
      )($rootScope);

      $rootScope.$digest();

      expect($(element).children('div').is('div.ring-tabs')).to.be.true;
    });

    it('One tab', function () {
      var element = $compile(
        '<div><ring-tabs>' +
        '<ring-tabs-pane x-title="General">' +
        'General' +
        '</ring-tabs-pane>' +
        '</ring-tabs></div>'
      )($rootScope);

      $rootScope.$digest();

      var el = $(element);
      var active = el.find('.active');
      var container = el.find('div.ring-tabs__container');

      expect(active.contents().first().text()).to.be.equal('General');
      expect(container.html()).to.contain('General');
    });

    xit('Two tabs', function () {
      var element = $compile(
        '<div><ring-tabs>' +
        '<ring-tabs-pane x-title="General">' +
        'General' +
        '</ring-tabs-pane>' +
        '<ring-tabs-pane x-title="Second">' +
        'Second' +
        '</ring-tabs-pane>' +
        '</ring-tabs></div>'
      )($rootScope);
      var scope;
      $controller('RingTabsController', { $scope: scope});
      scope.control.next();

      $rootScope.$digest();

      console.log(element.html());
      var el = $(element);
      var active = el.find('.active');
      var container = el.find('div.ring-tabs__container');

      expect(active.contents().first().text()).to.be.equal('General');
      expect(container.html()).to.contain('General');
    });

  });
});
