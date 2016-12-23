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

  onKeyDown = e => {
    const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers
    if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
      this.setState({disabledHover: true});
    }
  }

  onRowHover = row => {
    if (this.state.hoveredRow !== row) {
      this.setState({hoveredRow: row});
    }
  }

  onRowFocus = row => {
    const {selection, onSelect} = this.props;
    if (selection.getFocus() !== row) {
      onSelect(selection.setFocus(row));
    }
  }

  onRowSelect = row => {
    const {selection, onSelect} = this.props;
    onSelect(selection.toggle(row));
  }

  getPrevRow = () => {
    const {state: {hoveredRow}, props: {data}} = this;
    const focused = this.props.selection.getFocus();

    let result = data[0];

    if (focused) {
      const prevRow = data[data.indexOf(focused) - 1];
      if (prevRow) {
        result = prevRow;
      }
    } else if (hoveredRow) {
      result = hoveredRow;
    }

    return result;
  }

  getNextRow = () => {
    const {state: {hoveredRow}, props: {data}} = this;
    const focused = this.props.selection.getFocus();

    let result = data[data.length - 1];

    if (focused) {
      const nextRow = data[data.indexOf(focused) + 1];
      if (nextRow) {
        result = nextRow;
      }
    } else if (hoveredRow) {
      result = hoveredRow;
    }

    return result;
  }

  onUpPress = () => {
    const {selection, onSelect} = this.props;
    onSelect(selection.setFocus(this.getPrevRow()));
    return false;
  }

  onDownPress = () => {
    const {selection, onSelect} = this.props;
    onSelect(selection.setFocus(this.getNextRow()));
    return false;
  }

  shiftSelectRow = () => {
    const {selection} = this.props;
    const focused = selection.getFocus();

    if (focused) {
      if (!this.shiftSelectionMode) {
        if (selection.has(focused)) {
          this.shiftSelectionMode = 'deleting';
        } else {
          this.shiftSelectionMode = 'adding';
        }
      }

      if (this.shiftSelectionMode === 'deleting') {
        this.props.onSelect(selection.delete(focused));
      } else if (this.shiftSelectionMode === 'adding') {
        this.props.onSelect(selection.add(focused));
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

    const {selection, onSelect} = this.props;
    onSelect(selection.setFocus(this.getPrevRow()));
  }

  onShiftDownPress = () => {
    this.shiftSelectRow();

    const {selection, onSelect} = this.props;
    onSelect(selection.setFocus(this.getNextRow()));
  }

  onHomePress = () => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.setFocus(data[0]));
    return false;
  }

  onEndPress = () => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.setFocus(data[data.length - 1]));
    return false;
  }

  onSpacePress = () => {
    const {selection, onSelect} = this.props;
    const focused = this.props.selection.getFocus();

    if (focused) {
      onSelect(selection.toggle(focused));
      return false;
    }

    return true;
  }

  onEscPress = () => {
    const {onSelect, onFocusReset} = this.props;
    this.setState({hoveredRow: undefined});
    onSelect(new Selection());
    onFocusReset();
  }

  onCmdAPress = () => {
    const {data, onSelect, selection} = this.props;

    const focused = selection.getFocus();
    const selected = new Set(data);
    onSelect(new Selection({selected, focused}));

    return false;
  }

  onCheckboxChange = checked => {
    const {data, onSelect, onFocusReset} = this.props;
    let selected;

    if (checked) {
      selected = new Set(data);
    } else {
      selected = new Set();
    }

    onSelect(new Selection({selected}));
    onFocusReset();
  }

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable, focused} = this.props;

    if (data !== nextProps.data) {
      onSelect(new Selection());
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(new Selection({focused: selection.getFocus()}));
    }

    if (!nextProps.focused && nextProps.focused !== focused) {
      onSelect(selection.setFocus(undefined));
    }

    const shortcuts = nextProps.selectable && nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyDown, true);
  }

  componentWillMount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('keydown', this.onKeyDown, true);
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
                focused: selection.getFocus() === item,
                selected: selectable && selection.has(item),
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
