define(['jquery', 'handlebars', 'dropdown/dropdown', 'font-icon/font-icon'], function($, Handlebars, dropdown) {
  'use strict';

  var $body;
  var data;
  var html;
  var cb;

  var $global = $(window);
  var SELECTOR_PREFIX = '.ring-';
  var template = 'full-header'; // Default template

  var init = function(initData, dontWaitDom, initCb) {
    if (typeof initCb === 'function') {
      cb = initCb;
    }

    data = initData || data;

    if (!dontWaitDom) {
      $(updateHtml);
    } else {
      bodyReady(updateHtml);
    }
  };

  var bodyReady = function bodyReady(cb) {
    $body = $('body');

    if ($body[0]) {
      cb();
    } else {
      setTimeout(function() {
        bodyReady(cb);
      }, 10);
    }
  };

  var render = function(template, data) {
    return Handlebars.partials[template](data);
  };

  var clean = function() {
    $(SELECTOR_PREFIX + template).remove();
  };

  var updateHtml = function() {
    if (!data) {
      return false;
    }

    if (!$body) {
      $body = $('body');
    }

    html = render(template, data);
    if (html) {
      if ($body[0].firstChild) {
        $body.prepend(html);
      } else {
        $body.append(html);
      }

      $global.trigger('ring:header:updated');

      if (cb) {
        cb();
      }

      return true;
    } else {
      return false;
    }

  };

  var update = function(path, value) {
    var part;
    var newData = {};
    var pathParts = path.split('.');

    while ((part = pathParts.pop())) {
      if (isNaN(Number(part))) {
        newData = {};
      } else {
        newData = [];
      }
      newData[part] = value;
      value = newData;
    }

    $.extend(true, data, newData);

    return updateHtml(clean);
  };

  return {
    init: init,
    update: update,
    render: render,
    dropdown: dropdown
  };

});