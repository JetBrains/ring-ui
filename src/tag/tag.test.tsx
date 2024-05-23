import React from 'react';
import {shallow} from 'enzyme';
import closeIcon from '@jetbrains/icons/close';

import Icon from '../icon/icon';

import Tag, {TagAttrs} from './tag';

describe('Tag', () => {
  const tagMock = {label: 'test1', rgTagIcon: closeIcon};

  const shallowTag = (props?: TagAttrs) => shallow(<Tag key="1" {...tagMock} {...props}/>);

  it('should render tags', () => {
    shallowTag().find('button').should.have.data('test', 'ring-tag');
  });

  it('should contains icon', () => {
    shallowTag().find(Icon).length.should.not.equal(0);
  });
});
