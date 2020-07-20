import React, {Component, createContext} from 'react';

import {interpolateLinear} from '../global/linear-function';

const TITLE_RESIZE_END = 20;
const TITLE_RESIZE_THRESHOLD = 36;

export const PhaseContext = createContext();
export const ScrollHandlerContext = createContext();

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

    render() {
      return (
        <PhaseContext.Provider value={this.state.phase}>
          <ScrollHandlerContext.Provider value={this.onContentScroll}>
            <ComposedComponent {...this.props}/>
          </ScrollHandlerContext.Provider>
        </PhaseContext.Provider>
      );
    }
  };
}
