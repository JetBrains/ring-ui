import React, {PropTypes, Children, cloneElement} from 'react';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';

export default class MultiTable extends RingComponentWithShortcuts {
  static propTypes = {
    children: PropTypes.any
  }

  static defaultProps = {
  }

  render() {
    return (
      <div>{
        Children.map(this.props.children, child => {
          const props = {multi: true};
          return cloneElement(child, props);
        })
      }</div>
    );
  }
}
