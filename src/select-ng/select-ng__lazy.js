import angular from 'angular';

import {render, hydrate} from 'react-dom';
import React from 'react';

import {RerenderableSelect} from '../select/select';

class SelectLazy {
  constructor(container, props, ctrl, type) {
    this.container = container;
    this.ctrl = ctrl;
    this.props = props || {};
    this.type = type;
    this.node = container;
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
    this.container.addEventListener('click', this.onClick);
  }

  detachEvents() {
    this.container.removeEventListener('click', this.onClick);
  }

  render(props) {
    this.reactSelect = <RerenderableSelect {...Object.assign({}, this.props, props || {})}/>;
    this.props = this.reactSelect.props;

    if (this.type !== 'dropdown') {
      const ReactDOMServer = require('react-dom/server');
      this.container.innerHTML = ReactDOMServer.renderToString(this.reactSelect);
    }
  }

  _clickHandler() {
    this.detachEvents();
    if (this.type === 'dropdown') {
      this.ctrl.selectInstance = render(this.reactSelect, this.container);
      // In "dropdown" mode we don't click select itself, so need to force click handler
      this.ctrl.selectInstance._clickHandler();
    } else {
      this.ctrl.selectInstance = hydrate(this.reactSelect, this.container);
    }
  }
}

export default SelectLazy;
