import React from 'react';
import {shallow, mount} from 'enzyme';

import Popup from '../popup/popup';

import Message from './message';

describe('Message', () => {
  const shallowMessage = props => shallow(<Message {...props}/>);
  const mountMessage = props => mount(<Message {...props}/>);

  it('should create component', () => {
    mountMessage({title: 'foo'}).should.have.type(Message);
  });

  it('should wrap children with Popup', () => {
    shallowMessage({title: 'foo'}).should.have.type(Popup);
  });

  it('should use passed className', () => {
    shallowMessage({
      title: 'foo',
      className: 'test-class'
    }).should.have.className('test-class');
  });
});
