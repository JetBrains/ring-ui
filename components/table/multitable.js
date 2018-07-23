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
    const {selections, onSelects} = this.state;

    const i = selections.findIndex(selection => selection.getFocused());
    let newSelection = selections[i].moveUp();

    if (newSelection) {
      onSelects[i](newSelection);
    } else if (i > 0) {
      onSelects[i](selections[i].resetFocus());
      newSelection = selections[i - 1].moveUp();
      if (newSelection) {
        onSelects[i - 1](newSelection);
      }
    }

    return false;
  };

  onDownPress = () => {
    const {selections, onSelects} = this.state;

    const i = selections.findIndex(selection => selection.getFocused());
    let newSelection = selections[i].moveDown();

    if (newSelection) {
      onSelects[i](newSelection);
    } else if (i <= selections.length) {
      onSelects[i](selections[i].resetFocus());
      newSelection = selections[i + 1].moveDown();
      if (newSelection) {
        onSelects[i + 1](newSelection);
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
