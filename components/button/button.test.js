import React from 'react';
import {mount, render} from 'enzyme';
import caretDownSVG from '@jetbrains/icons/caret-down-10px.svg';

import {CaretDown10pxIcon} from '../icon/icons';

import Button from './button';
import styles from './button.css';

describe('Button', () => {
  const mountButton = props => mount(<Button {...props}/>);
  const getButtonOutput = props => mountButton(props).find('button');
  const renderButton = props => render(<Button {...props}/>);

  it('should create component', () => {
    mountButton().should.have.type(Button);
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
      icon: CaretDown10pxIcon
    });

    wrapper.hasClass(styles.withIcon).should.be.true;
    caretDownSVG.should.include(wrapper.find('svg').html());
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
