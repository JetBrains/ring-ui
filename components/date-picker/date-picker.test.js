import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import DatePicker from './date-picker';

describe('Date Picker', () => {
  const renderComponent = params => renderIntoDocument(DatePicker.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), DatePicker).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  // TODO Add more tests
});
