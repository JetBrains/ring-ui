import {type HTMLAttributes} from 'react';
import {render, screen} from '@testing-library/react';

import ButtonToolbar from './button-toolbar';

describe('Button Toolbar', () => {
  const renderButtonToolbar = (params?: HTMLAttributes<HTMLElement>) => {
    render(<ButtonToolbar {...params} />);
    return screen.getByTestId('ring-button-toolbar');
  };

  it('should create component', () => {
    expect(renderButtonToolbar()).to.exist;
  });

  it('should wrap children with div', () => {
    expect(renderButtonToolbar()).to.have.tagName('div');
  });

  it('should use passed className', () => {
    expect(renderButtonToolbar({className: 'test-class'})).to.have.class('test-class');
  });
});
