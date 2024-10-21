import {Component, ComponentType, createContext} from 'react';

import {interpolateLinear} from '../global/linear-function';

const TITLE_RESIZE_END = 20;
const TITLE_RESIZE_THRESHOLD = 36;

export const PhaseContext = createContext<number | null>(null);

type ScrollHandler = (element: Element) => void;
export const ScrollHandlerContext = createContext<ScrollHandler | null>(null);

export default function adaptiveIslandHOC<P>(ComposedComponent: ComponentType<P>) {
  return class AdaptiveIsland extends Component<P> {
    state = {
      phase: null,
    };

    onContentScroll = ({scrollTop, scrollHeight, clientHeight}: Element) => {
      if (
        scrollHeight - clientHeight >=
        interpolateLinear(TITLE_RESIZE_THRESHOLD, TITLE_RESIZE_END, this.state.phase ?? 0)
      ) {
        const phase = Math.min(1, scrollTop / TITLE_RESIZE_END);
        this.setState({phase});
      }
    };

    render() {
      return (
        <PhaseContext.Provider value={this.state.phase}>
          <ScrollHandlerContext.Provider value={this.onContentScroll}>
            <ComposedComponent {...this.props} />
          </ScrollHandlerContext.Provider>
        </PhaseContext.Provider>
      );
    }
  };
}
