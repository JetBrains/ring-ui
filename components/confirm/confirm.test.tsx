import React from 'react';
import {mount, ReactWrapper} from 'enzyme';

import islandStyles from '../island/island.css';

import Confirm, {ConfirmAttributes} from './confirm';

describe('Confirm', () => {
  const defaultProps = {show: true, text: 'Foo'};
  let wrapper: ReactWrapper;
  const mountConfirm = (props: ConfirmAttributes) => {
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
    const container = getContainer();
    should.exist(container);
    container?.should.contain(`.${islandStyles.title}`);
  });
});
