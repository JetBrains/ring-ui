import {getByRole, render, screen} from '@testing-library/react';

import Input, {InputAttrs} from './input';

describe('Input', () => {
  const renderInput = (props?: InputAttrs) => {
    render(<Input {...props} />);
    return screen.getByTestId('ring-input');
  };

  it('should create component', () => {
    expect(renderInput()).to.exist;
  });

  it('should wrap children with div', () => {
    expect(renderInput()).to.have.tagName('div');
  });

  it('should create input by default', () => {
    const container = renderInput();
    const input = getByRole(container, 'textbox');
    expect(input).to.exist;
    expect(input).to.match('input');
  });

  it('should create textarea with multiline option', () => {
    const container = renderInput({multiline: true});
    const input = getByRole(container, 'textbox');
    expect(input).to.exist;
    expect(input).to.match('textarea');
  });

  it('should use passed className', () => {
    expect(renderInput({className: 'test-class'})).to.have.class('test-class');
  });
});
