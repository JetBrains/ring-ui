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

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import focusSensorFactory from '../global/focus-sensor-factory';
import getUID from '../global/get-uid';
import Selection from './selection';
import Header from './header';
import Row from './row';
import style from './table.css';

import Shortcuts from '../shortcuts/shortcuts';
import LoaderInline from '../loader-inline/loader-inline';

class Table extends Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    selection: PropTypes.instanceOf(Selection),
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    loading: PropTypes.bool,
    onFocusReset: PropTypes.func,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    selection: new Selection(),
    selectable: true,
    focused: false,
    loading: false,
    onFocusReset: () => {},
    onSort: () => {},
    sortKey: 'id',
    sortOrder: true
  }

  state = {
    hoveredRow: undefined,
    focusedRow: undefined,
    shortcuts: this.props.selectable && this.props.focused,
    userSelectNone: false,
    disabledHover: false
  }

  onSelectionChange = () => {
    this.forceUpdate();
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
    const {selection} = this.props;
    if (selection.has(row)) {
      selection.delete(row);
    } else {
      selection.add(row);
    }
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
    const {selection} = this.props;

    if (focusedRow) {
      if (!this.shiftSelectionMode) {
        if (selection.has(focusedRow)) {
          this.shiftSelectionMode = 'deleting';
        } else {
          this.shiftSelectionMode = 'adding';
        }
      }

      if (this.shiftSelectionMode === 'deleting') {
        selection.delete(focusedRow);
      } else if (this.shiftSelectionMode === 'adding') {
        selection.add(focusedRow);
      }
    } else {
      this.shiftSelectionMode = 'adding';
    }
  }

  onShiftKeyDown = () => {
    Reflect.deleteProperty(this, 'shiftSelectionMode');
  }

  onShiftUpPress = () => {
    this.shiftSelectRow();
    this.setState({focusedRow: this.getPrevRow(), disabledHover: true});
  }

  onShiftDownPress = () => {
    this.shiftSelectRow();
    this.setState({focusedRow: this.getNextRow(), disabledHover: true});
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
      disabledHover: true
    });

    this.props.selection.clear();
    this.props.onFocusReset();
  }

  onCmdAPress = () => {
    this.props.selection.addGroup(this.props.data);
    this.setState({disabledHover: true});
    return false;
  }

  onCheckboxChange = checked => {
    const {selection} = this.props;
    if (checked) {
      selection.addGroup(this.props.data);
    } else {
      selection.clear();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({focusedRow: undefined});
      this.props.selection.clear();
    }

    if (this.props.focused !== nextProps.focused && !nextProps.focused) {
      this.setState({focusedRow: undefined});
    }

    const shortcuts = nextProps.selectable && nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.props.selection.on('change', this.onSelectionChange);
  }

  componentWillMount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.props.selection.off('change', this.onSelectionChange);
  }

  render() {
    const {selection, caption, selectable, loading, onSort, sortKey, sortOrder} = this.props;
    const {focusedRow, shortcuts} = this.state;

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
    headerProps.checked = selection.size === data.length;
    headerProps.onCheckboxChange = this.onCheckboxChange;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selection.size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.state.disabledHover,
      [style.selectable]: selectable
    });

    return (
      <div className={wrapperClasses}>
        {shortcuts ? <Shortcuts map={this.shortcutsMap} scope={this.shortcutsScope} /> : ''}

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
                selected: selection.has(item),
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

  shortcutsMap = {
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
  }

  shortcutsScope = getUID('ring-table-')
}

export default focusSensorFactory(Table);
