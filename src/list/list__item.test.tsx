import {shallow, mount} from 'enzyme';

import Icon from '../icon/icon';
import Checkbox from '../checkbox/checkbox';

import ListItem from './list__item';
import {ListDataItemProps} from './consts';


describe('ListItem', () => {
  const shallowListItem = (props?: Partial<ListDataItemProps>) =>
    shallow(<ListItem {...props as ListDataItemProps}/>);
  const mountListItem = (props?: Partial<ListDataItemProps>) =>
    mount(<ListItem {...props as ListDataItemProps}/>);


  it('should create component', () => {
    mountListItem().should.have.type(ListItem);
  });


  it('should use passed className', () => {
    shallowListItem({className: 'test-class'}).find('button').should.
      have.className('test-class');
  });


  it('should add data test attributes', () => {
    shallowListItem().should.
      match('div[data-test="ring-list-item ring-list-item-action"]');
  });


  it('should remove ring-list-item-action data-test attribute if item is disabled', () => {
    shallowListItem({disabled: true}).should.
      match('div[data-test="ring-list-item"]');
  });


  it('should add data-test attribute if item is selected', () => {
    shallowListItem({checkbox: false}).should.
      match('div[data-test="ring-list-item ring-list-item-action"]');

    shallowListItem({checkbox: true}).should.
      match('div[data-test="ring-list-item ring-list-item-action ring-list-item-selected"]');
  });


  it('should render checkbox icon', () => {
    const checked = shallowListItem({checkbox: true}).
      find(Checkbox).prop('checked');
    true.should.equal(checked);

    shallowListItem({checkbox: undefined}).
      find(Checkbox).length.should.equal(0);
  });


  it('should not render check mark icon', () => {
    shallowListItem().should.not.
      containMatchingElement(<Icon/>);
  });
});
