import React from 'react';
import {mount} from 'enzyme';

import Fragment from './fragment';

describe('Fragment', () => {
  it('should render its children', () => {
    const wrapper = mount(<Fragment>{'Hello, '}<span>{'World!'}</span></Fragment>);
    wrapper.should.have.text('Hello, ');
    wrapper.should.containMatchingElement(<span>{'World!'}</span>);
  });
});
