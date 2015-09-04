import 'babel/polyfill';
import { Component, createElement } from 'react';
import { findDOMNode, render } from 'react-dom';

export default class RingComponent extends Component {
  static factory(...args) {
    return createElement(this, ...args);
  }

  rerender(props = {}) {
    let container;

    try {
      container = findDOMNode(this).parentNode;
    } finally {
      if (!container) {
        throw new Error(`Component isn't mounted`);
      }
    }

    let newProps = Object.assign({}, this.props, props);
    return render(createElement(this.constructor, newProps), container);
  }
}
