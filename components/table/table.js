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
    selection: PropTypes.instanceOf(Selection).isRequired,
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
    shortcuts: this.props.selectable && this.props.focused,
    userSelectNone: false,
    disabledHover: false
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
    if (this.props.selection.focused !== row) {
      const selection = new Selection(this.props.selection);
      selection.focused = row;
      this.props.onSelect(selection);
    }
  }

  onRowSelect = row => {
    const selection = new Selection(this.props.selection);
    if (selection.selected.has(row)) {
      selection.selected.delete(row);
    } else {
      selection.selected.add(row);
    }
    this.props.onSelect(selection);
  }

  getPrevRow = () => {
    const {state: {hoveredRow}, props: {data}} = this;
    const {focused} = this.props.selection;

    let result = data[0];

    if (data.includes(focused)) {
      const prevRow = data[data.indexOf(focused) - 1];
      if (prevRow) {
        result = prevRow;
      }
    } else if (data.includes(hoveredRow)) {
      result = hoveredRow;
    }

    return result;
  }

  getNextRow = () => {
    const {state: {hoveredRow}, props: {data}} = this;
    const {focused} = this.props.selection;

    let result = data[data.length - 1];

    if (data.includes(focused)) {
      const nextRow = data[data.indexOf(focused) + 1];
      if (nextRow) {
        result = nextRow;
      }
    } else if (data.includes(hoveredRow)) {
      result = hoveredRow;
    }

    return result;
  }

  onUpPress = () => {
    const selection = new Selection(this.props.selection);
    selection.focused = this.getPrevRow();
    this.props.onSelect(selection);

    this.setState({disabledHover: true});

    return false;
  }

  onDownPress = () => {
    const selection = new Selection(this.props.selection);
    selection.focused = this.getNextRow();
    this.props.onSelect(selection);

    this.setState({disabledHover: true});

    return false;
  }

  shiftSelectRow = () => {
    const {focused} = this.props.selection;

    if (focused) {
      const selection = new Selection(this.props.selection);

      if (!this.shiftSelectionMode) {
        if (selection.selected.has(focused)) {
          this.shiftSelectionMode = 'deleting';
        } else {
          this.shiftSelectionMode = 'adding';
        }
      }

      if (this.shiftSelectionMode === 'deleting') {
        selection.selected.delete(focused);
      } else if (this.shiftSelectionMode === 'adding') {
        selection.selected.add(focused);
      }

      this.props.onSelect(selection);
    } else {
      this.shiftSelectionMode = 'adding';
    }
  }

  onShiftKeyDown = () => {
    Reflect.deleteProperty(this, 'shiftSelectionMode');
  }

  onShiftUpPress = () => {
    this.shiftSelectRow();

    const selection = new Selection(this.props.selection);
    selection.focused = this.getPrevRow();
    this.props.onSelect(selection);

    this.setState({disabledHover: true});
  }

  onShiftDownPress = () => {
    this.shiftSelectRow();

    const selection = new Selection(this.props.selection);
    selection.focused = this.getNextRow();
    this.props.onSelect(selection);

    this.setState({disabledHover: true});
  }

  onHomePress = () => {
    const {data} = this.props;
    const selection = new Selection(this.props.selection);
    selection.focused = data[0];
    this.props.onSelect(selection);

    this.setState({disabledHover: true});

    return false;
  }

  onEndPress = () => {
    const {data} = this.props;
    const selection = new Selection(this.props.selection);
    selection.focused = data[data.length - 1];
    this.props.onSelect(selection);

    this.setState({disabledHover: true});

    return false;
  }

  onSpacePress = () => {
    const {focused} = this.props.selection;
    if (focused) {
      this.setState({disabledHover: true});
      this.onRowSelect(focused);
      return false;
    }
    return true;
  }

  onEscPress = () => {
    this.setState({
      hoveredRow: undefined,
      disabledHover: true
    });

    this.props.onSelect(new Selection());
    this.props.onFocusReset();
  }

  onCmdAPress = () => {
    const selection = new Selection(this.props.selection);
    selection.selected = new Set(this.props.data);
    this.props.onSelect(selection);
    this.setState({disabledHover: true});
    return false;
  }

  onCheckboxChange = checked => {
    const selection = new Selection();
    if (checked) {
      selection.selected = new Set(this.props.data);
    }
    this.props.onSelect(selection);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.props.onSelect(new Selection());
    }

    if (this.props.focused !== nextProps.focused && !nextProps.focused) {
      const selection = new Selection(this.props.selection);
      selection.focused = undefined;
      this.props.onSelect(selection);
    }

    const shortcuts = nextProps.selectable && nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillMount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const {selection, caption, selectable, loading, onSort, sortKey, sortOrder} = this.props;
    const {shortcuts} = this.state;

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
    headerProps.checked = selection.selected.size === data.length;
    headerProps.onCheckboxChange = this.onCheckboxChange;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selection.selected.size > 0,
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
                focused: selection.focused === item,
                selected: selection.selected.has(item),
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
