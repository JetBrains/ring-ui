import {getByRole, render, screen} from '@testing-library/react';

import Input, {InputAttrs} from './input';

describe('Input', () => {
  const renderInput = (props?: InputAttrs) => {
    render(<Input {...props} />);
    return screen.getByTestId('ring-input');
  };

  it('should create component', () => {
    renderInput().should.exist;
  });

  it('should wrap children with div', () => {
    renderInput().should.have.tagName('div');
  });

  it('should create input by default', () => {
    const container = renderInput();
    const input = getByRole(container, 'textbox');
    should.exist(input);
    input?.should.match('input');
  });

  it('should create textarea with multiline option', () => {
    const container = renderInput({multiline: true});
    const input = getByRole(container, 'textbox');
    should.exist(input);
    input?.should.match('textarea');
  });

  it('should use passed className', () => {
    renderInput({className: 'test-class'}).should.have.class('test-class');
  });
});
