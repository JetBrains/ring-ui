import 'dom4';
import React from 'react';
import {mount} from 'enzyme';

import islandStyles from '../island/island.css';

import Confirm from './confirm';

describe('Confirm', () => {
  const defaultProps = {show: true, text: 'Foo'};
  const mountConfirm = props => mount(<Confirm {...props}/>);

  const getContainer = () => document.querySelector('*[data-test="ring-dialog"]');

  it('should create component', () => {
    mountConfirm(defaultProps).should.have.type(Confirm);
  });

  it('should render confirm', () => {
    mountConfirm(defaultProps);
    getContainer().should.contain(`.${islandStyles.title}`);
  });
});
