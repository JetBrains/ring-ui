import {shallow, mount} from 'enzyme';

import PopupMenu from '../popup-menu/popup-menu';
import Anchor from '../dropdown/anchor';

import DropdownMenu, {DropdownMenuProps} from './dropdown-menu';

const waitForCondition = (condition: () => boolean, rejectMessage: string) =>
  new Promise<void>((resolve, reject) => {
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
  const shallowDropdownMenu = <T, >(props: DropdownMenuProps<T>) =>
    shallow(<DropdownMenu id="test-list-id" {...props}/>);
  const mountDropdownMenu = <T, >(props: DropdownMenuProps<T>) =>
    mount(<DropdownMenu id="test-list-id" {...props}/>);

  const mountAndWaitForMenuContent = async <T, >(props: DropdownMenuProps<T>) => {
    const wrapper = mountDropdownMenu(props);

    wrapper.find('button').getDOMNode<HTMLElement>().click();
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

    const list = wrapper.find<PopupMenu>(PopupMenu).instance().list;
    list!.should.exist;

    //We need it to maintain compatibility between Dropdown Menu and List
    list!.props.data.length.should.equal(0);
  });

  it('should pass params to List', async () => {
    const wrapper = await mountAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}]
    });

    shallow(wrapper.find<PopupMenu>(PopupMenu).instance().list!.renderItem({index: 1})).
      should.exist;
  });

  it('should add accessibility attributes to anchor', async () => {
    const wrapper = await mountAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}, {key: 'key2'}]
    });

    const anchorProps = wrapper.update().find(Anchor).props();
    anchorProps['aria-owns']!.should.equal('test-list-id');
    anchorProps['aria-activedescendant']!.should.contain(':key1');
  });
});
