/**
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provide interface to React Alerts interface.
 */

'use strict';

/* global angular: false */

var React = require('react/addons');

angular.module('Ring.alert', []).provider('alert', function() {
  var ReactAlert = require('../alert/alert');
  var ReactAlerts = require('../alert/alerts');
  var container = null;

  this.init = function(containerElement) {
    container = React.renderComponent(new ReactAlerts(), containerElement);
  };

  this.$get = function() {
    return {
      error: error,
      warning: warning,
      message: message,
      success: success
    };
  };


  function _add(text, type, ttl) {
    if(!container) {
      throw Error('Ring2 alert is not configured for use');
    }
    return container.add(text, type, ttl);
  }

  function error(text, ttl) {
    _add(text, ReactAlert.Type.ERROR, ttl);
  }

  function warning(text, ttl) {
    _add(text, ReactAlert.Type.WARNING, ttl);
  }

  function message(text, ttl) {
    _add(text, ReactAlert.Type.MESSAGE, ttl);
  }

  function success(text, ttl) {
    _add(text, ReactAlert.Type.SUCCESS, ttl);
  }
});
