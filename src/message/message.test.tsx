import {render, screen} from '@testing-library/react';

import Message, {MessageAttrs} from './message';

describe('Message', () => {
  const renderMessage = (props: MessageAttrs) => {
    render(<Message {...props} />);
    return screen.getByTestId('ring-popup');
  };

  it('should wrap children with Popup', () => {
    renderMessage({title: 'foo'}).should.exist;
  });

  it('should use passed className', () => {
    renderMessage({
      title: 'foo',
      className: 'test-class',
    }).should.have.class('test-class');
  });
});
