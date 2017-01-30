import 'dom4';
import TestUtils from 'react-addons-test-utils';
import Input from './input-legacy';

describe('Input Legacy', () => {
  const renderComponent = params => TestUtils.renderIntoDocument(Input.factory(params));

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(renderComponent(), Input).should.be.true;
  });

  it('should create input by default', () => {
    renderComponent().node.should.match('input');
  });

  it('should create textarea with multiline option', () => {
    renderComponent({multiline: true}).node.should.match('textarea');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.have.class('test-class');
  });
});
