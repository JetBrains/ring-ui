import React from 'react';
import {shallow, mount} from 'enzyme';

import Popup from '../popup/popup';

import Message, {MessageAttrs} from './message';

describe('Message', () => {
  const shallowMessage = (props: MessageAttrs) => shallow(<Message {...props}/>);
  const mountMessage = (props: MessageAttrs) => mount(<Message {...props}/>);

  it('should create component', () => {
    mountMessage({title: 'foo'}).should.have.type(Message);
  });

  it('should wrap children with Popup', () => {
    shallowMessage({title: 'foo'}).find(Popup).should.exist;
  });

  it('should use passed className', () => {
    shallowMessage({
      title: 'foo',
      className: 'test-class'
    }).find(Popup).should.have.className('test-class');
  });
});
