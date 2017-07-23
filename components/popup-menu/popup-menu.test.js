import React from 'react';
import {shallow, mount} from 'enzyme';

import PopupMenu from './popup-menu';

describe('Popup Menu', () => {
  const shallowPopupMenu = props => shallow(<PopupMenu {...props}/>);
  const mountPopupMenu = props => mount(<PopupMenu {...props}/>);

  it('should create component', () => {
    shallowPopupMenu().should.exist;
  });

  it('should have List', () => {
    const list = mountPopupMenu().instance().list;
    list.should.exist;

    // We need it to maintain compatibility between Popup Menu and List
    list.props.data.length.should.equal(0);
  });

  it('should pass params to List', () => {
    const wrapper = mountPopupMenu({data: [
      {}
    ]});

    shallow(wrapper.instance().list.renderItem({index: 1})).should.exist;
  });
});
