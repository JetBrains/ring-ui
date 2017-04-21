/*global angular*/
import {render} from 'react-dom';
import {createElement} from 'react';

import Select from '../select/select';

class SelectLazy {
  constructor(container, props, ctrl, type) {
    this.container = container;
    this.ctrl = ctrl;
    this.props = props || {};
    this.type = type;
    this._popup = {
      isVisible: angular.noop
    };

    this.attachEvents();
    this.render();
  }

  render(props) {
    this.reactSelect = createElement(Select, angular.extend({}, this.props, props || {}));
    this.props = this.reactSelect.props;

    if (this.type !== 'dropdown') {
      const ReactDOMServer = require('react-dom/server');
      this.container.innerHTML = ReactDOMServer.renderToStaticMarkup(this.reactSelect);
    }
  }

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
    this.onClick = this.onClick.bind(this);
    this.container.addEventListener('click', this.onClick);
  }

  detachEvents() {
    this.container.removeEventListener('click', this.onClick);
  }

  onClick() {
    this._clickHandler();
  }

  _clickHandler() {
    this.detachEvents();
    this.ctrl.selectInstance = render(this.reactSelect, this.container);
    this.ctrl.selectInstance._clickHandler();
  }
}

export default SelectLazy;
