import {Component, createElement} from 'react';
import {findDOMNode, render} from 'react-dom';

export default class RingComponent extends Component {
  static letOverrideLifecycleMethods = false;
  static RING_UNIT = 8;
  static idCounter = 0;

  static lifecycleMethods = {
    componentWillMount: 'willMount',
    componentDidMount: 'didMount',
    componentWillReceiveProps: 'willReceiveProps',
    shouldComponentUpdate: 'shouldUpdate',
    componentWillUpdate: 'willUpdate',
    componentDidUpdate: 'didUpdate',
    componentWillUnmount: 'willUnmount'
  };

  static factory(...args) {
    return createElement(this, ...args);
  }

  static getUID() {
    let id = String(this.idCounter++);
    return this.name + id;
  }

  node = null;

  constructor(...props) {
    super(...props);

    if (!this.constructor.letOverrideLifecycleMethods) {
      Object.keys(this.constructor.lifecycleMethods).forEach(key => {
        if (this[key] !== RingComponent.prototype[key]) {
          throw new Error(`You shouldn't override the lifecycle methods from RingComponent, use short (without "component" prefix) alternative instead. "${this.constructor.lifecycleMethods[key]}" instead of "${key}" for example.`);
        }
      });
    }
  }

  rerender(props = {}, callback) {
    let container;

    try {
      container = this.node.parentNode;
    } finally {
      if (!container) {
        throw new Error(`${this.constructor.name} component isn't mounted`);
      }
    }

    let newProps = Object.assign({}, this.props, props);
    return render(createElement(this.constructor, newProps), container, callback);
  }

  // React Lifecycle Methods

  componentWillMount() {
    if (this.willMount) {
      this.willMount();
    }
  }

  componentDidMount() {
    this.node = findDOMNode(this);
    if (this.didMount) {
      this.didMount();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.willReceiveProps) {
      this.willReceiveProps(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.shouldUpdate) {
      return this.shouldUpdate(nextProps, nextState);
    } else {
      return true;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.willUpdate) {
      this.willUpdate(nextProps, nextState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.didUpdate) {
      this.didUpdate(prevProps, prevState);
    }

    if (this.props._onModelChange) {
      let data;
      if (this.ngModelStateField) {
        if (typeof this.ngModelStateField === 'string' && this.state[this.ngModelStateField] !== undefined) {
          data = this.state[this.ngModelStateField];
        } else if (typeof this.ngModelStateField === 'object') {
          data = {};
          for (let stateFieldName in this.state) {
            if (this.state.hasOwnProperty(stateFieldName) && this.ngModelStateField[stateFieldName]) {
              data[stateFieldName] = this.state[stateFieldName];
            }
          }
        } else {
          return;
        }
      }

      this.props._onModelChange(data);
    }
  }

  componentWillUnmount() {
    if (this.willUnmount) {
      this.willUnmount();
    }

    this.node = null;
  }
}
