import React from 'react';
import {shallow, mount} from 'enzyme';
import expandIcon from '@jetbrains/icons/expand.svg';

import {resolveRelativeURL} from '../global/url';

import Icon from './icon';

describe('Icon', () => {
  const shallowIcon = props => shallow(<Icon {...props}/>);
  const mountIcon = props => mount(<Icon {...props}/>);

  it('should create component', () => {
    mountIcon().should.have.type(Icon);
  });

  it('should render passed glyph', () => {
    const icon = shallowIcon({glyph: expandIcon});
    icon.find('use').should.have.attr('xlink:href', resolveRelativeURL(expandIcon.toString()));
  });

  it('should set size 16', () => {
    const icon = shallowIcon({glyph: expandIcon, size: Icon.Size.Size16});

    icon.find('svg').should.have.style('width', '16px');
    icon.find('svg').should.have.style('height', '16px');
  });

  it('should set one custom dimension', () => {
    const icon = shallowIcon({glyph: expandIcon, width: 100});

    icon.find('svg').should.have.style('width', '100px');
    icon.find('svg').should.not.have.style('height');
  });

  it('should set two custom dimensions', () => {
    const icon = shallowIcon({glyph: expandIcon, width: 99, height: 66});

    icon.find('svg').should.have.style('width', '99px');
    icon.find('svg').should.have.style('height', '66px');
  });

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = shallowIcon({glyph: expandIcon, className: CUSTOM_CSS_CLASS});

    icon.should.have.className(CUSTOM_CSS_CLASS);
  });
});
