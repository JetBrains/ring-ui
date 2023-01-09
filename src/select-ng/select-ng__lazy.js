import angular from 'angular';

import React, {cloneElement} from 'react';

import {render, hydrate} from '../global/react-render-adapter';
import {RerenderableSelect} from '../select/select';

class SelectLazy {
  constructor(container, props, ctrl, type, selectRef) {
    this.container = container;
    this.ctrl = ctrl;
    this.props = props || {};
    this.type = type;
    this.node = container;
    this.selectInstance = null;
    this.selectRef = node => {
      this.selectInstance = node;
      selectRef(node);
    };
    this._popup = {
      isVisible: angular.noop
    };

    this.attachEvents();
    this.render();
  }

  onClick = () => {
    this._clickHandler();
  };

  rerender(props = {}) {
    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (props[prop] == this.props[prop]) { //eslint-disable-line eqeqeq
          break;
        }

        this.render(props);
        return;
      }
    }
  }

  attachEvents() {
    this.container.addEventListener('click', this.onClick, {capture: true});
  }

  detachEvents() {
    this.container.removeEventListener('click', this.onClick, {capture: true});
  }

  render(props) {
    this.reactSelect = (
      <RerenderableSelect
        {...Object.assign({}, this.props, props || {})}
        ref={this.selectRef}
      />
    );
    this.props = this.reactSelect.props;

    if (this.type !== 'dropdown') {
      const ReactDOMServer = require('react-dom/server');
      this.container.innerHTML = ReactDOMServer.renderToString(this.reactSelect);
    }
  }

  _clickHandler() {
    this.detachEvents();
    if (this.type === 'dropdown') {
      render(cloneElement(this.reactSelect, {
        ref: node => {
          this.selectRef(node);
          node?._openPopupIfClosed?.();
        }
      }), this.container);
    } else {
      hydrate(this.reactSelect, this.container);
    }
  }
}

export default SelectLazy;
