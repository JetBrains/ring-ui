import 'angular';
import 'angular-route';
import 'angular-mocks';

import styles from '../tabs/tabs.css';

import Tabs from './tabs-ng';

describe('Tabs Ng', () => {
  let $rootScope;
  let $compile;

  function getActiveTab(element) {
    return {
      title: element[0].querySelector('[data-test-active="true"]'),
      content: element[0].querySelector('div[ng-transclude]')
    };
  }

  beforeEach(window.module(Tabs));

  /* global inject */
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('DOM', () => {
    it('Empty tabs', () => {
      const element = $compile(
        '<rg-tabs>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();
      element[0].className.should.contain(styles.tabs);
    });

    it('One tab', () => {
      const element = $compile(
        '<rg-tabs>' +
        '<rg-tabs-pane x-title="General">' +
        'General' +
        '</rg-tabs-pane>' +
        '</rg-tabs>'
      )($rootScope);

      $rootScope.$digest();
      const tab = getActiveTab(element);

      tab.title.firstChild.should.contain.text('General');
      tab.content.should.contain.text('General');
    });

    it('Two tabs', () => {
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

      tab.title.firstChild.should.contain.text('Second');
      tab.content.should.contain.text('Second');
    });
  });
});
