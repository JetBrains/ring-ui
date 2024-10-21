import {HTMLAttributes} from 'react';
import {render, screen} from '@testing-library/react';

import ButtonToolbar from './button-toolbar';

describe('Button Toolbar', () => {
  const renderButtonToolbar = (params?: HTMLAttributes<HTMLElement>) => {
    render(<ButtonToolbar {...params} />);
    return screen.getByTestId('ring-button-toolbar');
  };

  it('should create component', () => {
    renderButtonToolbar().should.exist;
  });

  it('should wrap children with div', () => {
    renderButtonToolbar().should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderButtonToolbar({className: 'test-class'}).should.have.class('test-class');
  });
});
