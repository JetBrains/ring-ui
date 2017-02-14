/* eslint-disable func-names */

import {isCompositeComponentWithType, renderIntoDocument} from 'react-addons-test-utils';
import React from 'react';
import {findDOMNode} from 'react-dom';
import Icon from './icon';
import expandIcon from 'jetbrains-icons/expand.svg';
import {resolveRelativeURL} from '../global/url';

describe('Icon', () => {
  const renderComponent = props => renderIntoDocument(<Icon {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent({glyph: expandIcon}), Icon).should.equal(true);
  });

  it('should render passed glyph', () => {
    const icon = renderComponent({glyph: expandIcon});
    findDOMNode(icon).query('use').should.have.attr('xlink:href', resolveRelativeURL(expandIcon));
  });

  it('should set size 16', () => {
    const icon = renderComponent({glyph: expandIcon, size: Icon.Size.Size16});

    findDOMNode(icon).query('svg').should.have.attr('style').contain('width: 16px');
    findDOMNode(icon).query('svg').should.have.attr('style').contain('height: 16px');
  });

  it('should set one custom dimension', () => {
    const icon = renderComponent({glyph: expandIcon, width: 100});

    findDOMNode(icon).query('svg').should.have.attr('style').contain('width: 100px');
    findDOMNode(icon).query('svg').should.have.attr('style').not.contain('height:');
  });

  it('should set two custom dimensions', () => {
    const icon = renderComponent({glyph: expandIcon, width: 99, height: 66});

    findDOMNode(icon).query('svg').should.have.attr('style').contain('width: 99px');
    findDOMNode(icon).query('svg').should.have.attr('style').contain('height: 66px');
  });

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = renderComponent({glyph: expandIcon, className: CUSTOM_CSS_CLASS});

    findDOMNode(icon).should.have.class(CUSTOM_CSS_CLASS);
  });
});
