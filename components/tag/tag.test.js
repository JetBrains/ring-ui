import React from 'react';
import {shallow} from 'enzyme';
import checkMarkIcon from '@jetbrains/icons/checkmark.svg';

import Icon from '../icon/icon';

import Tag from './tag';


describe('Tag', () => {
  const tagMock = {key: 1, label: 'test1', rgTagIcon: checkMarkIcon};

  const shallowTag = props => shallow(<Tag {...tagMock} {...props}/>);

  it('should render tags', () => {
    shallowTag().should.have.data('test', 'ring-tag');
  });

  it('should contains icon', () => {
    shallowTag().find(Icon).should.have.className('ring-tag__ring-icon');
  });
});
