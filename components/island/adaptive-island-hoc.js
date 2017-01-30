import React, {Component, Children, cloneElement} from 'react';
import Header, {MAX_SIZE, MIN_SIZE} from './header';
import Content from './content';

const BORDER_APPEAR_SIZE = MIN_SIZE + ((MAX_SIZE - MIN_SIZE) / 2);
const TITLE_RESIZE_SPEED = 0.5;

/* eslint-disable react/prop-types */

export default function adaptiveIslandHOC(ComposedComponent) {

  return class AdaptiveIsland extends Component {
    state = {
      border: false,
      size: MAX_SIZE
    };

    onContentScroll = ({scrollTop}) => {
      let size = MAX_SIZE - (scrollTop * TITLE_RESIZE_SPEED);
      size = size < MIN_SIZE ? MIN_SIZE : size;
      const border = size <= BORDER_APPEAR_SIZE;

      this.setState({size, border});
    }

    addResizingProps(children) {
      return Children.map(children, child => {
        let props;
        const {size, border} = this.state;

        if (child.type === Content) {
          props = {onScroll: this.onContentScroll};
        }

        if (child.type === Header) {
          props = {size, border};
        }

        return props ? cloneElement(child, props) : child;
      });
    }

    render() {
      const {children, ...restProps} = this.props;

      return (
        <ComposedComponent
          {...restProps}
          children={this.addResizingProps(children)}
        />
      );
    }
  };
}
