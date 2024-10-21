import {shallow, mount} from 'enzyme';

import List from '../list/list';

import PopupMenu, {PopupMenuAttrs} from './popup-menu';

describe('Popup Menu', () => {
  const shallowPopupMenu = (props?: PopupMenuAttrs) => shallow(<PopupMenu {...props} />);
  const mountPopupMenu = (props?: Partial<PopupMenuAttrs>) => mount<PopupMenu>(<PopupMenu {...props} />);

  it('should create component', () => {
    shallowPopupMenu().should.exist;
  });

  it('should have List', () => {
    const list = mountPopupMenu().instance().list;
    should.exist(list);

    // We need it to maintain compatibility between Popup Menu and List
    list?.props.data.length.should.equal(0);
  });

  it('should pass params to List', () => {
    const wrapper = mountPopupMenu({data: [{}]});

    const maybeList = wrapper.instance().list;
    should.exist(maybeList);
    const list = maybeList as List;

    shallow(list.renderItem({index: 1})).should.exist;
  });
});
