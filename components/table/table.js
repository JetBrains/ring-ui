/**
 * @name Table
 */

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
import selectionShortcutsHOC from './selection-shortcuts-hoc';
import disableHoverHOC from './disable-hover-hoc';

const alwaysFalse = () => false;

const DraggableRows = sortableContainer(props => {
  const {
    data, getItemKey, selection, selectable,
    isItemSelectable, onRowFocus, onRowSelect,
    getItemLevel, isItemCollapsible, isParentCollapsible,
    isItemCollapsed, onItemCollapse, onItemExpand,
    isDisabledSelectionVisible, getCheckboxTooltip,
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
          parentCollapsible={isParentCollapsible(item)}
          collapsed={isItemCollapsed(item)}
          onCollapse={onItemCollapse}
          onExpand={onItemExpand}
          showDisabledSelection={isDisabledSelectionVisible(item)}
          checkboxTooltip={getCheckboxTooltip(item)}
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
    caption: PropTypes.string,
    isItemSelectable: PropTypes.func,
    stickyHeader: PropTypes.bool,
    stickyHeaderOffset: PropTypes.string,
    loading: PropTypes.bool,
    getItemKey: PropTypes.func,
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

    // focusSensorHOC
    focused: PropTypes.bool,
    onFocusRestore: PropTypes.func,

    // selectionShortcutsHOC
    selection: PropTypes.instanceOf(Selection).isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    shortcutsMap: PropTypes.object,

    // disableHoverHOC
    disabledHover: PropTypes.bool,

    remoteSelection: PropTypes.bool
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
    isItemCollapsible: () => false,
    isParentCollapsible: () => false,
    isItemCollapsed: () => false,
    onItemCollapse: () => {},
    onItemExpand: () => {},
    remoteSelection: false,
    isDisabledSelectionVisible: () => {},
    getCheckboxTooltip: () => {}
  };

  state = {
    shortcutsEnabled: this.props.selectable && this.props.focused,
    shortcutsScope: getUID('ring-table-'),
    userSelectNone: false
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data && !this.props.remoteSelection) {
      onSelect(selection.cloneWith({data: nextProps.data}));
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(selection.resetSelection());
    }

    const shortcutsEnabled = nextProps.focused;
    if (shortcutsEnabled !== this.state.shortcutsEnabled) {
      this.setState({shortcutsEnabled});
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
      data, selection, columns, caption, getItemKey, selectable,
      isItemSelectable, getItemLevel, draggable, alwaysShowDragHandle,
      loading, onSort, sortKey, sortOrder, loaderClassName, stickyHeader,
      stickyHeaderOffset, isItemCollapsible, isParentCollapsible, isItemCollapsed,
      onItemCollapse, onItemExpand, isDisabledSelectionVisible, getCheckboxTooltip
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

    return (
      <div className={wrapperClasses} data-test="ring-table-wrapper">
        {this.state.shortcutsEnabled &&
          (
            <Shortcuts
              map={this.props.shortcutsMap}
              scope={this.state.shortcutsScope}
            />
          )
        }

        {/* Handler detects that user holds Shift key */}
        <div role="presentation" onMouseDown={this.onMouseDown}>
          <table className={classes} data-test="ring-table">
            <Header {...headerProps}/>
            <DraggableRows
              /* Sortable props */
              useDragHandle
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
              isParentCollapsible={isParentCollapsible}
              isItemCollapsed={isItemCollapsed}
              onItemCollapse={onItemCollapse}
              onItemExpand={onItemExpand}
              isDisabledSelectionVisible={isDisabledSelectionVisible}
              getCheckboxTooltip={getCheckboxTooltip}
            />
          </table>
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
