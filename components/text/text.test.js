import React from 'react';
import {shallow, mount} from 'enzyme';

import Text from './text';

describe('Text', () => {
  const shallowText = props => shallow(<Text {...props}/>);
  const mountText = props => mount(<Text {...props}/>);

  it('should create component', () => {
    mountText().should.have.type(Text);
  });

  it('should wrap children with span', () => {
    shallowText().should.have.tagName('span');
  });

  it('should use passed className', () => {
    shallowText({className: 'test-class'}).should.have.className('test-class');
  });

  it('should use pass rest props to dom node', () => {
    shallowText({'data-test': 'foo'}).should.have.data('test', 'foo');
  });
});
