import {render, screen} from '@testing-library/react';

import ErrorMessage, {ErrorMessageProps} from './error-message';

describe('Error Message', () => {
  const renderErrorMessage = (props?: ErrorMessageProps) => render(<ErrorMessage {...props} />);

  it('should create component', () => {
    renderErrorMessage();
    expect(screen.getByTestId('ring-error-message')).to.exist;
  });

  it('should wrap children with div', () => {
    renderErrorMessage();
    expect(screen.getByTestId('ring-error-message')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderErrorMessage({className: 'test-class'});
    expect(screen.getByTestId('ring-error-message')).to.have.class('test-class');
  });
});
