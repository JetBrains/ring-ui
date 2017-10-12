import React from 'react';
import {shallow, mount, render} from 'enzyme';

import DataList from './data-list';
import Selection from './selection';

describe('Data List', () => {
  const shallowDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => {};
    return shallow(<DataList {...{...{data, selection, itemFormatter}, ...props}}/>);
  };

  const mountDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => {};
    return mount(<DataList {...{...{data, selection, itemFormatter}, ...props}}/>);
  };

  const renderDataList = (props = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => {};
    return render(<DataList {...{...{data, selection, itemFormatter}, ...props}}/>);
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
