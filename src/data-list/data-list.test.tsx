import {shallow, mount, render} from 'enzyme';

import DataList, {DataListContainerProps} from './data-list';
import Selection from './selection';
import {Item} from './data-list.mock';

describe('Data List', () => {
  const shallowDataList = (props: Partial<DataListContainerProps<Item>> = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => ({});
    return shallow(<DataList {...{...{data, selection, itemFormatter}, ...props}}/>);
  };

  const mountDataList = (props: Partial<DataListContainerProps<Item>> = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => ({});
    return mount(<DataList {...{...{data, selection, itemFormatter}, ...props}}/>);
  };

  const renderDataList = (props: Partial<DataListContainerProps<Item>> = {}) => {
    const data = props.data || [];
    const selection = new Selection({data, isItemSelectable: item => item.selectable});
    const itemFormatter = () => ({});
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
});
