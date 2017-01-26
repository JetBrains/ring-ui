/* eslint-disable func-names */

import {isCompositeComponentWithType, renderIntoDocument, Simulate} from 'react-addons-test-utils';
import Icon from './icon';
import expandIcon from 'jetbrains-icons/expand.svg';
import urlUtils from '../global/url-utils';

describe('Icon', () => {
  beforeEach(function () {
    this.icon = renderIntoDocument(Icon.factory({
      glyph: expandIcon
    }));
  });

  it('should create component', function () {
    isCompositeComponentWithType(this.icon, Icon).should.equal(true);
  });

  it('should render passed glyph', function () {
    this.icon.node.query('use').should.have.attr('xlink:href', urlUtils.resolveRelativeURL(expandIcon));
  });

  it('should set size 16', function () {
    this.icon.rerender({size: Icon.Size.Size16});

    this.icon.node.query('svg').should.have.attr('style').contain('width: 16px');
    this.icon.node.query('svg').should.have.attr('style').contain('height: 16px');
  });

  it('should set one custom dimension', function () {
    this.icon.rerender({width: 100});

    this.icon.node.query('svg').should.have.attr('style').contain('width: 100px');
    this.icon.node.query('svg').should.have.attr('style').not.contain('height:');
  });

  it('should set two custom dimensions', function () {
    this.icon.rerender({width: 99, height: 66});

    this.icon.node.query('svg').should.have.attr('style').contain('width: 99px');
    this.icon.node.query('svg').should.have.attr('style').contain('height: 66px');
  });

  it('should set custom class', function () {
    const CUSTOM_CSS_CLASS = 'my-icon';

    this.icon.rerender({className: CUSTOM_CSS_CLASS});
    this.icon.node.should.have.class(CUSTOM_CSS_CLASS);
  });

  it('should set active color', function () {
    this.icon.rerender({
      activeColor: Icon.Color.GREEN,
      onClick: () => 'test'
    });

    Simulate.click(this.icon.node);
    this.icon.node.should.have.class('ring-icon_green');
  });

  it('should remove active color after Promise resolve', function (done) {
    this.icon.rerender({
      activeColor: Icon.Color.GREEN,
      onClick: () => 'test'
    });

    Simulate.click(this.icon.node);

    setTimeout(() => {
      this.icon.node.should.not.have.class('ring-icon_green');
      done();
    }, 100); // Haven't found other way to detect re-render in order to support IE10
  });

  it('should not set active color without onClick', function () {
    this.icon.rerender({
      activeColor: Icon.Color.GREEN
    });

    Simulate.click(this.icon.node);
    this.icon.node.should.not.have.class('ring-icon_green');
  });

  it('should set hover color', function () {
    this.icon.rerender({
      hoverColor: Icon.Color.RED
    });

    Simulate.mouseOver(this.icon.node);
    this.icon.node.should.have.class('ring-icon_red');
  });

  it('should set active color after hover', function () {
    this.icon.rerender({
      hoverColor: Icon.Color.RED,
      activeColor: Icon.Color.GREEN,
      onClick: () => 'test'
    });

    Simulate.mouseOver(this.icon.node);
    Simulate.click(this.icon.node);

    this.icon.node.should.have.class('ring-icon_green');
    this.icon.node.should.not.have.class('ring-icon_red');
  });

  it('should not set hover color after click', function () {
    this.icon.rerender({
      hoverColor: Icon.Color.RED,
      activeColor: Icon.Color.GREEN,
      onClick: () => 'test'
    });

    Simulate.click(this.icon.node);
    Simulate.mouseOver(this.icon.node);

    this.icon.node.should.have.class('ring-icon_green');
    this.icon.node.should.not.have.class('ring-icon_red');
  });
});
