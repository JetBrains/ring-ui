/**
 * @name Table
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {arrayMove, List} from 'react-movable';

import focusSensorHOC from '../global/focus-sensor-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection from './selection';
import Header from './header';
import style from './table.css';
import selectionShortcutsHOC from './selection-shortcuts-hoc';
import disableHoverHOC from './disable-hover-hoc';
import Row from './row-with-focus-sensor';

/**
 * Interactive table with selection and keyboard navigation support.
 */
export class Table extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loaderClassName: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    caption: PropTypes.string,
    isItemSelectable: PropTypes.func,
    stickyHeader: PropTypes.bool,
    stickyHeaderOffset: PropTypes.string,
    loading: PropTypes.bool,
    getItemKey: PropTypes.func,
    getItemClassName: PropTypes.func,
    getItemDataTest: PropTypes.func,
    onSort: PropTypes.func,
    onReorder: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool,
    draggable: PropTypes.bool,
    alwaysShowDragHandle: PropTypes.bool,
    dragHandleTitle: PropTypes.string,
    getItemLevel: PropTypes.func,
    isItemCollapsible: PropTypes.func,
    isParentCollapsible: PropTypes.func,
    isItemCollapsed: PropTypes.func,
    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isDisabledSelectionVisible: PropTypes.func,
    getCheckboxTooltip: PropTypes.func,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),

    // focusSensorHOC
    focused: PropTypes.bool,
    onFocusRestore: PropTypes.func,

    // selectionShortcutsHOC
    selection: PropTypes.instanceOf(Selection).isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    onItemDoubleClick: PropTypes.func,
    onItemClick: PropTypes.func,
    shortcutsMap: PropTypes.object,

    // disableHoverHOC
    disabledHover: PropTypes.bool,

    remoteSelection: PropTypes.bool,

    renderEmpty: PropTypes.func
  };

  static defaultProps = {
    isItemSelectable: () => true,
    loading: false,
    onSort: () => {},
    onReorder: () => {},
    getItemKey: item => item.id,
    sortKey: 'id',
    sortOrder: true,
    draggable: false,
    alwaysShowDragHandle: false,
    stickyHeader: true,
    getItemLevel: () => 0,
    getItemClassName: () => null,
    getItemDataTest: () => null,
    isItemCollapsible: () => false,
    isParentCollapsible: () => false,
    isItemCollapsed: () => false,
    onItemCollapse: () => {},
    onItemExpand: () => {},
    onItemDoubleClick: () => {},
    onItemClick: () => {},
    remoteSelection: false,
    isDisabledSelectionVisible: () => {},
    getCheckboxTooltip: () => {}
  };

  state = {
    shortcutsScope: getUID('ring-table-'),
    userSelectNone: false
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate({data, selection, onSelect, selectable, remoteSelection}) {
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

  onMouseDown = e => {
    if (e.shiftKey) {
      this.setState({userSelectNone: true});
    }
  };

  onMouseUp = () => {
    if (this.state.userSelectNone) {
      this.setState({userSelectNone: false});
    }
  };

  onRowFocus = row => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(row));
  };

  onRowSelect = (row, selected) => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(row));
    } else {
      onSelect(selection.deselect(row));
    }
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    const data = arrayMove(this.props.data, oldIndex, newIndex);
    this.props.onReorder({data, oldIndex, newIndex});
  };

  onCheckboxChange = e => {
    const {checked} = e.target;
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
      isItemSelectable, getItemLevel, getItemClassName, getItemDataTest,
      draggable, alwaysShowDragHandle, dragHandleTitle,
      loading, onSort, sortKey, sortOrder, loaderClassName, stickyHeader,
      stickyHeaderOffset, isItemCollapsible, isParentCollapsible, isItemCollapsed,
      onItemCollapse, onItemExpand, isDisabledSelectionVisible, getCheckboxTooltip,
      onItemDoubleClick, onItemClick, renderEmpty
    } = this.props;


    // NOTE: Do not construct new object per render because it causes all rows rerendering

    const headerProps = {
      caption, selectable, draggable,
      columns, onSort, sortKey, sortOrder,
      sticky: stickyHeader,
      topStickOffset: stickyHeaderOffset
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
      [style.multiSelection]: selection.getSelected().size > 0,
      [style.userSelectNone]: this.state.userSelectNone,
      [style.disabledHover]: this.props.disabledHover
    });

    const renderList = ({children, props}) => {
      const empty = (
        <tr>
          <td
            colSpan={this.props.columns.length || '1'}
            className={style.tableMessage}
          >
            {renderEmpty ? renderEmpty() : null}
          </td>
        </tr>
      );
      const tbody = (children || []).length > 0
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

    const renderItem = ({value, index, props = {}, isDragged}) => {
      const {ref, ...restProps} = props;
      const row = (
        <Row
          innerRef={ref}
          key={getItemKey(value)}
          level={getItemLevel(value)}
          index={index}
          item={value}
          showFocus={selection.isFocused(value)}
          autofocus={selection.isFocused(value)}
          focused={selection.isFocused(value)}
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
          draggable={draggable}
          alwaysShowDragHandle={alwaysShowDragHandle}
          dragHandleTitle={dragHandleTitle}
          columns={columns}
          data-test={getItemDataTest(value)}
          {...restProps}
        />
      );

      return isDragged
        ? (
          <table style={{...props.style, borderSpacing: 0}}>
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
                values={data}
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

export default disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(Table)));
