import 'dom4';

import 'angular';
import 'angular-mocks';
import Icon from './icon-ng';

import okIcon from 'jetbrains-icons/ok.svg';
import warningIcon from 'jetbrains-icons/warning.svg';

const XLINK_NS = 'http://www.w3.org/1999/xlink';

describe('IconNg', function () {
  let scope;
  let element;
  let $compile;

  beforeEach(window.module(Icon));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    scope.icon = okIcon;
    $compile = _$compile_;

    element = $compile('<rg-icon color="{{color}}" glyph="{{icon}}" loading="loading" size="{{size}}" height="{{height}}" width="{{width}}"></rg-icon>')(scope)[0];
    scope.$digest();
  }));

  it('should set base class', function () {
    element.should.match('rg-icon.ring-icon');
  });

  it('should contain non-empty use element', function () {
    // queries like 'use[*|href="#ok"]' do not work in IE
    element.query('use').getAttributeNS(XLINK_NS, 'href').should.equal(okIcon);
  });

  it('should change use element content', function () {
    scope.icon = warningIcon;
    scope.$digest();
    element.query('use').getAttributeNS(XLINK_NS, 'href').should.equal(warningIcon);
  });

  it('should remove use element content', function () {
    scope.icon = '';
    scope.$digest();
    element.should.not.contain('use[*|href]');
  });

  it('should not have loading class initially', function () {
    element.should.not.match('.ring-icon_loading');
  });

  it('should set loading class', function () {
    scope.loading = true;
    scope.$digest();
    element.should.match('.ring-icon_loading');
  });

  it('should remove loading class', function () {
    scope.loading = true;
    scope.$digest();
    scope.loading = false;
    scope.$digest();
    element.should.not.match('.ring-icon_loading');
  });

  it('should set color class', function () {
    scope.color = 'BLUE';
    scope.$digest();
    element.should.match('.ring-icon_blue');
  });

  it('should remove previous color class', function () {
    scope.color = 'BLUE';
    scope.$digest();
    scope.color = 'ORANGE';
    scope.$digest();
    element.should.not.match('.ring-icon_blue');
  });

  it('should set default size', function () {
    element.query('svg').should.have.attr('style', 'width: 32px; height: 32px;');
  });

  it('should set size', function () {
    scope.size = 64;
    scope.$digest();
    element.query('svg').should.have.attr('style', 'width: 64px; height: 64px;');
  });

  it('should set width', function () {
    scope.width = 64;
    scope.$digest();
    element.query('svg').should.have.attr('style', 'width: 64px;');
  });

  it('should set height', function () {
    scope.height = 64;
    scope.$digest();
    element.query('svg').should.have.attr('style', 'height: 64px;');
  });

  it('should set width and height', function () {
    scope.height = 67;
    scope.width = 76;
    scope.$digest();
    element.query('svg').should.have.attr('style', 'width: 76px; height: 67px;');
  });
});
