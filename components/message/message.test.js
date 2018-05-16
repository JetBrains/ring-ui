import React from 'react';
import {shallow, mount} from 'enzyme';

import Popup from '../popup/popup';

import Message from './message';

describe('Message', () => {
  const shallowMessage = props => shallow(<Message {...props}/>);
  const mountMessage = props => mount(<Message {...props}/>);

  it('should create component', () => {
    mountMessage().should.have.type(Message);
  });

  it('should wrap children with Popup', () => {
    shallowMessage().should.have.type(Popup);
  });

  it('should use passed className', () => {
    shallowMessage({
      className: 'test-class'
    }).should.have.className('test-class');
  });
});
