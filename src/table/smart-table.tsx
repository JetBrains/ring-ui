import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Table, {TableAttrs} from './table';
import Selection, {SelectionItem} from './selection';

const {
  selection: __selection__,
  onSelect: __onSelect__,
  ...restPropTypes
} = Table.propTypes ?? {};

export interface SmartTableProps<T extends SelectionItem> extends
  Omit<TableAttrs<T>, 'selection' | 'onSelect'> {
  onSelectionChange: (selection: Selection<T>) => void
}
class SmartTable<T extends SelectionItem> extends PureComponent<SmartTableProps<T>> {
  static propTypes = {
    onSelectionChange: PropTypes.func,
    isItemSelectable: PropTypes.func,
    ...restPropTypes
  };

  static defaultProps = {
    onSelectionChange: () => {}
  };

  state = {
    selection: new Selection({
      data: this.props.data,
      isItemSelectable: this.props.isItemSelectable
    })
  };

  UNSAFE_componentWillReceiveProps(nextProps: SmartTableProps<T>) {
    const {data, isItemSelectable} = nextProps;
    if (this.props.data !== data || this.props.isItemSelectable !== isItemSelectable) {
      const selection = new Selection({data, isItemSelectable});
      this.setState({selection});
    }
  }

  onSelect = (selection: Selection<T>) => {
    this.setState({selection});
    this.props.onSelectionChange(selection);
  };

  render() {
    return (
      <Table
        {...this.props}
        selection={this.state.selection}
        onSelect={this.onSelect}
      />
    );
  }
}

export default SmartTable;
