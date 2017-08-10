import React from 'react';
import {shallow, mount, render} from 'enzyme';
import CaretDownIcon from '@jetbrains/icons/caret-down.svg';

import Button from './button';

describe('Button', () => {
  const shallowButton = props => shallow(<Button {...props}/>);
  const mountButton = props => mount(<Button {...props}/>);
  const renderButton = props => render(<Button {...props}/>);

  it('should create component', () => {
    mountButton().should.have.type(Button);
  });

  it('should set _default modifier', () => {
    shallowButton().should.have.className('ring-button_default');
  });

  it('should set modifiers', () => {
    const wrapper = shallowButton({
      active: true,
      blue: true,
      danger: true,
      delayed: true,
      loader: true,
      primary: true,
      short: true
    });

    wrapper.should.have.className('ring-button_active');
    wrapper.should.have.className('ring-button_blue');
    wrapper.should.have.className('ring-button_danger');
    wrapper.should.have.className('ring-button_delayed');
    wrapper.should.have.className('ring-button_loader');
    wrapper.should.have.className('ring-button_primary');
    wrapper.should.have.className('ring-button_short');
  });

  it('should add icon', () => {
    const wrapper = renderButton({
      icon: CaretDownIcon
    });

    wrapper.should.have.className('ring-button_icon');
    wrapper.should.have.descendants('svg[style*="16"]');
    wrapper.find('use').should.have.attr('xlink:href', '#caret-down');
  });

  it('should set custom class', () => {
    const CUSTOM_CLASS = 'test';

    const wrapper = shallowButton({
      className: CUSTOM_CLASS
    });

    wrapper.should.have.className(CUSTOM_CLASS);
  });
});
