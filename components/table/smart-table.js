import React, {PureComponent, PropTypes} from 'react';
import Table from './table';
import Selection from './selection';

/* eslint-disable no-unused-vars */
const {
  selection: __selection__,
  onSelect: __onSelect__,
  ...restPropTypes
} = Table.propTypes;
/* eslint-enable no-unused-vars */

class SmartTable extends PureComponent {
  static propTypes = {
    onSelectionChange: PropTypes.func,
    ...restPropTypes
  }

  static defaultProps = {
    onSelectionChange: () => {}
  }

  state = {
    selection: new Selection({data: this.props.data})
  }

  onSelect = selection => {
    this.setState({selection});
    this.props.onSelectionChange(selection);
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    if (this.props.data !== data) {
      const selection = new Selection({data});
      this.setState({selection});
    }
  }

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
