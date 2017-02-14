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

import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import getUID from '../global/get-uid';
import Selection from './selection';
import Header from './header';
import style from './table.css';
import {sortableContainer, arrayMove} from 'react-sortable-hoc';
import DraggableRow from './draggable-row';

import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

const DraggableRows = sortableContainer(props => {
  const {data, getRowKey, selection, selectable, onRowFocus, onRowSelect, ...restProps} = props;
  return (
    <tbody>
    {data.map((item, index) => (
      <DraggableRow
        key={getRowKey(item)}
        index={index}
        item={item}
        showFocus={selection.isFocused(item)}
        focused={selection.isFocused(item)}
        selected={selectable && selection.isSelected(item)}
        onFocus={onRowFocus}
        onSelect={onRowSelect}
        {...restProps}
      />
    ))}
    </tbody>
  );
});

class Table extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loaderClassName: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    selection: PropTypes.instanceOf(Selection).isRequired,
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    loading: PropTypes.bool,
    onFocusRestore: PropTypes.func,
    onSelect: PropTypes.func,
    getRowKey: PropTypes.func,
    onSort: PropTypes.func,
    onReorder: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool,
    draggable: PropTypes.bool,
    shortcuts: PropTypes.object
  }

  static defaultProps = {
    selectable: true,
    focused: false,
    loading: false,
    onFocusRestore: () => {},
    onSelect: () => {},
    onSort: () => {},
    onReorder: () => {},
    getRowKey: item => item.id,
    sortKey: 'id',
    sortOrder: true,
    draggable: false,
    shortcuts: {}
  }

  state = {
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

  onRowFocus = row => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(row));
  }

  onRowSelect = (row, selected) => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(row));
    } else {
      onSelect(selection.deselect(row));
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    const data = arrayMove(this.props.data, oldIndex, newIndex);
    this.props.onReorder({data, oldIndex, newIndex});
  }

  onUpPress = () => {
    const {selection, onSelect} = this.props;
    const newSelection = selection.moveUp();

    if (newSelection) {
      onSelect(newSelection);
    }

    return false;
  }

  onDownPress = () => {
    const {selection, onSelect} = this.props;
    const newSelection = selection.moveDown();

    if (newSelection) {
      onSelect(newSelection);
    }

    return false;
  }

  onShiftKeyDown = () => {
    const {selection} = this.props;
    if (selection.isSelected(selection.getFocused())) {
      this.shiftSelectionMode = 'deletion';
    } else {
      this.shiftSelectionMode = 'addition';
    }
  }

  shiftSelect = selection => {
    if (this.shiftSelectionMode === 'addition') {
      return selection.select();
    } else {
      return selection.deselect();
    }
  }

  onShiftUpPress = () => {
    const {selection, onSelect} = this.props;

    const newSelection = this.shiftSelect(selection);
    const newMovedSelection = newSelection.moveUp();

    if (newMovedSelection) {
      onSelect(newMovedSelection);
    } else {
      onSelect(newSelection);
    }
  }

  onShiftDownPress = () => {
    const {selection, onSelect} = this.props;

    const newSelection = this.shiftSelect(selection);
    const newMovedSelection = newSelection.moveDown();

    if (newMovedSelection) {
      onSelect(newMovedSelection);
    } else {
      onSelect(newSelection);
    }
  }

  onHomePress = () => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.focus(data[0]));
    return false;
  }

  onEndPress = () => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.focus(data[data.length - 1]));
    return false;
  }

  onSpacePress = () => {
    const {selection, onSelect} = this.props;
    onSelect(selection.toggleSelection());
    return false;
  }

  onEscPress = () => {
    const {selection, onSelect, onFocusRestore} = this.props;
    onSelect(selection.reset());
    onFocusRestore();
  }

  onCmdAPress = () => {
    const {selection, onSelect} = this.props;
    onSelect(selection.selectAll());
    return false;
  }

  onCheckboxChange = e => {
    const {checked} = e.target;
    const {selection, onSelect, onFocusRestore} = this.props;

    if (checked) {
      onSelect(selection.selectAll());
    } else {
      onSelect(selection.reset());
    }

    onFocusRestore();
  }

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data) {
      onSelect(selection.cloneWith({data: nextProps.data}));
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(selection.resetSelection());
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

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('keydown', this.onKeyDown, true);
  }

  render() {
    const {selection, caption, getRowKey, selectable, draggable, loading, onSort, sortKey, sortOrder, loaderClassName} = this.props;
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
      //item.__level = 0;
      data.push(item);
      /*if (subtreeKey) {
        const subtree = flattenSubtree(item, subtreeKey, 1);
        subtree.forEach(subitem => {
          data.push(subitem);
        });
      }*/
    });

    const headerProps = {caption, selectable, columns, onSort, sortKey, sortOrder};
    headerProps.checked = selection.getSelected().size === data.length;
    headerProps.onCheckboxChange = this.onCheckboxChange;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selection.getSelected().size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.state.disabledHover,
      [style.selectable]: selectable
    });

    return (
      <div className={wrapperClasses}>
        {shortcuts ? <Shortcuts map={{...this.shortcutsMap, ...this.props.shortcuts}} scope={this.shortcutsScope} /> : ''}

        <table className={classes} onMouseDown={this.onMouseDown}>
          <Header {...headerProps} />
          <DraggableRows
            /* Sortable props */
            useDragHandle={true}
            disabled={!draggable}
            helperClass={style.draggingRow}
            onSortEnd={this.onSortEnd}
            getRowKey={getRowKey}

            /* Row props */
            draggable={draggable}
            data={data}
            columns={columns}
            selectable={selectable}
            selection={selection}
            onRowFocus={this.onRowFocus}
            onRowSelect={this.onRowSelect}
          />
        </table>

        {loading && <div className={style.loadingOverlay}>
          <Loader className={loaderClassName}/>
        </div>}
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

export default focusSensorHOC(Table);
