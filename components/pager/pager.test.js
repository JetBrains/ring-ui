import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Pager from './pager';

describe('Pager', () => {
  const renderComponent = params => renderIntoDocument(Pager.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Pager).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });
});
