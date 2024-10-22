import {render, screen} from '@testing-library/react';

import caretDownSVG from '@jetbrains/icons/caret-down-10px';

import Button from './button';
import styles from './button.css';

describe('Button', () => {
  it('should create component', () => {
    render(<Button />);
    screen.getByRole('button').should.exist;
  });

  it('should set _default modifier', () => {
    render(<Button />);
    screen.getByRole('button').className.should.include(styles.button);
  });

  it('should set modifiers', () => {
    render(<Button active danger delayed loader primary short />);

    const className = screen.getByRole('button').className;
    className.should.include(styles.active);
    className.should.include(styles.danger);
    className.should.include(styles.delayed);
    className.should.include(styles.loader);
    className.should.include(styles.primary);
    className.should.include(styles.short);
  });

  it('should add icon', () => {
    render(<Button icon={caretDownSVG} />);

    const element = screen.getByRole('button');
    const icon = element.querySelector('svg');
    should.exist(icon);
    caretDownSVG.replace('/>', '></polygon>').should.include(icon!.innerHTML);
  });

  it('should set custom class', () => {
    const CUSTOM_CLASS = 'test';

    render(<Button className={CUSTOM_CLASS} />);

    screen.getByRole('button').should.have.class(CUSTOM_CLASS);
  });

  it('should render link instead of button if href specified', () => {
    render(<Button href="http://www.jetbrains.com" />);

    screen.getByRole('link').should.have.attr('href', 'http://www.jetbrains.com');
  });
});
