/**
 * @name Table
 */

import {Component, ComponentType, PureComponent, ReactNode, SyntheticEvent} from 'react';

import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {arrayMove, List} from 'react-movable';

import {OnChangeMeta, RenderItemParams, RenderListParams} from 'react-movable/lib/types';

import focusSensorHOC, {FocusSensorAddProps, FocusSensorProps} from '../global/focus-sensor-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection, {SelectionItem} from './selection';
import Header, {HeaderAttrs} from './header';
import style from './table.css';
import selectionShortcutsHOC, {
  SelectionShortcutsAddProps,
  SelectionShortcutsProps
} from './selection-shortcuts-hoc';
import disableHoverHOC, {DisableHoverAddProps, DisableHoverProps} from './disable-hover-hoc';
import Row from './row-with-focus-sensor';
import {Column, SortParams} from './header-cell';

export interface ReorderParams<T> {
  data: T[]
  oldIndex: number
  newIndex: number
}

export interface TableProps<T extends SelectionItem> extends
  FocusSensorAddProps<HTMLTableRowElement>, SelectionShortcutsAddProps<T>, DisableHoverAddProps {
  data: readonly T[]
  columns: readonly Column<T>[] | ((item:T|null)=>readonly Column<T>[])
  maxColSpan?:number;
  isItemSelectable: (item: T) => boolean
  loading: boolean
  onSort: (params: SortParams) => void
  onReorder: (params: ReorderParams<T>) => void
  getItemKey: (item: T) => string | number
  sortKey: string
  sortOrder: boolean
  draggable: boolean
  alwaysShowDragHandle: boolean
  dragHandleTitle?: string
  stickyHeader: boolean
  wideFirstColumn: boolean
  getItemLevel: (item: T) => number
  getItemClassName: (item: T) => string | null | undefined
  getMetaColumnClassName: (item: T) => string | null | undefined
  getItemDataTest: (item: T) => string | null | undefined
  isItemCollapsible: (item: T) => boolean
  isParentCollapsible: (item: T) => boolean
  isItemCollapsed: (item: T) => boolean
  onItemCollapse: (item: T) => void
  onItemExpand: (item: T) => void
  onItemDoubleClick: (item: T) => void
  onItemClick: (item: T, e: React.MouseEvent<HTMLTableRowElement>) => void
  remoteSelection: boolean
  isDisabledSelectionVisible: (item: T) => boolean
  getCheckboxTooltip: (item: T) => string | undefined
  className?: string | null | undefined
  loaderClassName?: string | undefined
  caption?: string | null | undefined
  stickyHeaderOffset?: string | undefined
  renderEmpty?: (() => ReactNode) | null | undefined
  RowComponent: typeof Row
}
/**
 * Interactive table with selection and keyboard navigation support.
 */
export class Table<T extends SelectionItem> extends PureComponent<TableProps<T>> {
  static defaultProps = {
    isItemSelectable: () => true,
    loading: false,
    onSort: () => {},
    onReorder: () => {},
    getItemKey: (item: SelectionItem) => item.id,
    sortKey: 'id',
    sortOrder: true,
    draggable: false,
    alwaysShowDragHandle: false,
    stickyHeader: true,
    getItemLevel: () => 0,
    getItemClassName: () => null,
    getMetaColumnClassName: () => null,
    getItemDataTest: () => null,
    isItemCollapsible: () => false,
    isParentCollapsible: () => false,
    isItemCollapsed: () => false,
    onItemCollapse: () => {},
    onItemExpand: () => {},
    onItemDoubleClick: () => {},
    onItemClick: () => {},
    remoteSelection: false,
    isDisabledSelectionVisible: () => false,
    getCheckboxTooltip: () => undefined,
    RowComponent: Row,
    wideFirstColumn: false
  };

  state = {
    shortcutsScope: getUID('ring-table-'),
    userSelectNone: false
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate({data, selection, onSelect, selectable, remoteSelection}: TableProps<T>) {
    if (data !== this.props.data && remoteSelection) {
      onSelect(selection.cloneWith({data: this.props.data}));
    }

    if (!this.props.selectable && this.props.selectable !== selectable) {
      onSelect(selection.resetSelection());
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      this.setState({userSelectNone: true});
    }
  };

  onMouseUp = () => {
    if (this.state.userSelectNone) {
      this.setState({userSelectNone: false});
    }
  };

  onRowFocus = (row: T) => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(row));
  };

  onRowSelect = (row: T, selected: boolean) => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(row));
    } else {
      onSelect(selection.deselect(row));
    }
  };

  onSortEnd = ({oldIndex, newIndex}: OnChangeMeta) => {
    const data = arrayMove(this.props.data as T[], oldIndex, newIndex);
    this.props.onReorder({data, oldIndex, newIndex});
  };

  onCheckboxChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const {checked} = e.currentTarget;
    const {selection, onSelect} = this.props;

    if (checked) {
      onSelect(selection.selectAll());
    } else {
      onSelect(selection.reset());
    }

    this.restoreFocusWithoutScroll();
  };

  restoreFocusWithoutScroll = () => {
    const {scrollX, scrollY} = window;
    this.props.onFocusRestore();
    window.scrollTo(scrollX, scrollY);
  };

  render() {
    const {
      data, selection, columns, caption, getItemKey, selectable, focused,
      isItemSelectable, getItemLevel, getItemClassName, getMetaColumnClassName, getItemDataTest,
      draggable, alwaysShowDragHandle, dragHandleTitle,
      loading, onSort, sortKey, sortOrder, loaderClassName, stickyHeader,
      stickyHeaderOffset, isItemCollapsible, isParentCollapsible, isItemCollapsed,
      onItemCollapse, onItemExpand, isDisabledSelectionVisible, getCheckboxTooltip,
      onItemDoubleClick, onItemClick, renderEmpty, maxColSpan, RowComponent
    } = this.props;


    // NOTE: Do not construct new object per render because it causes all rows rerendering

    const headerProps: HeaderAttrs = {
      caption, selectable, draggable,
      columns: typeof columns === 'function' ? columns(null) : columns, onSort, sortKey, sortOrder,
      sticky: stickyHeader,
      topStickOffset: stickyHeaderOffset, maxColSpan: this.props.maxColSpan
    };

    const selectedSize = selection.getSelected().size;
    const allSelectedSize = selection.selectAll().getSelected().size;
    headerProps.checked = selectedSize > 0 && selectedSize === allSelectedSize;
    headerProps.onCheckboxChange = this.onCheckboxChange;
    headerProps.checkboxDisabled = this.props.data.length === 0;

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    const classes = classNames(this.props.className, {
      [style.table]: true,
      [style.wideFirstColumn]: this.props.wideFirstColumn,
      [style.multiSelection]: selection.getSelected().size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.props.disabledHover
    });

    const renderList = ({children, props}: Partial<RenderListParams>) => {
      const empty = (
        <tr>
          <td
            colSpan={this.props.columns.length || 1}
            className={style.tableMessage}
          >
            {renderEmpty ? renderEmpty() : null}
          </td>
        </tr>
      );
      const tbody = Array.isArray(children) && children.length > 0
        ? children
        : empty;
      return (
        <table className={classes} data-test="ring-table">
          <Header {...headerProps}/>
          <tbody {...props} data-test="ring-table-body">
            {tbody}
          </tbody>
        </table>
      );
    };

    const renderItem = ({value, props = {}, isDragged}: Partial<RenderItemParams<T>>) => {
      if (value == null) {
        return null;
      }
      const {ref, ...restProps} = props;
      const row = (
        <RowComponent<T>
          innerRef={ref}
          level={getItemLevel(value)}
          item={value}
          showFocus={selection.isFocused(value)}
          autofocus={selection.isFocused(value)}
          focused={focused && selection.isFocused(value)}
          selectable={selectable && isItemSelectable(value)}
          selected={selectable && selection.isSelected(value)}
          onFocus={this.onRowFocus}
          onSelect={this.onRowSelect}
          onDoubleClick={onItemDoubleClick}
          onClick={onItemClick}
          collapsible={isItemCollapsible(value)}
          parentCollapsible={isParentCollapsible(value)}
          collapsed={isItemCollapsed(value)}
          onCollapse={onItemCollapse}
          onExpand={onItemExpand}
          showDisabledSelection={isDisabledSelectionVisible(value)}
          checkboxTooltip={getCheckboxTooltip(value)}
          className={classNames(getItemClassName(value), {[style.draggingRow]: isDragged})}
          metaColumnClassName={getMetaColumnClassName(value)}
          draggable={draggable}
          alwaysShowDragHandle={alwaysShowDragHandle}
          dragHandleTitle={dragHandleTitle}
          columns={columns}
          data-test={getItemDataTest(value)}
          maxColSpan={maxColSpan}
          {...restProps}
          key={restProps.key ?? getItemKey(value)}
        />
      );

      return isDragged
        ? (
          <table style={{...props.style}} className={style.draggingTable}>
            <tbody>{row}</tbody>
          </table>
        )
        : row;
    };

    return (
      <div className={wrapperClasses} data-test="ring-table-wrapper" ref={this.props.innerRef}>
        {focused &&
          (
            <Shortcuts
              map={this.props.shortcutsMap}
              scope={this.state.shortcutsScope}
            />
          )
        }

        {/* Handler detects that user holds Shift key */}
        <div role="presentation" onMouseDown={this.onMouseDown}>
          {draggable
            ? (
              <List
                values={data as T[]}
                renderList={renderList}
                renderItem={renderItem}
                onChange={this.onSortEnd}
              />
            )
            : renderList({children: data.map((value, index) => renderItem({value, index}))})}
        </div>

        {loading && (
          <div className={style.loadingOverlay}>
            <Loader className={loaderClassName}/>
          </div>
        )}
      </div>
    );
  }
}

(Table as ComponentType<unknown>).propTypes = {
  className: PropTypes.string,
  loaderClassName: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  caption: PropTypes.string,
  isItemSelectable: PropTypes.func,
  stickyHeader: PropTypes.bool,
  stickyHeaderOffset: PropTypes.string,
  loading: PropTypes.bool,
  getItemKey: PropTypes.func,
  getItemClassName: PropTypes.func,
  getMetaColumnClassName: PropTypes.func,
  getItemDataTest: PropTypes.func,
  onSort: PropTypes.func,
  onReorder: PropTypes.func,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.bool,
  draggable: PropTypes.bool,
  alwaysShowDragHandle: PropTypes.bool,
  getItemLevel: PropTypes.func,
  isItemCollapsible: PropTypes.func,
  isParentCollapsible: PropTypes.func,
  isItemCollapsed: PropTypes.func,
  onItemCollapse: PropTypes.func,
  onItemExpand: PropTypes.func,
  isDisabledSelectionVisible: PropTypes.func,
  getCheckboxTooltip: PropTypes.func,
  onItemDoubleClick: PropTypes.func,
  onItemClick: PropTypes.func,
  wideFirstColumn: PropTypes.bool,

  // focusSensorHOC
  focused: PropTypes.bool,
  onFocusRestore: PropTypes.func,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),

  // selectionShortcutsHOC
  selection: PropTypes.instanceOf(Selection).isRequired,
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
  shortcutsMap: PropTypes.object,

  // disableHoverHOC
  disabledHover: PropTypes.bool,

  remoteSelection: PropTypes.bool,

  renderEmpty: PropTypes.func
};

const getContainer = <T extends SelectionItem>() =>
  disableHoverHOC(
    selectionShortcutsHOC<T, FocusSensorProps<TableProps<T>, HTMLTableRowElement, typeof Table>>(
      focusSensorHOC<HTMLTableRowElement, TableProps<T>, typeof Table>(Table)));

export type TableAttrs<T extends SelectionItem> = DisableHoverProps<SelectionShortcutsProps<T,
  FocusSensorProps<TableProps<T>, HTMLTableRowElement, typeof Table>>>

// eslint-disable-next-line react/no-multi-comp
export default class TableContainer<T extends SelectionItem> extends Component<TableAttrs<T>> {
  // https://stackoverflow.com/a/53882322/6304152
  static propTypes = getContainer().propTypes;
  Table = getContainer<T>();

  render() {
    return <this.Table {...this.props}/>;
  }
}
