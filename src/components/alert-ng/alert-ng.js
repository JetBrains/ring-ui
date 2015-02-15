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
  var allowedTags = {'A': ['href', 'class']};
  var defaultTTL = 0; // no ttl, never closed by timeout

  this.init = init;
  this.setAllowedTags = setAllowedTags;
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

  function init(containerElement) {
    if (!containerElement) {
      containerElement = angular.element('<div>');
      angular.element(document.body).prepend(containerElement);
    }
    container = React.renderComponent(new ReactAlerts(), containerElement.get(0));
  }

  function setAllowedTags(tags) {
    allowedTags = tags;
  }
  function setDefaultTTL(ttl) {
    defaultTTL = parseInt(ttl);
  }


  function _add(text, type, ttl) {
    if(!container) {
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
    if(!container) {
      init();
    }
    container.setProps({
      onRemove: removeCallback
    });
  }
});
