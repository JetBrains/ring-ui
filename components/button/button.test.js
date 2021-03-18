import React from 'react';
import {mount, render} from 'enzyme';
import caretDownSVG from '@jetbrains/icons/caret-down-10px';

import Button from './button';
import styles from './button.css';

describe('Button', () => {
  const mountButton = props => mount(<Button {...props}/>);
  const getButtonOutput = props => mountButton(props).find('button');
  const renderButton = props => render(<Button {...props}/>);

  it('should create component', () => {
    mountButton().type().should.equal(Button.type);
  });

  it('should set _default modifier', () => {
    getButtonOutput().hasClass(styles.button).should.be.true;
  });

  it('should set modifiers', () => {
    const wrapper = getButtonOutput({
      active: true,
      danger: true,
      delayed: true,
      loader: true,
      primary: true,
      short: true
    });

    wrapper.hasClass(styles.active).should.be.true;
    wrapper.hasClass(styles.danger).should.be.true;
    wrapper.hasClass(styles.delayed).should.be.true;
    wrapper.hasClass(styles.loader).should.be.true;
    wrapper.hasClass(styles.primary).should.be.true;
    wrapper.hasClass(styles.short).should.be.true;
  });

  it('should add icon', () => {
    const wrapper = renderButton({
      icon: caretDownSVG
    });

    wrapper.hasClass(styles.withIcon).should.be.true;
    caretDownSVG.
      replace('/>', '></path>').
      should.include(wrapper.find('svg').html());
  });

  it('should set custom class', () => {
    const CUSTOM_CLASS = 'test';

    const wrapper = getButtonOutput({
      className: CUSTOM_CLASS
    });

    wrapper.hasClass(CUSTOM_CLASS).should.be.true;
  });

  it('should render link instead of button if href specified', () => {
    const linkButton = mountButton({href: 'http://www.jetbrains.com'}).find('a');
    linkButton.should.exist;
    linkButton.should.have.attr('href', 'http://www.jetbrains.com');
  });
});
