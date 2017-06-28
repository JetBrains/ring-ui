import React from 'react';
import {shallow, mount} from 'enzyme';

import Input from '../input-legacy/input-legacy';

import ErrorBubble from './error-bubble';

describe('Error Bubble', () => {
  const shallowErrorBubble = params => shallow(
    <ErrorBubble {...params}>
      <Input/>
    </ErrorBubble>
  );
  const mountErrorBubble = params => mount(
    <ErrorBubble {...params}>
      <Input/>
    </ErrorBubble>
  );

  it('should create component', () => {
    mountErrorBubble().should.have.type(ErrorBubble);
  });

  it('should wrap children with div', () => {
    shallowErrorBubble().should.have.tagName('div');
  });

  it('should not show error bubble by default', () => {
    shallowErrorBubble().should.not.have.descendants('.ring-error-bubble');
  });

  it('should show error bubble', () => {
    shallowErrorBubble({error: 'test'}).should.have.descendants('.ring-error-bubble');
  });

  it('should use passed className', () => {
    shallowErrorBubble({error: 'test', className: 'test-class'}).should.have.descendants('.test-class');
  });
});
