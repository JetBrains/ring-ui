import React, {Component, PropTypes, Children, cloneElement} from 'react';

export default class MultiTable extends Component {
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
