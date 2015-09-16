/**
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provides an interface to React-based Alerts component.
 */
/* global angular: false */

import { render } from 'react-dom';
import ReactAlert from 'alert/alert';
import ReactAlerts from 'alert/alerts';

let ringAlertModule = angular.module('Ring.alert', []);

ringAlertModule.provider('alert', function () {
  let container = null;
  let defaultTTL = 0; // no ttl, never closed by timeout

  function init(containerElement) {
    if (!containerElement) {
      containerElement = angular.element('<div>');
      angular.element(document.body.childNodes[0]).after(containerElement);
    }
    container = render(ReactAlerts.factory(), containerElement[0]);
  }

  function setDefaultTTL(ttl) {
    defaultTTL = parseInt(ttl, 10);
  }

  function _add(text, type, ttl) {
    if (!container) {
      init();
    }

    if (ttl === undefined) {
      ttl = defaultTTL;
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

  function setRemoveCallback(removeCallback){
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
  this.$get = function () {
    return {
      error: error,
      warning: warning,
      message: message,
      success: success,
      setRemoveCallback: setRemoveCallback,
      DOM: ReactAlert.DOM
    };
  };
});
