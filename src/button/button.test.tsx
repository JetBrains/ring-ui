import {render, screen} from '@testing-library/react';

import caretDownSVG from '@jetbrains/icons/caret-down-10px';

import Button from './button';
import styles from './button.css';

describe('Button', () => {
  it('should create component', () => {
    render(<Button />);
    expect(screen.getByRole('button')).to.exist;
  });

  it('should set _default modifier', () => {
    render(<Button />);
    expect(screen.getByRole('button').className).to.include(styles.button);
  });

  it('should set modifiers', () => {
    render(<Button active danger delayed loader primary short />);

    const className = screen.getByRole('button').className;
    expect(className).to.include(styles.active);
    expect(className).to.include(styles.danger);
    expect(className).to.include(styles.delayed);
    expect(className).to.include(styles.loader);
    expect(className).to.include(styles.primary);
    expect(className).to.include(styles.short);
  });

  it('should add icon', () => {
    render(<Button icon={caretDownSVG} />);

    const element = screen.getByRole('button');
    const icon = element.querySelector('svg');
    expect(icon).to.exist;
    expect(caretDownSVG.replace('/>', '></polygon>')).to.include(icon!.innerHTML);
  });

  it('should set custom class', () => {
    const CUSTOM_CLASS = 'test';

    render(<Button className={CUSTOM_CLASS} />);

    expect(screen.getByRole('button')).to.have.class(CUSTOM_CLASS);
  });

  it('should render link instead of button if href specified', () => {
    render(<Button href="http://www.jetbrains.com" />);

    expect(screen.getByRole('link')).to.have.attr('href', 'http://www.jetbrains.com');
  });
});
