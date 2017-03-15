/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import {sortableHandle} from 'react-sortable-hoc';

import focusSensorHOC from '../global/focus-sensor-hoc';
import dragIcon from 'jetbrains-icons/drag.svg';

import Cell from './cell';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import style from './table.css';

const DragHandle = sortableHandle(({alwaysShowDragHandle}) => { // eslint-disable-line arrow-body-style
  const classes = classNames(style.dragHandle, alwaysShowDragHandle && style.visibleDragHandle);

  return (
    <div className={classes}>
      <Icon
        className={style.clear}
        glyph={dragIcon}
        size={Icon.Size.Size14}
      />
    </div>
  );
});

class Row extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    showFocus: PropTypes.bool,
    draggable: PropTypes.bool,
    alwaysShowDragHandle: PropTypes.bool,
    selected: PropTypes.bool,
    onHover: PropTypes.func,
    onSelect: PropTypes.func,
    onFocusRestore: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    showFocus: false,
    draggable: false,
    alwaysShowDragHandle: false,
    selected: false,
    onHover: () => {},
    onSelect: () => {},
    onFocusRestore: () => {}
  }

  onMouseEnter = () => {
    const {item, onHover} = this.props;
    onHover(item);
  }

  onClick = e => {
    if (e.shiftKey) {
      this.toggleSelection();
    }
  }

  onCheckboxFocus = () => {
    this.props.onFocusRestore();
  }

  onCheckboxChange = () => {
    this.toggleSelection();
  }

  toggleSelection() {
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  render() {
    const {item, columns, selectable, selected, showFocus, draggable, alwaysShowDragHandle} = this.props;

    const classes = classNames(this.props.className, {
      [style.row]: true,
      [style.rowFocused]: showFocus,
      [style.rowSelected]: selected
    });

    const testAttrs = {
      'data-test-focused': showFocus || undefined,
      'data-test-selected': selected || undefined
    };

    const metaColumnClasses = classNames(style.metaColumn, {
      [style.metaColumnSpaced]: selectable
    });

    const cells = [
      <Cell key="meta" className={metaColumnClasses}>
        {draggable && <DragHandle alwaysShowDragHandle={alwaysShowDragHandle}/>}
        {selectable &&
        <Checkbox
          className={showFocus ? 'ring-checkbox_focus' : ''}
          checked={selected}
          onFocus={this.onCheckboxFocus}
          onChange={this.onCheckboxChange}
          tabIndex="-1"
        />}
      </Cell>
    ];

    columns.map((column, key) => {
      const getValue = column.getValue || (() => item[column.id]);
      const value = getValue(item, column);

      /*let gap = 0;
      if (column.groupable) {
        gap = item.__level * 10;
      }

      const style = {
        paddingLeft: `${gap + 10}px`
      };*/

      const cellClasses = classNames({[style.cellRight]: column.rightAlign});
      cells.push(<Cell key={key} className={cellClasses}>{value}</Cell>);
    });

    return (
      <tr
        ref="row"
        className={classes}
        tabIndex="0"
        onMouseMove={this.onMouseEnter}
        onClick={this.onClick}
        data-test="ring-table-row"
        {...testAttrs}
      >{cells}</tr>
    );
  }
}

export default focusSensorHOC(Row);
