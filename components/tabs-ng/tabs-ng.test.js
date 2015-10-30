import 'angular';
import 'angular-route';
import 'angular-mocks';
import './tabs-ng';
import $ from 'jquery';

describe('TabsNg', function () {
  let $rootScope;
  let $compile;

  function getActiveTab(element) {
    const el = $(element);
    const active = el.find('.active');
    const container = el.find('div.ring-tabs__container');
    return {
      title: active,
      content: container
    };
  }

  beforeEach(window.module('Ring.tabs'));

  /* global inject */
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('DOM', function () {
    it('Empty tabs', function () {
      const element = $compile(
        '<rg-tabs>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();

      expect($(element).is('div.ring-tabs')).to.be.true;
    });

    it('One tab', function () {
      const element = $compile(
        '<rg-tabs>' +
        '<rg-tabs-pane x-title="General">' +
        'General' +
        '</rg-tabs-pane>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();
      const tab = getActiveTab(element);

      expect(tab.title.contents().first().text()).to.be.equal('General');
      expect(tab.content.html()).to.contain('General');
    });

    it('Two tabs', function () {
      const element = $compile(
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

      const tab = getActiveTab(element);

      expect(tab.title.contents().first().text()).to.be.equal('Second');
      expect(tab.content.html()).to.contain('Second');
    });

  });
});
