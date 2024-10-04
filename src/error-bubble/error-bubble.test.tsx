import {render, screen} from '@testing-library/react';

import Input, {InputAttrs} from '../input/input';

import ErrorBubble, {ErrorBubbleProps} from './error-bubble';

describe('Error Bubble', () => {
  const renderErrorBubble = (params?: Partial<ErrorBubbleProps<Omit<InputAttrs, 'ref'>>>) =>
    render(
      <ErrorBubble {...params}>
        <Input/>
      </ErrorBubble>
    );

  it('should create component', () => {
    renderErrorBubble();
    screen.getByTestId('ring-error-bubble-wrapper').should.exist;
  });

  it('should wrap children with div', () => {
    renderErrorBubble();
    screen.getByTestId('ring-error-bubble-wrapper').should.have.tagName('div');
  });

  it('should not show error bubble by default', () => {
    renderErrorBubble();
    should.not.exist(screen.queryByTestId('ring-error-bubble'));
  });

  it('should show error bubble', () => {
    renderErrorBubble({error: 'test'});
    screen.getByTestId('ring-error-bubble').should.exist;
  });

  it('should use passed className', () => {
    renderErrorBubble({error: 'test', className: 'test-class'});
    screen.getByTestId('ring-error-bubble').should.have.class('test-class');
  });
});
