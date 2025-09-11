import {render, screen} from '@testing-library/react';

import Input, {type InputAttrs} from '../input/input';
import ErrorBubble, {type ErrorBubbleProps} from './error-bubble';

describe('Error Bubble', () => {
  const renderErrorBubble = (params?: Partial<ErrorBubbleProps<Omit<InputAttrs, 'ref'>>>) =>
    render(
      <ErrorBubble {...params}>
        <Input />
      </ErrorBubble>,
    );

  it('should create component', () => {
    renderErrorBubble();
    expect(screen.getByTestId('ring-error-bubble-wrapper')).to.exist;
  });

  it('should wrap children with div', () => {
    renderErrorBubble();
    expect(screen.getByTestId('ring-error-bubble-wrapper')).to.have.tagName('div');
  });

  it('should not show error bubble by default', () => {
    renderErrorBubble();
    expect(screen.queryByTestId('ring-error-bubble')).to.not.exist;
  });

  it('should show error bubble', () => {
    renderErrorBubble({error: 'test'});
    expect(screen.getByTestId('ring-error-bubble')).to.exist;
  });

  it('should use passed className', () => {
    renderErrorBubble({error: 'test', className: 'test-class'});
    expect(screen.getByTestId('ring-error-bubble')).to.have.class('test-class');
  });
});
