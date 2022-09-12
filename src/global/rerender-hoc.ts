import {createElement, Component, RefAttributes} from 'react';

import {render} from './react-render-adapter';
import composeRefs from './composeRefs';

export interface RerenderableComponent<P, S> extends Component<P, S> {
  node?: HTMLElement | null
}

export interface RerenderableComponentClass<P, S> {
  new (props: P): RerenderableComponent<P, S>;
}

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @returns {Rerenderer}
 */
export default function rerenderHOC<P extends {}, S>(
  ComposedComponent: RerenderableComponentClass<P, S>
) {
  return class Rerenderer extends ComposedComponent {
    _propsCache: P & RefAttributes<unknown> = this.props;

    rerender(props: Partial<P> = {}, callback?: () => void) {
      let container;

      try {
        container = this.node?.parentNode;
      } finally {
        if (!container || !(container instanceof Element)) {
          throw new Error(`${this.constructor.name} component isn't mounted`);
        }
      }

      this._propsCache = Object.assign({}, this.props, this._propsCache, props);
      this._propsCache.ref = composeRefs(this._propsCache.ref, callback);

      render(createElement(this.constructor as typeof Rerenderer, this._propsCache), container);
    }
  };
}
