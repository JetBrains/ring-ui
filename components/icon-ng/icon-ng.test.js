import 'dom4';

import 'angular';
import 'angular-mocks';
import {CheckmarkIcon, WarningIcon} from '../icon';
import styles from '../icon/icon.css';

import Icon from './icon-ng';

const XLINK_NS = 'http://www.w3.org/1999/xlink';

// Temporary turn off until it is not clear how to implement icon-ng inline svg
describe.skip('Icon Ng', () => {
  let scope;
  let element;
  let $compile;

  beforeEach(window.module(Icon));

  /* global inject */
  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    scope.icon = CheckmarkIcon;
    $compile = _$compile_;

    element = $compile(`
      <rg-icon
      color="{{color}}"
      glyph="{{icon}}"
      loading="loading"
      ></rg-icon>
    `)(scope)[0];
    scope.$digest();
  }));

  it('should set base class', () => {
    element.should.match(`rg-icon.${styles.icon}`);
  });

  it('should contain non-empty use element', () => {
    // queries like 'use[*|href="#ok"]' do not work in IE
    element.query('use').getAttributeNS(XLINK_NS, 'href').should.equal(CheckmarkIcon.glyph);
  });

  it('should change use element content', () => {
    scope.icon = WarningIcon;
    scope.$digest();
    element.query('use').getAttributeNS(XLINK_NS, 'href').should.equal(WarningIcon.glyph);
  });

  it('should remove use element content', () => {
    scope.icon = '';
    scope.$digest();
    element.should.not.contain('use[*|href]');
  });

  it('should not have loading class initially', () => {
    element.should.not.match(`.${styles.loading}`);
  });

  it('should set loading class', () => {
    scope.loading = true;
    scope.$digest();
    element.should.match(`.${styles.loading}`);
  });

  it('should remove loading class', () => {
    scope.loading = true;
    scope.$digest();
    scope.loading = false;
    scope.$digest();
    element.should.not.match(`.${styles.loading}`);
  });

  it('should set color class', () => {
    scope.color = 'BLUE';
    scope.$digest();
    element.should.match(`.${styles.blue}`);
  });

  it('should remove previous color class', () => {
    scope.color = 'BLUE';
    scope.$digest();
    scope.color = 'MAGENTA';
    scope.$digest();
    element.should.not.match('.ring-icon_blue');
  });
});
