import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import Cell from './cell';

export default class DefaultRenderer extends RingComponent {
  static propTypes = {
    item: PropTypes.any.isRequired,
    column: PropTypes.any.isRequired
  }

  render() {
    const {item, column} = this.props;
    return <Cell>{item[column.id]}</Cell>;
  }
}
