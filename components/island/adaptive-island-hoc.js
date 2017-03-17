import React, {Component, Children, cloneElement} from 'react';
import Header from './header';
import Content from './content';

const TITLE_RESIZE_END = 20;

/* eslint-disable react/prop-types */

export default function adaptiveIslandHOC(ComposedComponent) {

  return class AdaptiveIsland extends Component {
    static propTypes = ComposedComponent.propTypes;

    state = {
      phase: 0
    };

    onContentScroll = ({scrollTop}) => {
      const phase = Math.min(1, scrollTop / TITLE_RESIZE_END);
      this.setState({phase});
    }

    addResizingProps(children) {
      return Children.map(children, child => {
        if (!child) {
          return child;
        }
        let props;
        const {phase} = this.state;

        if (child.type === Content) {
          props = {onScroll: this.onContentScroll, bottomBorder: true};
        }

        if (child.type === Header) {
          props = {phase};
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
