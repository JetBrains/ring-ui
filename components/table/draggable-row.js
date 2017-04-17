import React, {PureComponent} from 'react';
import {sortableElement} from 'react-sortable-hoc';

import Row from './row';

class DraggableRow extends PureComponent {
  static propTypes = Row.propTypes;

  onFocus = () => {
    this.props.onFocus(this.props.item);
  }

  onSelect = selected => {
    this.props.onSelect(this.props.item, selected);
  }

  onCollapse = () => {
    this.props.onCollapse(this.props.item);
  }

  onExpand = () => {
    this.props.onExpand(this.props.item);
  }

  render() {
    return (
      <Row
        {...this.props}
        onFocus={this.onFocus}
        onSelect={this.onSelect}
        onCollapse={this.onCollapse}
        onExpand={this.onExpand}
      />
    );
  }
}


export default sortableElement(DraggableRow);
