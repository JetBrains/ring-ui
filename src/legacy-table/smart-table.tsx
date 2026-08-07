import {PureComponent} from 'react';

import Table, {type TableAttrs} from './table';
import TableSelection, {type SelectionItem} from '../global/table-selection';

export interface SmartTableProps<T extends SelectionItem> extends Omit<TableAttrs<T>, 'selection' | 'onSelect'> {
  onSelectionChange: (selection: TableSelection<T>) => void;
  selection?: TableSelection<T>;
}
class SmartTable<T extends SelectionItem> extends PureComponent<SmartTableProps<T>> {
  static defaultProps = {
    onSelectionChange: () => {},
  };

  state = {
    selection: new TableSelection({
      data: this.props.data,
      isItemSelectable: this.props.isItemSelectable,
    }),
  };

  UNSAFE_componentWillReceiveProps(nextProps: SmartTableProps<T>) {
    const {data, isItemSelectable, selection} = nextProps;
    if (this.props.remoteSelection && this.props.selection !== selection) {
      this.setState({selection});
    } else if (this.props.data !== data || this.props.isItemSelectable !== isItemSelectable) {
      this.setState({
        selection: new TableSelection({data, isItemSelectable}),
      });
    }
  }

  onSelect = (selection: TableSelection<T>) => {
    this.setState({selection});
    this.props.onSelectionChange(selection);
  };

  render() {
    return <Table {...this.props} selection={this.state.selection} onSelect={this.onSelect} />;
  }
}

export default SmartTable;
