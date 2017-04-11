import 'dom4';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import ButtonToolbar from './button-toolbar';

describe('Button Toolbar', () => {
  const renderComponent = params => renderIntoDocument(ButtonToolbar.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), ButtonToolbar).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });
});
