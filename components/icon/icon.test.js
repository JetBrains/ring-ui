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

  it('should set custom class', () => {
    const CUSTOM_CSS_CLASS = 'my-icon';
    const icon = renderIcon({glyph: expandIcon, className: CUSTOM_CSS_CLASS});

    icon.should.have.className(CUSTOM_CSS_CLASS);
  });
});
