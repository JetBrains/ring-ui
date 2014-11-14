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

  function error(text, ttl) {
    _add(text, reactAlert.Type.ERROR, ttl);
  }

  function warning(text, ttl) {
    _add(text, reactAlert.Type.WARNING, ttl);
  }

  function message(text, ttl) {
    _add(text, reactAlert.Type.MESSAGE, ttl);
  }

  function success(text, ttl) {
    _add(text, reactAlert.Type.SUCCESS, ttl);
  }

  function _add(text, type, ttl) {
    if(!container) {
      throw Error('Ring2 alert is not configured for use');
    }
    return reactAlerts.add(text, type, ttl);
  }
});
