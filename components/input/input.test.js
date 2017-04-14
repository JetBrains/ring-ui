import 'dom4';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';
import Input from './input';

describe('Input', () => {
  const renderComponent = params => renderIntoDocument(Input.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Input).should.be.true;
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
