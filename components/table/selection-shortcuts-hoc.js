import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Selection from './selection';

export default function selectionShortcutsHOC(ComposedComponent) {
  return class SelectionShortcuts extends PureComponent {
    static propTypes = {
      ...ComposedComponent.propTypes,
      selection: PropTypes.instanceOf(Selection).isRequired,
      selectable: PropTypes.bool,
      onSelect: PropTypes.func,
      shortcuts: PropTypes.object
    }

    static defaultProps = {
      ...ComposedComponent.defaultProps,
      selectable: true,
      onSelect: () => {},
      shortcuts: {}
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
      const {selection, onSelect} = this.props;

      const newSelection = selection.moveStart();
      if (newSelection) {
        onSelect(newSelection);
      }

      return false;
    }

    onEndPress = () => {
      const {selection, onSelect} = this.props;

      const newSelection = selection.moveEnd();
      if (newSelection) {
        onSelect(newSelection);
      }

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
      //this.restoreFocusWithoutScroll();
    }

    onCmdAPress = () => {
      const {selectable, selection, onSelect} = this.props;

      if (!selectable) {
        return true;
      }

      onSelect(selection.selectAll());
      return false;
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

    render() {
      const {selection, selectable, onSelect} = this.props;
      return (
        <ComposedComponent
          {...this.props}
          selection={selection}
          selectable={selectable}
          onSelect={onSelect}
          shortcutsMap={{...this.shortcutsMap, ...this.props.shortcuts}}
        />
      );
    }
  }
}
