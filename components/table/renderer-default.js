import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import Cell from './cell';

export default class DefaultRenderer extends RingComponent {
  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return <Cell>{this.props.children}</Cell>;
  }
}
