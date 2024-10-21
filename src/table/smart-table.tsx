import {PureComponent} from 'react';

import Table, {TableAttrs} from './table';
import Selection, {SelectionItem} from './selection';

export interface SmartTableProps<T extends SelectionItem> extends Omit<TableAttrs<T>, 'selection' | 'onSelect'> {
  onSelectionChange: (selection: Selection<T>) => void;
  selection?: Selection<T>;
}
class SmartTable<T extends SelectionItem> extends PureComponent<SmartTableProps<T>> {
  static defaultProps = {
    onSelectionChange: () => {},
  };

  state = {
    selection: new Selection({
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
        selection: new Selection({data, isItemSelectable}),
      });
    }
  }

  onSelect = (selection: Selection<T>) => {
    this.setState({selection});
    this.props.onSelectionChange(selection);
  };

  render() {
    return <Table {...this.props} selection={this.state.selection} onSelect={this.onSelect} />;
  }
}

export default SmartTable;
