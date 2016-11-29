import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Confirm from './confirm';

describe('Confirm', () => {
  const renderComponent = params => renderIntoDocument(Confirm.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Confirm).should.be.true;
  });
});
