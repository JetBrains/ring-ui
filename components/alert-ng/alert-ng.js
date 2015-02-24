/**
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provide interface to React Alerts interface.
 */
/* global angular: false */

var React = require('react/addons');

angular.module('Ring.alert', []).provider('alert', function() {
  var ReactAlert = require('../alert/alert');
  var ReactAlerts = require('../alert/alerts');
  var container = null;
  var defaultTTL = 0; // no ttl, never closed by timeout

  function init(containerElement) {
    if (!containerElement) {
      containerElement = angular.element('<div>');
      angular.element(document.body.childNodes[0]).after(containerElement);
    }
    container = React.renderComponent(new ReactAlerts(), containerElement.get(0));
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
    container.setProps({
      onRemove: removeCallback
    });
  }

  this.init = init;
  this.setDefaultTTL = setDefaultTTL;

  this.$get = function() {
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
