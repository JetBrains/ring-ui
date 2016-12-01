import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Pager from './pager';

describe('Pager', () => {
  const props = {total: 2, current: 1, goto: () => {}};
  const renderComponent = params => renderIntoDocument(Pager.factory(Object.assign({}, props, params)));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Pager).should.be.true;
  });

  it('should return null instead of node when total is less than 2', () => {
    should.not.exist(renderComponent({total: 1}).node);
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });
});
