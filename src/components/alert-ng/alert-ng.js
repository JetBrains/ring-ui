/**
 * @author maxim.erekhinskiy
 * @fileoverview AngularJS service that provide interface to React Alerts interface.
 */

'use strict';

/* global angular: false */
/* jshint latedef:false */

var React = require('react/addons');

angular.module('Ring.alert', []).provider('alert', function() {
  var ReactAlert = require('../alert/alert');
  var ReactAlerts = require('../alert/alerts');
  var container = null;

  this.init = init;

  this.$get = function() {
    return {
      error: error,
      warning: warning,
      message: message,
      success: success
    };
  };

  function init(containerElement) {
    if (!containerElement) {
      containerElement = angular.element('<div>');
      angular.element(document.body).prepend(containerElement);
    }
    container = React.renderComponent(new ReactAlerts(), containerElement.get(0));
  }

  function _add(text, type, ttl) {
    if(!container) {
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
});
