import React from 'react';
import {shallow, mount} from 'enzyme';

import PopupMenu from '../popup-menu/popup-menu';
import Anchor from '../dropdown/anchor';

import DropdownMenu from './dropdown-menu';

const waitForCondition = (condition, rejectMessage) => new Promise((resolve, reject) => {
  const interval = 10;
  const maxWaitingTime = 2000;
  let remainingTime = maxWaitingTime;

  const intervalId = setInterval(() => {
    if (condition()) {
      clearInterval(intervalId);
      resolve();
    } else if (remainingTime < 0) {
      clearInterval(intervalId);
      reject(new Error(rejectMessage));
    } else {
      remainingTime -= interval;
    }
  }, interval);
});

describe('Dropdown Menu', () => {
  const shallowDropdownMenu = props => shallow(<DropdownMenu id="test-list-id" {...props}/>);
  const mountDropdownMenu = props => mount(<DropdownMenu id="test-list-id" {...props}/>);

  const mountAndWaitForMenuContent = async props => {
    const wrapper = mountDropdownMenu(props);

    wrapper.find('button').getDOMNode().click();
    await waitForCondition(
      () => !!wrapper.find(PopupMenu).length,
      'List was not rendered in a dropdown menu'
    );

    return wrapper;
  };

  it('should create component', () => {
    shallowDropdownMenu({anchor: 'Anchor text'}).should.exist;
  });

  it('should open List', async () => {
    const wrapper = await mountAndWaitForMenuContent({anchor: 'Anchor text'});

    const list = wrapper.find(PopupMenu).instance().list;
    list.should.exist;

    //We need it to maintain compatibility between Dropdown Menu and List
    list.props.data.length.should.equal(0);
  });

  it('should pass params to List', async () => {
    const wrapper = await mountAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}]
    });

    shallow(wrapper.find(PopupMenu).instance().list.renderItem({index: 1})).should.exist;
  });

  it('should add accessibility attributes to anchor', async () => {
    const wrapper = await mountAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}, {key: 'key2'}],
      menuProps: {activateFirstItem: true}
    });

    const anchorProps = wrapper.update().find(Anchor).props();
    anchorProps['aria-owns'].should.equal('test-list-id');
    anchorProps['aria-activedescendant'].should.contain(':key1');
  });
});
