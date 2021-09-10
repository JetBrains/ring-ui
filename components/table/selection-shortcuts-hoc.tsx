import React, {PureComponent, ComponentType} from 'react';
import PropTypes from 'prop-types';

import {ShortcutsMap} from '../shortcuts/core';

import Selection, {SelectionItem} from './selection';

export interface SelectionShortcutsProps<T extends SelectionItem> {
  selection: Selection<T>
  selectable?: boolean | undefined
  onSelect?: ((selection: Selection<T>) => void) | undefined
  shortcuts?: ShortcutsMap | undefined
}

export interface SelectionShortcutsAddProps<T extends SelectionItem> {
  selection: Selection<T>
  selectable: boolean
  onSelect: (selection: Selection<T>) => void
  shortcutsMap: ShortcutsMap
}

export default function selectionShortcutsHOC<
  T extends SelectionItem,
  P extends SelectionShortcutsAddProps<T>
>(ComposedComponent: ComponentType<P>) {
  class SelectionShortcuts extends PureComponent<
    Omit<P, keyof SelectionShortcutsAddProps<T>> & SelectionShortcutsProps<T>
  > {
    static defaultProps = {
      ...ComposedComponent.defaultProps,
      selectable: true,
      onSelect: () => {},
      shortcuts: {}
    };

    onUpPress = () => {
      const {selection, onSelect} = this.props;
      const newSelection = selection.moveUp();

      if (newSelection) {
        onSelect?.(newSelection);
      }

      return false;
    };

    onDownPress = () => {
      const {selection, onSelect} = this.props;
      const newSelection = selection.moveDown();

      if (newSelection) {
        onSelect?.(newSelection);
      }

      return false;
    };

    shiftSelectionMode?: 'deletion' | 'addition';
    onShiftKeyDown = () => {
      const {selection} = this.props;

      if (selection.isSelected(selection.getFocused())) {
        this.shiftSelectionMode = 'deletion';
      } else {
        this.shiftSelectionMode = 'addition';
      }
    };

    shiftSelect = (selection: Selection<T>) => {
      if (this.shiftSelectionMode === 'addition') {
        return selection.select();
      } else {
        return selection.deselect();
      }
    };

    onShiftUpPress = (e: KeyboardEvent) => {
      e.preventDefault();
      const {selectable, selection, onSelect} = this.props;

      if (!selectable) {
        return;
      }

      const newSelection = this.shiftSelect(selection);
      const newMovedSelection = newSelection.moveUp();

      if (newMovedSelection) {
        onSelect?.(newMovedSelection);
      } else {
        onSelect?.(newSelection);
      }
    };

    onShiftDownPress = (e: KeyboardEvent) => {
      e.preventDefault();
      const {selectable, selection, onSelect} = this.props;

      if (!selectable) {
        return;
      }

      const newSelection = this.shiftSelect(selection);
      const newMovedSelection = newSelection.moveDown();

      if (newMovedSelection) {
        onSelect?.(newMovedSelection);
      } else {
        onSelect?.(newSelection);
      }
    };

    onHomePress = () => {
      const {selection, onSelect} = this.props;

      const newSelection = selection.moveStart();
      if (newSelection) {
        onSelect?.(newSelection);
      }

      return false;
    };

    onEndPress = () => {
      const {selection, onSelect} = this.props;

      const newSelection = selection.moveEnd();
      if (newSelection) {
        onSelect?.(newSelection);
      }

      return false;
    };

    onSpacePress = () => {
      const {selectable, selection, onSelect} = this.props;

      if (!selectable) {
        return true;
      }

      onSelect?.(selection.toggleSelection());
      return false;
    };

    onEscPress = () => {
      const {selection, onSelect} = this.props;

      onSelect?.(selection.reset());
      //this.restoreFocusWithoutScroll();
    };

    onCmdAPress = () => {
      const {selectable, selection, onSelect} = this.props;

      if (!selectable) {
        return true;
      }

      onSelect?.(selection.selectAll());
      return false;
    };

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
    };

    render() {
      const {selection, selectable, onSelect, shortcuts, ...restProps} = this.props;
      return (
        <ComposedComponent
          {...restProps as P}
          selection={selection}
          selectable={selectable}
          onSelect={onSelect}
          shortcutsMap={{...this.shortcutsMap, ...this.props.shortcuts}}
        />
      );
    }
  }
  (SelectionShortcuts as ComponentType<unknown>).propTypes = {
    ...ComposedComponent.propTypes,
    selection: PropTypes.instanceOf(Selection).isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    shortcuts: PropTypes.object
  };
  return SelectionShortcuts;
}
