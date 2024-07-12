import {render, screen} from '@testing-library/react';

import {SelectionItem} from '../table/selection';

import DataList, {DataListContainerProps} from './data-list';
import Selection from './selection';

const data: SelectionItem[] = [];
const props: DataListContainerProps<SelectionItem> = {
  data,
  selection: new Selection({data, isItemSelectable: item => Boolean(item.selectable)}),
  itemFormatter: () => ({})
};

describe('Data List', () => {
  it('should create component', () => {
    render(<DataList {...props}/>);
    screen.getByTestId('ring-data-list').should.exist;
  });

  it('should wrap children with div', () => {
    render(<DataList {...props}/>);
    screen.getByTestId('ring-data-list').should.have.tagName('div');
  });

  it('should use passed className', () => {
    render(<DataList {...props} className="test-class"/>);
    screen.getByRole('list').should.have.class('test-class');
  });
});
