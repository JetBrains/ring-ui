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

import Header from './header';
import Row from './row';
import style from './table.css';

import LoaderInline from '../loader-inline/loader-inline';

export default class Table extends RingComponentWithShortcuts {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    selectable: true,
    loading: false,
    onSelect: () => {},
    onSort: () => {},
    sortKey: 'id',
    sortOrder: true
  }

  state = {
    focusedRow: undefined,
    hoveredRow: undefined,
    selectedRows: new Set(),
    shortcuts: this.props.selectable,
    userSelectNone: false,
    disabledHover: false
  }

  getShortcutsProps() {
    return {
      map: {
        up: this.onUpPress,
        down: this.onDownPress,
        shift: this.onShiftKeyDown,
        'shift+up': this.onShiftUpPress,
        'shift+down': this.onShiftDownPress,
        home: this.onHomePress,
        end: this.onEndPress,
        space: this.onSpacePress,
        esc: this.onEscPress,
        'command+a': this.onCmdAPress,
        'ctrl+a': this.onCmdAPress
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

  onMouseMove = () => {
    this.setState({disabledHover: false});
  }

  onRowFocus = row => {
    this.setState({focusedRow: row});
  }

  onRowHover = row => {
    this.setState({hoveredRow: row});
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
    const {state: {focusedRow, hoveredRow}, props: {data}} = this;
    const row = focusedRow || hoveredRow;
    const i = data.indexOf(row) - 1;

    if (i > -1) {
      return data[i];
    } else {
      return data[0];
    }
  }

  getNextRow = () => {
    const {state: {focusedRow, hoveredRow}, props: {data}} = this;
    const row = focusedRow || hoveredRow;
    const i = data.indexOf(row) + 1;

    if (i < data.length) {
      return data[i];
    } else {
      return data[data.length - 1];
    }
  }

  onUpPress = () => {
    this.setState({focusedRow: this.getPrevRow(), disabledHover: true});
    return false;
  }

  onDownPress = () => {
    this.setState({focusedRow: this.getNextRow(), disabledHover: true});
    return false;
  }

  shiftSelectRow = () => {
    const {focusedRow} = this.state;
    const selectedRows = new Set(this.state.selectedRows);

    if (focusedRow) {
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
    } else {
      this.shiftSelectionMode = 'adding';
    }

    return selectedRows;
  }

  onShiftKeyDown = () => {
    Reflect.deleteProperty(this, 'shiftSelectionMode');
  }

  onShiftUpPress = () => {
    const focusedRow = this.getPrevRow();
    const selectedRows = this.shiftSelectRow();
    this.setState({focusedRow, selectedRows, disabledHover: true});
  }

  onShiftDownPress = () => {
    const focusedRow = this.getNextRow();
    const selectedRows = this.shiftSelectRow();
    this.setState({focusedRow, selectedRows, disabledHover: true});
  }

  onHomePress = () => {
    const {data} = this.props;
    this.setState({focusedRow: data[0], disabledHover: true});
    return false;
  }

  onEndPress = () => {
    const {data} = this.props;
    this.setState({focusedRow: data[data.length - 1], disabledHover: true});
    return false;
  }

  onSpacePress = () => {
    const {focusedRow} = this.state;
    if (focusedRow) {
      this.setState({disabledHover: true});
      this.onRowSelect(focusedRow);
      return false;
    }
    return true;
  }

  onEscPress = () => {
    this.setState({
      focusedRow: undefined,
      hoveredRow: undefined,
      selectedRows: new Set(),
      disabledHover: true
    });
  }

  onCmdAPress = () => {
    this.setState({selectedRows: new Set(this.props.data), disabledHover: true});
    return false;
  }

  onCheckboxChange = checked => {
    if (checked) {
      this.setState({selectedRows: new Set(this.props.data)});
    } else {
      this.setState({selectedRows: new Set()});
    }
  }

  willReceiveProps(nextProps) {
    const {data, selectable} = this.props;

    if (data !== nextProps.data) {
      this.setState({focusedRow: undefined, selectedRows: new Set()});
    }

    if (selectable !== nextProps.selectable) {
      if (nextProps.selectable === false) {
        this.setState({shortcuts: false});
      } else {
        this.setState({shortcuts: true});
      }
    }
  }

  didUpdate(prevProps, prevState) {
    const {selectedRows, focusedRow} = this.state;
    let selection;

    if (selectedRows.size || prevState.selectedRows.size) {
      const union = new Set([...selectedRows, ...prevState.selectedRows]);
      if (selectedRows.size !== union.size || prevState.selectedRows.size !== union.size) {
        selection = new Set(selectedRows);
      }
    } else if (focusedRow !== prevState.focusedRow) {
      if (focusedRow) {
        selection = new Set([focusedRow]);
      } else {
        selection = new Set();
      }
    }

    if (selection) {
      this.props.onSelect({selection});
    }
  }

  didMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  willUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const {caption, selectable, loading, onSort, sortKey, sortOrder} = this.props;
    const {selectedRows, focusedRow} = this.state;

    const columns = this.props.columns.filter(column => !column.subtree);

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

    const headerProps = {caption, selectable, columns, onSort, sortKey, sortOrder};
    headerProps.checked = selectedRows.size === data.length;
    headerProps.onCheckboxChange = this.onCheckboxChange;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selectedRows.size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.state.disabledHover,
      [style.selectable]: selectable
    });

    return (
      <div className={wrapperClasses}>
        <LoaderInline className={style.loader}/>

        <table className={classes} onMouseDown={this.onMouseDown} tabIndex="0">
          <Header {...headerProps} />

          <tbody>{
            data.map((item, key) => {
              const props = {
                key,
                item,
                columns,
                selectable,
                focused: focusedRow === item,
                selected: selectedRows.has(item),
                onFocus: this.onRowFocus,
                onHover: this.onRowHover,
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
