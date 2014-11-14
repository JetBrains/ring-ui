/**
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provide interface to React Alerts interface.
 */

'use strict';

/* global angular: false */

var React = require('react/addons');

angular.module('Ring.alert', []).provider('alert', function() {
  var reactAlert = require('alert/alert');
  var reactAlerts = require('alert/alerts');
  var container = null;

  this.init = function(containerElement) {
    container = React.renderComponent(reactAlerts, containerElement);
  };

  this.$get = function() {
    return {
      error: error,
      warning: warning,
      message: message,
      success: success
    };
  };

  function error(message, ttl) {
    _add(message, reactAlert.Type.ERROR, ttl);
  }

  function warning(message, ttl) {
    _add(message, reactAlert.Type.WARNING, ttl);
  }

  function message(message, ttl) {
    _add(message, reactAlert.Type.MESSAGE, ttl);
  }

  function success(message, ttl) {
    _add(message, reactAlert.Type.SUCCESS, ttl);
  }

  function _add(message, type, ttl) {
    if(!container) {
      throw Error('Ring2 alert is not configured for use');
    }
    return reactAlerts.add(message, type, ttl);
  }
});
