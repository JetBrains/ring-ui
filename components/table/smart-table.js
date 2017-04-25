import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

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

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    if (this.props.data !== data) {
      const selection = new Selection({data});
      this.setState({selection});
    }
  }

  onSelect = selection => {
    this.setState({selection});
    this.props.onSelectionChange(selection);
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
