import React, {Component, Children, cloneElement} from 'react';
import Header from './header';
import Content from './content';

const DEFAULT_SIZE = 40;
const MIN_SIZE = 30;
const BORDER_APPEAR_SIZE = 35;
const TITLE_RESIZE_SPEED = 0.5;

/* eslint-disable react/prop-types */

export default function adaptiveIslandHOC(ComposedComponent) {

  return class AdaptiveIsland extends Component {
    state = {
      border: false,
      size: DEFAULT_SIZE
    };

    onContentScroll = ({scrollTop}) => {
      let size = DEFAULT_SIZE - (scrollTop * TITLE_RESIZE_SPEED);
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
