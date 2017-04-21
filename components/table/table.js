/* @flow */

/**
 * @name Table
 * @category Components
 * @framework React
 * @extends {ReactComponent}
 * @description The table.
 * @example-file ./table.examples.html
 */

/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable modules/no-mix-default-named */
/* eslint-disable arrow-parens */

import 'core-js/modules/es6.array.find';

import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';
import {arrayMove, sortableContainer} from 'react-sortable-hoc';

import focusSensorHOC from '../global/focus-sensor-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import type {Columns} from './columns-type';
import Selection from './selection';
import Header from './header';
import style from './table.css';
import DraggableRow from './draggable-row';
import Row from './row';

export const THEMES = {
  cleanUI: 'cleanUI'
};

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
  props : {
    className: string,
    loaderClassName: string,
    data: any[],
    columns: Columns[],
    selection: Selection<*>,
    caption: string,
    selectable: boolean,
    isItemSelectable: () => void,
    focused: boolean,
    stickyHeader: boolean,
    stickyHeaderOffset: string,
    loading: boolean,
    onFocusRestore: () => void,
    onSelect: () => void,
    getItemKey: () => void,
    onSort: () => void,
    onReorder: () => void,
    sortKey: string,
    sortOrder: boolean,
    draggable: boolean,
    alwaysShowDragHandle: boolean,
    shortcuts: {[key: string] : () => {}},
    getItemLevel: () => void,
    isItemCollapsible: () => void,
    isItemCollapsed: () => void,
    onItemCollapse: () => void,
    onItemExpand: () => void,
    theme: string
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
    onItemExpand: () => {},
    theme: null
  }

  state = {
    shortcuts: this.props.selectable && this.props.focused,
    userSelectNone: false,
    disabledHover: false
  }

  shiftSelectionMode: 'deletion' | 'addition';

  onMouseDown = (e: MouseEvent): void => {
    if (e.shiftKey) {
      this.setState({userSelectNone: true});
    }
  }

  onMouseUp = (): void => {
    if (this.state.userSelectNone) {
      this.setState({userSelectNone: false});
    }
  }

  onMouseMove = (): void => {
    if (this.state.disabledHover) {
      this.setState({disabledHover: false});
    }
  }

  onKeyDown = (e: KeyboardEvent): void => {
    const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers
    if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
      this.setState({disabledHover: true});
    }
  }

  onRowFocus = (row: Row): void => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(row));
  }

  onRowSelect = (row: Row, selected: boolean): void => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(row));
    } else {
      onSelect(selection.deselect(row));
    }
  }

  onSortEnd = ({oldIndex, newIndex}): void => {
    const data = arrayMove(this.props.data, oldIndex, newIndex);
    this.props.onReorder({data, oldIndex, newIndex});
  }

  onUpPress = (): boolean => {
    const {selection, onSelect} = this.props;
    const newSelection = selection.moveUp();

    if (newSelection) {
      onSelect(newSelection);
    }

    return false;
  }

  onDownPress = (): boolean => {
    const {selection, onSelect} = this.props;
    const newSelection = selection.moveDown();

    if (newSelection) {
      onSelect(newSelection);
    }

    return false;
  }

  onShiftKeyDown = (): void => {
    const {selection} = this.props;

    if (selection.isSelected(selection.getFocused())) {
      this.shiftSelectionMode = 'deletion';
    } else {
      this.shiftSelectionMode = 'addition';
    }
  }

  shiftSelect = (selection: Selection<*>): Selection<*> => {
    if (this.shiftSelectionMode === 'addition') {
      return selection.select();
    } else {
      return selection.deselect();
    }
  }

  onShiftUpPress = (e: KeyboardEvent): void => {
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

  onShiftDownPress = (e: KeyboardEvent): void => {
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

  onHomePress = (): boolean => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.focus(data[0]));
    return false;
  }

  onEndPress = (): boolean => {
    const {data, selection, onSelect} = this.props;
    onSelect(selection.focus(data[data.length - 1]));
    return false;
  }

  onSpacePress = (): boolean => {
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return true;
    }

    onSelect(selection.toggleSelection());
    return false;
  }

  onEscPress = (): void => {
    const {selection, onSelect} = this.props;

    onSelect(selection.reset());
    this.restoreFocusWithoutScroll();
  }

  onCmdAPress = (): boolean => {
    const {selectable, selection, onSelect} = this.props;

    if (!selectable) {
      return true;
    }

    onSelect(selection.selectAll());
    return false;
  }

  onCheckboxChange = (checked: boolean): void => {
    const {selection, onSelect} = this.props;

    if (checked) {
      onSelect(selection.selectAll());
    } else {
      onSelect(selection.reset());
    }

    this.restoreFocusWithoutScroll();
  }

  restoreFocusWithoutScroll = (): void => {
    const {scrollX, scrollY} = window;
    this.props.onFocusRestore();
    window.scrollTo(scrollX, scrollY);
  }

  componentWillReceiveProps(nextProps): void {
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

  componentDidMount(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyDown, true);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('keydown', this.onKeyDown, true);
  }

  render(): Element<any> {
    const {
      data, selection, columns, caption, getItemKey, selectable,
      isItemSelectable, getItemLevel, draggable, alwaysShowDragHandle,
      loading, onSort, sortKey, sortOrder, loaderClassName, stickyHeader,
      stickyHeaderOffset, isItemCollapsible, isItemCollapsed,
      onItemCollapse, onItemExpand, theme
    } = this.props;

    const {shortcuts} = this.state;

    // NOTE: Do not construct new object per render because it causes all rows rerendering

    const headerProps = {
      caption, selectable, draggable,
      columns, onSort, sortKey, sortOrder,
      sticky: stickyHeader,
      topStickOffset: stickyHeaderOffset,
      checked: data.length > 0 && data.length === selection.getSelected().size,
      onCheckboxChange: this.onCheckboxChange
    };

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading,
      [style[theme]]: theme !== null
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.multiSelection]: selection.getSelected().size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.state.disabledHover,
      [style.selectable]: selectable
    });

    return (
      <div className={wrapperClasses} data-test="ring-table-wrapper">
        {shortcuts ? <Shortcuts map={{...this.shortcutsMap, ...this.props.shortcuts}} scope={this.shortcutsScope} /> : ''}

        <table className={classes} onMouseDown={this.onMouseDown} data-test="ring-table">
          <Header {...headerProps} />
          <DraggableRows
            /* Sortable props */
            useDragHandle={true}
            disabled={!draggable}
            helperClass={style.draggingRow}
            onSortEnd={this.onSortEnd}
            getItemKey={getItemKey}

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
