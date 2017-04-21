/* @flow */
/* eslint-disable arrow-parens */

import React, {PureComponent, Element} from 'react';
import {sortableElement} from 'react-sortable-hoc';

import Row from './row';
import type {RowProps} from './row';

class DraggableRow extends PureComponent {
  props: RowProps;

  onFocus = (): void => {
    this.props.onFocus(this.props.item);
  }

  onSelect = (selected: boolean): void => {
    this.props.onSelect(this.props.item, selected);
  }

  onCollapse = (): void => {
    this.props.onCollapse(this.props.item);
  }

  onExpand = (): void => {
    this.props.onExpand(this.props.item);
  }

  render(): Element<any> {
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
