import {isCompositeComponentWithType, renderIntoDocument} from 'react-addons-test-utils';

import Tooltip from './tooltip';

describe('Tooltip', function () {
  beforeEach(function () {
    this.tooltip = renderIntoDocument(Tooltip.factory({title: 'test tooltip', children: 'test elem'}));
  });

  it('should create component', function () {
    isCompositeComponentWithType(this.tooltip, Tooltip).should.be.true;
  });
});
