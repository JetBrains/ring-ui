import {mount} from 'enzyme';

import Popup from '../popup/popup';

import Message, {MessageAttrs} from './message';

describe('Message', () => {
  const mountMessage = (props: MessageAttrs) => mount(<Message {...props}/>);

  it('should create component', () => {
    mountMessage({title: 'foo'}).should.have.type(Message);
  });

  it('should wrap children with Popup', () => {
    mountMessage({title: 'foo'}).find(Popup).should.exist;
  });

  it('should use passed className', () => {
    mountMessage({
      title: 'foo',
      className: 'test-class'
    }).find(Popup).props().className.should.include('test-class');
  });
});
