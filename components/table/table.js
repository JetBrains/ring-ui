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

import focusSensor from './focus-sensor';
import Header from './header';
import Row from './row';
import style from './table.css';

import LoaderInline from '../loader-inline/loader-inline';

class Table extends RingComponentWithShortcuts {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    loading: PropTypes.bool,
    onFocusReset: PropTypes.func,
    onSelect: PropTypes.func,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    selectable: true,
    focused: false,
    loading: false,
    onFocusReset: () => {},
    onSelect: () => {},
    onSort: () => {},
    sortKey: 'id',
    sortOrder: true
  }

  state = {
    hoveredRow: undefined,
    focusedRow: undefined,
    selectedRows: new Set(),
    shortcuts: this.props.selectable && this.props.focused,
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
    if (this.state.userSelectNone) {
      this.setState({userSelectNone: false});
    }
  }

  onMouseMove = () => {
    if (this.state.disabledHover) {
      this.setState({disabledHover: false});
    }
  }

  onRowHover = row => {
    if (this.state.hoveredRow !== row) {
      this.setState({hoveredRow: row});
    }
  }

  onRowFocus = row => {
    if (this.state.focusedRow !== row) {
      this.setState({focusedRow: row});
    }
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
    const {state: {hoveredRow, focusedRow}, props: {data}} = this;

    let result = data[0];

    if (data.includes(focusedRow)) {
      const prevRow = data[data.indexOf(focusedRow) - 1];
      if (prevRow) {
        result = prevRow;
      }
    } else if (data.includes(hoveredRow)) {
      result = hoveredRow;
    }

    return result;
  }

  getNextRow = () => {
    const {state: {hoveredRow, focusedRow}, props: {data}} = this;

    let result = data[data.length - 1];

    if (data.includes(focusedRow)) {
      const nextRow = data[data.indexOf(focusedRow) + 1];
      if (nextRow) {
        result = nextRow;
      }
    } else if (data.includes(hoveredRow)) {
      result = hoveredRow;
    }

    return result;
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
      hoveredRow: undefined,
      focusedRow: undefined,
      selectedRows: new Set(),
      disabledHover: true
    });

    this.props.onFocusReset();
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
    if (this.props.data !== nextProps.data) {
      this.setState({focusedRow: undefined, selectedRows: new Set()});
    }

    if (this.props.focused !== nextProps.focused && !nextProps.focused) {
      this.setState({focusedRow: undefined});
    }

    const shortcuts = nextProps.selectable && nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  didUpdate(prevProps, prevState) {
    const {selectedRows, focusedRow} = this.state;
    let selection;

    if (selectedRows.size) {
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

        <table className={classes} onMouseDown={this.onMouseDown}>
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
                onHover: this.onRowHover,
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

export default focusSensor(Table);
