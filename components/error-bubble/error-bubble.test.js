import 'dom4';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Input from '../input/input';

import ErrorBubble from './error-bubble';

describe('Error Bubble', () => {
  const renderComponent = params => renderIntoDocument(ErrorBubble.factory(params, Input.factory()));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), ErrorBubble).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should not show error bubble by default', () => {
    renderComponent().node.should.not.contain('.ring-error-bubble');
  });

  it('should show error bubble', () => {
    renderComponent({error: 'test'}).node.should.contain('.ring-error-bubble');
  });

  it('should use passed className', () => {
    renderComponent({error: 'test', className: 'test-class'}).node.should.contain('.test-class');
  });
});
