import React from 'react';
import {shallow, mount} from 'enzyme';

import Icon from '../icon';
import Checkbox from '../checkbox/checkbox';

import ListItem from './list__item';


describe('ListItem', () => {
  const shallowListItem = props => shallow(<ListItem {...props}/>);
  const mountListItem = props => mount(<ListItem {...props}/>);


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
    shallowListItem({checkbox: true}).
      find(Checkbox).prop('checked').should.be.true;

    shallowListItem({checkbox: undefined}).
      find(Checkbox).length.should.equal(0);
  });


  it('should not render check mark icon', () => {
    shallowListItem().should.not.
      containMatchingElement(<Icon/>);
  });
});
