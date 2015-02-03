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

  this.init = init;
  this.setAllowedTags = setAllowedTags;

  this.$get = function() {
    return {
      error: error,
      warning: warning,
      message: message,
      success: success,
      setRemoveCallback: setRemoveCallback
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

  function _checkText(text) {
    var dummyElement = document.createElement('div');
    dummyElement.innerHTML = text;

    var goDeeper = function(DOMNode) {
      for (var j = 0; j < DOMNode.childNodes.length; j++) {
        var child = DOMNode.childNodes[j];

        if (child.nodeName === '#text') {
          continue;
        }

        var tagName = child.nodeName || child.tagName;
        if (allowedTags[tagName]) {
          var allowedAttrs = allowedTags[tagName];

          for (var i = 0; i < child.attributes.length; i++) {
            var attr = child.attributes[i];
            var attrName = attr.nodeName;
            var attrValue = attr.nodeValue || attr.value;
            if (allowedAttrs.indexOf(attrName) === -1) {
              // remove unallowed attribute
              child.removeAttribute(attrName);
            } else if (attrName === 'href' && attrValue.match(/javascript:/ig)) {
              // special processor for "href" attribute
              /* jshint ignore:start */
              child.setAttribute('href', 'javascript:;');
              /* jshint ignore:end */
            }
          }

          goDeeper(child);
        } else {
          // escape unallowed tags
          var outerHTML = child.outerHTML;
          outerHTML = outerHTML.replace(/</ig, '&lt;').replace(/>/ig, '&gt;');
          child.outerHTML = outerHTML;
        }
      }
    };

    goDeeper(dummyElement);

    return dummyElement.innerHTML;
  }

  function _add(text, type, ttl) {
    if(!container) {
      init();
    }

    return container.add(_checkText(text), type, ttl);
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
