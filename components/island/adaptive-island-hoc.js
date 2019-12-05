import React, {Children, cloneElement, Component} from 'react';

import {interpolateLinear} from '../global/linear-function';

import Header from './header';
import Content from './content';

const TITLE_RESIZE_END = 20;
const TITLE_RESIZE_THRESHOLD = 36;

export default function adaptiveIslandHOC(ComposedComponent) {

  return class AdaptiveIsland extends Component {
    static propTypes = ComposedComponent.propTypes;

    state = {
      phase: 0
    };

    onContentScroll = ({scrollTop, scrollHeight, clientHeight}) => {
      if (scrollHeight - clientHeight >=
        interpolateLinear(TITLE_RESIZE_THRESHOLD, TITLE_RESIZE_END, this.state.phase)) {
        const phase = Math.min(1, scrollTop / TITLE_RESIZE_END);
        this.setState({phase});
      }
    };

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
        <ComposedComponent {...restProps}>
          {this.addResizingProps(children)}
        </ComposedComponent>
      );
    }
  };
}
