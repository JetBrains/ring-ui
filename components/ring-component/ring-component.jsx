import 'babel/polyfill';
import { Component, createElement } from 'react';
import { findDOMNode, render } from 'react-dom';
import shortcuts from 'shortcuts/shortcuts';

export default class RingComponent extends Component {
  static RING_UNIT = 8;
  static idCounter = 0;

  static factory(...args) {
    return createElement(this, ...args);
  }

  static getUID() {
    let id = String(this.idCounter++);
    return this.name + id;
  }

  node = null;

  toggleShortcuts(props) {
    if (this.getShortcutsProps) {
      if (props.shortcuts && !this.shortcutsScope) {
        let shortcutsProps = this.getShortcutsProps();

        if (!shortcutsProps || !shortcutsProps.map || !shortcutsProps.scope) {
          throw new Error('Shortcuts\' props weren\'t provided');
        }

        shortcuts.bindMap(shortcutsProps.map, shortcutsProps);
        shortcuts.pushScope(shortcutsProps.scope);
        this.shortcutsScope = shortcutsProps.scope;

        return;
      }

      let hasScope = this.shortcutsEnabled();

      if (props.shortcuts && !hasScope) {
        shortcuts.pushScope(this.shortcutsScope);
      } else if (!props.shortcuts && hasScope) {
        shortcuts.spliceScope(this.shortcutsScope);
      }
    }
  }

  setShortcutsEnabled(flag) {
    this.toggleShortcuts(Object.assign({}, this.props, {shortcuts: !!flag}));
  }

  shortcutsEnabled() {
    return shortcuts.hasScope(this.shortcutsScope);
  }

  rerender(props = {}) {
    let container;

    try {
      container = findDOMNode(this).parentNode;
    } finally {
      if (!container) {
        throw new Error(`${this.constructor.name} component isn't mounted`);
      }
    }

    let newProps = Object.assign({}, this.props, props);
    return render(createElement(this.constructor, newProps), container);
  }

  // React Lifecycle Methods

  componentWillMount() {
    if (this.willMount) {
      this.willMount();
    }

    this.toggleShortcuts(this.props);
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

    this.toggleShortcuts(Object.assign({}, nextProps, nextState));
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

    if (this.shortcutsScope) {
      shortcuts.unbindScope(this.shortcutsScope);
      shortcuts.spliceScope(this.shortcutsScope);
    }

    this.node = null;
  }
}
