import React from 'react';
import {mount, render} from 'enzyme';
import defaultIcon from '@jetbrains/icons/umbrella.svg';
import expandIcon from '@jetbrains/icons/expand.svg';

import Icon from './icon';

describe('Icon', () => {
  const mountIcon = props => mount(<Icon glyph={defaultIcon} {...props}/>);
  const renderIcon = props => render(<Icon glyph={defaultIcon} {...props}/>);

  it('should create component', () => {
    mountIcon().should.have.type(Icon);
  });

  it('should render passed glyph', () => {
    const icon = renderIcon({glyph: expandIcon});
    expandIcon.should.include(icon.find('svg').html());
  });

  it('should set size 16', () => {
    const icon = renderIcon({glyph: expandIcon, size: Icon.Size.Size16});

    icon.find('svg').should.have.style('width', '16px');
    icon.find('svg').should.have.style('height', '16px');
  });

  it('should set one custom dimension', () => {
    const icon = renderIcon({glyph: expandIcon, width: 100});

    icon.find('svg').should.have.style('width', '100px');
    icon.find('svg').should.not.have.style('height');
  });

  it('should set two custom dimensions', () => {
    const icon = renderIcon({glyph: expandIcon, width: 99, height: 66});

    icon.find('svg').should.have.style('width', '99px');
    icon.find('svg').should.have.style('height', '66px');
  });

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = renderIcon({glyph: expandIcon, className: CUSTOM_CSS_CLASS});

    icon.should.have.className(CUSTOM_CSS_CLASS);
  });
});
