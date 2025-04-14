import {PureComponent, Children, cloneElement, ReactElement} from 'react';

import {TableAttrs} from './table';
import {SelectionItem} from './selection';

type TableComponent = ReactElement<TableAttrs<SelectionItem>>;

export interface MultiTableProps {
  children: TableComponent[];
}

export default class MultiTable extends PureComponent<MultiTableProps> {
  componentDidUpdate(prevProps: MultiTableProps) {
    if (prevProps.children) {
      const prevSelections = prevProps.children.map(element => element.props.selection);
      const prevFocusedIndex = prevSelections.findIndex(selection => selection.getFocused());
      const prevFocused = prevSelections[prevFocusedIndex];

      const currentSelections = this.props.children.map(element => element.props.selection);
      const currentFocused = currentSelections.filter(selection => selection.getFocused());

      if (currentFocused.includes(prevFocused)) {
        prevProps.children[prevFocusedIndex].props.onSelect?.(prevFocused.resetFocus());
      }
    }
  }

  onUpPress = () => {
    const {children: tables} = this.props;

    const tableIndex = tables.findIndex(({props: {selection}}) => selection.getFocused());
    const currentTable = tables[tableIndex].props;
    const prevTable = tables[tableIndex - 1] ? tables[tableIndex - 1].props : null;

    let newSelection = currentTable.selection.moveUp();
    if (newSelection) {
      currentTable.onSelect?.(newSelection);
    } else if (prevTable) {
      currentTable.onSelect?.(currentTable.selection.resetFocus());
      newSelection = prevTable.selection.moveUp();
      if (newSelection) {
        prevTable.onSelect?.(newSelection);
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
      currentTable.onSelect?.(newSelection);
    } else if (nextTable) {
      currentTable.onSelect?.(currentTable.selection.resetFocus());
      newSelection = nextTable.selection.moveDown();
      if (newSelection) {
        nextTable.onSelect?.(newSelection);
      }
    }

    return false;
  };

  onEscPress = () => {
    const {children} = this.props;
    Children.forEach<TableComponent>(children, ({props: {selection, onSelect}}) => {
      onSelect?.(selection.reset());
    });
  };

  onCmdAPress = () => {
    const {children} = this.props;
    Children.forEach<TableComponent>(children, ({props: {selection, onSelect}}) => {
      onSelect?.(selection.selectAll());
    });
    return false;
  };

  shortcuts = {
    up: this.onUpPress,
    down: this.onDownPress,
    esc: this.onEscPress,
    'command+a': this.onCmdAPress,
    'ctrl+a': this.onCmdAPress,
  };

  render() {
    return (
      <div data-test="ring-multitable">
        {Children.map<ReactElement, ReactElement>(this.props.children, child => {
          const props = {shortcuts: this.shortcuts};
          return cloneElement(child, props);
        })}
      </div>
    );
  }
}
