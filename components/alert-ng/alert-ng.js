/**
 * @name Alert Ng
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provides an interface to React-based Alerts component.
 */
/* global angular: false */

import {render} from 'react-dom';
import ReactAlert from '../alert/alert';
import ReactAlerts from '../alert/alerts';

const angularModule = angular.module('Ring.alert', []);

function alert() {
  let container = null;
  let defaultTTL = 0; // no ttl, never closed by timeout

  function init(customContainer) {
    let containerElement;
    if (!customContainer) {
      containerElement = angular.element('<div>');
      angular.element(document.body.childNodes[0]).after(containerElement);
    } else {
      containerElement = customContainer;
    }
    container = render(ReactAlerts.factory(), containerElement[0]);
  }

  function setDefaultTTL(ttl) {
    defaultTTL = parseInt(ttl, 10);
  }

  function _add(text, type, ttl = defaultTTL) {
    if (!container) {
      init();
    }

    return container.add(text, type, ttl);
  }

  function error(text, ttl) {
    return _add(text, ReactAlert.Type.ERROR, ttl);
  }

  function warning(text, ttl) {
    return _add(text, ReactAlert.Type.WARNING, ttl);
  }

  function message(text, ttl) {
    return _add(text, ReactAlert.Type.MESSAGE, ttl);
  }

  function success(text, ttl) {
    return _add(text, ReactAlert.Type.SUCCESS, ttl);
  }

  function loading(text, ttl) {
    return _add(text, ReactAlert.Type.LOADING, ttl);
  }

  function setRemoveCallback(removeCallback) {
    if (!container) {
      init();
    }
    container.rerender({
      onRemove: removeCallback
    });
  }

  this.init = init;
  this.setDefaultTTL = setDefaultTTL;

  /*@ngInject*/
  this.$get = () => ({
    error,
    warning,
    message,
    success,
    loading,
    setRemoveCallback,
    DOM: ReactAlert.DOM
  });
}

angularModule.provider('alert', alert);

export default angularModule.name;
