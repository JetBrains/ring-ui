import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import DatePicker from './date-picker';

describe('Date Picker', () => {
  const renderComponent = params => renderIntoDocument(DatePicker.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), DatePicker).should.be.true;
  });

  it('should render a button', () => {
    renderComponent().node.should.match('button');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  it('should parse and display passed date', () => {
    renderComponent({date: '01.11.16'}).node.should.have.text('1 Nov 2016');
  });

  // TODO Add more tests
});
