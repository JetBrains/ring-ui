import React from 'react';
import {shallow, mount, render} from 'enzyme';

import DataList from './data-list';
import Selection from './selection';

describe('Data List', () => {
  const shallowDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    return shallow(<DataList {...{...{data, selection}, ...props}}/>);
  };
  const mountDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    return mount(<DataList {...{...{data, selection}, ...props}}/>);
  };
  const renderDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    return render(<DataList {...{...{data, selection}, ...props}}/>);
  };

  it('should create component', () => {
    mountDataList().should.have.type(DataList);
  });

  it('should wrap children with div', () => {
    shallowDataList().should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderDataList({className: 'test-class'}).find('ul').should.have.className('test-class');
  });

  // TODO Add more tests
});
