/**
 * @name Table
 * @category Components
 * @tags 3.0
 * @framework React
 * @extends {ReactComponent}
 * @description The table.
 * @example-file ./table.examples.html
 */

import 'core-js/modules/es6.array.find';

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {arrayMove, sortableContainer} from 'react-sortable-hoc';

import focusSensorHOC from '../global/focus-sensor-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection from './selection';
import Header from './header';
import style from './table.css';
import DraggableRow from './draggable-row';

const alwaysFalse = () => false;

const DraggableRows = sortableContainer(props => {
  const {
    data, getItemKey, selection, selectable,
    isItemSelectable, onRowFocus, onRowSelect,
    getItemLevel, isItemCollapsible, isItemCollapsed,
    onItemCollapse, onItemExpand,
    ...restProps
  } = props;

  return (
    <tbody data-test="ring-table-body">
      {data.map((item, index) => (
        <DraggableRow
          key={getItemKey(item)}
          level={getItemLevel(item)}
          index={index}
          item={item}
          showFocus={selection.isFocused(item)}
          focused={selection.isFocused(item)}
          selectable={selectable && isItemSelectable(item)}
          selected={selectable && selection.isSelected(item)}
          onFocus={onRowFocus}
          onSelect={onRowSelect}
          collapsible={isItemCollapsible(item)}
          collapsed={isItemCollapsed(item)}
          onCollapse={onItemCollapse}
          onExpand={onItemExpand}
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
    isItemSelectable: PropTypes.func,
    focused: PropTypes.bool,
    stickyHeader: PropTypes.bool,
    stickyHeaderOffset: PropTypes.string,
    loading: PropTypes.bool,
    onFocusRestore: PropTypes.func,
    onSelect: PropTypes.func,
    getItemKey: PropTypes.func,
    onSort: PropTypes.func,
    onReorder: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool,
    draggable: PropTypes.bool,
    alwaysShowDragHandle: PropTypes.bool,
    shortcuts: PropTypes.object,
    getItemLevel: PropTypes.func,
    isItemCollapsible: PropTypes.func,
    isItemCollapsed: PropTypes.func,
    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    isItemSelectable: () => true,
    focused: false,
    loading: false,
    onFocusRestore: () => {},
    onSelect: () => {},
    onSort: () => {},
    onReorder: () => {},
    getItemKey: item => item.id,
    sortKey: 'id',
    sortOrder: true,
    draggable: false,
    alwaysShowDragHandle: false,
    stickyHeader: true,
    shortcuts: {},
    getItemLevel: () => 0,
    isItemCollapsible: () => false,
    isItemCollapsed: () => false,
    onItemCollapse: () => {},
    onItemExpand: () => {}
  }

  state = {
    shortcuts: this.props.selectable && this.props.focused,
    userSelectNone: false,
    disabledHover: false
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyDown, true);
  }

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data) {
      onSelect(selection.cloneWith({data: nextProps.data}));
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(selection.resetSelection());
    }

    const shortcuts = nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('keydown', this.onKeyDown, true);
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

  onShiftUpPress = e => {
    e.preventDefault();
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return;
    }

    const newSelection = this.shiftSelect(selection);
    const newMovedSelection = newSelection.moveUp();

    if (newMovedSelection) {
      onSelect(newMovedSelection);
    } else {
      onSelect(newSelection);
    }
  }

  onShiftDownPress = e => {
    e.preventDefault();
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return;
    }

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
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return true;
    }

    onSelect(selection.toggleSelection());
    return false;
  }

  onEscPress = () => {
    const {selection, onSelect} = this.props;

    onSelect(selection.reset());
    this.restoreFocusWithoutScroll();
  }

  onCmdAPress = () => {
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return true;
    }

    onSelect(selection.selectAll());
    return false;
  }

  onCheckboxChange = e => {
    const {checked} = e.target;
    const {selection, onSelect} = this.props;

    if (checked) {
      onSelect(selection.selectAll());
    } else {
      onSelect(selection.reset());
    }

    this.restoreFocusWithoutScroll();
  }

  restoreFocusWithoutScroll = () => {
    const {scrollX, scrollY} = window;
    this.props.onFocusRestore();
    window.scrollTo(scrollX, scrollY);
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

  render() {
    const {
      data, selection, columns, caption, getItemKey, selectable,
      isItemSelectable, getItemLevel, draggable, alwaysShowDragHandle,
      loading, onSort, sortKey, sortOrder, loaderClassName, stickyHeader,
      stickyHeaderOffset, isItemCollapsible, isItemCollapsed,
      onItemCollapse, onItemExpand
    } = this.props;
    const {shortcuts} = this.state;

    // NOTE: Do not construct new object per render because it causes all rows rerendering

    const headerProps = {
      caption, selectable, draggable,
      columns, onSort, sortKey, sortOrder,
      sticky: stickyHeader,
      topStickOffset: stickyHeaderOffset
    };

    headerProps.checked = data.length > 0 && data.length === selection.getSelected().size;
    headerProps.onCheckboxChange = this.onCheckboxChange;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selection.getSelected().size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.state.disabledHover
    });

    return (
      <div className={wrapperClasses} data-test="ring-table-wrapper">
        {shortcuts
          ? (
            <Shortcuts
              map={{...this.shortcutsMap, ...this.props.shortcuts}}
              scope={this.shortcutsScope}
            />
          )
          : ''}

        <table className={classes} onMouseDown={this.onMouseDown} data-test="ring-table">
          <Header {...headerProps}/>
          <DraggableRows
            /* Sortable props */
            useDragHandle={true}
            disabled={!draggable}
            helperClass={style.draggingRow}
            onSortEnd={this.onSortEnd}
            getItemKey={getItemKey}
            shouldCancelStart={alwaysFalse}

            /* Row props */
            draggable={draggable}
            alwaysShowDragHandle={alwaysShowDragHandle}
            data={data}
            columns={columns}
            selectable={selectable}
            isItemSelectable={isItemSelectable}
            selection={selection}
            onRowFocus={this.onRowFocus}
            onRowSelect={this.onRowSelect}
            getItemLevel={getItemLevel}
            isItemCollapsible={isItemCollapsible}
            isItemCollapsed={isItemCollapsed}
            onItemCollapse={onItemCollapse}
            onItemExpand={onItemExpand}
          />
        </table>

        {loading && <div className={style.loadingOverlay}>
          <Loader className={loaderClassName}/>
        </div>}
      </div>
    );
  }
}

export default focusSensorHOC(Table);
