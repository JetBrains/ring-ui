import 'dom4';
import React from 'react';
import {mount} from 'enzyme';

import islandStyles from '../island/island.css';

import Confirm from './confirm';

describe('Confirm', () => {
  const defaultProps = {show: true, text: 'Foo'};
  let wrapper;
  const mountConfirm = props => {
    wrapper = mount(<Confirm {...props}/>);
    return wrapper;
  };

  const getContainer = () => document.querySelector('[data-test~="ring-dialog"]');

  afterEach(() => wrapper.unmount());

  it('should create component', () => {
    mountConfirm(defaultProps).should.have.type(Confirm);
  });

  it('should render confirm', () => {
    mountConfirm(defaultProps);
    getContainer().should.contain(`.${islandStyles.title}`);
  });
});
