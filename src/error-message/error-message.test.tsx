import {render, screen} from '@testing-library/react';

import ErrorMessage, {ErrorMessageProps} from './error-message';

describe('Error Message', () => {
  const renderErrorMessage = (props?: ErrorMessageProps) => render(<ErrorMessage {...props} />);

  it('should create component', () => {
    renderErrorMessage();
    screen.getByTestId('ring-error-message').should.exist;
  });

  it('should wrap children with div', () => {
    renderErrorMessage();
    screen.getByTestId('ring-error-message').should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderErrorMessage({className: 'test-class'});
    screen.getByTestId('ring-error-message').should.have.class('test-class');
  });
});
