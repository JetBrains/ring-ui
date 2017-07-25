import React from 'react';
import {shallow} from 'enzyme';
import okIcon from 'jetbrains-icons/ok.svg';

import Tag from './tag';


describe('Tag', () => {
  const tagMock = {key: 1, label: 'test1', rgTagIcon: okIcon};

  const shallowTag = props => shallow(<Tag {...tagMock} {...props}/>);

  it('should render tags', () => {
    shallowTag().should.have.data('test', 'ring-tag');
  });

  it('should contains icon', () => {
    shallowTag().should.have.descendants('.ring-tag__ring-icon');
  });
});
