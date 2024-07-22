import {PureComponent} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import style from './table.css';

import Table, {TableAttrs} from './table';
import Selection, {SelectionItem} from './selection';

const {
  selection: __selection__,
  onSelect: __onSelect__,
  selectable: __selectable__,
  disabledHover: __disabledHover__,
  ...restPropTypes
} = Table.propTypes ?? {};

export interface SimpleTableProps<T extends SelectionItem> extends
  Omit<TableAttrs<T>, 'selection' | 'onSelect' | 'selectable'> {
  narrowFirstColumn?: boolean;
}
class SimpleTable<T extends SelectionItem> extends PureComponent<SimpleTableProps<T>> {
  static propTypes = {
    narrowFirstColumn: PropTypes.bool,
    ...restPropTypes
  };

  static defaultProps = {
    selectable: false
  };


  state = {
    selection: new Selection({
      data: this.props.data
    })
  };

  classes = classNames(style.disabledHover,
    {[style.narrowFirstColumn]: this.props.narrowFirstColumn}, this.props.className);

  render() {
    return (
      <Table
        {...this.props}
        className={this.classes}
        {...this.state}
      />
    );
  }
}

export default SimpleTable;

