import {render, screen} from '@testing-library/react';

import Message, {type MessageAttrs} from './message';

describe('Message', () => {
  const renderMessage = (props: MessageAttrs) => {
    render(<Message {...props} />);
    return screen.getByTestId('ring-popup');
  };

  it('should wrap children with Popup', () => {
    expect(renderMessage({title: 'foo'})).to.exist;
  });

  it('should use passed className', () => {
    expect(
      renderMessage({
        title: 'foo',
        className: 'test-class',
      }),
    ).to.have.class('test-class');
  });
});
