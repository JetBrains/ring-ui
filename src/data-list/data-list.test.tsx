import {render, screen} from '@testing-library/react';

import {SelectionItem} from '../table/selection';

import DataList, {DataListContainerProps} from './data-list';
import Selection from './selection';

interface DateListTestItem extends SelectionItem {
  selectable: boolean;
}

const data: DateListTestItem[] = [];
const props: DataListContainerProps<DateListTestItem> = {
  data,
  selection: new Selection({data, isItemSelectable: item => Boolean(item.selectable)}),
  itemFormatter: () => ({}),
};

describe('Data List', () => {
  it('should create component', () => {
    render(<DataList {...props} />);
    expect(screen.getByTestId('ring-data-list')).to.exist;
  });

  it('should wrap children with div', () => {
    render(<DataList {...props} />);
    expect(screen.getByTestId('ring-data-list')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    render(<DataList {...props} className="test-class" />);
    expect(screen.getByRole('list')).to.have.class('test-class');
  });
});
