import React, {PureComponent, Children, cloneElement} from 'react';
import PropTypes from 'prop-types';

export default class MultiTable extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired
  };

  static getDerivedStateFromProps(props) {
    const selections = Children.map(props.children, child => child.props.selection);
    const onSelects = Children.map(props.children, child => child.props.onSelect);
    return {selections, onSelects};
  }

  state = {
    selections: [],
    onSelects: []
  };

  onUpPress = () => {
    const {children: tables} = this.props;

    const tableIndex = tables.findIndex(({props: {selection}}) => selection.getFocused());
    const currentTable = tables[tableIndex].props;
    const prevTable = tables[tableIndex - 1] ? tables[tableIndex - 1].props : null;

    let newSelection = currentTable.selection.moveUp();
    if (newSelection) {
      currentTable.onSelect(newSelection);
    } else if (prevTable) {
      currentTable.onSelect(currentTable.selection.resetFocus());
      newSelection = prevTable.selection.moveUp();
      if (newSelection) {
        prevTable.onSelect(newSelection);
      }
    }

    return false;
  };

  onDownPress = () => {
    const {children: tables} = this.props;

    const tableIndex = tables.findIndex(({props: {selection}}) => selection.getFocused());
    const currentTable = tables[tableIndex].props;
    const nextTable = tables[tableIndex + 1] ? tables[tableIndex + 1].props : null;

    let newSelection = currentTable.selection.moveDown();
    if (newSelection) {
      currentTable.onSelect(newSelection);
    } else if (nextTable) {
      currentTable.onSelect(currentTable.selection.resetFocus());
      newSelection = nextTable.selection.moveDown();
      if (newSelection) {
        nextTable.onSelect(newSelection);
      }
    }

    return false;
  };

  onEscPress = () => {
    const {children} = this.props;
    Children.forEach(children, ({props: {selection, onSelect}}) => {
      onSelect(selection.reset());
    });
  };

  onCmdAPress = () => {
    const {children} = this.props;
    Children.forEach(children, ({props: {selection, onSelect}}) => {
      onSelect(selection.selectAll());
    });
    return false;
  };

  shortcuts = {
    up: this.onUpPress,
    down: this.onDownPress,
    esc: this.onEscPress,
    'command+a': this.onCmdAPress,
    'ctrl+a': this.onCmdAPress
  };

  render() {
    return (
      <div data-test="ring-multitable">{
        Children.map(this.props.children, child => {
          const props = {shortcuts: this.shortcuts};
          return cloneElement(child, props);
        })
      }</div>
    );
  }
}
