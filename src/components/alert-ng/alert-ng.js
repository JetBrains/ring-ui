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
  var defaultRenderAsHTML = false;
  var defaultTTL = 0; // no ttl, never closed by timeout

  this.init = init;
  this.setAllowedTags = setAllowedTags;
  this.setDefaultRenderAsHTML = setDefaultRenderAsHTML;
  this.setDefaultTTL = setDefaultTTL;

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

  function setDefaultRenderAsHTML(value) {
    defaultRenderAsHTML = !!value;
  }

  function setDefaultTTL(ttl) {
    defaultTTL = parseInt(ttl);
  }

  function _checkText(text) {
    var dummyElement = document.createElement('div');
    dummyElement.innerHTML = text;

    var goDeeper = function(DOMNode) {
      for (var j = 0; j < DOMNode.childNodes.length; j++) {
        var child = DOMNode.childNodes[j];

        // text node, skip as is
        if (child.nodeType === 3) {
          continue; // go to next child node
        }

        // element node, check and parse attributes
        if (child.nodeType === 1) {
          var tagName = child.nodeName || child.tagName;
          if (allowedTags[tagName]) {
            var allowedAttrs = allowedTags[tagName];

            // process attributes
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
            continue; // go to next child node
          }
        }

        // If we are here we need to edit tree
        // remove comments
        if (child.nodeType === 8) {
          child.parentElement.removeChild(child);
        } else if (child.outerHTML !== undefined) {
          // escape all other node types and unallowed tags
          var outerHTML = child.outerHTML;
          outerHTML = outerHTML.replace(/</ig, '&lt;').replace(/>/ig, '&gt;');
          child.outerHTML = outerHTML;
        }

        goDeeper(DOMNode); // recheck this node, because of child nodes change
        break;
      }
    };

    goDeeper(dummyElement); // start check from "root" dummy element
    return dummyElement.innerHTML;
  }

  function _add(text, type, ttl, renderAsHTML) {
    if(!container) {
      init();
    }

    if (typeof text === 'string') {
      text = _checkText(text);
    }

    if (renderAsHTML === undefined) {
      renderAsHTML = defaultRenderAsHTML;
    }

    if (ttl === undefined) {
      ttl = defaultTTL;
    }

    return container.add(text, type, ttl, renderAsHTML);
  }

  function error(text, ttl, renderAsHTML) {
    return _add(text, ReactAlert.Type.ERROR, ttl, renderAsHTML);
  }

  function warning(text, ttl, renderAsHTML) {
    return _add(text, ReactAlert.Type.WARNING, ttl, renderAsHTML);
  }

  function message(text, ttl, renderAsHTML) {
    return _add(text, ReactAlert.Type.MESSAGE, ttl, renderAsHTML);
  }

  function success(text, ttl, renderAsHTML) {
    return _add(text, ReactAlert.Type.SUCCESS, ttl, renderAsHTML);
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
