import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Table from './table';
import Selection from './selection';

const {
  selection: __selection__,
  onSelect: __onSelect__,
  ...restPropTypes
} = Table.propTypes;

class SmartTable extends PureComponent {
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {data, isItemSelectable, selection} = nextProps;
    if (this.props.remoteSelection && this.props.selection !== selection) {
      this.setState({selection});
    } else if (this.props.data !== data || this.props.isItemSelectable !== isItemSelectable) {
      this.setState({
        selection: new Selection({data, isItemSelectable})
      });
    }
  }

  onSelect = selection => {
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
