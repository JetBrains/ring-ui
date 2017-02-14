import React, {PureComponent} from 'react';
import {sortableElement} from 'react-sortable-hoc';
import Row from './row';

class DraggableRow extends PureComponent {
  onFocus = () => {
    this.props.onFocus(this.props.item);
  }

  onSelect = selected => {
    this.props.onSelect(this.props.item, selected);
  }

  render() {
    const {onSelect, onFocus, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <Row
        onFocus={this.onFocus}
        onSelect={this.onSelect}
        {...restProps}
      />
    );
  }
}


export default sortableElement(DraggableRow);
