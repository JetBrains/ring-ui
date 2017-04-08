import React, {Children, cloneElement, Component} from 'react';
import PropTypes from 'prop-types';

export default class MultiTable extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  static defaultProps = {
  }

  render() {
    return (
      <div data-test="ring-multitable">{
        Children.map(this.props.children, child => {
          const props = {multi: true};
          return cloneElement(child, props);
        })
      }</div>
    );
  }
}
