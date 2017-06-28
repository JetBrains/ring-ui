import React from 'react';
import {shallow} from 'enzyme';
import GroupIcon from 'jetbrains-icons/group.svg';

import Tag from './tag';


describe('Tag', () => {
  const tagMock = {key: 1, label: 'test1', rgTagIcon: GroupIcon};

  const shallowTag = props => shallow(<Tag {...tagMock} {...props}/>);

  it('should render tags', () => {
    shallowTag().should.have.data('test', 'ring-tag');
  });

  it('should contains icon', () => {
    shallowTag().should.have.descendants('.ring-tag__ring-icon');
  });
});
