require('angular/angular');
require('angular-route/angular-route');
require('angular-mocks/angular-mocks');
require('./tabs-ng');
var $ = require('jquery');

describe('TabsNg', function () {

  var $rootScope;
  var $compile;

  var getActiveTab = function (element) {
    var el = $(element);
    var active = el.find('.active');
    var container = el.find('div.ring-tabs__container');
    return {
      title: active,
      content: container
    };
  };

  beforeEach(window.module('Ring.tabs'));

  /* global inject */
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('DOM', function () {
    it('Empty tabs', function () {
      var element = $compile(
        '<rg-tabs>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();

      expect($(element).is('div.ring-tabs')).to.be.true;
    });

    it('One tab', function () {
      var element = $compile(
        '<rg-tabs>' +
        '<rg-tabs-pane x-title="General">' +
        'General' +
        '</rg-tabs-pane>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();
      var tab = getActiveTab(element);

      expect(tab.title.contents().first().text()).to.be.equal('General');
      expect(tab.content.html()).to.contain('General');
    });

    it('Two tabs', function () {
      var element = $compile(
        '<rg-tabs>' +
        '<rg-tabs-pane x-title="General">' +
        'General' +
        '</rg-tabs-pane>' +
        '<rg-tabs-pane x-title="Second">' +
        'Second' +
        '</rg-tabs-pane>' +
        '</rg-tabs>'
      )($rootScope);
      element.isolateScope().control.next();

      $rootScope.$digest();

      var tab = getActiveTab(element);

      expect(tab.title.contents().first().text()).to.be.equal('Second');
      expect(tab.content.html()).to.contain('Second');
    });

  });
});
