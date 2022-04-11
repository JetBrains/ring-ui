import {createElement} from 'react';

import {render} from './react-render-adapter';

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @returns {Rerenderer}
 */
export default function rerenderHOC(ComposedComponent, {captureNode} = {captureNode: false}) {
  if (captureNode) {
    // TODO remove in 5.0
    throw new Error('rerenderHOC: captureNode={true} is deprecated. Wrapped component must have "node" property captured itself');
  }

  return class Rerenderer extends ComposedComponent {
    _propsCache = {};

    rerender(props = {}, callback) {
      let container;

      try {
        container = this.node.parentNode;
      } finally {
        if (!container) {
          throw new Error(`${this.constructor.name} component isn't mounted`);
        }
      }

      this._propsCache = Object.assign({}, this.props, this._propsCache, props);

      render(createElement(this.constructor, this._propsCache), container, callback);
    }
  };
}
