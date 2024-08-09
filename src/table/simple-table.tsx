import {PureComponent} from 'react';

import classNames from 'classnames';

import style from './table.css';

import Table, {TableAttrs} from './table';
import Selection, {SelectionItem} from './selection';

export interface SimpleTableProps<T extends SelectionItem> extends
  Omit<TableAttrs<T>, 'selection' | 'onSelect' | 'selectable'> {
}
class SimpleTable<T extends SelectionItem> extends PureComponent<SimpleTableProps<T>> {
  static defaultProps = {
    selectable: false,
    wideFirstColumn: false
  };


  state = {
    selection: new Selection({
      data: this.props.data
    })
  };

  classes = classNames(style.disabledHover, this.props.className);

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

