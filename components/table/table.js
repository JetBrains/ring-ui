/**
 * @name Table
 * @category Components
 * @framework React
 * @extends {ReactComponent}
 * @description The table.
 * @example-file ./table.examples.html
 */

/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.array.find';

import React, {PropTypes} from 'react';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import classNames from 'classnames';

import HeaderCell from './header-cell';
import Row from './row';
import style from './table.css';

import LoaderInline from '../loader-inline/loader-inline';

export default class Table extends RingComponentWithShortcuts {
  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    onSelect: () => {}
  }

  state = {
    focusedRow: undefined,
    selectedRows: new Set(),
    shortcuts: true,
    userSelectNone: false
  }

  getShortcutsProps() {
    return {
      map: {
        up: this.onUpPress,
        down: this.onDownPress,
        shift: this.onShiftPress,
        'shift+up': this.onShiftUpPress,
        'shift+down': this.onShiftDownPress,
        space: this.onSpacePress,
        esc: this.onEscPress
      },
      scope: ::this.constructor.getUID('ring-table-')
    };
  }

  onMouseDown = e => {
    if (e.shiftKey) {
      this.setState({userSelectNone: true});
    }
  }

  onMouseUp = () => {
    this.setState({userSelectNone: false});
  }

  onRowFocus = row => {
    this.setState({focusedRow: row});
  }

  onRowSelect = row => {
    const selectedRows = new Set(this.state.selectedRows);
    if (selectedRows.has(row)) {
      selectedRows.delete(row);
    } else {
      selectedRows.add(row);
    }
    this.setState({selectedRows});
  }

  getPrevRow = () => {
    const {state: {focusedRow}, props: {data}} = this;
    const i = data.indexOf(focusedRow) - 1;
    if (i > -1) {
      return data[i];
    } else {
      return data[data.length - 1];
    }
  }

  getNextRow = () => {
    const {state: {focusedRow}, props: {data}} = this;
    const i = data.indexOf(focusedRow) + 1;
    if (i < data.length) {
      return data[i];
    } else {
      return data[0];
    }
  }

  shiftSelectRow = () => {
    const {focusedRow} = this.state;
    const selectedRows = new Set(this.state.selectedRows);

    if (!this.shiftSelectionMode) {
      if (selectedRows.has(focusedRow)) {
        this.shiftSelectionMode = 'deleting';
      } else {
        this.shiftSelectionMode = 'adding';
      }
    }

    if (this.shiftSelectionMode === 'deleting') {
      selectedRows.delete(focusedRow);
    } else if (this.shiftSelectionMode === 'adding') {
      selectedRows.add(focusedRow);
    }

    return selectedRows;
  }

  onUpPress = () => {
    this.setState({focusedRow: this.getPrevRow()});
  }

  onDownPress = () => {
    this.setState({focusedRow: this.getNextRow()});
  }

  onShiftPress = () => {
    Reflect.deleteProperty(this, 'shiftSelectionMode');
  }

  onShiftUpPress = () => {
    const focusedRow = this.getPrevRow();
    const selectedRows = this.shiftSelectRow();
    this.setState({focusedRow, selectedRows});
  }

  onShiftDownPress = () => {
    const focusedRow = this.getNextRow();
    const selectedRows = this.shiftSelectRow();
    this.setState({focusedRow, selectedRows});
  }

  onSpacePress = () => {
    const {focusedRow} = this.state;
    if (focusedRow) {
      this.onRowSelect(focusedRow);
    }
  }

  onEscPress = () => {
    this.setState({focusedRow: undefined, selectedRows: new Set()});
  }

  didUpdate(prevProps, prevState) {
    const {selectedRows, focusedRow} = this.state;
    if (selectedRows.size) {
      const union = new Set([...selectedRows, ...prevState.selectedRows]);
      if (selectedRows.size !== union.size || prevState.selectedRows.size !== union.size) {
        this.props.onSelect({selection: new Set(selectedRows)});
      }
    } else if (focusedRow && focusedRow !== prevState.focusedRow) {
      this.props.onSelect({selection: new Set([focusedRow])});
    }
  }

  didMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  willUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const {loading, onSort, sortKey, sortOrder} = this.props;
    const {selectedRows, focusedRow} = this.state;

    const columns = this.props.columns.filter(column => !column.subtree);
    const multiSelection = selectedRows.size > 0;

    /*const subtreeKey = do {
      const subtreeColumn = this.props.columns.find(column => column.subtree);
      if (subtreeColumn) {
        subtreeColumn.id;
      }
    };

    function flattenSubtree(item, subtreeKey, level) { // eslint-disable-line no-shadow
      const result = [];
      if (item[subtreeKey]) {
        item[subtreeKey].forEach(subItem => {
          subItem.__level = level;
          result.push(subItem);
          const subtree = flattenSubtree(subItem, subtreeKey, level + 1);
          subtree.forEach(subitem => {
            result.push(subitem);
          });
        });
      }
      return result;
    }*/

    const data = [];
    this.props.data.forEach(item => {
      item.__level = 0;
      data.push(item);
      /*if (subtreeKey) {
        const subtree = flattenSubtree(item, subtreeKey, 1);
        subtree.forEach(subitem => {
          data.push(subitem);
        });
      }*/
    });

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames({
      [style.table]: true,
      [style.tableMultiSelection]: multiSelection,
      [style.tableSingleSelection]: !multiSelection,
      [style.userSelectNone]: this.state.userSelectNone
    });

    return (
      <div className={wrapperClasses}>
        <LoaderInline className={style.loader}/>

        <table className={classes} onMouseDown={this.onMouseDown}>
          <thead>
            <tr>{
              columns.map((column, key) => {
                const props = {key, column, onSort, sortKey, sortOrder};
                return <HeaderCell {...props} />;
              })
            }</tr>
          </thead>

          <tbody>{
            data.map((item, key) => {
              const props = {
                key,
                item,
                columns,
                focused: focusedRow === item,
                selected: selectedRows.has(item),
                onFocus: this.onRowFocus,
                onSelect: this.onRowSelect
              };
              return <Row {...props} />;
            })
          }</tbody>
        </table>
      </div>
    );
  }
}
