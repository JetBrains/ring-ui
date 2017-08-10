import React from 'react';
import {shallow} from 'enzyme';
import CheckMarkIcon from '@jetbrains/icons/checkmark.svg';

import Tag from './tag';


describe('Tag', () => {
  const tagMock = {key: 1, label: 'test1', rgTagIcon: CheckMarkIcon};

  const shallowTag = props => shallow(<Tag {...tagMock} {...props}/>);

  it('should render tags', () => {
    shallowTag().should.have.data('test', 'ring-tag');
  });

  it('should contains icon', () => {
    shallowTag().should.have.descendants(CheckMarkIcon);
  });
});
