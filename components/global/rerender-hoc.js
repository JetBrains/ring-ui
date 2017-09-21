import React, {createElement} from 'react';
import {findDOMNode, render} from 'react-dom';

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @returns {Rerenderer}
 */
export default function rerenderHOC(ComposedComponent, {captureNode} = {captureNode: true}) {
  return class Rerenderer extends ComposedComponent {
    _propsCache = {};

    onRefUpdate = component => {
      // eslint-disable-next-line react/no-find-dom-node
      this.node = findDOMNode(component);
    };

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

      return render(createElement(this.constructor, this._propsCache), container, callback);
    }

    render() {
      if (!captureNode) {
        return super.render();
      }

      return (
        <ComposedComponent
          ref={this.onRefUpdate}
          {...this.props}
        />
      );
    }
  };
}
