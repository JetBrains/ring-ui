import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Badge from './badge';
import style from './badge.css';

describe('Badge', () => {
  const renderComponent = (params, content) => renderIntoDocument(Badge.factory(params, content));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Badge).should.be.true;
  });

  it('should render span with badge class', () => {
    const node = renderComponent().node;
    node.should.match('span');
    node.should.have.class(style.badge);
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  it('should render children', () => {
    renderComponent({}, 'foo').node.textContent.should.equal('foo');
  });

  it('should render valid badge', () => {
    renderComponent({valid: true}, 'foo').node.should.have.class(style.valid);
  });
});
